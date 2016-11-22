$('#container').resizable({
  handles: 'n',
  minHeight: 300,
  resize: function (event, ui) {
    $('#login > div, .column > div').height(ui.size.height - 28);
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
  if ($(this).val() == 1) {
    $('#login').hide();
    $('#columns').show();

    setTimeout(function () {
      $('.column.left li:nth-child(1)').show();
    }, 1500);

    setTimeout(function () {
      $('.column.left li:nth-child(2)').show();
    }, 1350);

    setTimeout(function () {
      $('.column.left li:nth-child(3)').show();
    }, 1000);

    setTimeout(function () {
      $('.column.left li:nth-child(4)').show();
    }, 750);
  } else {
    $('#login > div').html($('#unauthorized').show());
  }
});

var options = {
  markAsSecure: function () {
    $(`.column.left li[data-optionid="${this.activeOptionID}"] span`).css('left', 35);
    $(`.column.left li[data-optionid="${this.activeOptionID}"] i.secure`).show();
    this[this.activeOptionID].secure = true;
    $('.alert.secure').show();
  },
  markAsVulnerable: function () {
    $(`.column.left li[data-optionid="${this.activeOptionID}"] span`).css('left', 35);
    $(`.column.left li[data-optionid="${this.activeOptionID}"] i.vulnerable`).show();
    this[this.activeOptionID].vulnerable = true;
    $('.alert.vulnerable').show();
  },
  restore: function () {
    $(`.column.left li[data-optionid="${this.activeOptionID}"] span`).css('left', 'auto');
    var activeOption = this[this.activeOptionID];

    if (activeOption.secure) {
      $(`.column.left li[data-optionid="${this.activeOptionID}"] i.secure`).hide();
      activeOption.secure = false;
      $('.alert.secure').hide();
    } else {
      $(`.column.left li[data-optionid="${this.activeOptionID}"] i.vulnerable`).hide();
      activeOption.vulnerable = false;
      $('.alert.vulnerable').hide();
    }

    activeOption.$el.html(activeOption.defaultHtml);
    activeOption.status = 1;
  }
};

$(document).on('click', '.column.left li:not(.selected):not(.disabled)', function () {
  $(this).addClass('selected');

  if (options.activeOptionID) {
    $(`.column.left li[data-optionid="${options.activeOptionID}"]`).removeClass('selected');
    if (options[options.activeOptionID].secure) $('.alert.secure').hide();
    else if (options[options.activeOptionID].vulnerable) $('.alert.vulnerable').hide();
    options[options.activeOptionID].isActive = false;
    options[options.activeOptionID].$el.hide();
  }

  var optionID = $(this).data('optionid');
  options.activeOptionID = optionID;

  if (options.hasOwnProperty(optionID)) {
    if (options[optionID].secure) $('.alert.secure').show();
    else if (options[optionID].vulnerable) $('.alert.vulnerable').show();
  } else {
    var $el = $(`.column.right ul:nth-child(${optionID + 2})`);

    options[optionID] = {
      $el: $el,
      defaultHtml: $el.html(),
      status: 1
    };
  }

  options[optionID].isActive = true;
  options[optionID].$el.show();
});

$('.alert button').click(function () {
  options.restore();
});

$(document).on('click', '.column.right li button', function () {
  $(this).parent().find('button').prop('disabled', true);
  $(this).addClass('selected');
  var activeOption = options[options.activeOptionID];
  var self = this;

  setTimeout(function () {
    switch (options.activeOptionID) {
      case 1: // XXE
      case 4: // Detectar inyección CSV
        switch (activeOption.status) {
          case 1:
            activeOption.status = 2;
            activeOption.path = $(self).val();
            activeOption.$el.children().eq($(self).val()).show();
            break;
          case 2:
            if (activeOption.path == 1) {
              if ($(self).val() == 1) {
                options.markAsVulnerable();
                activeOption.$el.children().last().show();
              } else options.markAsSecure();
            }
            else {
              if ($(self).val() == 1) options.markAsSecure();
              else {
                activeOption.path = 1;
                activeOption.$el.children().eq(1).insertAfter($(self).parent()).show();
              }
            }

            break;
        }

        break;
      case 2: // Leak de info privada por JSONP
        switch (activeOption.status) {
          case 1:
            $(self).val() == 1 ? options.markAsVulnerable() : activeOption.status = 2;
            activeOption.$el.children().eq($(self).val()).show();
            break;
          case 2:
            if ($(self).val() == 1) options.markAsSecure();
            else {
              options.markAsVulnerable();
              activeOption.$el.children().eq(1).insertAfter($(self).parent()).show();
            }

            break;
        }

        break;
      case 3: // Leak de info privada por JS
        switch (activeOption.status) {
          case 1:
            $(self).val() == 1 ? options.markAsSecure() : activeOption.status = 2;
            activeOption.$el.children().first().find('textarea').prop('disabled', true);
            activeOption.$el.children().eq($(self).val()).show();
            break;
          case 2:
            if ($(self).val() == 1) {
              options.markAsVulnerable();
              activeOption.$el.children().eq(3).show();
            } else {
              activeOption.status = 3;
              activeOption.$el.children().eq(4).show();
            }

            break;
          case 3:
            if ($(self).val() == 1) options.markAsSecure();
            else {
              options.markAsVulnerable();
              activeOption.$el.children().eq(3).insertAfter($(self).parent()).show();
            }

            break;
        }

        break;
    }
  }, Math.floor(Math.random() * ((1500 - 800) + 1) + 800));
});

$(document).on('click', '.request > span:nth-child(1)', function () {
  var $textarea = $(this).parent().find('textarea');

  if ($textarea.is(':visible')) {
    $(this).html('&#9654;');
    $('.request > span:nth-child(2)').html('GET http://example.com/static/nonlib.js');
    $textarea.hide();
  } else {
    $(this).html('&#9660;');
    $('.request > span:nth-child(2)').html('GET /static/nonlib.js&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HTTP/1.1');
    $textarea.show();
  }
});
