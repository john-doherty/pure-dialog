# [pure-dialog](https://codepen.io/anon/pen/bRrbMe)

[![Shippable branch](https://img.shields.io/shippable/594ab4e4febbde0700daa804/master.svg)](https://app.shippable.com/projects/594ab4e4febbde0700daa804)
[![Linked In](https://img.shields.io/badge/Linked-In-blue.svg)](https://www.linkedin.com/in/john-i-doherty)
 [![Twitter Follow](https://img.shields.io/twitter/follow/CambridgeMVP.svg?style=social&label=Twitter&style=plastic)](https://twitter.com/CambridgeMVP)

A small _(3.3kb gzipped)_, self-contained, pure JavaScript modal dialog designed to simplify the creation of dialogs in Web and Hybrid Mobile apps.

```html
<pure-dialog id="example" title="Pure Dialog Demo" buttons="Absolutely, No">
Is this project worth a star?
</pure-dialog>
```

Becomes:

![Screenshot](/docs/screenshot.png)

Try the [demo](https://codepen.io/anon/pen/bRrbMe)

<details>
  <summary>Table of Contents</summary>
  <ul>
    <li><a href="#how-to-use">How to use</a></li>
    <ul>
      <li><a href="#in-html">In HTML</a></li>
      <li><a href="#in-javascript">In JavaScript</a></li>
      <li><a href="#methods">Methods</a></li>
      <li><a href="#events">Events</a></li>
      <li><a href="#properties-and-attributes">Properties and attributes</a></li>
      <li><a href="#styling">Styling</a></li>
    </ul>
    <li><a href="#unit-tests">Unit Tests</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#star-the-repo">Start the repo</a></li>
    <li><a href="#history">History</a></li>
    <li><a href="#license">License</a></li>
</details>

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
dialog.show();        // show the dialog
dialog.showModal();   // show the dialog as a modal
dialog.close();       // close the dialog
dialog.appendToDOM(); // add the dialog to the DOM (not require if using HTML literal)
dialog.remove();      // remove the dialog from the DOM
```

### Events

All pure-dialog events bubble up so it is possible to listen for pure-dialog events at the root of the DOM. Assuming `var dialog = document.getElementById('example')`:

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

// detect button click on all dialogs in the DOM
document.addEventListener('pure-dialog-button-clicked', function(e) {
  console.log(e.detail); // log button label
});

// detect closed clicked
dialog.addEventListener('pure-dialog-close-clicked', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from closing by using e.preventDefault()
});

// detect dialog is opening
dialog.addEventListener('pure-dialog-opening', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from opening by using e.preventDefault()
});

// detect dialog has opened
dialog.addEventListener('pure-dialog-opened', function(e) {
  console.log(e.target.id) // log dialog id
});

// detect dialog is closing
dialog.addEventListener('pure-dialog-closing', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from closing by using e.preventDefault()
});

// detect dialog has closed
dialog.addEventListener('pure-dialog-closed', function(e) {
  console.log(e.target.id) // log dialog id
});

// detect dialog is appending to DOM
dialog.addEventListener('pure-dialog-appending', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from been inserted by using e.preventDefault()
});

// detect dialog removed from DOM
dialog.addEventListener('pure-dialog-removing', function(e) {
  console.log(e.target.id) // log dialog id

  // stop the dialog from been removed by using e.preventDefault()
});
```

### Properties and attributes

JS Property    | HTML Attribute    | Description                              | Type      | Default
-------------- | ----------------- | ---------------------------------------- | --------- | --------
title          | `title`           | Get/set the dialog title                 | _string_  | _empty_
buttons        | `buttons`         | Get/set comma separated list of buttons  | _string_  | _empty_
closeButton    | `close-button`    | If true, renders a close button          | _boolean_ | `false`
removeOnClose  | `remove-on-close` | If true, remove dialog from DOM on close | _boolean_ | `false`
autoClose      | `auto-close`      | auto close when button clicked           | _boolean_ | `true`
innerHTML      | _n/a_             | Injects HTML into body of dialog         | _string_  | _empty_
body           | _n/a_             | Gets dialog inner body tag               | _object_  | null

Assuming `var dialog = document.getElementById('example')`:

```js
dialog.title = 'Pure Dialog Demo';        // set title
dialog.buttons = 'Absolutely, No';        // set buttons
dialog.closeButton = true;                // set close button visibility
dialog.removeOnClose = true;              // remove dialog from DOM on close
dialog.autoClose = false;                 // do not auto close when button clicked
dialog.innerHTML = 'Hello World!';        // set dialog body HTML
dialog.body.textContent = 'Hello World';  // set inner text via body tag
```

## Styling

`pure-dialog` was designed to be light and so only produces the following output, making it easy to style:

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

To change the style of a particular button, you could use its value as a selector:

```css
#example input[value="Absolutely"] { background: #880000; }
```

## Unit Tests

1. Checkout using `git clone https://github.com/john-doherty/pure-dialog`
2. Navigate into project folder `cd pure-dialog`
3. Install dependencies `npm install`
4. Run the tests `npm test`

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## Star the repo

If you find this useful, star the repo, it motivates me to continue development :)

## History

For change-log, check [releases](https://github.com/john-doherty/pure-dialog/releases).

## License

Licensed under [MIT License](LICENSE) &copy; [John Doherty](http://www.johndoherty.info)