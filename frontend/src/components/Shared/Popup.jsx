import React, { useEffect, useRef } from 'react';
import { 
  XMarkIcon, 
  UserIcon, 
  MapPinIcon, 
  TagIcon, 
  CurrencyDollarIcon, 
  PhoneIcon 
} from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import '../../styles/components/PopupAnimation.css';

const Popup = ({ item, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const popupRef = useRef(null);
  
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);
  
  const handleBackdropClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
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
    phone = 'Contact Info Unavailable',
    images,
    category = 'General',
    price = null,
    pricePeriod = 'use',
    firstName = 'N/A',
    lastName = '',
    ownerId = null
  } = item;

  const address = [street, city, state, zipCode].filter(Boolean).join(', ');
  const ownerName = [firstName, lastName].filter(Boolean).join(' ');

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
    const currentUserId = user.uid || user.user?.id;
    
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

  return (
    <div 
      className="fixed inset-0 flex justify-center items-center z-50 p-4 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
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
      <div className="bg-[#8cc9f1] p-6 pb-5 rounded-t-xl relative text-white" dir="auto"> {/* Changed p-4 to p-6 */}
        <div className="mt-2 mb-1 text-right">
          <h2 className="text-lg font-bold break-words py-1">&nbsp;{title}&nbsp;</h2>
          {description && (
            <p className="text-sm text-white/90 mt-1 line-clamp-2 break-words py-1">&nbsp;{description}</p>
          )}
        </div>
      </div>

        {images && images[0] && (
          <div className="overflow-hidden">
            <img 
              src={images[0].startsWith('http') ? images[0] : `https://giveit-backend.onrender.com${images[0]}`} 
              alt={title} 
              className="w-full h-28 object-cover"
              loading="lazy" 
            />
          </div>
        )}

        <div className="p-4 space-y-3" dir="rtl">
          {ownerName && ownerName !== 'N/A' && (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <div className="bg-blue-100 rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
                <UserIcon className="h-1.5 w-1.5 text-blue-600" />
              </div>
              <div className="px-3 min-w-0 text-right">
                <p className="text-sm text-gray-500 py-0.5">בעלים</p>
                <p className="text-sm font-medium break-words py-0.5">{ownerName}</p>
              </div>
            </div>
          )}
          
          {address && (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <div className="bg-blue-100 rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
                <MapPinIcon className="h-1.5 w-1.5 text-blue-600" />
              </div>
              <div className="px-3 min-w-0 text-right">
                <p className="text-sm text-gray-500 py-0.5">מיקום</p>
                <p className="text-sm font-medium break-words py-0.5">{address}</p>
              </div>
            </div>
          )}
          
          {price !== null && (
            <div className="bg-gray-100 rounded-lg p-3 flex items-center">
              <div className="bg-blue-100 rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
                <CurrencyDollarIcon className="h-1.5 w-1.5 text-blue-600" />
              </div>
              <div className="px-3 min-w-0 text-right">
                <p className="text-sm text-gray-500 py-0.5">מחיר</p>
                <p className="text-sm font-medium break-words py-0.5">${price} <span className="text-sm text-gray-500">ל{pricePeriod}</span></p>
              </div>
            </div>
          )}
          
          <div className="bg-gray-100 rounded-lg p-3 flex items-center">
            <div className="bg-blue-100 rounded-full w-3 h-3 flex items-center justify-center mx-3 flex-shrink-0">
              <PhoneIcon className="h-1.5 w-1.5 text-blue-600" />
            </div>
            <div className="px-3 min-w-0 text-right">
              <p className="text-sm text-gray-500 py-0.5">יצירת קשר</p>
              <p className="text-sm font-medium break-words py-0.5">{phone}</p>
            </div>
          </div>
        </div>

        <div className="p-4 pt-2">
          <button
            className="w-full bg-[#f55363] hover:bg-[#a86c45] text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.90] transition-all duration-200 ease-in-out border border-[#a86c45]"
            onClick={handleContact}
          >
            <span className="text-sm">צור קשר</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;