const multer = require('multer');
const fs = require('fs');

const uploader = (destination, fileNamePrefix) => {
  let defaultPath = './public';

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = defaultPath + destination;
      if (fs.existsSync(dir)) {
        console.log(dir, 'dir exists');
        cb(null, dir);
      } else {
        fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
      }
    },
    filename: (req, file, cb) => {
      let originalname = file.originalname;
      let ext = originalname.split('.').pop();
      let filename = fileNamePrefix + Date.now() + '.' + ext;
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx)$/;
    if (!file.originalname.toLowerCase().match(ext)) {
      return cb(new Error('Only Selected file types are allowerd'), false);
    }
    cb(null, true);
  };
  return multer({
    storage,
    fileFilter,
  });
};

module.exports = uploader;
