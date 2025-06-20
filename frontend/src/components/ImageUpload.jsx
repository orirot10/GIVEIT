import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { getStorage } from 'firebase/storage';

const ImageUpload = ({ onImageUpload, multiple = false, accept = 'image/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}_${file.name}`;
          const storageRef = ref(storage, `images/${fileName}`);

          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return url;
        })
      );

      // שלח את ה-URL חזרה להורה
      onImageUpload(multiple ? urls : urls[0]);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image(s). Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-upload">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p className="error" style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUpload;
