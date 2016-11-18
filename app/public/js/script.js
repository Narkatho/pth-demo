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

$('#login button').click(function () {
  $('#login').hide();
  $('#columns').show();
});

//----------------------------------------------------------------------------------------------- pulido

var options = {
  markAsSecure: function () {
    $(`.column.left li[data-optionid="${this.activeOptionID}"] i.secure`).show();
  },
  markAsVulnerable: function () {
    $(`.column.left li[data-optionid="${this.activeOptionID}"] i.vulnerable`).show();
  },
  restore: function () {
    delete this[this.activeOptionID];
  }
};

$(document).on('click', '.column.left li:not(.selected):not(.disabled)', function () {
  $(this).addClass('selected');

  if (options.activeOptionID) {
    $(`.column.left li[data-optionid="${options.activeOptionID}"]`).removeClass('selected');

    options[options.activeOptionID].isActive = false;
    options[options.activeOptionID].$el.hide();
  }

  var optionID = $(this).data('optionid');
  options.activeOptionID = optionID;

  if (!options.hasOwnProperty(optionID)) {
    options[optionID] = {
      $el: $(`.column.right ul:nth-child(${optionID})`),
      status: 1
    };
  }

  options[optionID].isActive = true;
  options[optionID].$el.show();
});

$(document).on('click', '.column.right button', function () {
  $(this).parent().find('button').prop('disabled', true);
  $(this).addClass('selected');
  var activeOption = options[options.activeOptionID];

  switch (options.activeOptionID) {
    case 1: // XXE
    case 4: // Detectar inyección CSV
      switch (activeOption.status) {
        case 1:
          activeOption.status = 2;
          activeOption.path = $(this).val();
          activeOption.$el.children().eq($(this).val()).show();
          break;
        case 2:
          if (activeOption.path == 1) {
            if ($(this).val() == 1) {
              options.markAsVulnerable();
              activeOption.$el.children().last().show();
            } else options.markAsSecure();
          }
          else {
            if ($(this).val() == 1) options.markAsSecure();
            else {
              activeOption.path = 1;
              activeOption.$el.children().eq(1).insertAfter($(this).parent()).show();
            }
          }

          break;
      }

      break;
    case 2: // Leak de info privada por JSONP
      switch (activeOption.status) {
        case 1:
          activeOption.status = 2;
          activeOption.$el.children().eq($(this).val()).show();
          break;
        case 2:
          if ($(this).val() == 1) options.markAsSecure();
          else {
            options.markAsVulnerable();
            activeOption.$el.children().eq(1).insertAfter($(this).parent()).show();
          }

          break;
      }

      break;
    case 3: // Leak de info privada por JS
      break;
  }
});
