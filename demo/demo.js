(function() {

  var el = document.querySelector('.item');
  var status  = document.querySelector('.status');

  function text(el, content) {
    el.innerText = content;
  }

  function html(el, content) {
    el.innerHTML = content;
  }

  function statusHtml(content) {
    html(status, content);
  }

  var inView = inView(el, function(isInView, data) {
    if (isInView) {
      statusHtml('status: <span class="success">in view</span>');
    } else {
      if (data.windowScrollTop - (data.elementOffsetTop - data.inViewHeight) > data.inViewHeight) {
        statusHtml('status: <span class="fail">not in view</span> (scroll up)');
      } else {
        statusHtml('status: <span class="fail">not in view</span> (scroll down)');
      }
    }
  });

})();
