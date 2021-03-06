$(document).bind('ready', selectGallery);
$(window).bind('hashchange', selectGallery);

function selectGallery(e) {
  var gallery_num = document.location.hash.match(/[0-9]+/) || 0
  $('a[feed]').eq(gallery_num).trigger('click');
};

$('a[feed]').live('click', function(e) {
  e.preventDefault();
  
  document.location.hash = '#' + $('a[feed]').index(e.target);
  
  $.getJSON($(e.currentTarget).attr('feed'), function(data) {
    var thumbs = "<ul>";
    $.each(data.items, function(i,item) {
      var photo_url = (item.media.m).replace("_m.jpg", ".jpg");                     // 500x500 max straight from flickr
      var thumb_url = '/thumb?url=' + (item.media.m).replace("_m.jpg", "_s.jpg");   // 75x75 square; proxied through slickr
      if (document.title.match('ADMIN')) thumb_url += '&t=' + new Date().getTime(); // bypass cache
      thumbs += '<li><img class="thumb" photo_src="' + photo_url + '" src="' + thumb_url + '" alt="' + item.title + '" title="' + item.title + '"/></li>';
    });
    thumbs += "</ul>";

    $('#thumbnails').html(thumbs + "</ul>");
    $('img.thumb').first().trigger('click'); // select first thumb    
  });
});

$('img.thumb').live('click', function(e) {
  e.preventDefault();
  
  $('img.thumb').removeClass('selected');
  $(e.currentTarget).addClass('selected');

  $('#photo').html('<img id="jpg" src="' +  $(e.currentTarget).attr('photo_src') + '"/>');
});