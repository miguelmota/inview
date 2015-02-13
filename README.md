# inView

Detect when element scrolled to view

# Demo

[http://lab.moogs.io/inview/demo/](http://lab.moogs.io/inview/demo/)

# Documentation


# Install

Available via [bower](http://bower.io/)

```bash
bower install inview
```

Available via [npm](https://www.npmjs.org/package/inview)

```bash
npm install inview
```

# Usage

```javascript
var inView = inView(el, function(isInView, data) {
  if (isInView) {
    console.log('in view');
  } else {
    if (data.windowScrollTop - (data.elementOffsetTop - data.inViewHeight) > data.inViewHeight) {
      console.log('not in view (scroll up)');
    } else {
      console.log('not in view (scroll down)');
    }
  }
});
```

Scroll callback parameters:

```
{boolean} isInView - is in view
{object} data - scroll data
{number} data.windowScrollTop - scrolled amount
{number} data.elementOffsetTop - element top offset
{number} data.inViewHeight - height of visible area
```

[http://lab.moogs.io/inview/docs](http://lab.moogs.io/inview/docs)

# License

Released under the MIT License.
