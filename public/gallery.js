$(document).ready(function() {
  $('a[feed]').first().trigger('click'); // select first feed
});

$('a[feed]').live('click', function(e) {
  $.getJSON($(e.currentTarget).attr('feed'), function(data) {
    var thumbs = "<ul>";
    $.each(data.items, function(i,item) {
      var thumb_url = (item.media.m).replace("_m.jpg", "_s.jpg"); // 75x75 square
      thumbs += '<li><img class="thumb" src="/thumb?url=' + thumb_url + '" alt="' + item.title + '" title="' + item.title + '"/></li>';
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
  $('#photowrap').append('<div id="resizable" class="ui-widget-content"><a id="save" href="#">save</a><a id="close" href="#">x</a><a id="reset" href="#">reset</a></div>');
  $("#resizable").resizable({ aspectRatio: 1/1, minWidth: 75, minHeight: 75, containment: 'parent' });
  $("#resizable").draggable({ containment: '#jpg', cursor: 'move' });
  $("#resizable").css({ position: 'absolute', left: e.layerX - 75, top: e.layerY - 75, width: 150, height: 150 });
});

$('#save').live('click', function(e) {
  e.preventDefault();
  updateResizable('saving...');
  
  $.post("/thumb", {
    photo_url: $("#jpg").attr('src'),
    x: $("#resizable").attr('offsetLeft') - $("#jpg").attr('offsetLeft'),
    y: $("#resizable").attr('offsetTop')  - $("#jpg").attr('offsetTop'),
    width: $("#resizable").attr('clientWidth')
  }, closeResizable);
});

$('#reset').live('click', function(e) {
  e.preventDefault();
  updateResizable('resetting...');

  $.post("/thumb", {
    _method: 'delete',
    photo_url: $("#jpg").attr('src'),
  }, closeResizable);
});

$('#close').live('click', function(e) {
  e.preventDefault()
  if (!$("#resizable")) return;
  $("#resizable").resizable('destroy').draggable('destroy');  
  $("#resizable").remove();
});

function updateResizable(status) {
  $("#save").remove();
  $("#reset").remove();
  $("#close").html(''); // clear but save binding
  $("#resizable").append('<i id="status">' + status + '</i>');
};

function closeResizable(e) {
  $('img.thumb.selected').attr('src', $('img.thumb.selected').attr('src') + '&t=' + new Date().getTime()); // trigger reload
  $('#close').trigger('click');
};
