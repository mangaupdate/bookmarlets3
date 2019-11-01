if ("performance" in window == false) {
  window.performance = {};
}
Date.now =
  Date.now ||
  function() {
    // thanks IE8
    return new Date().getTime();
  };

if ("now" in window.performance == false) {
  var nowOffset = Date.now();

  if (performance.timing && performance.timing.navigationStart) {
    nowOffset = performance.timing.navigationStart;
  }

  window.performance.now = function now() {
    return Date.now() - nowOffset;
  };
}

setTimeout(function() {
  console.log("ok");
  $("img, video").addClass("scrollable");
  console.log("ok");
  //var $list = $(".inlineFrame.read");
  var $current = $(".inlineFrame.selectedx");
  if (!$current.length) {
    $current = $(".inlineFrame:first");
  }
  scrollImage($current);
}, 2000);

var currentOffset = window.pageYOffset;

function scrollImage($current) {
  var $media = null;

  $(".inlineFrame img,.inlineFrame video").each(function() {
    if ($(this).offset().top > window.pageYOffset + 100) {
      console.log($(this).attr("src"));
      console.log($(this).offset().top, window.pageYOffset);
      $media = $(this);
      $("html, body").animate({ scrollTop: $media.offset().top - 50 }, 0);
      return false;
    }
  });
  //console.log($media);
  setTimeout(() => {
    scrollImage($current);
  }, 300);
}
