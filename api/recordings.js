const uuidv4 = require('uuid/v4');
const express = require('express');
const multer = require('multer');

const upload = multer();
const router = express.Router();
const persistence = require('../persistence');

router.post('/', upload.single('file'), (req, res, next) => {
  const uploadId = uuidv4();
  const file = req.file;

  persistence.insert(uploadId, file, () => {
    res.json({ uploadId });
  });
});

router.get('/:uploadId', (req, res, next) => {
  const uploadId = req.params.uploadId;
  if (!uploadId) {
    return res.status(400).send('Invalid params');
  }

  persistence.find(uploadId, (result) => {
    if (result && result.length > 0) {
      console.log(result);
      const data = result[0].file;
      res.writeHead(200, {
        'Content-Type': data.mimetype,
        'Content-Length': data.size
      });
      res.end(data.buffer);
    } else {
      res.status(404).send('File not found');
    }
  });
});

module.exports = router;
