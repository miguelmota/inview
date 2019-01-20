<h3 align="center">
  <br />
  <img src="https://user-images.githubusercontent.com/168240/51433713-957e3000-1c05-11e9-975c-d3d1d17b6760.png" alt="logo" width="600" />
  <br />
  <br />
  <br />
</h3>

# inView

> Detect when element scrolled to view

[![License](http://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/miguelmota/inview/master/LICENSE) [![Build Status](https://travis-ci.org/miguelmota/inview.svg?branch=master)](https://travis-ci.org/miguelmota/inview) [![dependencies Status](https://david-dm.org/miguelmota/inview/status.svg)](https://david-dm.org/miguelmota/inview) [![NPM version](https://badge.fury.io/js/inview.svg)](http://badge.fury.io/js/inview)

## Demo

[https://lab.miguelmota.com/inview/demo/](https://lab.miguelmota.com/inview/demo/)

## Install

```bash
npm install inview
```

## Getting started

Basic example

```javascript
var inview = InView(el, function(isInView) {
  if (isInView) {
    // do something
    // ...
  }
});
```

Example showing if visible top half or bottom half of screen

```javascript
var inview = InView(el, function(isInView, data) {
  if (isInView) {
    if (data.elementOffsetTopInViewHeight < data.inViewHeight/2) {
      console.log('in view (top half)');
    } else {
      console.log('in view (bottom half)');
    }
  } else {
    if (data.windowScrollTop - (data.elementOffsetTop - data.inViewHeight) > data.inViewHeight) {
      console.log('not in view (scroll up)');
    } else {
      console.log('not in view (scroll down)');
    }
  }
});
```

Destroy InView listeners

```javascript
var inview = InView(el, function(isInView, data) {
  if (isInView) {
    // do something
    // ...

    this.destroy();
  }
})

// another way
inview.destroy();
```

Scroll callback parameters:

```
{boolean} isInView - is in view
{object} data - scroll data
{number} data.windowScrollTop - scrolled amount
{number} data.elementOffsetTop - element top offset
{number} data.inViewHeight - height of visible area
{number} data.elementOffsetTopInViewHeight - element top offset relative to height of visible area
```

[https://lab.miguelmota.com/inview/docs](https://lab.miguelmota.com/inview/docs)

## License

MIT
