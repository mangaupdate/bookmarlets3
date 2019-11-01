document.title = document.title + " 1";
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
var isScrolling = false;
var $div = $(
  '<button class="primary button-icon-only" title="Share with teammates" type="button" style="position: absolute; right:0;"><i class="icon icon-md icon-fx-share-to-team"></i></button>'
);
$("#searchBarFX, .Leftnav__dock.LeftnavDock").prepend($div);
$div.click(function() {
  if (isScrolling) {
    isScrolling = false;
    $div.css("background-color", "red !important");
    return;
  }
  isScrolling = true;
  $div.css("background-color", "green !important");
  scrollImage();
});
setTimeout(function() {
  console.log("ok");
  $("img, video").addClass("scrollable");
  console.log("ok");
  //var $list = $(".inlineFrame.read");
  var $current = $(".inlineFrame.selectedx");
  if (!$current.length) {
    $current = $(".inlineFrame:first");
  }
  //scrollImage($current);
}, 2000);

var currentOffset = window.pageYOffset;

function scrollImage($current) {
  if (!isScrolling) {
    return;
  }
  var $media = null;

  $(".inlineFrame img,.inlineFrame video").each(function() {
    if ($(this).offset().top > window.pageYOffset + 100) {
      console.log($(this).attr("src"));
      console.log($(this).offset().top, window.pageYOffset);
      $media = $(this);
      $("html, body").animate({ scrollTop: $media.offset().top - 50 }, 0);

      if (
        $media[0].width <= 140 ||
        $media.is("video") ||
        $media[0].naturalWidth == 0
      ) {
        like(true);
      }
      return false;
    }
  });
  //console.log($media);
  setTimeout(function() {
    scrollImage($current);
  }, 600);
}

function like(isLiked) {
  if (
    !isLiked &&
    $(".list-entries .selected .icon-fx-save--active-ios-md").length
  ) {
    $(".list-entries .selected .icon-fx-save--active-ios-md").click();
  } else if (
    isLiked &&
    $(".list-entries .selected .icon-fx-save-ios-md-black").length
  ) {
    $(".list-entries .selected .icon-fx-save-ios-md-black").click();
  }
}
