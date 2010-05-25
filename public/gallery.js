$(document).ready(function() {
  $('a[feed]').first().trigger('click'); // select first feed
});

$('a[feed]').live('click', function(e) {
  loadFeed($(e.currentTarget).attr('feed'));
  return false;
});

function loadFeed(url) {
  $.getJSON(url, displayFeed);
  return false;
};

function displayFeed(data) {
  var thumbs = "<ul>";
  $.each(data.items, function(i,item) {
    // thumbnail src is proxied through ThumbnailHandler
    //var thumb_url = '/thumbnails/?key_name=' + (item.media.m).replace("_m.jpg", ".jpg");
    //if (isAdmin()) thumb_url += '&nc=' + new Date().getTime();
    var thumb_url = (item.media.m).replace("_m.jpg", "_s.jpg"); // 75x75 square
    thumbs += '<li>';
    thumbs += '<img class="thumb" src="' + thumb_url + '" alt="' + item.title + '" title="' + item.title + '"/>';
    thumbs += '</li>';
  });
  thumbs += "</ul>";

  $('#thumbnails').html(thumbs + "</ul>");
  $('img.thumb').first().trigger('click'); // select first thumb
}