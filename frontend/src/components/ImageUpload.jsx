import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { FaTimes, FaImage, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';

const ImageUpload = () => {
  const [singleImage, setSingleImage] = useState(null);
  const [singlePreview, setSinglePreview] = useState('');
  const [multipleImages, setMultipleImages] = useState([null]);
  const [multiplePreviews, setMultiplePreviews] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [allImages, setAllImages] = useState([]);
  const [showGallery, setShowGallery] = useState(false);

  // Handle single image selection from the userr
  const handleSingleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSingleImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSinglePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle multiple image selection from the user
  const handleMultipleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...multipleImages];
      updatedImages[index] = file;
      setMultipleImages(updatedImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...multiplePreviews];
        updatedPreviews[index] = reader.result;
        setMultiplePreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add another image field onclidk
  const addAnotherImage = () => {
    setMultipleImages([...multipleImages, null]);
    setMultiplePreviews([...multiplePreviews, '']);
  };

  // Remove an image field
  const removeImageField = (index) => {
    if (multipleImages.length > 1) {
      const updatedImages = [...multipleImages];
      updatedImages.splice(index, 1);
      setMultipleImages(updatedImages);

      const updatedPreviews = [...multiplePreviews];
      updatedPreviews.splice(index, 1);
      setMultiplePreviews(updatedPreviews);
    }
  };

  // Upload single image
  const uploadSingleImage = async () => {
    if (!singleImage) {
      setMessage('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', singleImage);

    try {
      const response = await axios.post(`${backendUrl}/api/image/upload-single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Image uploaded successfully');
      setSingleImage(null);
      setSinglePreview('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  // Upload multiple images
  const uploadMultipleImages = async () => {
    const validImages = multipleImages.filter(img => img !== null);
    if (validImages.length === 0) {
      setMessage('Please select at least one image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    validImages.forEach((image, index) => {
      formData.append('images', image);
    });

    try {
      const response = await axios.post(`${backendUrl}/api/image/upload-multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Images uploaded successfully');
      setMultipleImages([null]);
      setMultiplePreviews(['']);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error uploading images');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all images
  const fetchAllImages = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/image`);
      setAllImages(response.data.images);
      setShowGallery(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error fetching images');
    }
  };

  // Delete an image
  const handleDeleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await axios.delete(`${backendUrl}/api/image/${id}`);
        setMessage('Image deleted successfully');
        // Refresh the gallery
        fetchAllImages();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting image');
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Image Upload</h1>
      
      {message && (
        <div className={`p-3 mb-6 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      {/* Single Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Upload Single Image</h2>
        <div className="flex flex-col items-center">
          {singlePreview ? (
            <div className="mb-4 relative">
              <img 
                src={singlePreview} 
                alt="Preview" 
                className="w-48 h-48 object-cover rounded-lg border"
              />
              <button 
                onClick={() => {
                  setSingleImage(null);
                  setSinglePreview('');
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 mb-4">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaImage className="h-10 w-10 text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Click to upload</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleSingleImageChange}
              />
            </label>
          )}
          <button
            onClick={uploadSingleImage}
            disabled={loading || !singleImage}
            className={`px-4 py-2 rounded-md text-white ${loading || !singleImage ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {loading ? 'Uploading...' : 'Upload Image'}
          </button>
        </div>
      </div>
      
      {/* Multiple Image Upload */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Multiple Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {multipleImages.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {multiplePreviews[index] ? (
                <div className="mb-2 relative">
                  <img 
                    src={multiplePreviews[index]} 
                    alt={`Preview ${index}`} 
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                  <button 
                    onClick={() => removeImageField(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 mb-2">
                  <div className="flex flex-col items-center justify-center">
                    <FaImage className="h-8 w-8 text-gray-400" />
                    <p className="text-xs text-gray-500 mt-1">Click to upload</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleMultipleImageChange(e, index)}
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={addAnotherImage}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Add Another Image
          </button>
          <button
            onClick={uploadMultipleImages}
            disabled={loading || multipleImages.every(img => img === null)}
            className={`px-4 py-2 rounded-md text-white ${loading || multipleImages.every(img => img === null) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {loading ? 'Uploading...' : 'Upload All Images'}
          </button>
        </div>
      </div>

      {/* Gallery Toggle Button */}
      {!showGallery && (
        <div className="text-center mt-8">
          <button
            onClick={fetchAllImages}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 flex items-center justify-center mx-auto"
          >
            <FaEye className="mr-2" /> View All Images
          </button>
        </div>
      )}

      {/* Image Gallery */}
      {showGallery && (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Image Gallery</h2>
            <button
              onClick={() => setShowGallery(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 flex items-center"
            >
              <FaEyeSlash className="mr-1" /> Hide
            </button>
          </div>
          {allImages.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No images found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {allImages.map((image) => (
                <div key={image._id} className="relative group">
                  <img 
                    src={image.url} 
                    alt="Gallery" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => handleDeleteImage(image._id)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(image.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;