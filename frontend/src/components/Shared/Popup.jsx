import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid'; // Using Heroicons for the close icon
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuthContext } from '../../context/AuthContext'; // Import useAuthContext (adjust path if needed)
import '../../styles/components/PopupAnimation.css'; // Import the animation CSS

const Popup = ({ item, onClose }) => {
  const navigate = useNavigate(); // Initialize navigate
  const { user } = useAuthContext(); // Get current user context

  console.log('[Popup] Received item prop:', item); // Log 4

  if (!item) return null; // Don't render if no item is provided

  // Destructure item properties with default values for robustness
  const {
    title = 'Item Title Unavailable',
    description = 'No description available', // Added description field
    street = '',
    city = '',
    state = '',
    zipCode = '',
    phone = 'Contact Info Unavailable',
    images, // Changed from 'image' to 'images' (assuming it's an array)
    category = 'General',
    price = null,
    pricePeriod = 'use', // Added pricePeriod with a default
    firstName = 'N/A', // Added owner's first name
    lastName = '',    // Added owner's last name
    ownerId = null
  } = item;

  const address = [street, city, state, zipCode].filter(Boolean).join(', ');
  const ownerName = [firstName, lastName].filter(Boolean).join(' ');

  const handleContact = () => {
    console.log('handleContact called with item:', item);
    console.log('Current user:', user);
    console.log('Owner ID from item:', ownerId);
    console.log('User ID from context:', user?.user?.id);

    if (!user) {
      alert('Please log in to start a conversation');
        // Optionally redirect to login or show a message

        return;
    }

    if (!ownerId) {
      alert('Unable to start conversation: Owner information is missing');
      onClose();
      return;
    }

    if (ownerId === user.user.id) {
      alert('You cannot start a conversation with yourself');
      onClose();
      return;
    }

    console.log(`Navigating to messages to chat with owner: ${ownerId}`);
    navigate('/messages', {
      state: {
        contactId: ownerId,
        itemTitle: title,
        initialMessage: true
      }
    });
    onClose();
  };

  return (
    // Light/transparent overlay
<div className="fixed inset-0 flex justify-center items-center z-50 p-4 sm:p-8 transition-opacity duration-300 ease-in-out">{/* Popup container */}
<div className="bg-white rounded-md shadow-lg px-4 sm:px-6 md:px-8 py-6 w-full max-w-xs relative transform transition-all duration-200 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
    {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 left-0 text-gray-500 hover:text-gray-500 transition-colors"
          aria-label="Close popup"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{title}</h2>

        {/* Image Section */}
        {images && images[0] && ( // Check for images array and first image
          <div className="mb-2 overflow-hidden rounded-md">
            <img src={`https://giveit-backend.onrender.com${images[0]}`} alt={title} className="w-full h-12 object-cover" />
          </div>
        )}

        {/* Details Section */}
        
        <div className=" space-y-4 text-left"> 
        {description && (
            <p className="text-gray-600">
              <span className="font-semibold">&nbsp; Description:</span> {description}
            </p>
        )}
        {ownerName && ownerName !== 'N/A' && (
            <p className="text-gray-600">
                <span className="font-semibold">&nbsp;Owner:</span> {ownerName}
            </p>
        )}
        {address && (
            <p className="text-gray-600">
              <span className="font-semibold">&nbsp;Address:</span> {address}
            </p>
          )}
           {category && (
             <p className="text-gray-600 capitalize">
               <span className="font-semibold">&nbsp;Category:</span> {category}
            </p>
            )}
           {price !== null && (
             <p className="text-gray-600">
               <span className="font-semibold">&nbsp;Price:</span> ${price} per {pricePeriod}
             </p>
           )}
          <p className="text-gray-600">
            <span className="font-semibold">&nbsp;Contact:</span> {phone}
          </p>
        </div>

        {/* Call-to-action button */}
        <button
className="w-full bg-[#8cc9f1] hover:bg-[#7bb8e8] text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out border border-[#7bb8e8] backdrop-blur-sm"          onClick={handleContact}
        >
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default Popup;