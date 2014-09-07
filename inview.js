(function() {

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 100);
    var last,
        deferTimer;

    return function () {
      var context = scope || this;

      var now = +(new Date),
          args = arguments;
      if (last && now < last + threshhold) {
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function () {
          last = now;
          fn.apply(context, args);
        }, threshhold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  }

  function hasClass(el, name) {
      return new RegExp(' ' + name + ' ').test(' ' + el.className + ' ');
  }

  function addClass(el, name) {
      if (!hasClass(el, name)) {
          el.className += ' ' + name;
      }
      return el;
  }

  function removeClass(el, name) {
      var newClass = ' ' + el.className.replace(/[\t\r\n]/g, ' ') + ' ';
      if (hasClass(el, name)) {
          while (newClass.indexOf(' ' + name + ' ') >= 0) {
              newClass = newClass.replace(' ' + name + ' ', ' ');
          }
          el.className = newClass.replace(/^\s+|\s+$/g, '');
      }
      return el;
  }

  function addEvent(el, name, fn) {
      if (el.addEventListener) {
          return el.addEventListener(name, fn, false);
      } else if (el.attachEvent) {
          return el.attachEvent('on' + name, fn);
      }
  }

  function getScrollTop() {
      if (typeof pageYOffset != 'undefined') {
          return pageYOffset;
      } else {
          var b = document.body;
          var d = document.documentElement;
          d = d.clientHeight ? d : b;
          return d.scrollTop;
      }
  }

  function isInView(obj) {
      var winTop = getScrollTop(),
          winBottom = winTop + window.innerHeight,
          objTop = obj.offsetTop,
          objBottom = objTop + obj.offsetHeight,
          offset = 0;

      if ((objBottom <= winBottom + offset) && (objTop >= winTop)) {
          return true;
      }
  }

  /**
   * @desc Create an InView instance.
   *
   * @fileoverview asdfasdf
   * @class
   * @func InView
   * @param {HTMLElement} element - element to detect when scrolled to view
   * @param {scrollCallback} scrollCallback - callback function fired on scroll event
   * @return {HTMLElement} - element
   *
   * @example
   * var el = document.querySelector('.item');
   *
   * var inView = InView(el, function(isInView, data) {
   *   if (isInView) {
   *     console.log('in view');
   *   } else {
   *     if (data.windowScrollTop - (data.elementOffsetTop - data.inViewHeight) > data.inViewHeight) {
   *       console.log('not in view (scroll up)');
   *     } else {
   *       console.log('not in view (scroll down)');
   *     }
   *   }
   * });
   */
  function InView (el, callback) {
    var _this = this;
    if (!(_this instanceof InView)) {
      return new InView(el, callback);
    }
    _this.el = el;
    _this.callback = callback;

    function check(e) {
        var params = {
          windowScrollTop: getScrollTop(),
          elementOffsetTop: _this.el.offsetTop,
          inViewHeight: window.outerHeight
        };
        if (isInView(_this.el)) {
            addClass(_this.el, 'inview');
            _this.callback.call(_this.el, true, params);
        } else {
            removeClass(_this.el, 'inview');
            _this.callback.call(_this.el, false, params);
        }
    }

    var throttledCheck = throttle(check, 100);

    check();
    addEvent(window, 'scroll', throttledCheck);
  }

  /**
   * @desc InView callback
   *
   * @callback scrollCallback
   * @param {boolean} isInView - is in view
   * @param {object} data - scroll data
   * @param {number} data.windowScrollTop - scrolled amount
   * @param {number} data.elementOffsetTop - element top offset
   * @param {number} data.inViewHeight - height of visible area
   */

  this.InView = InView;

}).call(this);
