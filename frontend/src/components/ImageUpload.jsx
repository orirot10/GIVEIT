import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const ImageUpload = ({ onImageUpload, multiple = false, accept = "image/*" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setUploading(true);
    setError('');

    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `images/${fileName}`);
        
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      onImageUpload(multiple ? urls : urls[0]);
    } catch (err) {
      setError('Failed to upload image(s)');
      console.error('Upload error:', err);
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
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ImageUpload;