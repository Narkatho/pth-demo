$('#container').resizable({
  handles: 'n',
  minHeight: 300,
  resize: function (event, ui) {
    $('.column > div').height(ui.size.height - 28);
  }
});

$('.column.left').resizable({
  handles: 'e',
  minWidth: 199,
  resize: function (event, ui) {
    $('.column.right').width(window.innerWidth - (ui.size.width + 1));
  }
});

var options = {};

$('.column.left li:not(.disabled)').click(function () {
  var optionID = $(this).data('optionid');

  if (options.hasOwnProperty(optionID)) {
    if (options[optionID].isActive) return false;
  } else {
    options[optionID] = {
      $el: $('<ul>ALGO ' + optionID + '</ul>'),
      status: 0
    };

    options[optionID].$el.appendTo('.column.right > div');
  }

  if (options.activeOptionID) {
    $('.column.left li[data-optionID=' + options.activeOptionID + ']').css({
      backgroundColor: 'initial',
      color: 'initial'
    });

    options[options.activeOptionID].isActive = false;
    options[options.activeOptionID].$el.hide();
  }

  $(this).css({
    backgroundColor: 'rgb(56, 121, 217)',
    color: 'white'
  });

  options.activeOptionID = optionID;
  options[optionID].isActive = true;
  options[optionID].$el.show();
});
