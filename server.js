const express = require('express');
const bodyParser = require('body-parser');
const app = express();


// Setup public folder and allow POSTs
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Editor UI
app.get('/editor', (req, res) => {
  res.sendFile(__dirname + '/templates/editor.html');
});

// APIs
app.use('/api/recordings', require('./api/recordings'));
app.use('/api/resolver', require('./api/resolver'));

if (process.env.NODE_ENV === 'production') {
  app.listen(process.env.PORT || 8910);
} else {
  const pem = require('pem');
  const https = require('https');
  pem.createCertificate({ days: 1, selfSigned: true }, (err, keys) => {
    if (err) throw err;

    https.createServer({
      key: keys.serviceKey,
      cert: keys.certificate
    }, app).listen(process.env.PORT || 8910);
  });
}
