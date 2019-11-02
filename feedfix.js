// ==UserScript==
// @name         fix feed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://feedly.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// ==/UserScript==

document.title = document.title + " 1.1";
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
  '<button class="primary button-icon-only" title="Share with teammates" type="button" style="position: absolute; right:300px;z-index: 9999999999;"><i class="icon icon-md icon-fx-share-to-team"></i></button>'
);
console.log($div);
$("#searchBarFX, .Leftnav__dock.LeftnavDock").prepend($div);
$div.click(function() {
  if (isScrolling) {
    isScrolling = false;
    $div.css("background-color", "green");
    return;
  }
  isScrolling = true;
  $div.css("background-color", "red");
  scrollImage();
});
setTimeout(function() {
  $("#headerBarFX").prepend($div);

  var script_tag = document.createElement("script");
  script_tag.type = "text/javascript";
  script_tag.text =
    "" +
    "function simulateKeydown (keycode){" +
    'var e = new KeyboardEvent( "keypress", { bubbles:true} );' +
    'Object.defineProperty(e, "charCode", {get:function(){return this.charCodeVal;}});' +
    "e.charCodeVal = keycode.charCodeAt(0);" +
    "document.body.dispatchEvent(e);" +
    '}; simulateKeydown("j");document.title = document.title + " key"; ';
  document.body.appendChild(script_tag);
}, 10000);

var currentOffset = window.pageYOffset;
var $currenTmedia = null;

function scrollImage($current) {
  if (!isScrolling) {
    return;
  }
  var $media = null;

  $(".inlineFrame img,.inlineFrame video").each(function() {
    if ($(this).offset().top > window.pageYOffset + 100) {
      if ($currenTmedia && !$currenTmedia[0].complete) {
        //console.log($currenTmedia.complete)
        return false;
      }
      $media = $(this);
      $currenTmedia = $media;
      $("html, body").animate({ scrollTop: $media.offset().top - 50 }, 0);
      console.log(
        $media[0].width +
          " <= 140 ||" +
          $media.is("video") +
          " || " +
          $media[0].naturalWidth +
          " == 0"
      );
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

function fixContent() {
  $(".entryholder:not(.fixed)").each(function(newsIndex) {
    var ent = this;
    $(this).addClass("fixed");
    $(this)
      .find("img:first:not(.listening)")
      .each(function() {
        $(this).addClass("listening");
        $(this).on("error", function(e) {
          //console.log('error', ent);
          fixImg(
            $(ent).find(".entryBody"),
            $(ent)
              .find(".entryHeader a:first")
              .attr("href")
          );
        });
      });
    $(ent)
      .find('.entryHeader a[href^="https://twitter.com"]')
      .each(function() {
        fixImg(
          $(ent).find(".entryBody"),
          $(ent)
            .find(".entryHeader a:first")
            .attr("href")
        );
      });
    $(ent)
      .find('.entryHeader a[href^="https://www.metarthunter.com"]')
      .each(function() {
        fixImg(
          $(ent).find(".entryBody"),
          $(ent)
            .find(".entryHeader a:first")
            .attr("href")
        );
      });
    $(ent)
      .find('.entryBody a[href$=".jpg"]:contains("original")')
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
    $(ent)
      .find('.entryBody a[href$=".png"]:contains("original")')
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
    $(ent)
      .find('.entryBody a[href$=".gifv"]:contains("original")')
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
    $(ent)
      .find(
        '.entryBody a[href^="https://imgur.com"]:contains("view this album")'
      )
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
    $(ent)
      .find('.entryBody a[href*="imgur.com/a"]:contains("view this album")')
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
    $(ent)
      .find('.entryBody a[href^="http://gelbooru.com/"]')
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
    $(ent)
      .find(
        '.entryHeader a.entryTitle[href^="https://idol.sankakucomplex.com"]'
      )
      .each(function() {
        fixImg($(ent).find(".entryBody"), $(this).attr("href"));
      });
  });
}

setInterval(function() {
  fixContent();
}, 10000);

async function fixImg($entryBody, url) {
  var previewGifs = true;
  var bigImgs = true;
  var newsIndex = $(".entryBody").index($entryBody);
  var src = "src";
  if (newsIndex > 4) {
    //src = 'data-src';
  }
  console.log("url", url);
  if (url.match(/\.jpg$/) || url.match(/\.png$/)) {
    //console.log('$entryBody',$('.entryBody').index($entryBody) )
    $entryBody.html(
      '<img style="min-width:400px; width:auto !important; max-height:' +
        $(window).height() +
        'px !important;" ' +
        src +
        '="' +
        url +
        '" onError="this.onerror=null;this.src=this.src+\'#\';"/>'
    );
  } else if (url.match(/\.gifv$/)) {
    $entryBody.html(
      '<video src="' +
        url.replace("gifv", "mp4") +
        '" controls poster="' +
        url.replace("gifv", "jpg") +
        '" />'
    );
  }
}
function loadFix(a, b) {
  return a;
}
