import React, { useEffect, useRef, useState } from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  MapPinIcon, 
  TagIcon, 
  CurrencyDollarIcon, 
  PhoneIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import '../../styles/components/PopupAnimation.css';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../../firebase';

const Popup = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const popupRef = useRef(null);
  const [resolvedImageUrls, setResolvedImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  useEffect(() => {
    let isMounted = true;
    async function resolveImages() {
      if (!item || !item.images || item.images.length === 0) {
        setResolvedImageUrls([]);
        setCurrentImageIndex(0);
        return;
      }

      const resolvedUrls = [];
      
      for (const img of item.images) {
        if (img.startsWith('http')) {
          resolvedUrls.push(img);
          continue;
        }
        
        // Try Firebase Storage
        try {
          const firebaseRef = storageRef(storage, img.startsWith('images/') ? img : `images/${img.replace(/^\//, '')}`);
          const url = await getDownloadURL(firebaseRef);
          resolvedUrls.push(url);
        } catch (error) {
          console.warn(`Failed to resolve image from Firebase Storage, falling back to legacy URL for image: ${img}`, error);
          // Fallback to backend URL
          if (img.startsWith('http')) {
            resolvedUrls.push(img);
          } else {
            resolvedUrls.push(`https://giveit-backend.onrender.com${img}`);
          }
        }
      }
      
      if (isMounted) {
        setResolvedImageUrls(resolvedUrls);
        setCurrentImageIndex(0);
      }
    }
    resolveImages();
    return () => { isMounted = false; };
  }, [item]);
  
  const handleBackdropClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  console.log('[Popup] Received item prop:', item);

  if (!item) return null;

  const {
    title = 'Item Title Unavailable',
    description = 'No description available',
    street = '',
    city = '',
    state = '',
    zipCode = '',
    phone,
    phoneNumber,
    price = null,
    pricePeriod = 'use',
    firstName = 'N/A',
    lastName = '',
    ownerId = null
  } = item;

  const address = [street, city, state, zipCode].filter(Boolean).join(', ');
  const ownerName = [firstName, lastName].filter(Boolean).join(' ');
  const displayPhone = (phone && phone.trim() !== '') ? phone : (phoneNumber && phoneNumber.trim() !== '' ? phoneNumber : 'Contact Info Unavailable');

  const handleContact = () => {
    console.log('handleContact called with item:', item);
    console.log('Current user:', user);
    console.log('Owner ID from item:', ownerId);
    console.log('User ID from context:', user?.uid);

    if (!user) {
      alert('Please log in to start a conversation');
      return;
    }

    if (!ownerId) {
      alert('Unable to start conversation: Owner information is missing');
      onClose();
      return;
    }

    // Check if user.uid exists (Firebase auth) or fall back to user.user?.id (legacy)
    const currentUserId = user.uid;
    
    if (!currentUserId) {
      alert('Your user information is incomplete. Please log out and log in again.');
      return;
    }

    if (ownerId === currentUserId) {
      alert('You cannot start a conversation with yourself');
      onClose();
      return;
    }

    console.log(`Navigating to messages to chat with owner: ${ownerId}`);
    navigate('/messages', {
      state: {
        contactId: ownerId,
        contactName: ownerName,
        itemTitle: title,
        initialMessage: true
      }
    });
    onClose();
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? resolvedImageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === resolvedImageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center p-4 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      style={{ zIndex: 9999 }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      dir="auto"
    >
      {/* X button outside the popup */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white hover:text-gray-200 transition-colors rounded-full p-1 bg-black/40 hover:bg-black/60 z-[60]"
        aria-label="Close popup"
      >
        <XMarkIcon className="h-3 w-3" />
      </button>
      
      <div 
        ref={popupRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-xs max-h-[80vh] overflow-y-auto overflow-x-hidden relative transform transition-all duration-300 ease-in-out animate-popup-enter"
        dir="auto"
      >
      <div className="bg-[#2E4057] p-6 pb-5 rounded-t-xl relative text-white" dir="auto"> {/* Changed p-4 to p-6 */}
        <div className="mt-2 mb-1 text-right">
          <h2 className="text-lg font-bold break-words py-1">&nbsp;{title}&nbsp;</h2>
          {description && (
            <p className="text-sm text-white/90 mt-1 line-clamp-2 break-words py-1">&nbsp;{description}</p>
          )}
        </div>
      </div>

        {resolvedImageUrls.length > 0 && (
          <div className="p-4 pb-2 flex justify-center">
            <div className="relative overflow-hidden rounded-xl shadow-lg" style={{ width: '160px', height: '120px' }}>
              <img
                src={resolvedImageUrls[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              
              {/* Navigation arrows - only show if there are multiple images */}
              {resolvedImageUrls.length > 1 && (
                <>
                  {/* Previous button */}
                  <button
                    onClick={handlePreviousImage}
                    className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Next button */}
                  <button
                    onClick={handleNextImage}
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Image counter */}
                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {currentImageIndex + 1} / {resolvedImageUrls.length}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="p-4 space-y-3" dir="rtl">
          {ownerName && ownerName !== 'N/A' && (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <div className="bg-transparent rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
                <UserIcon className="h-1.5 w-1.5 text-[#F9A620]" />
              </div>
              <div className="px-3 min-w-0 text-right">
                <p className="text-xs text-gray-500 py-0.5 font-medium">בעלים</p>
                <p className="text-base font-bold text-gray-800 break-words py-0.5">{ownerName}</p>
              </div>
            </div>
          )}
          
          {address && (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <div className="bg-transparent rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
                <MapPinIcon className="h-1.5 w-1.5 text-[#F9A620]" />
              </div>
              <div className="px-3 min-w-0 text-right">
                <p className="text-xs text-gray-500 py-0.5 font-medium">מיקום</p>
                <p className="text-base font-bold text-gray-800 break-words py-0.5">{address}</p>
              </div>
            </div>
          )}
          
          {price !== null && (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <div className="bg-transparent rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
                <CurrencyDollarIcon className="h-1.5 w-1.5 text-[#F9A620]" />
              </div>
              <div className="px-3 min-w-0 text-right">
                <p className="text-xs text-gray-500 py-0.5 font-medium">מחיר</p>
                <p className="text-base font-bold text-gray-800 break-words py-0.5">₪{price} <span className="text-sm text-gray-500 font-normal">ל{pricePeriod}</span></p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-100 rounded-lg p-3 flex items-center">
            <div className="bg-transparent rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
              <PhoneIcon className="h-1.5 w-1.5 text-[#F9A620]" />
            </div>
            <div className="px-3 min-w-0 text-right">
              <p className="text-xs text-gray-500 py-0.5 font-medium">יצירת קשר</p>
              <a href={`tel:${displayPhone}`} className="text-base font-bold text-blue-600 hover:text-blue-800 underline break-words py-0.5 cursor-pointer">
                {displayPhone}
              </a>
            </div>
          </div>
        </div>

        <div className="p-4 pt-2">
          <button
            className="w-full bg-[#2E4057] hover:bg-[#1E8A7A] text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out"
            onClick={handleContact}
          >
            <span className="text-sm">התחל שיחה בצ'אט</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;