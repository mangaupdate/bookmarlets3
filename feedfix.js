//document.title = "ok";
//var $ = window.$ || {};

console.log("ok");
setTimeout(function() {
  console.log("ok");
  $("img, video").addClass("scrollable");
  console.log("ok");
  //var $list = $(".inlineFrame.read");
  var $current = $(".inlineFrame.selected");
  if (!$current.length) {
    $current = $(".inlineFrame:first");
  }
  /*$list.each(function() {
    console.log($(this).offset().top, window.pageYOffset);
    if ($(this).offset().top > window.pageYOffset) {
      $current = $(this);
      return false;
    }
  });*/
  //console.log([$list, $current]);
  scrollImage($current);
}, 2000);

var currentOffset = window.pageYOffset;

function scrollImage($current) {
  //var nextIndex = $list.index($current) + 1;
  //console.log(nextIndex);
  //console.log($list, $current);

  var $next = null;

  $current.find("img, video").each(function() {
    console.log($(this).offset().top, window.pageYOffset);
    if ($(this).offset().top > window.pageYOffset) {
      $current = $(this);
      return false;
    }
  });
  if (!$next) {
    return;
  }
  setTimeout(() => {
    scrollImage($list, $next);
  }, 300);
  if (!$current.offset()) {
    return;
  }
  if (currentOffset > $current.offset().top) {
    return;
  }
  currentOffset = $current.offset().top;
  $("html, body").animate({ scrollTop: $current.offset().top }, 0);
}
