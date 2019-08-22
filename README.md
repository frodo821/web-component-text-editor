# Web Component Text Editor
This is a web component based text editor.

## Table of Contents
- [Web Component Text Editor](#web-component-text-editor)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [1. Type following commands:](#1-type-following-commands)
    - [2. Write the code in your html:](#2-write-the-code-in-your-html)
  - [Properties](#properties)
  - [Known Bugs, Problems and Not Implemented Functions](#known-bugs-problems-and-not-implemented-functions)

## Installation
**This project needs  [yarn](https://yarnpkg.com) and globally installed [webpack](https://github.com/webpack/webpack) to build and also needs globally installed [webpack-dev-server](https://github.com/webpack/webpack-dev-server) to test.**

### 1. Type following commands:

```sh
$ git clone https://github.com/frodo821/web-component-text-editor.git
$ cd web-component-text-editor
$ yarn run build
```

And then, `text-editor-element.js` will be generated under `dist/` folder.

### 2. Write the code in your html:

In head section:

```html
<script src="/path/to/text-editor-elements.js"></script>
```

Somewhere you want in body section:

```html
<text-editor></text-editor>
```

## Properties
* rows: number of rows of the text editor.
* columns: number of columns of the text editor.

## Known Bugs, Problems and Not Implemented Functions

1. Bugs and Problems
   1. When deleting characters, sometimes the caret goes back one character more.
   2. Changing properties after initialized makes no effect.
   3. When full width characters are entered, the caret doesn't points actual potision.
   4. Scrolling editor makes caret overflowed from view.
2. Not Implemented Functions
   1. Extensions to add or to vary editor behaviour.
   2. File operations (ex. open, save, etc.)
