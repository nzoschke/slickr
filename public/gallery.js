$(document).ready(function() {
  $('a[feed]').first().trigger('click'); // select first feed
});

$('a[feed]').live('click', function(e) {
  $.getJSON($(e.currentTarget).attr('feed'), function(data) {
    var thumbs = "<ul>";
    $.each(data.items, function(i,item) {
      var thumb_url = (item.media.m).replace("_m.jpg", "_s.jpg"); // 75x75 square
      thumbs += '<li><img class="thumb" src="' + thumb_url + '" alt="' + item.title + '" title="' + item.title + '"/></li>';
    });
    thumbs += "</ul>";

    $('#thumbnails').html(thumbs + "</ul>");
    $('img.thumb').first().trigger('click'); // select first thumb    
  });
  return false;
});

$('img.thumb').live('click', function(e) {
  // toggle selection
  $('img.thumb').removeClass('selected');
  $(e.currentTarget).addClass('selected');

  var photo_url = $(e.currentTarget).attr('src').replace("_s.jpg", ".jpg"); // 500x500 max
  $('#photo').html('<img id="jpg" src="' + photo_url + '"/>');
  return false;
});
