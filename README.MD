# pure-dialog

[![Shippable branch](https://img.shields.io/shippable/594ab4e4febbde0700daa804/master.svg)](https://app.shippable.com/projects/594ab4e4febbde0700daa804) [![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

Create dialogs with minimal effort using a new `pure-dialog` HTML tag _(framework independent Web Component written in pure JavaScript good old ES5)_.

**Table of Contents**

* [How to use](#how-to-use)
  * [In HTML](#in-html)
  * [In JavaScript](#or-javaScript)
  * [Methods](#methods)
  * [Events](#events)
  * [Properties and attributes](#properties-and-attributes)
* [Contribute](#contribute)
  * [Local development](#local-development)
  * [Testing](#testing)
  * [Generate .min files](#generate-min-files)
* [Reporting bugs](#reporting-bugs)
* [Pull requests](#pull-requests)

## How to use

Add the [document.registerElement](polyfills/document-register-element.js) polyfill to your project to add support for Web Components. Next add  [dist/pure-dialog.min.js](dist/pure-dialog.min.js) and [dist/pure-dialog.min.css](dist/pure-dialog.min.css) files.

### In HTML

```html
<pure-dialog id="example" title="Pure Dialog Demo" buttons="Absolutely!, No">
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
dialog.innerHTML = 'Is this project worth a star?';
dialog.buttons = 'Absolutely!, No';
dialog.closeButton = false;

// append to DOM
dialog.appendToDOM();

// show as a modal
dialog.showModal();
```

### Methods

```js
// Show the dialog
document.getElementById('example').show();
```

```js
// Show the dialog as a modal
document.getElementById('example').showModal();
```

```js
// Close the dialog
document.getElementById('example').close();
```

```js
// Add the dialog to the DOM (not require if using HTML literal)
document.getElementById('example').appendToDOM();
```

```js
// Remove the dialog from the DOM
document.getElementById('example').remove();
```

### Events

Events bubble up so it is possible to listen for pure-dialog events at the root of the DOM:

```js
// Button clicked
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

```js
// Closed clicked
document.addEventListener('pure-dialog-close-clicked', function(e) {
  console.log(e.target.id) // console log the ID of the dialog
  // use e.preventDefault() to stop the dialog from closing
});
```

```js
// Dialog is opening
document.addEventListener('pure-dialog-opening', function(e) {
  console.log(e.target.id) // console log the ID of the opening dialog
  // use e.preventDefault() to stop the dialog from opening
});
```

```js
// Dialog has opened
document.addEventListener('pure-dialog-opened', function(e) {
  console.log(e.target.id) // console log the ID of the opened dialog
});
```

```js
// Dialog is closing
document.addEventListener('pure-dialog-closing', function(e) {
  console.log(e.target.id) // console log the ID of the closing dialog
  // use e.preventDefault() to stop the dialog from closing
});
```

```js
// Dialog has closed
document.addEventListener('pure-dialog-closed', function(e) {
  console.log(e.target.id) // console log the ID of the closed dialog
});
```

```js
// Dialog appending to DOM
document.addEventListener('pure-dialog-appending', function(e) {
  console.log(e.target.id) // console log the ID of the dialog about to be inserted
  // use e.preventDefault() to stop the dialog from been inserted
});
```

```js
// Dialog removed from DOM
document.addEventListener('pure-dialog-removing', function(e) {
  console.log(e.target.id) // console log the ID of the dialog about to be removed
  // use e.preventDefault() to stop the dialog from been removed
});
```

### Properties and attributes

Property                                        | Attribute      | Description                            | Type      | Default
----------------------------------------------- | -------------- | -------------------------------------- | --------- | --------
[title](#getset-title)                          | `title`        | The dialog title                       | _string_  | _empty_
[buttons](#getset-buttons)                      | `buttons`      | Comma separated list of button labels  | _string_  | _empty_
[closeButton](#get/set-close-button-visibility) | `close-button` | If true, renders a close button        | _boolean_ | `false`
[innerHTML](#getset-dialog-body-html)           | -              | Injects HTML into body of dialog       | _string_  | _empty_

#### Get/set title

```js
// set dialog title
document.getElementById('example').title = 'Pure Dialog Demo';

// get dialog title
var dialogTitle = document.getElementById('example').title;
```

#### Get/set buttons

```js
// set dialog buttons
document.getElementById('example').buttons = 'Absolutely!, No';

// get dialog buttons
var dialogButtons = document.getElementById('example').buttons;
```

#### Get/set close button visibility

```js
// set close button visibility
document.getElementById('example').closeButton = true;

// get close button visibility
var closeButtonStatus = document.getElementById('example').closeButton;
```

#### Get/set dialog body HTML

```js
// set dialog body HTML
document.getElementById('example').innerHTML = 'Hello World!';

// get dialog body HTML
var dialogBody = document.getElementById('example').innerHTML;
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

### Generate .min files

The minified [pure-dialog.min.js](dist/pure-dialog.min.js) and [pure-dialog.min.css](dist/pure-dialog.min.css) files included in this project are the latest version. To generate new .min files, execute the following:

```bash
npm run build
```

The version number is picked up from the `package.json` file.

## Reporting bugs

If you find a bug, please create an [issue](https://github.com/john-doherty/pure-dialog/issues) _(include a [jsfiddle](https://jsfiddle.net) if possible)_.

## Pull requests

Please ensure your work is covered with unit test(s) and your code follows the ESLint coding style defined in the [package.json](package.json) file.

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)