# inView

Detect when element scrolled to view

# Demo

[https://lab.miguelmota.com/inview/demo/](https://lab.miguelmota.com/inview/demo/)

# Install

Available via [npm](https://www.npmjs.org/package/inview)

```bash
npm install inview
```

# Usage

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

# License

Released under the MIT License.
