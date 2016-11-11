$('#container').resizable({
  handles: 'n',
  minHeight: 300,
  resize: function (event, ui) {
    $('.column > div').height(ui.size.height - 28);
  }
});

$('.column.left').resizable({ // ver el max width más adelante (seguro que será según el contenido de RC)
  handles: 'e',
  minWidth: 199,
  resize: function (event, ui) {
    $('.column.right').width($(document).width() - (ui.size.width + 1));
  }
});
