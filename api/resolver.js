const cors = require('cors');
const fs = require('fs');
const util = require('util');

const router = require('express').Router();
const PREVIEW_TEMPLATE = fs.readFileSync('./templates/preview.html').toString();
const CORS_OPTIONS = Object.freeze({
  origin: /^[^.\s]+\.mixmax\.com$/, // Since Mixmax calls this API directly from the client-side, it must be whitelisted.
  credentials: true
});


router.post('/', cors(CORS_OPTIONS), (req, res, next) => {
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
});

module.exports = router;
