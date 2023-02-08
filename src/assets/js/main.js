//right slder start
// $("#menu-toggle").click(function (e) {
// e.preventDefault();
// $("#rightslider").toggleClass("toggled");
// })
//right slder end

//plus minus start
$(document).ready(function() {
    $('.minus').click(function () {
        var $input = $(this).parent().find('input');
        var count = parseInt($input.val()) - 1;
        count = count < 1 ? 1 : count;
        $input.val(count);
        $input.change();
        return false;
    });
    $('.plus').click(function () {
        var $input = $(this).parent().find('input');
        $input.val(parseInt($input.val()) + 1);
        $input.change();
        return false;
    });
});
//plus minus end

//BG blur start
myBlurFunction = function(bgfunr) {
  var overlayEle = document.getElementById('overlay');
  if (bgfunr) {
      overlayEle.style.display = 'block';
      containerElement.setAttribute('class', 'bg-blur');
  } else {
      overlayEle.style.display = 'none';
      containerElement.setAttribute('class', null);
  }
};
//BG blur end

