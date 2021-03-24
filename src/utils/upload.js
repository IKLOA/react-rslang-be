const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'files/');
  },
  filename(req, file, cb) {
    const date = moment().format('DDMMYYYY-HHmmss_SSS');
    cb(null, `${date}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    // eslint-disable-next-line callback-return
    cb(null, true);
  } else {
    // eslint-disable-next-line callback-return
    cb(null, false);
  }
};

const limits = {
  fileSize: 1024 * 1024 * 5
};

module.exports = multer({
  storage,
  fileFilter,
  limits
});
