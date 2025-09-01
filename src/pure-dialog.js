/*!
 * pure-dialog - v@version@
 * https://github.com/john-doherty/pure-dialog
 */
(function (base, window, document) {

    'use strict';

    /**
     * @exports pure-dialog
     * @description A custom HTML element (Web Component) that can be created using
     * document.createElement('pure-dialog') or included in a HTML page as an element.
     */

    // check if we're using a touch screen
    var isTouch = (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));

    // switch to touch events if using a touch screen
    var mouseClick = isTouch ? 'touchend' : 'click';

    // Create a prototype for our new element that extends HTMLElement
    var pureDialog = Object.create(base, {

        /** @property {string} pure-dialog.title - title of the dialog */
        title: {
            get: function () {
                // get title from data-title attribute
                return (this.dataset || {}).title || this.getAttribute('data-title') || '';
            },
            set: function (value) {
                this.setAttribute('data-title', value);
            }
        },

        /** @property {string} pure-dialog.buttons - comma separated list of button labels */
        buttons: {
            get: function () {
                return this.getAttribute('buttons') || '';
            },
            set: function (value) {

                // remove duplicates
                var uniqueValue = (value || '').split(this.buttonValueSeparator).filter(function(item, index, all) {
                    return (index === all.indexOf(item));
                });

                this.setAttribute('buttons', uniqueValue.join(this.buttonValueSeparator));
            }
        },

        /** @property {string} pure-dialog.buttonValueSeparator - character used to separate button values */
        buttonValueSeparator: {
            get: function () {
                return this.getAttribute('button-value-separator') || ',';
            },
            set: function (value) {
                this.setAttribute('button-value-separator', value);
            }
        },

        /** @property {boolean} pure-dialog.closeButton - show or hide the dialog close icon */
        closeButton: {
            get: function () {
                return (this.getAttribute('close-button') === 'true');
            },
            set: function (value) {
                this.setAttribute('close-button', value === true);
            }
        },

        /** @property {boolean} pure-dialog.autoClose - should the dialog auto close on button click */
        autoClose: {
            get: function () {
                return (this.getAttribute('auto-close') === null || this.getAttribute('auto-close') === 'true');
            },
            set: function (value) {
                this.setAttribute('auto-close', value === true);
            }
        },

        /** @property {string} pure-dialog.content - set the dialog body HTML */
        content: {
            get: function () {
                return (this._body) ? this._body.innerHTML : '';
            },
            set: function (value) {
                if (this._body) {
                    this._body.innerHTML = value;
                    updateScrollState(this);
                }
            }
        },

        /** @property {string} pure-dialog.body - dialog inner body tag */
        body: {
            get: function () {
                return this._body;
            }
        },

        /** @property {string} pure-dialog.removeOnClose - removes the dialog from the dom on close */
        removeOnClose: {
            get: function () {
                return (this.getAttribute('remove-on-close') === 'true');
            },
            set: function (value) {
                this.setAttribute('remove-on-close', value === true);
            }
        },

        translate: {
            get: function () {
                return this.getAttribute('translate') !== 'no'; // defaults to true
            },
            set: function (value) {
                this.setAttribute('translate', value === true ? 'yes' : 'no');
            }
        },

        /** @property {string} pure-dialog.buttonProxySelector - css selector for inner buttons to proxy */
        buttonProxySelector: {
            get: function () {
                return this.getAttribute('button-proxy-selector') || '';
            },
            set: function (value) {
                this.setAttribute('button-proxy-selector', value || '');
            }
        }
    });

    /**
     * Executes when created, fires attributeChangedCallback for each attribute set
     * @access private
     * @returns {void}
     */
    pureDialog.createdCallback = function () {

        var self = this;
        var attributes = Array.prototype.slice.call(self.attributes);

        renderBody.call(this);

        // ensure current attributes are set
        attributes.forEach(function(item) {
            self.attributeChangedCallback(item.name, null, item.value);
        });

        // if remove on close is set, remove it
        self.addEventListener('pure-dialog-closed', function(e) {

            self.removeAttribute('open');
            self.removeAttribute('modal');
            self.removeAttribute('closing');

            if (e.target.removeOnClose) {
                e.target.remove();
            }
        });

        self.addEventListener('pure-dialog-opened', function(e) {
            self.removeAttribute('opening');
        });

        self.addEventListener('pure-dialog-opening', function(e) {

            updateScrollState(self);

            // proxy buttons if required
            if (self._container && self._body && self.buttonProxySelector) {

                var buttonContainer = self._container.querySelector('.pure-dialog-buttons');
                var buttonsToProxy = [].slice.call(self._body.querySelectorAll(self.buttonProxySelector));

                for (var i = 0, l = buttonsToProxy.length; i < l; i++) {

                    var buttonToProxy = buttonsToProxy[i];
                    var buttonToProxyValue = buttonToProxy.value || '';

                    // only if a button of the same name does not already exist
                    if (buttonToProxyValue && !buttonContainer.querySelector('.pure-dialog-button[value="' + buttonToProxyValue + '"]')){

                        var buttonToProxyId = newUniqueId('proxyButton');

                        // hide source button and assign ID so we can reach it
                        buttonToProxy.style.display = 'none';
                        buttonToProxy.setAttribute('data-proxy-id', buttonToProxyId);

                        // create a proxy button to add to the dialog
                        var proxyButton = createEl(null, 'input', { type: 'button', value: buttonToProxyValue, class: 'pure-dialog-button', 'data-proxy-target': buttonToProxyId });
                        buttonContainer.insertBefore(proxyButton, buttonContainer.firstChild);
                    }
                }
            }
        });

        window.addEventListener('resize', function resizeHandler() {
            var connected = (typeof self.isConnected === 'boolean') ? self.isConnected : (document.body && document.body.contains(self));
            if (!connected) {
                window.removeEventListener('resize', resizeHandler, false);
            }
            else {
                updateScrollState(self);
            }
        }, false);
    };

    /**
     * Executes when the element is appended to the DOM
     * @access private
     * @returns {void}
     */
    pureDialog.attachedCallback = function() {
        this.dispatchEvent(new CustomEvent('pure-dialog-ready', { bubbles: true, cancelable: true }));
    };

    /**
     * Executes when any pure-dialog attribute is changed
     * @access private
     * @type {Event}
     * @param {string} attrName - the name of the attribute to have changed
     * @param {string} oldVal - the old value of the attribute
     * @param {string} newVal - the new value of the attribute
     * @returns {void}
     */
    pureDialog.attributeChangedCallback = function (attrName, oldVal, newVal) {

        if (oldVal === newVal) return;

        switch (attrName) {

            case 'title': // account for the fact .title is changed internally
            case 'data-title': {
                renderTitle.call(this);
            } break;

            // case 'button-value-separator':
            case 'buttons': {
                renderButtons.call(this);
            } break;

            case 'closeButton':
            case 'close-button': {
                renderCloseButton.call(this);
            } break;

            case 'translate': {
                if (this._container) {
                    this._container.setAttribute('translate', (this.translate === true) ? 'yes' : 'no');
                }
            } break;
        }
    };

    /**
     * Shows the dialog
     * @access public
     * @returns {void}
     */
    pureDialog.show = function() {
        showDialog.call(this, false);
    };

    /**
     * Shows the dialog as a modal
     * @access public
     * @returns {void}
     */
    pureDialog.showModal = function() {
        showDialog.call(this, true);
    };

    /**
     * Closes/hides the dialog
     * @access public
     * @returns {void}
     */
    pureDialog.close = function() {

        // if we've already started closing, exit
        if (this.getAttribute('closing') === 'true') return;

        var self = this;
        var transitionEndEventName = getTransitionEndEventName();
        var animationEndEventName = getAnimationEndEventName();
        var allow = self.dispatchEvent(new CustomEvent('pure-dialog-closing', { bubbles: true, cancelable: true }));

        if (allow) {

            // this has to come first as adding the attribute probably introduces the transition/animation
            self.setAttribute('closing', 'true');

            // if we have transitions/animations set complete to false so we hook up events
            var cssTransitionComplete = !hasCssTransition(self); // does it have a transition
            var cssAnimationComplete = !hasCssAnimation(self);    // does it have an animation

            var closedHandler = function(e) {

                if (e.type === transitionEndEventName) {
                    cssTransitionComplete = true;
                    self.removeEventListener(transitionEndEventName, closedHandler);
                }

                if (e.type === animationEndEventName) {
                    cssAnimationComplete = true;
                    self.removeEventListener(animationEndEventName, closedHandler);
                }

                if (cssTransitionComplete && cssAnimationComplete) {
                    self.dispatchEvent(new CustomEvent('pure-dialog-closed', { bubbles: true, cancelable: true }));
                }
            };

            // wait for transition to end if we have one
            if (!cssTransitionComplete) self.addEventListener(transitionEndEventName, closedHandler);

            // wait for animation to end if we have one
            if (!cssAnimationComplete) self.addEventListener(animationEndEventName, closedHandler);

            // if we dont have any animations/transitions, or they completed super fast - fire close event immediately
            if (cssTransitionComplete && cssAnimationComplete) {
                self.dispatchEvent(new CustomEvent('pure-dialog-closed', { bubbles: true, cancelable: true }));
            }
        }
    };

    /**
     * Injects the dialog into the body (helps avoid stacking issues)
     * @access public
     * @returns {void}
     */
    pureDialog.appendToDOM = function() {

        if (document.body) {

            var allow = this.dispatchEvent(new CustomEvent('pure-dialog-appending', { bubbles: true, cancelable: true }));

            if (allow && !this.parentElement) {
                document.body.appendChild(this);

                // trigger element reflow after insert (we do this to ensure open is seen as a new css change)
                var reflow = this.offsetWidth;
            }
        }
        else {
            throw new Error('document does not contain a body, unable to append.');
        }
    };

    /**
     * Removes the dialog from the DOM
     * @access public
     * @returns {void}
     */
    pureDialog.remove = function() {

        var allow = this.dispatchEvent(new CustomEvent('pure-dialog-removing', { bubbles: true, cancelable: true }));

        if (allow && this.parentElement) {
            this.parentElement.removeChild(this);
        }
    };

    /*-----------------*/
    /* PRIVATE METHODS */
    /*-----------------*/

    /**
     * Handles opening the dialog and waiting for opening animation before firing `opened` event
     * @param {boolean} modal - should the dialog be opened as a modal
     * @returns {void}
     */
    function showDialog(modal) {

        // if we've already started open, exit
        if (this.getAttribute('open') === 'true') return;

        var self = this;
        var transitionEndEventName = getTransitionEndEventName();
        var animationEndEventName = getAnimationEndEventName();
        var allow = self.dispatchEvent(new CustomEvent('pure-dialog-opening', { bubbles: true, cancelable: true }));

        if (allow) {

            self.setAttribute('opening', 'true');

            // this has to come first as adding the attribute probably introduces the transition/animation
            self.setAttribute('open', 'true');

            if (modal) {
                self.setAttribute('modal', 'true');
            }

            // if we have transitions/animations set complete to false so we hook up events
            var cssTransitionComplete = !hasCssTransition(self); // does it have a transition
            var cssAnimationComplete = !hasCssAnimation(self);    // does it have an animation

            var openedHandler = function(e) {

                if (e.type === transitionEndEventName) {
                    cssTransitionComplete = true;
                    self.removeEventListener(transitionEndEventName, openedHandler);
                }

                if (e.type === animationEndEventName) {
                    cssAnimationComplete = true;
                    self.removeEventListener(animationEndEventName, openedHandler);
                }

                if (cssTransitionComplete && cssAnimationComplete) {
                    self.dispatchEvent(new CustomEvent('pure-dialog-opened', { bubbles: true, cancelable: true }));
                }
            };

            // wait for transition to end (it will be true if we have no transition)
            if (!cssTransitionComplete) self.addEventListener(transitionEndEventName, openedHandler);

            // wait for animation to end (it will be true if we have no animation)
            if (!cssAnimationComplete) self.addEventListener(animationEndEventName, openedHandler);

            // if we don't have any animations/transitions, or they completed super fast - fire close event immediately
            if (cssTransitionComplete && cssAnimationComplete) {
                self.dispatchEvent(new CustomEvent('pure-dialog-opened', { bubbles: true, cancelable: true }));
            }
        }
    }

    /**
     * Render body takes care of creating the core elements and also ensuring the literal html is inserted into a wrapper
     * @access private
     * @returns {void}
     */
    function renderBody() {

        var self = this;

        // create container
        self._container = createEl(null, 'div', { class: 'pure-dialog-container' });

        // create a body element wrapper
        self._body = createEl(self._container, 'div', { class: 'pure-dialog-body' });

        // update `data-body-scroll-state` attribute
        try {
            self._body.addEventListener('scroll', function(){ updateScrollState(self); }, { passive: true });
        } catch (e) {
            self._body.addEventListener('scroll', function(){ updateScrollState(self); }, false);
        }

        // copy all children written literally into the body of the <pure-dialog> HTML tag
        while (this.firstChild !== null) {
            this._body.appendChild(this.removeChild(this.firstChild));
        }

        // add title and buttons in case they already exist
        renderTitle.call(this);
        renderButtons.call(this);

        // append the new container
        this.appendChild(this._container);

        updateScrollState(self);

        self.dispatchEvent(new CustomEvent('pure-dialog-body-rendered', { bubbles: true, cancelable: true }));
    }

    /**
     * Adds/removes dialog title based on .title property
     * @access private
     * @returns {void}
     */
    function renderTitle() {

        var self = this;

        if (this.title !== '') {

            // either get existing title tag or create a new one
            var el = this.querySelector('.pure-dialog-title') || createEl(null, 'div', { class: 'pure-dialog-title' });

            el.textContent = this.title;

            // if its not in the DOM, append it in the correct location
            if (!el.parentElement) {
                this._container.insertBefore(el, this._body);
            }
        }
        else {
            // remove title element if we have no value
            removeElementBySelector(this, '.pure-dialog-title');
        }

        self.dispatchEvent(new CustomEvent('pure-dialog-title-rendered', { bubbles: true, cancelable: true }));
    }

    /**
     * Adds/removes buttons based on this.buttons value
     * @access private
     * @returns {void}
     */
    function renderButtons() {

        var self = this;

        // convert buttons to array removing empty strings
        var buttons = this.buttons.split(self.buttonValueSeparator).filter(Boolean);

        if (buttons.length > 0) {

            // get the current button container if it exists
            var buttonContainer = this._container.querySelector('.pure-dialog-buttons');

            // if we already have a button container in the DOM
            if (buttonContainer) {

                // ensure it's empty (this could be a re-render)
                buttonContainer.innerHTML = '';
            }
            // otherwise, create one and bind events (one time)
            else {

                // create & insert container
                buttonContainer = createEl(this._container, 'div', { class: 'pure-dialog-buttons' });

                // listen for button click events
                buttonContainer.addEventListener(mouseClick, function(e) {

                    var el = e.target;

                    e.preventDefault();

                    if (el.tagName === 'INPUT' && el.className.indexOf('pure-dialog-button') > -1) {

                        // if this button is a proxy for another, suppress this click and fire on target
                        var buttonProxyTarget = el.getAttribute('data-proxy-target');
                        if (buttonProxyTarget) {
                            var targetButton = self.querySelector('[data-proxy-id="' +buttonProxyTarget + '"]');
                            fireEvent(targetButton, mouseClick);
                        }
                        else {
                            var proceedToClose = self.dispatchEvent(new CustomEvent('pure-dialog-button-clicked', { detail: el.value, bubbles: true, cancelable: true }));

                            if (self.autoClose && proceedToClose) {
                                self.close();
                            }
                        }
                    }
                });
            }

            // insert buttons
            buttons.forEach(function(item) {
                // insert button
                createEl(buttonContainer, 'input', { type: 'button', value: item.trim(), class: 'pure-dialog-button' });
            });
        }
        else {
            // remove buttons container if we have no buttons
            removeElementBySelector(this, '.pure-dialog-buttons');
        }

        self.dispatchEvent(new CustomEvent('pure-dialog-buttons-rendered', { bubbles: true, cancelable: true }));
    }

    /**
     * Adds/removes the closed button based on this.closeButton value
     * @access private
     * @returns {void}
     */
    function renderCloseButton() {

        var self = this;

        if (self.closeButton) {

            // add close button
            var closeButton = createEl(self._container, 'div', { class: 'pure-dialog-close' });

            // add close event
            closeButton.addEventListener(mouseClick, function(e) {
                e.preventDefault();

                var allow = self.dispatchEvent(new CustomEvent('pure-dialog-close-clicked', { bubbles: true, cancelable: true }));

                if (allow) {
                    self.close();
                }
            });
        }
        else {
            // remove close button
            removeElementBySelector(self, '.pure-dialog-close');
        }
    }

    /*------------------------*/
    /* PRIVATE HELPER METHODS */
    /*------------------------*/

    /**
     * Update data-body-scroll-state attribute
     * @param {HTMLElement} dialog - dialog element
     * @returns {void} sets data-body-scroll-state to top, middle, bottom or removes if not scrollable
     */
    function updateScrollState(dialog) {

        var body = dialog.body;

        if (!body) return;

        if (body.scrollHeight <= body.clientHeight + 1) {
            dialog.removeAttribute('data-body-scroll-state');
        }
        else {

            var value = 'middle';

            if (body.scrollTop <= 0) {
                value = 'top';
            }
            else if (body.scrollTop + body.clientHeight >= body.scrollHeight - 1) {
                value = 'bottom';
            }

            dialog.setAttribute('data-body-scroll-state', value);
        }
    }

    /**
     * Determine if an element of any or its children have a CSS transition applied
     * @param {HTMLElement} el - element to inspect
     * @returns {boolean} true if an transition detected, otherwise false
     */
    function hasCssTransition(el) {

        // items to inspect for transitions
        var items = [el];

        // add container element
        items.push(el && el.querySelector && el.querySelector('.pure-dialog-container'));

        for (var i = 0, l = items.length; i < l; i++) {

            if (!items[i]) { continue; } // skip if not found

            // get the applied styles
            var style = window.getComputedStyle(items[i], null);

            // read the transition duration - defaults to 0
            var transDuration = parseFloat(style.getPropertyValue('transition-duration') || '0');

            // if we have a duration greater than 0, a transition exists
            if (transDuration > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determine if an element of any or its children have a CSS animation applied
     * @param {HTMLElement} el - element to inspect
     * @returns {boolean} true if an animation detected, otherwise false
     */
    function hasCssAnimation(el) {

        // items to inspect for animation
        var items = [el];

        // add container element
        items.push(el && el.querySelector && el.querySelector('.pure-dialog-container'));

        for (var i = 0, l = items.length; i < l; i++) {

            if (!items[i]) { continue; } // skip if not found

            // get the applied styles
            var style = window.getComputedStyle(items[i], null);

            // read the animation duration - defaults to 0
            var animDuration = parseFloat(style.getPropertyValue('animation-duration') || '0');

            // if we have a duration greater than 0, an animation exists
            if (animDuration > 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Removes an element from the dom by CSS selector
     * @access private
     * @param {HTMLElement} parent - html element to look within
     * @param {string} selector - CSS selector
     * @returns {void}
     */
    function removeElementBySelector(parent, selector) {

        // remove container
        var el = (parent || document).querySelector(selector);

        if (el) {
            el.parentElement.removeChild(el);
        }
    }

    /**
    * Creates, configures & optionally inserts DOM elements via one function call
    * @access private
    * @param {object} parentEl HTML element to insert into, null if no insert is required
    * @param {string} tagName of the element to create
    * @param {object} attrs key : value collection of element attributes to create (if key is not a string, value is set as expando property)
    * @param {string} text to insert into element once created
    * @param {string} html to insert into element once created
    * @returns {object} newly constructed html element
    */
    function createEl(parentEl, tagName, attrs, text, html) {

        var el = document.createElement(tagName);
        var customEl = tagName.indexOf('-') > 0;

        // @NOTE: this needs to happen first so translate attributes are respected
        if (parentEl) {
            parentEl.appendChild(el);
        }

        if (attrs) {

            for (var key in attrs) {
                // assign className
                if (key === 'class') {
                    el.className = attrs[key];
                }
                // assign id
                else if (key === 'id') {
                    el.id = attrs[key];
                }
                // assign translate
                else if (key === 'translate') {
                    el.translate = attrs[key];
                }
                // assign name attribute, even for customEl
                else if (key === 'name') {
                    el.setAttribute(key, attrs[key]);
                }
                // assign object properties
                else if (customEl || (key in el)) {
                    el[key] = attrs[key];
                }
                // assign regular attribute
                else {
                    el.setAttribute(key, attrs[key]);
                }
            }
        }

        if (typeof text !== 'undefined') {
            el.appendChild(document.createTextNode(text));
        }

        if (typeof html !== 'undefined') {
            el.innerHTML = '';
            stringToDOM(html, el);
        }

        return el;
    }


    /**
     * Converts string containing HTML into a DOM elements - whilst removing script tags
     * @access private
     * @param {string} src - string containing HTML
     * @param {HTMLElement} [parent] - optional parent to append children into
     * @returns {DocumentFragment} fragment containing newly created elements (less script tags)
     */
    function stringToDOM(src, parent) {

        parent = parent || document.createDocumentFragment();

        var el = null;
        var tmp = document.createElement('div');

        // inject content into none live element
        tmp.innerHTML = src;

        // remove script tags
        var scripts = tmp.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) {
            scripts[i].parentElement.removeChild(scripts[i]);
        }

        // append elements
        while (el = tmp.firstChild) {
            parent.appendChild(el);
        }

        return parent;
    }

    /**
     * Works out the name for the 'transitionend' for current browser
     * @returns {string} transition end event name
     */
    function getTransitionEndEventName() {

        var el = document.createElement('div');

        var transitions = {
            WebkitTransition: 'webkitTransitionEnd',
            transition: 'transitionend',
            MozTransition: 'transitionend',
            OTransition: 'otransitionend'  // oTransitionEnd in very old Opera
        };

        for (var i in transitions) {
            if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
                return transitions[i];
            }
        }

        return '';
    }

    /**
     * Works out the name for the 'animationend' for current browser
     * @returns {string} animation end event name
     */
    function getAnimationEndEventName() {

        var el = document.createElement('div');

        var animations = {
            WebkitAnimation: 'webkitAnimationEnd',
            animation: 'animationend',
            MozAnimation: 'animationend',
            OAnimation: 'oAnimationEnd'
        };

        for (var i in animations) {
            if (animations.hasOwnProperty(i) && el.style[i] !== undefined) {
                return animations[i];
            }
        }

        return '';
    }

    /**
     * Generate unique id scoped to this environment
     * @param {string} [prefix] - optional prefix for the id
     * @returns {string} unique id string
     */
    function newUniqueId(prefix) {
        prefix = prefix || 'uid';
        newUniqueId._counters = newUniqueId._counters || {};
        newUniqueId._counters[prefix] = (newUniqueId._counters[prefix] || 0) + 1;
        return prefix + newUniqueId._counters[prefix];
    }

    /**
     * Fire event on element
     * @param {HTMLElement} el - target element
     * @param {string} type - event name like click or touchend
     * @returns {void}
     */
    function fireEvent(el, type) {
        if (!el) return;
        type = (type || '').replace(/^on/, '');

        // special case for click to trigger default behavior
        if (type === 'click' && typeof el.click === 'function') {
            el.click();
            return;
        }

        if (document.createEvent) {
            var e = document.createEvent('Event');
            e.initEvent(type, true, true);
            el.dispatchEvent(e);
        }
        else if (document.createEventObject) {
            el.fireEvent('on' + type);
        }
        else if (typeof el['on' + type] === 'function') {
            el['on' + type]();
        }
    }

    // patch CustomEvent to allow constructor creation (IE/Chrome)
    if (typeof window.CustomEvent !== 'function') {

        window.CustomEvent = function (event, params) {

            params = params || { bubbles: false, cancelable: false, detail: undefined };

            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        };

        window.CustomEvent.prototype = window.Event.prototype;
    }

    if (document.registerElement) {
        // register component with the dom
        document.registerElement('pure-dialog', { prototype: pureDialog });
    }
    else {
        throw new Error('document.registerElement does not exist. Are you missing the polyfill?');
    }

})(HTMLElement.prototype, this, document);
