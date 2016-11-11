var express = require('express');
var app = express();

app.set('view engine', 'html');
app.engine('html', require('hogan-express'));

app.use(express.static(__dirname + '/app/public'));

app.get('/', function (req, res) {
  res.render(__dirname + '/app/views/index', {});
});

app.listen(8000, function () {
  console.log('server listening on port 8000');
});
