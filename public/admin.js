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