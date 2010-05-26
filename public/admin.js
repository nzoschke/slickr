//////////
// admin thumbnail selection

ADMIN = true;
var opos = null;
var selection = null;

$('#jpg').live('mousedown', function(e) {
  var target = e.target;
  opos = [e.pageX, e.pageY];
  if (selection) selection.remove();
  $(document.body).append('<div id="selection"><a id="save" href="#">save</a></div>');
  selection = $('#selection');
  selection.css({left: opos[0], top: opos[1], width: 0, height: 0});

  $(document).bind('mousemove', function(e) {
    if (!opos) return;
    if (!selection) return;

    var x1 = opos[0], y1 = opos[1], x2 = event.pageX, y2 = event.pageY;
    if (x1 > x2) { var tmp = x2; x2 = x1; x1 = tmp; }
    if (y1 > y2) { var tmp = y2; y2 = y1; y1 = tmp; }

    // constrain to target
    x1 = Math.max(x1, target.x);
    y1 = Math.max(y1, target.y);
    x2 = Math.min(x2, target.x + target.width);
    y2 = Math.min(y2, target.y + target.height);

    // keep square
    var length = Math.min(x2-x1, y2-y1);
    if (opos[0] > x1) x1 = opos[0] - length;
    if (opos[1] > y1) y1 = opos[1] - length;

    selection.css({left: x1, top: y1, width: length, height: length});
    return false;
  });

  $(document).bind('mouseup', function(e) {
    opos = null;
    if (selection[0].offsetWidth < 10 && selection[0].offsetHeight < 10) {
      selection.remove();
      selection = null;
    }
    if (!selection) return;
    selection.resizable({ aspectRatio: 1 }).draggable({ containment: [target.x, target.y, target.x+target.width-selection[0].offsetWidth, target.y+target.height-selection[0].offsetHeight] });
  });
});

$('a#save').live('click', function(e) {
  if (!selection) { alert('error'); return; }
  e.preventDefault();
  $(e.target).remove();
  selection.resizable('destroy').draggable('destroy');

  var x1 = selection[0].offsetLeft - $("#jpg")[0].x;
  var y1 = selection[0].offsetTop - $("#jpg")[0].y;
  var length = selection[0].offsetWidth;

  $.get("/admin/thumbnails/", {
    method: 'put',
    key_name: $("#jpg")[0].src,
    x1: x1,
    y1: y1,
    x2: x1 + length,
    y2: y1 + length
  }, function(e) {
    var src = $('img.thumb.selected').attr('src');
    $('img.thumb.selected').attr('src', src + '&nc=' + new Date().getTime());
    selection.remove();
    selection = null;
  });
});

$('a#reset_thumb').live('click', function(e) {
  e.preventDefault();
  if (selection) {
    selection.remove();
    selection = null;
  }

  $.get("/admin/thumbnails/", {
    method: 'put',
    key_name: $("#jpg").attr('src'),
    reset: true,
  }, function(e) {
    var src = $('img.thumb.selected').attr('src');
    $('img.thumb.selected').attr('src', src + '&nc=' + new Date().getTime());
    selection.remove();
    selection = null;
  });
});