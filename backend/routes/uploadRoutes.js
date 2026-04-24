const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkImageFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

function checkAudioFileType(file, cb) {
  const filetypes = /mp3|wav|ogg|m4a/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /audio\/.*/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Audio files only!');
  }
}

const uploadImage = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkImageFileType(file, cb);
  },
});

const uploadAudio = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkAudioFileType(file, cb);
  },
});

router.post('/', protect, uploadImage.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No image uploaded' });
  }

  // Construct absolute local server paths assuming Express configures `app.use('/uploads')`
  const filePaths = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
  res.status(200).json({ paths: filePaths });
});

router.post('/audio', protect, uploadAudio.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No audio file uploaded' });
  }

  const filePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ path: filePath });
});

module.exports = router;
