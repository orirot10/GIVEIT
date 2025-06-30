import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { getAuth } from 'firebase/auth';

const ImageUpload = ({ onImageUpload, multiple = false, accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const auth = getAuth();
    if (!auth.currentUser) {
      setError('You must be logged in to upload images.');
      console.error('Upload error: User not authenticated.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name}`;
          const storageRef = ref(storage, `images/${auth.currentUser.uid}/${fileName}`);
          await uploadBytes(storageRef, file);
          return await getDownloadURL(storageRef);
        })
      );

      onImageUpload(urls); // Always send as array (simplifies parent logic)
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload image(s). Please try again.';
      if (err.code === 'storage/unauthorized') {
        errorMessage = "You don't have permission to upload files. This might be a security rule issue.";
      }
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload w-full">
      <label 
        htmlFor="file-upload" 
        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
      >
        <span>{uploading ? 'Uploading...' : 'Choose File(s)'}</span>
      </label>
      <input
        id="file-upload"
        name="file-upload"
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUpload;
