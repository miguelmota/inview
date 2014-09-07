(function() {

  var el = document.querySelector('.item');

  var inView = new InView(el, function(isInView) {
    if (isInView) {
      console.log('in view');
    } else {
      console.log('not in view');
    }
  });

})();
