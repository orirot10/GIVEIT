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
    if (!ownerId) {
      console.error("Cannot start conversation: Owner ID is missing from the item.");
      // Optionally show an error message to the user
      return;
    }
    if (!user) {
        console.error("Cannot start conversation: User not logged in.");
        // Optionally redirect to login or show a message
        return;
      }

    if (ownerId === user.user.id) {
        console.log("Cannot start conversation with yourself.");
        // Optionally show a message to the user
        return;
    }

    console.log(`Navigating to messages to chat with owner: ${ownerId}`);
    // Navigate to the messages page, passing the ownerId, itemTitle, and a flag
    navigate('/messages', {
      state: {
        contactId: ownerId,
        itemTitle: title, // Pass the item title
        initialMessage: true // Add a flag to trigger the message
      }
    });
    onClose(); // Close the popup after navigating
  };

  return (
    // Semi-transparent overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 transition-opacity duration-300 ease-in-out">
    {/* Popup container */}
    <div className="bg-white rounded-md shadow-lg px-7 py-6 w-full max-w-xs relative transform transition-all duration-200 ease-in-out scale-95 opacity-0 animate-fade-in-scale">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 left-0 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close popup"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{title}</h2>

        {/* Image Section */}
        {images && images[0] && ( // Check for images array and first image
          <div className="mb-4 overflow-hidden rounded-md">
            <img src={`http://localhost:5000${images[0]}`} alt={title} className="w-full h-12 object-cover" />
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-2 mb-4 px-2 text-center">
        {description && (
            <p className="text-gray-600">
              <span className="font-semibold">Description:</span> {description}
            </p>
        )}
        {ownerName && ownerName !== 'N/A' && (
            <p className="text-gray-600">
                <span className="font-semibold">Owner:</span> {ownerName}
            </p>
        )}
        {address && (
            <p className="text-gray-600">
              <span className="font-semibold">Address:</span> {address}
            </p>
          )}
           {category && (
             <p className="text-gray-600 capitalize">
               <span className="font-semibold">Category:</span> {category}
            </p>
            )}
           {price !== null && (
             <p className="text-gray-600">
               <span className="font-semibold">Price:</span> ${price} per {pricePeriod}
             </p>
           )}
          <p className="text-gray-600">
            <span className="font-semibold">Contact:</span> {phone}
          </p>
        </div>

        {/* Call-to-action button */}
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
          onClick={handleContact}
        >
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default Popup;