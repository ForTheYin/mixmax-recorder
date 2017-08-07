const fs = require('fs');
const util = require('util');
const PREVIEW_TEMPLATE = fs.readFileSync('./templates/preview.html').toString();


module.exports = function(req, res) {
  const data = JSON.parse(req.body.params);
  if (!data) {
    res.status(400).send('Invalid params');
    return;
  }

  const baseUrl = 'https://localhost:8910/';
  const recordingUrl = baseUrl + 'api/recordings/' + data.uploadId;

  const html = util.format(PREVIEW_TEMPLATE, recordingUrl);
  res.json({
    body: html,
    raw: false
  });
};
