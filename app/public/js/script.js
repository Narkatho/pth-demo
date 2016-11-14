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
        switch (this[2].status) {
          case 1:
            this[2].status = 2;

            this[2].$el.append(
              '<li class="pth-message">' +
                'El endpoint <span>GET http://examplecdn.com/js/script.js?callback=__smth__</spa' +
                'n> parece hacer uso del patrón JSONP. Si la información que transporta es priva' +
                'da entonces corres el riesgo de que dicha información pueda ser accedida por te' +
                'rceros sin autorización.' +
                '<br><br>' +
                '¿La información que viaja en el response JSONP es privada?' +
                '<br><br>' +
                '<button value="1">Sí</button><button value="2">No</button>' +
              '</li>');

            break;
          case 2:
            this[2].status = 3;

            if (algo == 1) {
              this[2].$el.append(
                '<li class="pth-message">' +
                  'El patrón JSONP no debe ser usado para procesar información privada pues pued' +
                  'e ser llamado desde dominios arbitrarios de terceros. En el caso particular d' +
                  'e esta llamada, cualquier dominio puede acceder a la información privada cont' +
                  'enida en esta llamada simplemente agregando esta porción de HTML en su código' +
                  ' fuente' +
                  '<br><br>' +
                  '<span class="code">&lt;script type=&rdquo;text/javascript&rdquo;' +
                  '<br>' +
                  'src=&rdquo;http://examplecdn.com/js/script.js?callback=__smth__&rdquo;&gt;&lt' +
                  ';/script&gt;</span>' +
                  '<br><br>' +
                  'Para resolver este problema se recomienda dejar de hacer uso completamente de' +
                  'l patrón JSONP y en su lugar retornar la información como un simple objeto JS' +
                  'ON a través de una llamada AJAX. Esto debiese ser bastante sencillo si la inf' +
                  'ormación transportada en el JSONP no debe ser compartida con un dominio de te' +
                  'rceros. Por otra parte, si resulta necesario compartir la información con otr' +
                  'os dominios, igualmente se recomienda retornar un simple objeto JSON a través' +
                  ' de una llamada AJAX, pero utilizando CORS para compartir la información con ' +
                  'el dominio específico que debe tener acceso a ella.' +
                '<li>');
            } else {
              this[2].$el.append(
                '<li class="pth-message">' +
                  '¿Estás seguro que la información que viaja en JSONP es privada y por lo tanto' +
                  ' este patrón JSONP no supone un filtrado de información hacia terceros?' +
                  '<br><br>' +
                  'Información privada es todo tipo de información que un tercero, que no es pro' +
                  'pietario de dicha asignación, no debiese poder ver tal como PII (Personally I' +
                  'dentifiable Information)' +
                  '<br><br>' +
                  '<button value="1">Sí, y marcar como no vulnerable</button><button value="2">N' +
                  'o, la información sí es privada</button>' +
                '</li>');
            }

            break;
          case 3:
            if (algo == 1) {
              alert('Marcado como no vulnerable');
            } else {
              alert('Marcado como vulnerable');
            }

            break;
        }

        break;
      case 3: // Leak de info privada por JS
        switch (this[3].status) {
          case 1:
            this[3].status = 2;

            this[3].$el.append( // hay que ver esto, no entiendo, preguntarle a mi tio
              '<li class="pth-message">' +
                'El javascript <span>GET http://example.com/static/nonlib.js</span> es llamado d' +
                'esde un recurso privado. Resulta importante comprobar si esta llamada JS no tra' +
                'nsporta información privada. Por favor ejecuta el siguiente request que ayudará' +
                ' a comprobar si existe leak de información privada en este JS' +
                '<br><br>' +
                '<button value="1">REQUEST GET http://example.com/static/nonlib.js</button> (sin' +
                ' auth)' +
                '<br><br>' +
                '<button value="1">REQUEST GET http://example.com/static/nonlib.js</button> (con' +
                ' auth)' +
              '</li>');

            break;
          case 2:
            this[3].status = 3;
            break;
          case 3:
            break;
        }

        break;
      case 4: // Detectar inyección CSV
        switch (this[4].status) {
          case 1:
            this[4].status = 2;

            this[4].$el.append(
              '<li class="pth-message">' +
                'We just saw a CSV file being downloaded. Does this file contain fields whose va' +
                'lues are direct input from the user of your webapp?' +
                '<br><br>' +
                '<button value="1">Yes</button><button value="2">No</button>' +
              '</li>');

            break;
          case 2:
            this[4].status = 3;

            if (algo == 1) {
              this[4].path = 1;

              this[4].$el.append(
                '<li class="pth-message">' +
                  'OK. There’s a chance this endpoint can be used to build malicious CSV files. ' +
                  'To test we need your help.' +
                  '<br><br>' +
                  'Please go to the formulary whose input is later shown as a field in this CSV ' +
                  'field and enter this value' +
                  '<br><br>' +
                  '<span class="code">=1+1</span>' +
                  '<br><br>' +
                  'And save it. Then, go back to this endpoint and check that the CSV file shows' +
                  ' this value too as a field.' +
                  '<br><br>' +
                  '<button value="1">Yes, it’s there!</button><button value="2">No, it’s not the' +
                  're</button>' +
                '</li>');
            } else {
              this[4].path = 2;

              this[4].$el.append(
                '<li class="pth-message">' +
                  'You sure?' +
                  '<br><br>' +
                  '<button value="1">Yes, I’m sure</button><button value="2">No, I think some of' +
                  ' these fields actually come directly from user input</button>' +
                '</li>');
            }

            break;
          case 3:
            if (algo == 1) {
              if (this[4].path === 1) {
                this[4].$el.append(
                  '<li class="pth-message">' +
                    'Awesome! (or not? it depends on who’s looking :P) This little nasty bug can' +
                    ' be used to inject malicious Excel commands in this CSV file and however ge' +
                    'ts to download it (maybe the boss herself??) will have a hard time on her c' +
                    'omputer.' +
                    '<br><br>' +
                    'So we need to fix this. The way to do it is simple: filter this CSV fields ' +
                    'to escape initial “=” characters. That way they won’t execute as Excel form' +
                    'ulas. Therefore if a field is' +
                    '<br><br>' +
                    '<span class="code">=1+1</span>' +
                    '<br><br>' +
                    'then it should be sent as' +
                    '<br><br>' +
                    '<span class="code">\\=1+1</span>' +
                    '<br><br>' +
                    'Cool?' +
                  '</li>');
              } else {
                alert('Aquí termina (A1 P2)');
              }
            } else {
              if (this[4].path === 1) {
                alert('Aquí termina (A2 P1)');
              } else {
                alert('Aquí termina (A2 P2)');
              }
            }
            break;
        }

        break;
    }
  }
};

$('#login button').click(function () {
  $('#login').hide();
  $('#columns').show();

  setTimeout(function () {
    $('.column.left ul').prepend(
      '<li data-optionID="3">Leak de info privada por JS</li>' +
      '<li data-optionID="4">Detectar inyección CSV</li>');
  }, 1500);

  setTimeout(function () {
    $('.column.left ul').prepend(
      '<li data-optionID="1">XXE</li>' +
      '<li data-optionID="2">Leak de info privada por JSONP</li>');
  }, 3000);
});

$(document).on('click', '.column.left li:not(.disabled)', function () {
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
  $(this).parent().find('button').prop('disabled', true);
  $(this).addClass('selected');
  options.algo($(this).val());
});
