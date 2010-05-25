//////////
// gallery event handlers

$(document).ready(function() {
  $('a.feed').first().trigger('click'); // select first feed
});

$('a.feed').live('click', function(e) {
  loadFeed(e.target.href);
  return false;
});

$('img.thumb').live('click', function(e) {
  // toggle selection
  $('img.thumb').removeClass('selected');
  $(e.target).addClass('selected');
  
  var key_name = e.target.src.match(/key_name=([^&]+)/)[1];
  $('#photo').html('<img id="jpg" src="' + key_name + '"/>');
  return false;
});

function loadFeed(url) {
  $.getJSON(url, displayFeed);
  return false;
}

function displayFeed(data) {
  var thumbs = "<ul>";
  $.each(data.items, function(i,item) {
    // thumbnail src is proxied through ThumbnailHandler
    var thumb_url = '/thumbnails/?key_name=' + (item.media.m).replace("_m.jpg", ".jpg");
    if (isAdmin()) thumb_url += '&nc=' + new Date().getTime();
    thumbs += '<li>';
    thumbs += '<img class="thumb" src="' + thumb_url + '" alt="' + item.title + '" title="' + item.title + '"/>';
    thumbs += '</li>';
  });
  thumbs += "</ul>";

  $('#thumbnails').html(thumbs + "</ul>");
  $('img.thumb').first().trigger('click'); // select first thumb
}

function isAdmin() {
  try { return ADMIN; }
  catch(err) { return false; }
}