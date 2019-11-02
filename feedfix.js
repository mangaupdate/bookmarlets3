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
    '}; simulateKeydown("j"); ';
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
  if (url.match("https://idol.sankakucomplex.com")) {
    return;
    //https://gelbooru.com/thumbnails/54/f2/thumbnail_54f236ca02c7e57361d0a8504b540194.jpg
    //https://img2.gelbooru.com//images/54/f2/54f236ca02c7e57361d0a8504b540194.jpg
    //var fix = url.replace('https://gelbooru','https://img2.gelbooru').replace('thumbnails','images').replace('thumbnail_','');
    //$entryBody.html('<img style="min-width:400px; width:auto !important; max-height:'+$( window ).height()+'px !important;" src="'+fix+'"/>');
    $entryBody.prepend(
      '<iframe  width="100%" style="overflow:hidden;" data-src="' +
        url +
        '?google"></iframe>'
    );
    //return;
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(response) {
        console.log(response.responseText.split('" id=highres'));
        //console.log(response.responseText.split("widgetFactory.mergeConfig('gallery', {"));
        var imgSrc = response.responseText
          .split('" id=highres')[0]
          .split('Original: <a href="')[1];
        console.log(imgSrc);
        if (imgSrc.match(".mp4") || imgSrc.match(".webm")) {
          $entryBody.html('<video src="https:' + imgSrc + '"></video>');
          return;
        } else {
          $entryBody.html(
            '<img style="min-width:400px; width:auto !important; max-height:' +
              $(window).height() +
              'px !important;" src="https:' +
              imgSrc +
              '"/>'
          );
          return;
        }
        GM_xmlhttpRequest({
          url: "https:" + imgSrc,
          headers: {
            referer: url,
            origin: url,
            authority: "is.sankakucomplex.com",
            pragma: "no-cache",
            "cache-control": "no-cache",
            "upgrade-insecure-requests": "1",
            dnt: "1",
            "user-agent":
              "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            "sec-fetch-mode": "navigate",
            "sec-fetch-user": "?1",
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "sec-fetch-site": "same-site",
            referer: "https://idol.sankakucomplex.com/post/show/727500",
            Host: "idol.sankakucomplex.com",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9,es;q=0.8"
          },
          responseType: "blob",
          contentType: "image/jpeg",
          "X-Requested-With": "XMLHttpRequest",
          onload: function(response) {
            console.log(response);
          }
        });
        if (imgSrc.match(".mp4") || imgSrc.match(".webm")) {
          $entryBody.prepend('<video src="https:' + imgSrc + '" controls  />');
          return;
        }
        //$entryBody.prepend('<img src="https://visuals.feedly.com/v1/resize?sizes=2500x*!0.01&url='+encodeURIComponent('https:'+imgSrc)+'" />');
        var wh =
          'height="' +
          response.responseText
            .split("orig_height=")[1]
            .split("src")[0]
            .replace(" orig_width=", 'px" x="') +
          'px"';
        //$entryBody.prepend('<iframe '+wh+' width="100%" style="overflow:hidden;" src="'+url+'"></iframe><img src="https:'+imgSrc+'" />');
      }
    });
  } else if (url.match("http://gelbooru.com/")) {
    //like(true);
    return;
    //https://gelbooru.com/thumbnails/54/f2/thumbnail_54f236ca02c7e57361d0a8504b540194.jpg
    //https://img2.gelbooru.com//images/54/f2/54f236ca02c7e57361d0a8504b540194.jpg
    //var fix = url.replace('https://gelbooru','https://img2.gelbooru').replace('thumbnails','images').replace('thumbnail_','');
    //$entryBody.html('<img style="min-width:400px; width:auto !important; max-height:'+$( window ).height()+'px !important;" src="'+fix+'"/>');

    $.ajax({
      method: "GET",
      url: url,
      onload: function(response) {
        console.log(response);
        //console.log(response.responseText.split("widgetFactory.mergeConfig('gallery', {"));
        var imgSrc =
          "https://img2.gelbooru.com/" +
          response.responseText
            .split("https://img2.gelbooru.com/")[1]
            .split('"')[0];
        if (imgSrc.match(".mp4") || imgSrc.match(".webm")) {
          $entryBody.prepend('<video src="' + imgSrc + '" controls  />');
          return;
        }
        $entryBody.prepend(
          '<img style="min-width:400px; width:auto !important; max-height:' +
            $(window).height() +
            'px !important;" ' +
            src +
            '="https://visuals.feedly.com/v1/resize?sizes=2500x*!0.01&url=' +
            imgSrc +
            '" onError="this.onerror=null;this.src=this.src+\'#\';"/>'
        );
      }
    });
  } else if (url.match(/\.jpg$/) || url.match(/\.png$/)) {
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
  } else if (url.match("imgur.com") || url.match("http://imgur.com")) {
    //like(true);
    return;
    var apiURL = url + "/embed?pub=true&ref=&w=540";
    //https://imgur.com/a/pwdnhrw/embed?pub=true&ref=&w=540
    //apiURL = 'https://www.tumbex.com/torontolesbian.tumblr/post/160110642022';
    console.log("apiURL", apiURL);
    $.ajax({
      method: "GET",
      url: apiURL,
      onload: function(response) {
        console.log(response);
        console.log(response.responseText.split("var images"));
        eval(
          "var t" +
            response.responseText.split("var images")[1].split("albumHash")[0] +
            "x =1;"
        );
        var images = t.images.map(function(image) {
          if (image.ext == ".mp4") {
            return (
              '<video src="https://i.imgur.com/' +
              image.hash +
              image.ext +
              '" controls poster="https://i.imgur.com/' +
              image.hash +
              '.jpg" />'
            );
          }
          return (
            '<img width="100%" ' +
            src +
            '="https://i.imgur.com/' +
            image.hash +
            image.ext +
            '" />'
          );
        });
        console.log();
        $entryBody.html(images.join(""));
      }
    });
  } else if (url.match("tumblr")) {
    return;
    //https://ultracameltoepussy.tumblr.com/post/184776982411
    var apiURL = url.replace("https://", "https://www.tumbex.com/");
    //apiURL = 'https://www.tumbex.com/torontolesbian.tumblr/post/160110642022';
    //console.log('apiURL',apiURL)
    GM_xmlhttpRequest({
      method: "GET",
      url: apiURL,
      onload: function(response) {
        eval(
          "var t = loadFix" +
            response.responseText
              .split("window.launcher")[1]
              .split("</script>")[0]
        );
        $entryBody.html(t.params.content.posts[0].player.player);
        $entryBody.find("video").attr("preload", "none");
      }
    });
  } else if (url.match("reddit")) {
    return;
    //console.log([$entryBody.find('a:contains("original")').attr('href'),$entryBody.find('a:contains("original")').attr('href').match('gfycat')])
    if (
      $entryBody
        .find('a:contains("original")')
        .attr("href")
        .match("gfycat")
    ) {
      //https://ultracameltoepussy.tumblr.com/post/184776982411
      var apiURL = $entryBody.find('a:contains("original")').attr("href");
      //apiURL = 'https://www.tumbex.com/torontolesbian.tumblr/post/160110642022';
      console.log(apiURL);
      GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        onload: function(response) {
          console.log(
            "https://thumbs." +
              response.responseText
                .split('class="gif" src="https://thumbs.')[1]
                .split('"')[0]
          );
          var dur =
            +(
              response.responseText.split('duration" content="')[1] || ""
            ).split('"')[0] || 0;
          //eval('var t = loadFix'+response.responseText.split("window.launcher")[1].split("</script>")[0]);
          var content =
            '<video src="https://giant.gfycat.com' +
            response.responseText
              .split('source src="https://giant.gfycat.com')[1]
              .split('"')[0] +
            '" controls preload="none" />';
          if (previewGifs) {
            content =
              "<img " +
              src +
              '="' +
              "https://thumbs." +
              response.responseText
                .split('class="gif" src="https://thumbs.')[1]
                .split('"')[0] +
              '" attr-dur="' +
              dur +
              '" onError="this.onerror=null;this.src=this.src+\'#\';"/><br/>' +
              content;
          }
          $entryBody.html(content);
        }
      });
      return;
    }
    //https://ultracameltoepussy.tumblr.com/post/184776982411
    var apiURL = url + ".json"; // $entryBody.find('a:contains("original")').attr('href') ;
    //apiURL = 'https://www.tumbex.com/torontolesbian.tumblr/post/160110642022';
    console.log(apiURL);
    $.getJSON(apiURL, function(result) {
      //response data are now in the result variable
      console.log("result", result);
      $entryBody.html(
        '<img src="' +
          result[0].data.children[0].data.media.oembed.thumbnail_url +
          '" />'
      );
    }).fail(function(e) {
      console.log(e);
    });
  } else if (url.match("twitter")) {
    //https://ultracameltoepussy.tumblr.com/post/184776982411
    var apiURL = url + ".json"; // $entryBody.find('a:contains("original")').attr('href') ;
    //apiURL = 'https://www.tumbex.com/torontolesbian.tumblr/post/160110642022';
    console.log(apiURL);
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://twittervideodownloader.com",
      onload: function(response) {
        //eval('var t = loadFix'+response.responseText.split("window.launcher")[1].split("</script>")[0]);
        console.log(
          $(
            "<form" +
              response.responseText.split("<form")[1].split("</form>")[0] +
              "</form>"
          )
            .find("input:first")
            .val()
        );
        //$entryBody.html(t.params.content.posts[0].player.player);
        var myData = new FormData();
        myData.append("tweet", url);
        myData.append(
          "csrfmiddlewaretoken",
          $(
            "<form" +
              response.responseText.split("<form")[1].split("</form>")[0] +
              "</form>"
          )
            .find("input:first")
            .val()
        );
        GM_xmlhttpRequest({
          method: "POST",
          url: "http://twittervideodownloader.com/download",
          data: myData,
          onload: function(response) {
            //eval('var t = loadFix'+response.responseText.split("window.launcher")[1].split("</script>")[0]);
            console.log(
              response.responseText
                .split(' <a href="https://video.twimg.com')[1]
                .split('"')[0]
            );
            $entryBody.html(
              '<video controls src="https://video.twimg.com' +
                response.responseText
                  .split(' <a href="https://video.twimg.com')[1]
                  .split('"')[0] +
                '" preload="none" />'
            );
          }
        });
      }
    });
  } else if (url.match("metarthunter")) {
    //https://ultracameltoepussy.tumblr.com/post/184776982411
    $entryBody.find("img").each(function() {
      $(this).attr(
        "src",
        $(this)
          .attr("src")
          .replace("t.jpg", ".jpg")
      );
      return;
      var apiURL =
        "https://script.google.com/macros/s/AKfycbzFvzsr0QeERpekDfM1oklwLfptk6hcnf4bct1P8V7hmW6KbCo/exec?referrer=" +
        encodeURIComponent(url) +
        "&url=" +
        encodeURIComponent($(this).attr("src"));
      console.log(apiURL);
      //apiURL = 'https://www.tumbex.com/torontolesbian.tumblr/post/160110642022';
      //console.log('apiURL',apiURL)
      GM_xmlhttpRequest({
        method: "GET",
        url: apiURL,
        headers: {
          referer: "https://www.metarthunter.com",
          origin: "https://www.metarthunter.com"
        },
        onload: function(response) {
          console.log(response);
          //eval('var t = loadFix'+response.responseText.split("window.launcher")[1].split("</script>")[0]);
          //$entryBody.html(t.params.content.posts[0].player.player);
          //$entryBody.find('img:first').attr('src','none');
        }
      });
    });
  }
}
function loadFix(a, b) {
  return a;
}
