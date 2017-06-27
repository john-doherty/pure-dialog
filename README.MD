# pure-dialog

[![Shippable branch](https://img.shields.io/shippable/594ab4e4febbde0700daa804/master.svg)](https://app.shippable.com/projects/594ab4e4febbde0700daa804) [![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty) [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

Pure JavaScript Web Component that makes creating dialogs super simple. For example:

```html
<pure-dialog id="example" title="Pure Dialog Demo" buttons="Absolutely, No">
Is this project worth a star?
</pure-dialog>
```

Becomes:

![Screenshot](/docs/screenshot.png)

Try the [interactive example](https://codepen.io/anon/pen/bRrbMe)

**Table of Contents**

* [How to use](#how-to-use)
  * [In HTML](#in-html)
  * [In JavaScript](#in-javascript)
  * [Methods](#methods)
  * [Events](#events)
  * [Properties and attributes](#properties-and-attributes)
  * [Styling](#styling)
* [Contribute](#contribute)
  * [Local development](#local-development)
  * [Testing](#testing)
  * [Generate .min files](#generate-min-files)
* [Reporting bugs](#reporting-bugs)
* [Pull requests](#pull-requests)

## How to use

Add  [dist/pure-dialog.min.js](dist/pure-dialog.min.js) and [dist/pure-dialog.min.css](dist/pure-dialog.min.css) files to your page.

_If your browser does not support Web Components you will need to add the  [document.registerElement](polyfills/document-register-element.js) polyfill._

### In HTML

```html
<pure-dialog id="example" title="Pure Dialog Demo" buttons="Absolutely, No">
Is this project worth a star?
</pure-dialog>
```

### In JavaScript

```js
// create the element
var dialog = document.createElement('pure-dialog');

// set its properties
dialog.id = 'example';
dialog.title = 'Pure Dialog Demo';
dialog.innerHTML = 'Is this project worth a star?';
dialog.buttons = 'Absolutely, No';
dialog.closeButton = false;

// append to DOM
dialog.appendToDOM();

// show as a modal
dialog.showModal();
```

### Methods

Assuming `var dialog = document.getElementById('example')`:

```js
// show the dialog
dialog.show();
```

```js
// show the dialog as a modal
dialog.showModal();
```

```js
// close the dialog
dialog.close();
```

```js
// add the dialog to the DOM (not require if using HTML literal)
dialog.appendToDOM();
```

```js
// remove the dialog from the DOM
dialog.remove();
```

### Events

All pure-dialog events bubble up so it is possible to listen for pure-dialog events at the root of the DOM.

Assuming `var dialog = document.getElementById('example')`:

```js
// detect button clicks on the #example element
dialog.addEventListener('pure-dialog-button-clicked', function(e) {

  if (e.detail === 'Absolutely') {
    // Absolutely was clicked!
  }
  else {
    // Absolutely was not clicked, stop the dialog from closing ;)
    e.preventDefault();
  }
});

// detect button click on all dialogs
document.addEventListener('pure-dialog-button-clicked', function(e) {
  console.log(e.detail); // log button label
});
```

```js
// detect closed clicked
dialog.addEventListener('pure-dialog-close-clicked', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from closing by using e.preventDefault()
});
```

```js
// detect dialog is opening
dialog.addEventListener('pure-dialog-opening', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from opening by using e.preventDefault()
});
```

```js
// detect dialog has opened
dialog.addEventListener('pure-dialog-opened', function(e) {
  console.log(e.target.id) // log dialog id
});
```

```js
// detect dialog is closing
dialog.addEventListener('pure-dialog-closing', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from closing by using e.preventDefault()
});
```

```js
// detect dialog has closed
dialog.addEventListener('pure-dialog-closed', function(e) {
  console.log(e.target.id) // log dialog id
});
```

```js
// detect dialog is appending to DOM
dialog.addEventListener('pure-dialog-appending', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from been inserted by using e.preventDefault()
});
```

```js
// detect dialog removed from DOM
dialog.addEventListener('pure-dialog-removing', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from been removed by using e.preventDefault()
});
```

### Properties and attributes

Property       | Attribute         | Description                              | Type      | Default
-------------- | ----------------- | ---------------------------------------- | --------- | --------
title          | `title`           | Get/set the dialog title                 | _string_  | _empty_
buttons        | `buttons`         | Get/set comma separated list of buttons  | _string_  | _empty_
closeButton    | `close-button`    | If true, renders a close button          | _boolean_ | `false`
removeOnClose  | `remove-on-close` | If true, remove dialog from DOM on close | _boolean_ | `false`
innerHTML      | -                 | Injects HTML into body of dialog         | _string_  | _empty_

Assuming `var dialog = document.getElementById('example')`:

```js
// set title
dialog.title = 'Pure Dialog Demo';
```

```js
// set buttons
dialog.buttons = 'Absolutely, No';
```

```js
// set close button visibility
dialog.closeButton = true;
```

```js
// remove dialog from DOM on close
dialog.removeOnClose = true;
```

```js
// set dialog body HTML
dialog.innerHTML = 'Hello World!';
```

## Styling

pure-dialog was designed to be super light and therefore only produces the following output, making it easy to style:

```html
<pure-dialog id="example" title="Pure Dialog Demo" buttons="Absolutely, No">
  <div class="pure-dialog-container">
    <div class="pure-dialog-title">Pure Dialog Demo</div>
    <div class="pure-dialog-body">Is this project worth a star?</div>
    <div class="pure-dialog-buttons">
      <input class="pure-dialog-button" type="button" value="Absolutely">
      <input class="pure-dialog-button" type="button" value="No">
    </div>
  </div>
</pure-dialog>
```

To change the colour of a particular button, you could use its value as a selector:

```css
#example input[value="Absolutely"] { background: #880000; }
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
| `pure-dialog-method-spec.js`    | Tests that execute methods and verify their functionality by inspecting rendered output
| `pure-dialog-rendering-spec.js` | Lists of test to check rendering

### Generate .min files

The minified [pure-dialog.min.js](dist/pure-dialog.min.js) and [pure-dialog.min.css](dist/pure-dialog.min.css) files included in this project are the latest version. To generate new .min files, execute the following:

```bash
npm run build
```

The version number is picked up from the `package.json` file.

## Reporting bugs

If you find a bug, please create an [issue](https://github.com/john-doherty/pure-dialog/issues) and include a [jsfiddle](https://jsfiddle.net) or [CodePen](https://codepen.io/anon/pen/bRrbMe) if possible.

## Pull requests

Please ensure your work is covered with unit test(s) and your code follows the ESLint coding style defined in the [package.json](package.json) file.

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)