$(document).ready(function() {
  $('a[feed]').first().trigger('click'); // select first feed
});

$('a[feed]').live('click', function(e) {
  $.getJSON($(e.currentTarget).attr('feed'), function(data) {
    var thumbs = "<ul>";
    $.each(data.items, function(i,item) {
      var thumb_url = (item.media.m).replace("_m.jpg", "_s.jpg"); // 75x75 square
      thumbs += '<li><img class="thumb" src="/thumb?' + 't=' + new Date().getTime() + '&url=' + thumb_url + '" alt="' + item.title + '" title="' + item.title + '"/></li>';
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

// admin

$('#photo').live('mousedown', function(e) {
  $('#close').trigger('click');
  $('#photowrap').append('<div id="resizable" class="ui-widget-content"><a id="save" href="#">save</a><a id="close" href="#" style="margin-left: 2px; float: left;">x</a></div>');
  $("#resizable").resizable({ aspectRatio: 1/1, minWidth: 75, minHeight: 75, containment: 'parent' });
  $("#resizable").draggable({ containment: '#jpg', cursor: 'move' });
  $("#resizable").css({ position: 'absolute', left: e.layerX - 75, top: e.layerY - 75, width: 150, height: 150, opacity: 0.65, cursor: 'move', border: '1px solid #0080FF' });
});

$('#save').live('click', function(e) {
  $("#save").remove(); // prevent clicking again
  $("#close").html('');
  $("#resizable").append('<i>saving...</i>');
  e.preventDefault();
  
  $.post("/thumb", {
    photo_url: $("#jpg").attr('src'),
    x: $("#resizable").attr('offsetLeft') - $("#jpg").attr('offsetLeft'),
    y: $("#resizable").attr('offsetTop')  - $("#jpg").attr('offsetTop'),
    width: $("#resizable").attr('clientWidth')
  }, function (e) {
    $('img.thumb.selected').attr('src', $('img.thumb.selected').attr('src') + '&t=' + new Date().getTime()); // trigger reload
    $('#close').trigger('click');
  });
});

$('#close').live('click', function(e) {
  if (!$("#resizable")) return;
  $("#resizable").resizable('destroy').draggable('destroy');  
  $("#resizable").remove();
  e.preventDefault()
});
