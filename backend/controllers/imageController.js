import { v2 as cloudinary } from 'cloudinary';
import Image from '../models/imageModel.js';
import streamifier from 'streamifier';

// Helper function to upload from buffer memory it is required to install that backage in your backend folder
const uploadFromBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'uploads'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    
    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

// Upload single image
export const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Upload image to Cloudinary from buffer
    const result = await uploadFromBuffer(req.file);

    // Save to database
    const newImage = new Image({
      url: result.secure_url,
      publicId: result.public_id,
      isMultiple: false
    });

    await newImage.save();

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      image: newImage
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image'
    });
  }
};

// Upload multiple images
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    const uploadResults = [];

    // Upload each image to Cloudinary and save to database
    for (const file of req.files) {
      const result = await uploadFromBuffer(file);
      
      // Save to database
      const newImage = new Image({
        url: result.secure_url,
        publicId: result.public_id,
        isMultiple: true
      });

      await newImage.save();
      uploadResults.push(newImage);
    }

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      images: uploadResults
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images'
    });
  }
};


// Get all images
export const getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.status(200).json({
      success: true,
      images
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching images'
    });
  }
};

// Delete an image
export const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the image in database
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(image.publicId);
    
    // Delete from database
    await Image.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image'
    });
  }
};