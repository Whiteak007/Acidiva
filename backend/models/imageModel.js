import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  isMultiple: {
    type: Boolean,
    default: false
  }
});

const Image = mongoose.model('Image', imageSchema);

export default Image;