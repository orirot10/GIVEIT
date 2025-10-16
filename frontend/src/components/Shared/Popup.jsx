// Popup.jsx (only UI changed per your request)
import React, { useEffect, useRef, useState } from 'react';
import {
  XMarkIcon,
  UserIcon,
  MapPinIcon,
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

const DESIGN_TOKENS = {
  colors: {
    primary: { 500: '#14b8a6', 600: '#0d9488' },
    neutral: { 100: '#f1f5f9', 200: '#e2e8f0', 700: '#334155', 800: '#1e293b' }
  },
  typography: {
    fontFamily: { primary: "'Assistant','Inter',Arial,sans-serif" },
    fontSize: { xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px' },
    fontWeight: { semibold: 600, bold: 700 }
  },
  borderRadius: { sm: '8px', md: '14px', lg: '20px', full: '9999px' },
  shadows: { md: '0 6px 16px rgba(0,0,0,.10)', lg: '0 12px 28px rgba(0,0,0,.15)' }
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
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const isRateable = contentType === 'rentals' || contentType === 'services';

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
      } else setHasRated(true);
    } catch (err) {
      console.error('Failed to rate', err);
    }
  };

  useEffect(() => {
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onEsc);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!item?.images?.length) {
        setResolvedImageUrls([]); setCurrentImageIndex(0); return;
      }
      const urls = [];
      for (const img of item.images) {
        if (img.startsWith('http')) { urls.push(img); continue; }
        try {
          const firebaseRef = storageRef(storage, img.startsWith('images/') ? img : `images/${img.replace(/^\//,'')}`);
          const url = await getDownloadURL(firebaseRef);
          urls.push(url);
        } catch {
          urls.push(`https://giveit-backend.onrender.com${img}`);
        }
      }
      if (mounted) { setResolvedImageUrls(urls); setCurrentImageIndex(0); }
    })();
    return () => (mounted = false);
  }, [item]);

  const handleBackdropClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) onClose();
  };

  if (!item) return null;

  const {
    title = 'Item Title Unavailable',
    description = 'No description available',
    street = '', city = '', state = '', zipCode = '',
    phone, phoneNumber,
    price = null, pricePeriod = 'use',
    firstName = 'N/A', lastName = '',
    ownerId = null, owner = null
  } = item;

  const actualOwnerId = ownerId || owner?._id || owner?.uid || null;
  const address = [street, city, state, zipCode].filter(Boolean).join(', ');
  const ownerName = [firstName, lastName].filter(Boolean).join(' ');
  const displayPhone = phone?.trim() ? phone : (phoneNumber?.trim() ? phoneNumber : '');
  const sanitizedPhone = displayPhone ? displayPhone.replace(/[^0-9+]/g, '').replace(/^0/, '+972') : '';

  const toggleFullScreen = () => setIsFullScreen((p) => !p);
  const handlePreviousImage = () =>
    setCurrentImageIndex((i) => (i === 0 ? resolvedImageUrls.length - 1 : i - 1));
  const handleNextImage = () =>
    setCurrentImageIndex((i) => (i === resolvedImageUrls.length - 1 ? 0 : i + 1));

  const handleContact = () => {
    if (!user) return alert('Please log in to start a conversation');
    const currentUserId = user.uid;
    if (!currentUserId) return alert('Your user information is incomplete. Please re-login.');
    const ownerUid = actualOwnerId;
    if (!ownerUid) { alert('Unable to start conversation: Owner missing'); onClose(); return; }
    if (ownerUid === currentUserId) { alert('You cannot start a conversation with yourself'); onClose(); return; }
    navigate('/messages', { state: { contactId: ownerUid, contactName: title, itemTitle: title, initialMessage: true } });
    onClose();
  };

  const hasImages = resolvedImageUrls.length > 0;

  return (
    <div
      className="fixed inset-0 flex justify-center items-start px-2 py-5 bg-black/40 backdrop-blur-sm"
      style={{ zIndex: 9999, fontFamily: DESIGN_TOKENS.typography.fontFamily.primary, paddingTop: '100px' }}
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      dir="rtl"
    >
      <div
        ref={popupRef}
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden relative animate-popup-enter"
        style={{ boxShadow: DESIGN_TOKENS.shadows.lg }}
      >
        {/* === Close Button (over image when exists; else at top-right) === */}
        <button
          onClick={onClose}
          aria-label="סגור"
          className={`absolute top-1 right-1 z-20 rounded-full text-white p-2 transition ${
            hasImages ? 'bg-black/55 hover:bg-black/65' : 'bg-black/35 hover:bg-black/45'
          }`}
        >
          <XMarkIcon className="h-3 w-3" />
        </button>

        {/* === HERO (no header) === */}
        {hasImages && (
          <div className="relative" style={{ aspectRatio: '16/10' }}>
            <img
              src={resolvedImageUrls[currentImageIndex]}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onClick={toggleFullScreen}
              loading="lazy"
            />
            {/* gradient bottom for legibility */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />
            {/* price chip over image */}
            {price !== null && (
              <div className="absolute left-1 bottom-1">
                <span className="inline-flex items-center px-5 py-3 text-white text-xl font-bold rounded-full"
                  style={{ background: contentType?.includes('request') ? '#d8974eff' : DESIGN_TOKENS.colors.primary[600] }}>
                  ₪{price}&nbsp;·&nbsp;{translatePricePeriod(pricePeriod)}
                </span>
              </div>
            )}
            {/* image counter + nav */}
            {resolvedImageUrls.length > 1 && (
              <>
                <div className="absolute right-3 bottom-3 text-[11px] text-white/90 bg-black/40 px-2 py-0.5 rounded-full">
                  {currentImageIndex + 1}/{resolvedImageUrls.length}
                </div>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/50 text-white p-2 rounded-full"
                  aria-label="תמונה קודמת"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/35 hover:bg-black/50 text-white p-2 rounded-full"
                  aria-label="תמונה הבאה"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        )}

        {isFullScreen && (
          <div className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center" onClick={toggleFullScreen}>
            <img src={resolvedImageUrls[currentImageIndex]} alt={`${title} - full view`} className="max-w-full max-h-full object-contain" />
          </div>
        )}

        {/* Separator (thin) below image */}
        {hasImages && <div className="h-px bg-gray-200 mx-3" />}

        {/* === Price chip fallback when NO image (left-aligned) === */}
        {!hasImages && price !== null && (
          <div className="px-4 py-2 pt-3">
            <div className="flex" dir="ltr">
              <span
                className="inline-flex items-center px-5 py-3 text-white text-xl font-bold rounded-full mr-auto"
                style={{ background: contentType?.includes('request') ? '#d8974eff' : DESIGN_TOKENS.colors.primary[600] }}
              >
                ₪{price}&nbsp;·&nbsp;{translatePricePeriod(pricePeriod)}
              </span>
            </div>
          </div>
        )}

        {/* === Title (black, above description) & Description === */}
        <div className="px-4 pt-2 space-y-0.5">
          <h1
            className="font-bold text-[18px] leading-snug mb-0 line-clamp-2"
            style={{ color: DESIGN_TOKENS.colors.neutral[800] }}
          >
            {title}
          </h1>

          {item?.description && (
            <p
              className="text-[14px] leading-[1.25] mt-0 text-gray-700 line-clamp-2"
              style={{ color: DESIGN_TOKENS.colors.neutral[700] }}
            >
              {item.description}
            </p>
          )}
        </div>

{/* === Rating (bigger) === */}
{isRateable && (
  <div className="px-4 pt-2 pb-1">
    <div className="flex items-center gap-4">
      <div className="flex items-center">
        {[1,2,3,4,5].map(star => (
          <FaStar
            key={star}
            className={`mx-1 ${hasRated ? '' : 'cursor-pointer'}`}
            size={28}                           // ⟵ was 20
            color={
              star <= (hasRated ? Math.round(currentRating) : selectedRating)
                ? '#FFC107'
                : '#E2E8F0'
            }
            onClick={() => !hasRated && setSelectedRating(star)}
          />
        ))}
      </div>

      <div className="flex items-baseline gap-2 text-gray-700">
        <span className="text-[20px] font-bold">{currentRating.toFixed(1)}</span>
        <span className="text-[14px] opacity-80">({ratingCount})</span>
      </div>

      {!hasRated && (
        <button
          onClick={handleRate}
          disabled={selectedRating === 0}
          className="ml-auto px-3 py-1.5 rounded-md text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: DESIGN_TOKENS.colors.primary[600] }}
        >
          דרג
        </button>
      )}
    </div>
  </div>
)}


        <div className="h-px bg-gray-200 my-2 mx-3" />

        {/* === Info Row === */}
        <div className="px-4 pb-2 flex items-center justify-between gap-2 text-[11px] overflow-hidden" dir="rtl">
          {([firstName,lastName].filter(Boolean).join(' ') !== 'N/A') && (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <UserIcon className={`h-2 w-2 flex-shrink-0`} style={{ color: contentType?.includes('request') ? '#d8974eff' : '#0d9488' }} />
              <span className="font-semibold truncate">{[firstName,lastName].filter(Boolean).join(' ')}</span>
            </div>
          )}
          {address && (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <MapPinIcon className={`h-2 w-2 flex-shrink-0`} style={{ color: contentType?.includes('request') ? '#d8974eff' : '#0d9488' }} />
              <span className="font-semibold truncate">{address}</span>
            </div>
          )}
          {displayPhone && (
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <a href={`tel:${sanitizedPhone}`} className="flex items-center gap-1 text-blue-700 underline font-semibold truncate">
                <PhoneIcon className={`h-2 w-2 flex-shrink-0`} style={{ color: contentType?.includes('request') ? '#d8974eff' : '#0d9488' }} />
                <span className="truncate">{displayPhone}</span>
              </a>
            </div>
          )}
        </div>
{/* === CTA (smaller) === */}
<div className="sticky bottom-0 bg-white px-3 pt-1 pb-2 border-t">
  <button
    className="w-full rounded-md text-white font-medium transition hover:opacity-95 active:scale-[.98]"
    style={{
      background: contentType?.includes('request') ? '#d8974eff' : DESIGN_TOKENS.colors.primary[500],
      height: '48px',                // ⟵ smaller (was h-8 ~32px)
      fontSize: '13px'               // ⟵ smaller text
    }}
    onClick={handleContact}
  >
    התחל שיחה בצ'אט
  </button>

  {sanitizedPhone && (
    <div className="mt-1 grid grid-cols-2 gap-1.5">
      <a
        href={`tel:${sanitizedPhone}`}
        className="rounded-[8px] grid place-items-center border text-white font-medium"
        style={{
          background: '#bb513e',
          borderColor: '#bb513e',
          height: '48px',            // ⟵ smaller (was ~16px)
          fontSize: '11px'
        }}
      >
        התקשר
      </a>

      <a
        href={`https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(`Hi! im interested in ${title}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-[8px] grid place-items-center text-white font-medium"
        style={{
          background: '#25D366',
          height: '48px',            // ⟵ smaller
          fontSize: '11px'
        }}
      >
        <span className="flex items-center gap-1">
          <FaWhatsapp size={12} /> WhatsApp
        </span>
      </a>
    </div>
  )}
</div>


      </div>
    </div>
  );
};

export default Popup;
