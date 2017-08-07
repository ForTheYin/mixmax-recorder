const multer = require('multer');
const uuidv4 = require('uuid/v4');

const upload = multer();
const router = require('express').Router();
const persistence = require('../persistence');


router.post('/', upload.single('file'), (req, res, next) => {
  // Create a random UUID to link to the audio file
  const uploadId = uuidv4();

  // TODO: Sanitize inputs and ensure that nothing malicious is uploaded
  const file = req.file;

  // Inserts the file with tag using the current persistence strategy
  persistence.insert(uploadId, file, () => {
    console.log('Successfully uploaded recording:', uploadId, '(' + new Date() + ')');
    res.json({ uploadId });
  });
});

router.get('/:uploadId', (req, res, next) => {
  const uploadId = req.params.uploadId;
  if (!uploadId) {
    // Terminate if the uploadId is not found
    return res.status(400).send('A valid recording id is needed');
  }

  // Finds the file with tag using the current persistence strategy
  persistence.find(uploadId, (result) => {
    if (result) {
      const file = result.file;

      // Write the audio file information directly from the saved data
      res.writeHead(200, {
        'Content-Type': file.mimetype,
        'Content-Length': file.size
      });
      res.end(file.buffer);
    } else {
      res.status(404).send('File not found');
    }
  });
});

module.exports = router;
