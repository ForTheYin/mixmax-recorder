module.exports = function(req, res) {
  var data = JSON.parse(req.body.params);
  if (!data) {
    res.status(400).send('Invalid params');
    return;
  }

  var host = 'https://localhost:8910/api/recordings/'
  var html = '<a href="' + host + data.uploadId + '">Recording</a>';
  res.json({
    body: html,
    raw: false
  });
};
