(function() {

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

  function InView (el, callback) {
    var _this = this;
    _this.el = el;
    _this.callback = callback;

    function check(e) {
        if (isInView(_this.el)) {
            addClass(_this.el, 'inview');
            _this.callback(true);
        } else {
            removeClass(_this.el, 'inview');
            _this.callback(false);
        }
    }

    addEvent(window, 'scroll', check);
  }

  this.InView = InView;

}).call(this);
