# pure-dialog

[![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

Create dialogs with minimal effort using a new `pure-dialog` HTML tag. pure-dialog is a framework independent Web Component written in pure JavaScript _(good old ES5)_.

## How to use

### Install

Add the [dist/pure-dialog.min.js](dist/pure-dialog.min.js) and [dist/pure-dialog.min.css](dist/pure-dialog.min.css) files into your project. If you require IE9+/Safari support you'll also need the [document.registerElement](polyfills/document-register-element.js) polyfill.

### In HTML

```html
<pure-dialog id="example" title="Pure Dialog Demo" close-button="false" buttons="Absolutely!, No">
Is this project worth a star?
</pure-dialog>
```

### Or JavaScript

```js
// create the element
var dialog = document.createElement('pure-dialog');

// set its properties
dialog.id = 'example';
dialog.title = 'Pure Dialog Demo';
dialog.buttons = 'Absolutely!, No';
dialog.closeButton = false;

// append to DOM
dialog.appendToDOM();

// show as a modal
dialog.showModal();
```

### Methods

Each pure-dialog element exposes the following methods:

Method                                      | Description
------------------------------------------- | ---------------------------------------------------------
[show()](#show-the-dialog)                  | Show the dialog
[showModal()](#show-the-dialog-as-a-modal)  | Show the dialog as a modal
[close()](#close-the-dialog)                | Close the dialog
[appendToDOM()](#add-the-dialog-to-the-dom) | `.appendToDOM()` helps avoid stacking issues by ensuring dialog is always appended to body
[remove()](#remove-the-dialog-from-the-dom) | Remove the dialog from the DOM

#### Show the dialog

```js
document.getElementById('example').show();
```

#### Show the dialog as a modal

```js
document.getElementById('example').showModal();
```

#### Close the dialog

```js
document.getElementById('example').close();
```

#### Add the dialog to the DOM

```js
// this method exists to help avoid stacking issues
// by ensuring the dialog is always the last tag in the body
document.getElementById('example').appendToDOM();
```

#### Remove the dialog from the DOM

```js
document.getElementById('example').remove();
```

### Events

Each pure-dialog element exposes the following events, however all events bubble up so it is possible to listen for pure-dialog events at the root of the DOM:

Method                                      | Description
--------------------------------------------------------------- | --------------------------------------------------------------
[pure-dialog-button-clicked](#listen-for-button-clicks) | Fires when a dialog button is clicked, `e.detail` contains button label
[pure-dialog-close-clicked](#detect-when-closed-clicked) | Fires when the dialog close button is clicked _(if present)_
[pure-dialog-opening](#detect-when-a-dialog-is-opening) | Fires when a dialog is about to open _(can be canceled)_
[pure-dialog-opened](#detect-when-a-dialog-has-opened) | Fires when a dialog has opened
[pure-dialog-closing](#detect-when-a-dialog-is-closing) | Fires when a dialog is about to close _(can be canceled)_
[pure-dialog-closed](#detect-when-a-dialog-has-closed) | Fires when a dialog is closed
[pure-dialog-appending](#detect-when-a-dialog-is-about-to-be-inserted-into-dom) | Fires before a dialog is about to be appended to the DOM _(can be canceled)_
[pure-dialog-removing](#detect-when-a-dialog-is-about-to-be-removed-from-the-dom) | Fires before a dialog element is about to be removed from the DOM _(can be canceled)_

#### Listen for button clicks

```js
document.getElementById('example').addEventListener('pure-dialog-button-clicked', function(e) {
  if (e.detail === 'Absolutely') {
    // Absolutely was clicked!
  }
  else {
    // Absolutely was not clicked, stop the dialog from closing ;)
    e.preventDefault();
  }
});
```

#### Detect when closed clicked

```js
// The event bubbles so you can listen on the DOM level or directly on the element
document.addEventListener('pure-dialog-close-clicked', function(e) {
    // FYI e.target === this === dialog that triggered the event
    // use e.preventDefault() to stop the dialog from closing
});
```

#### Detect when a dialog is opening

```js
document.addEventListener('pure-dialog-opening', function(e) {
  console.log(e.target.id) // console log the ID of the opening dialog
  // use e.preventDefault() to stop the dialog from opening
});
```

#### Detect when a dialog has opened

```js
document.addEventListener('pure-dialog-opened', function(e) {
  console.log(e.target.id) // console log the ID of the opened dialog
});
```

#### Detect when a dialog is closing

```js
document.addEventListener('pure-dialog-closing', function(e) {
  console.log(e.target.id) // console log the ID of the closing dialog
  // use e.preventDefault() to stop the dialog from closing
});
```

#### Detect when a dialog has closed

```js
document.addEventListener('pure-dialog-closed', function(e) {
  console.log(e.target.id) // console log the ID of the closed dialog
});
```

#### Detect when a dialog is about to be inserted into DOM

```js
document.addEventListener('pure-dialog-appending', function(e) {
  console.log(e.target.id) // console log the ID of the dialog about to be inserted
  // use e.preventDefault() to stop the dialog from been inserted
});
```

#### Detect when a dialog is about to be removed from the DOM

```js
document.addEventListener('pure-dialog-removing', function(e) {
  console.log(e.target.id) // console log the ID of the dialog about to be removed
  // use e.preventDefault() to stop the dialog from been removed
});
```

### Properties and attributes

Property                          | Attribute      | Description                            | Type      | Default
--------------------------------- | -------------- | -------------------------------------- | --------- | --------
[title](#set-title)               | `title`        | The dialog title                       | _string_  | _empty_
[buttons](#set-buttons)           | `buttons`      | Comma separated list of button labels  | _string_  | _empty_
[closeButton](#show-close-button) | `close-button` | If true, renders a close button        | _boolean_ | `false`
[innerHTML](#innerhtml)           | -              | Injects HTML into body of dialog       | _string_  | _empty_

#### Set title

```js
document.getElementById('example').title = 'Pure Dialog Demo';
```

#### Set buttons

```js
document.getElementById('example').buttons = 'Absolutely!, No';
```

#### Show close button

```js
document.getElementById('example').closeButton = true;
```

#### Set dialog body

```js
document.getElementById('example').innerHTML = 'Hello World!';
```

## Contribute

### Local development

The project includes everything needed to continue development, including a node webserver. If you'd like to help out, run the following to get started:

```bash
git clone https://github.com/john-doherty/pure-dialog
cd pure-dialog
npm install
npm start
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

### Testing

The project includes Unit Test. To run tests, execute the following from within the pure-dialog folder:

```bash
npm install
npm test
```

Tests are written using [jsdom](https://github.com/tmpvar/jsdom)/[jasmine](https://github.com/mhevery/jasmine-node) and are broken into 3 files:

| Filename                        | Description
| ------------------------------- | ---------------------------------------------------------------------------------------
| `pure-dialog-interface-spec.js` | Tests that check the correct properties, methods and defaults are exposed
| `pure-dialog-event-spec.js`     | Test pure-dialog events fire in the correct order
| `pure-dialog-method-spec.js`    | Tests that execute methods and verify their functionality by inspecting rendered output

### Generate .min Files

The minified [pure-dialog.min.js](dist/pure-dialog.min.js) and [pure-dialog.min.css](dist/pure-dialog.min.css) files included in this project are the latest version. To generate .min files, execute the following:

```bash
npm run build
```

The version number is picked up from the `package.json` file.

## Reporting Bugs

If you find a bug, please create an [issue](https://github.com/john-doherty/pure-dialog/issues) _(include a [jsfiddle](https://jsfiddle.net) if possible)_.

## Pull Requests

Feel free to submit a pull requests, but please ensure your work is covered with unit tests and your code follows the current ESLint coding style defined in the [package.json](package.json) file.

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)