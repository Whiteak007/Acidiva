import express from 'express';
import { 
  uploadSingleImage, 
  uploadMultipleImages, 
  getAllImages, 
  deleteImage 
} from '../controllers/imageController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Upload single image rotue for uploading a single image
router.post('/upload-single', upload.single('image'), uploadSingleImage);

// Upload multiple images route for uploading multiple iamges
router.post('/upload-multiple', upload.array('images', 10), uploadMultipleImages);

// Get all images from the database
router.get('/', getAllImages);

// Delete an image from database
router.delete('/:id', deleteImage);

export default router;