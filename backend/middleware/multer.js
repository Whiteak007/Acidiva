import multer from 'multer';

// Configure memory storage
const storage = multer.memoryStorage();

// Filtering the files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Adding limit of 5 mb
  }
});

export default upload;