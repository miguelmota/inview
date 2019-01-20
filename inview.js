;(function(root) {

  function throttle(fn, threshhold, scope) {
    threshhold || (threshhold = 100);
    var last,
        deferTimer;

    return function () {
      var context = scope || this;

      var now = +(new Date()),
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

  function removeEvent(el, name, fn) {
      if (el.removeEventListener) {
          return el.removeEventListener(name, fn);
      } else if (el.detachEvent) {
          return el.detachEvent('on' + name, fn);
      }
  }

  function addEvent(el, name, fn) {
      if (el.addEventListener) {
          return el.addEventListener(name, fn, false);
      } else if (el.attachEvent) {
          return el.attachEvent('on' + name, fn);
      }
  }

  function getScrollTop() {
      if (typeof window.pageYOffset !== 'undefined') {
          return window.pageYOffset;
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
          objTop = obj.getBoundingClientRect().top + window.scrollY,
          objBottom = objTop + obj.offsetHeight,
          offset = 0;

      if ((objTop <= winBottom + offset) && (objBottom >= winTop)) {
          return true;
      }

      return false;
  }

  /**
   * @desc Create an InView instance.
   *
   * @class
   * @func InView
   * @param {HTMLElement} element - element to detect when scrolled to view
   * @param {scrollCallback} scrollCallback - callback function fired on scroll event
   * @return {HTMLElement} - element
   *
   * @example
   * var el = document.querySelector('.item');
   *
   * var InView = InView(el, function(isInView, data) {
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
    _this.callback = callback.bind(_this);
    _this.destroy = function() {};

    if (!el) {
      return _this;
    }

    var isDestroyed = false;

    var check = function check(e) {
        if (isDestroyed) return false;

        var params = {
          windowScrollTop: getScrollTop(),
          elementOffsetTop: _this.el.offsetTop,
          inViewHeight: window.innerHeight,
          elementOffsetTopInViewHeight: window.innerHeight - (getScrollTop() - (_this.el.offsetTop - window.innerHeight))
        };
        if (isInView(_this.el)) {
            addClass(_this.el, 'inview');
            _this.callback.call(_this, true, params);
        } else {
            removeClass(_this.el, 'inview');
            _this.callback.call(_this, false, params);
        }
    }

    var throttledCheck = throttle(check, 100);

    addEvent(window, 'scroll', throttledCheck);

    _this.destroy = function() {
      isDestroyed = true;
      removeEvent(window, 'scroll', throttledCheck)
    };

    throttledCheck();

    return _this;
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
   * @param {number} data.elementOffsetTopInViewHeight - element top offset relative to height of visible area
   */

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = InView;
    }
    exports.InView = InView;
  } else {
    root.InView = InView;
  }

})(window);
