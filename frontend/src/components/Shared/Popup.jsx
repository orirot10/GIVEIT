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
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import '../../styles/components/PopupAnimation.css';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../../firebase';
import { usePricePeriodTranslation } from '../../utils/pricePeriodTranslator';

// Design System - Unified Color Palette & Typography
const DESIGN_TOKENS = {
    // Primary Color Palette (Teal-based)
    colors: {
        primary: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6', // Main accent
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a'
        },
        neutral: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a'
        },
        semantic: {
            success: '#10b981',
            warning: '#f59e0b',
            error: '#ef4444',
            info: '#3b82f6'
        }
    },
    // Typography System
    typography: {
        fontFamily: {
            primary: "'Assistant', 'David Libre', Arial, sans-serif",
            secondary: "'Inter', 'Alef', Arial, sans-serif"
        },
        fontSize: {
            xs: '12px',
            sm: '14px',
            base: '16px',
            lg: '18px',
            xl: '20px',
            '2xl': '24px',
            '3xl': '30px'
        },
        fontWeight: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },
    // Spacing System
    spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px'
    },
    // Border Radius
    borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        full: '9999px'
    },
    // Shadows
    shadows: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px rgba(0, 0, 0, 0.07)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    }
};

const Popup = ({ item, onClose, contentType }) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const popupRef = useRef(null);
  const [resolvedImageUrls, setResolvedImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { translatePricePeriod } = usePricePeriodTranslation();
  const [currentRating, setCurrentRating] = useState(item?.rating || 0);
  const [ratingCount, setRatingCount] = useState(item?.ratingCount || 0);
  const isRateable = contentType === 'rentals' || contentType === 'services';
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);


  useEffect(() => {
    setCurrentRating(item?.rating || 0);
    setRatingCount(item?.ratingCount || 0);
    setSelectedRating(0);
    setHasRated(false);
  }, [item]);

  const handleRate = async () => {
    if (!isRateable || hasRated || selectedRating === 0) return;

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://giveit-backend.onrender.com';
      const endpoint = contentType === 'services' ? 'services' : 'rentals';
      const res = await fetch(`${baseUrl}/api/${endpoint}/${item._id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user && user.token ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify({ rating: selectedRating })

      });
      const data = await res.json();
      if (res.ok) {
        setCurrentRating(data.rating);
        setRatingCount(data.ratingCount);
        setHasRated(true);
      } else if (data?.error) {
        setHasRated(true);

      }
    } catch (err) {
      console.error('Failed to rate', err);
    }
  };
  
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
    ownerId = null,
    owner = null
  } = item;

  // Handle different owner ID field names
  const actualOwnerId = ownerId || (owner && owner._id) || (owner && owner.uid) || null;

  const address = [street, city, state, zipCode].filter(Boolean).join(', ');
  const ownerName = [firstName, lastName].filter(Boolean).join(' ');
  const displayPhone = (phone && phone.trim() !== '') ? phone : (phoneNumber && phoneNumber.trim() !== '' ? phoneNumber : 'Contact Info Unavailable');
  const sanitizedPhone = displayPhone.replace(/[^0-9+]/g, '').replace(/^0/, '+972');

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const handleContact = () => {
    console.log('handleContact called with item:', item);
    console.log('Current user:', user);
    console.log('Owner ID from item:', ownerId);
    console.log('User ID from context:', user?.uid);

    if (!user) {
      alert('Please log in to start a conversation');
      return;
    }

    if (!actualOwnerId) {
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

    if (actualOwnerId === currentUserId) {
      alert('You cannot start a conversation with yourself');
      onClose();
      return;
    }

    console.log(`Navigating to messages to chat with owner: ${actualOwnerId}`);
    navigate('/messages', {
      state: {
        contactId: actualOwnerId,
        contactName: title,
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
      className="fixed inset-0 flex justify-center items-start p-5 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      style={{ 
        zIndex: 9999, 
        fontFamily: DESIGN_TOKENS.typography.fontFamily.primary,
        paddingTop: '100px'
      }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      dir="auto"
    >
      <div
        ref={popupRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden relative transform transition-all duration-300 ease-in-out animate-popup-enter"
        style={{
          borderRadius: DESIGN_TOKENS.borderRadius.lg,
          boxShadow: DESIGN_TOKENS.shadows.xl,
          fontFamily: DESIGN_TOKENS.typography.fontFamily.primary
        }}
        dir="auto"
      >
        {/* Header Bar */}
        <div 
          className="relative flex items-center justify-center px-3"
          style={{
            background: (contentType?.includes('request') || item.type?.includes('request')) ? '#c27e30ff' : '#10b981',
            height: '40px',
            borderTopLeftRadius: DESIGN_TOKENS.borderRadius.lg,
            borderTopRightRadius: DESIGN_TOKENS.borderRadius.lg
          }}
        >
          <h1
            className="header-title text-lg font-bold text-white break-words text-center"
            style={{
              fontSize: DESIGN_TOKENS.typography.fontSize.lg,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
              color: 'white',
              lineHeight: '1.1',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {title}
          </h1>
        
          {/* Close Button */}
          <button
            onClick={onClose}
            className="close-button absolute left-0.5 flex items-center justify-center text-white hover:text-gray-200 transition-all duration-200 rounded-full hover:bg-white/20 active:scale-95"
            style={{
              width: '40px',
              height: '40px'
            }}
            aria-label="Close popup"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
        {/* Hero Image Section */}
        {resolvedImageUrls.length > 0 && (
          <div className="relative shadow-sm" style={{ aspectRatio: '3/2', boxShadow: DESIGN_TOKENS.shadows.md }}>
            <div
              className="w-full h-full overflow-hidden"
              style={{
                background: DESIGN_TOKENS.colors.neutral[100],
                borderBottomLeftRadius: DESIGN_TOKENS.borderRadius.md,
                borderBottomRightRadius: DESIGN_TOKENS.borderRadius.md
              }}
            >
              <img
                src={resolvedImageUrls[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 cursor-zoom-in"
                onClick={toggleFullScreen}
                loading="lazy"
              />
            </div>
            

            
            {/* Image counter */}
            {resolvedImageUrls.length > 1 && (
              <div
                className="image-counter absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-md"
                style={{ borderRadius: DESIGN_TOKENS.borderRadius.sm }}
              >
                {currentImageIndex + 1} of {resolvedImageUrls.length}
              </div>
            )}
            
            {/* Navigation arrows - only show if there are multiple images */}
            {resolvedImageUrls.length > 1 && (
              <>
                {/* Previous button */}
                <button
                  onClick={handlePreviousImage}
                  className="image-nav-button absolute -left-1 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-black hover:text-gray-200 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="h-2 w-2" />
                </button>
                
                {/* Next button */}
                <button
                  onClick={handleNextImage}
                  className="image-nav-button absolute -right-1 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-black hover:text-gray-200 transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="h-2 w-2" />
                </button>
              </>
            )}
          </div>
        )}

        {isFullScreen && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            onClick={toggleFullScreen}
          >
            <img
              src={resolvedImageUrls[currentImageIndex]}
              alt={`${title} - full view`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}

        {/* Separator Line */}
        {resolvedImageUrls.length > 0 && (
          <div 
            style={{
              height: '0.5px',
              backgroundColor: DESIGN_TOKENS.colors.neutral[200],
              margin: '0 24px'
            }}
          />
        )}

        {/* Description */}
        {description && (
          <>
            <div 
              style={{
                height: '0.5px',
                backgroundColor: DESIGN_TOKENS.colors.neutral[200],
                margin: '8px 24px'
              }}
            />
            <div className="p-2 pb-1">
              <p
                className="description-text text-gray-700 break-words whitespace-pre-line"
                style={{
                  fontSize: DESIGN_TOKENS.typography.fontSize.base,
                  color: DESIGN_TOKENS.colors.neutral[700],
                  lineHeight: 1.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {description}
              </p>
            </div>
          </>
        )}

                {/* Info Rows */}
        <div className="px-3 space-y-0" dir="rtl">
          {/* Price Section */}
          {price !== null && (
            <div className="info-section">
              <div 
                style={{
                  height: '0.5px',
                  backgroundColor: DESIGN_TOKENS.colors.neutral[200],
                  margin: '8px 12px'
                }}
              />
              <div 
                className="info-row flex justify-center"
              >
                <p
                  className="text-base font-bold text-center"
                  style={{
                    fontSize: DESIGN_TOKENS.typography.fontSize.base,
                    fontWeight: DESIGN_TOKENS.typography.fontWeight.bold,
                    color: DESIGN_TOKENS.colors.primary[600],
                    lineHeight: 1
                  }}
                >
                  ₪{price} <span className="font-semibold" style={{ color: DESIGN_TOKENS.colors.primary[500] }}>{translatePricePeriod(pricePeriod)}</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Rating Section */}
          {isRateable && (
            <div className="info-section">
              <div 
                style={{
                  height: '0.3px',
                  backgroundColor: DESIGN_TOKENS.colors.neutral[200],
                  margin: '8px 8px'
                }}
              />
              <div
                className="info-row flex justify-center py-0.5"
                style={{ 
                  paddingTop: DESIGN_TOKENS.spacing.xs, 
                  paddingBottom: DESIGN_TOKENS.spacing.xs
                }}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-1">
                    <span style={{ fontSize: DESIGN_TOKENS.typography.fontSize.xs, fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold, color: DESIGN_TOKENS.colors.neutral[800] }}>
                      {currentRating.toFixed(1)} ({ratingCount})
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[1,2,3,4,5].map(star => (
                      <FaStar
                        key={star}
                        className={`h-2 w-2 ${hasRated ? '' : 'cursor-pointer'}`}
                        style={{ color: star <= (hasRated ? Math.round(currentRating) : selectedRating) ? '#fbbf24' : DESIGN_TOKENS.colors.neutral[300], marginRight: 3 }}
                        onClick={() => { if (!hasRated) setSelectedRating(star); }}
                      />
                    ))}
                    {!hasRated && (
                      <button
                        onClick={handleRate}
                        disabled={selectedRating === 0}
                        className="ml-1 text-md font-bold text-blue-600 disabled:text-gray-400 disabled:font-normal"
                      >
                        דרג
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Combined Contact Info Row */}
          <div className="info-section">
            <div 
              style={{
                height: '0.5px',
                backgroundColor: DESIGN_TOKENS.colors.neutral[200],
                margin: '8px 24px'
              }}
            />
            <div 
              className="info-row flex items-center py-1.5 space-x-3"
              style={{ 
                paddingTop: DESIGN_TOKENS.spacing.xs, 
                paddingBottom: DESIGN_TOKENS.spacing.xs
              }}
            >
              {/* Phone */}
              <div className="flex items-end flex-1">
                <PhoneIcon 
                  className="h-2 w-3 mr-3" 
                  style={{ color: DESIGN_TOKENS.colors.primary[500] }}
                />
                <p
                  className="text-xs font-semibold break-words popup-text-lower"
                  style={{
                    fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                    fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                    lineHeight: '10px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <a
                    href={`tel:${sanitizedPhone}`}
                    className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                  >
                    {displayPhone}
                  </a>
                </p>
              </div>
              
              {/* Owner */}
              {ownerName && ownerName !== 'N/A' && (
                <div className="flex items-end flex-1">
                  <UserIcon 
                    className="h-2 w-3 mr-3" 
                    style={{ color: DESIGN_TOKENS.colors.primary[500] }}
                  />
                  <p
                    className="text-xs font-semibold text-gray-800 break-words popup-text-lower"
                    style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                      color: DESIGN_TOKENS.colors.neutral[800],
                      lineHeight: '10px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {ownerName}
                  </p>
                </div>
              )}
              
              {/* Location */}
              {address && (
                <div className="flex items-end flex-1">
                  <MapPinIcon 
                    className="h-2 w-3 mr-1" 
                    style={{ color: DESIGN_TOKENS.colors.primary[500] }}
                  />
                  <p
                    className="text-xs font-semibold text-gray-800 break-words popup-text-lower"
                    style={{
                      fontSize: DESIGN_TOKENS.typography.fontSize.xs,
                      fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
                      color: DESIGN_TOKENS.colors.neutral[800],
                      lineHeight: '10px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Call-to-Action Button */}
        <div className="sticky bottom-0 bg-white px-3 pt-2 pb-2 space-y-2 border-t">
          <button
            className="cta-button w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.96] transition-all duration-200 ease-in-out"
            style={{
              background: DESIGN_TOKENS.colors.primary[500],
              height: '44px',
              borderRadius: DESIGN_TOKENS.borderRadius.md,
              fontSize: DESIGN_TOKENS.typography.fontSize.sm,
              fontWeight: DESIGN_TOKENS.typography.fontWeight.semibold,
              color: 'white',
              boxShadow: DESIGN_TOKENS.shadows.md,
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={handleContact}
            onMouseOver={e => e.currentTarget.style.background = DESIGN_TOKENS.colors.primary[600]}
            onMouseOut={e => e.currentTarget.style.background = DESIGN_TOKENS.colors.primary[500]}
          >
            <span className="text-sm">התחל שיחה בצ'אט</span>
          </button>
          {sanitizedPhone && (
            <div className="flex space-x-1">
              <a
                href={`tel:${sanitizedPhone}`}
                className="flex-1 text-center border border-current text-white rounded-lg block"
                style={{
                  height: '44px',
                  lineHeight: '44px',
                  fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                  borderColor: '#ef4444',
                  backgroundColor: '#bb513eff',
                  borderRadius: DESIGN_TOKENS.borderRadius.md
                }}
              >
                התקשר
              </a>
              <a
                href={`https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(`Hi! im interested in ${title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center rounded-lg text-white"
                style={{
                  height: '44px',
                  fontSize: DESIGN_TOKENS.typography.fontSize.sm,
                  borderRadius: DESIGN_TOKENS.borderRadius.md,
                  background: '#25D366'
                }}
              >
                <FaWhatsapp className="h-2 w-2 ml-1" />
                <span className="text-sm"> whatsapp </span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;