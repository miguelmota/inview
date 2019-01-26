;(function () {
  var el = document.querySelector('.item')
  var status = document.querySelector('.status')
  var output = document.querySelector('.output')

  function text (el, content) {
    el.innerText = content
  }

  function html (el, content) {
    el.innerHTML = content
  }

  function statusHtml (content) {
    html(status, content)
  }

  function log (data) {
    output.innerHTML = JSON.stringify(data, null, 2)
  }

  var inView = InView(el, function (isInView, data) {
    log(data)
    el.textContent = data.elementOffsetTopInViewHeight
    if (isInView) {
      if (data.elementOffsetTopInViewHeight < data.inViewHeight / 2) {
        statusHtml('status: <span class="success">in view</span> (top half)')
      } else {
        statusHtml('status: <span class="success">in view</span> (bottom half)')
      }
    } else {
      if (data.windowScrollTop - (data.elementOffsetTop - data.inViewHeight) > data.inViewHeight) {
        statusHtml('status: <span class="fail">not in view</span> (scroll up)')
      } else {
        statusHtml('status: <span class="fail">not in view</span> (scroll down)')
      }
    }
  })
})();
