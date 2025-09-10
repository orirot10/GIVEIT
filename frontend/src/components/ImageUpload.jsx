import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { uploadImage } from '../firebase';

const ImageUpload = ({ onImageUpload, onUploadStart, onUploadError, multiple = false, accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (event) => {
    // Preserve a reference to the input in case React reuses the event object
    const input = event.target;
    const files = Array.from(input.files);
    if (files.length === 0) return;

    const auth = getAuth();
    if (!auth.currentUser) {
      setError('You must be logged in to upload images.');
      return;
    }

    // Validate files
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return false;
      }
      if (file.size > maxSize) {
        setError('File size must be less than 5MB.');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setError('');
    setProgress(0);
    onUploadStart?.();

    try {
      // Get fresh token
      await auth.currentUser.getIdToken(true);
      
      const urls = [];
      const totalBytes = validFiles.reduce((sum, f) => sum + f.size, 0);
      let uploadedBytes = 0;

      for (const file of validFiles) {
        const url = await uploadImage(file, auth.currentUser.uid, (bytesTransferred) => {
          const currentProgress = ((uploadedBytes + bytesTransferred) / totalBytes) * 100;
          setProgress(Math.round(currentProgress));
        });
        uploadedBytes += file.size;
        setProgress(Math.round((uploadedBytes / totalBytes) * 100));
        urls.push(url);
      }

      onImageUpload(urls);
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload image(s). Please try again.';
      if (err.code === 'storage/unauthorized') {
        errorMessage = 'Permission denied. Please check Firebase storage rules.';
      } else if (err.code === 'storage/quota-exceeded') {
        errorMessage = 'Storage quota exceeded.';
      } else if (err.code === 'storage/unauthenticated') {
        errorMessage = 'Please log in again and try uploading.';
      }
      setError(errorMessage);
      onUploadError?.(errorMessage);
    } finally {
      setUploading(false);
      // Reset the file input so the same file can be selected again
      input.value = '';
    }
  };

  return (
    <div className="image-upload w-full">
      <label 
        htmlFor="file-upload" 
        className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <span>{uploading ? 'Uploading...' : 'Choose Image(s)'}</span>
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
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-gray-500">Max 5MB per image, up to 5 images</p>
    </div>
  );
};

export default ImageUpload;
