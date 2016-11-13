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

var options = {
  $el: $('.column.right > div'),
  algo: function (algo) {
    switch (this.activeOptionID) {
      case 1: // XXE
        switch (this[1].status) {
          case 1:
            this[1].status = 2;

            this[1].$el.append(
              '<li class="pth-message">' +
                'Hemos detectado que el endpoint <span>POST http://example.com/core/feeds/</span' +
                '> recibe un XML como entrada. Esto puede representar un riesgo muy grave para t' +
                'u aplicación web si el XML es procesado en backend y luego parte de éste es env' +
                'iado a algún output que el usuario puede ver directamente. De esta forma un ata' +
                'cante podría robar archivos sensibles desde tus servidores tales como /etc/pass' +
                'wd o el código fuente de tu aplicación web.' +
                '<br><br>' +
                '¿Tú endpoint procesa este XML de entrada y luego algún resultante es enviado co' +
                'mo output para el usuario?' +
                '<br><br>' +
                '<button value="1">Sí</button><button value="2">No</button>' +
              '</li>');

            break;
          case 2:
            this[1].status = 3;

            if (algo == 1) {
              this[1].path = 1;

              this[1].$el.append(
                '<li class="pth-message">' +
                  'Muy bien. Debes modificar el XML que estás enviando al endpoint <span>POST ht' +
                  'tp://example.com/core/feeds/</span> y debe contener la siguiente información:' +
                  '<br><br>' +
                  '1) En la cabecera del XML debes definir una variable XML que se llenará con e' +
                  'l valor del archivo /etc/passwd (o algún otro archivo de tu elección)' +
                  '<br><br>' +
                  '<span class="code">&lt;!DOCTYPE doc [' +
                  '<br>' +
                  '&nbsp;&nbsp;&nbsp;&nbsp;&lt;!ENTITY xxe SYSTEM &quot;file:///etc/passwd&quot;' +
                  ' &gt;]&gt;</span>' +
                  '<br><br>' +
                  'El fragmento debe colocarse justo después de abrir el XML, ejemplo' +
                  '<br><br>' +
                  '<span class="code">&lt;?xml version=&quot;1.0&quot; ?&gt;</span>' +
                  '<br><br>' +
                  '2) En el cuerpo del XML, identifica alguno de los campos cuyo valor es luego ' +
                  'replicado en el output que podrá ver el usuario y haz uso de la variable &xxe' +
                  '; Ejemplo:' +
                  '<br><br>' +
                  '<span class="code">&lt;content&gt;&amp;xxe;&lt;/content&gt;</span>' +
                  '<br><br>' +
                  'Una vez hecho esto revisa el output del usuario. Sí allí puedes ver reflejado' +
                  ' el contenido del archivo <span>/etc/passwd</span> del servidor entonces tu a' +
                  'plicación web es vulnerable a XXE.' +
                  '<br><br>' +
                  '<button value="1">Sí es vulnerable</button><button value="2">No es vulnerable' +
                  '</button>' +
                '</li>');
            } else {
              this[1].path = 2;

              this[1].$el.append(
                '<li class="pth-message">' +
                  '¿Estás seguro que el XML no es procesado ni alguno de sus campos enviado al o' +
                  'utput de usuario?' +
                  '<br><br>' +
                  '<button value="1">Sí, y marcar como no vulnerable</button><button value="2">N' +
                  'o, OK probemos' +
                '</li>');
            }

            break;
          case 3:
            if (algo == 1) {
              if (this[1].path === 1) {
                this[1].$el.append(
                  '<li class="pth-message">' +
                    'Entendido. Para resolver este bug necesitamos saber en qué lenguaje está es' +
                    'crito el código del endpoint <span>POST http://example.com/core/feeds/?</sp' +
                    'an>' +
                    '<br><br>' +
                    'Recomendamos revisar este link' +
                    '<br><br>' +
                    '<span class="code">https://www.owasp.org/index.php/XML_External_Entity_(XXE' +
                    ')_Prevention_Cheat_Sheet</span>' +
                    '<br><br>' +
                    'Para instrucciones sobre cómo resolver XXE para varios lenguajes.' +
                  '</li>');
              } else {
                alert('Aquí termina (A1 P2)');
              }
            } else {
              if (this[1].path === 1) {
                alert('Aquí termina (A2 P1)');
              } else {
                alert('Aquí termina (A2 P2)');
              }
            }

            break;
        }

        break;
      case 2: // Leak de info privada por JSONP
        break;
      case 3: // Leak de info privada por JS
        break;
      case 4: // Detectar inyección CSV
        break;
    }
  }
};

$('.column.left li:not(.disabled)').click(function () {
  var optionID = $(this).data('optionid');

  if (options.activeOptionID) {
    if (optionID === options.activeOptionID) return false;
    else {
      $('.column.left li[data-optionID=' + options.activeOptionID + ']').css({
        backgroundColor: 'initial',
        color: 'initial'
      });

      options[options.activeOptionID].isActive = false;
      options[options.activeOptionID].$el.hide();
    }
  }

  options.activeOptionID = optionID;

  $(this).css({
    backgroundColor: 'rgb(56, 121, 217)',
    color: 'white'
  });

  if (!options.hasOwnProperty(optionID)) {
    options[optionID] = {
      $el: $('<ul></ul>'),
      status: 1
    };

    options[optionID].$el.appendTo(options.$el);
    options.algo();
  }

  options[optionID].isActive = true;
  options[optionID].$el.show();
});

$(document).on('click', '.pth-message button', function () {
  options.algo($(this).val());
});
