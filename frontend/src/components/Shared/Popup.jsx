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
    street = '',
    city = '',
    state = '',
    zipCode = '',
    phone = 'Contact Info Unavailable',
    image = '', // Assuming 'image' holds the URL or is empty/null
    category = 'General', // Example default, adjust as needed
    price = null, // Example default, adjust as needed
    ownerId = null // Assuming item has an ownerId - ADJUST IF FIELD NAME IS DIFFERENT
  } = item;

  const address = [street, city, state, zipCode].filter(Boolean).join(', ');

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
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close popup"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>

        {/* Image Section */}
        {image && (
          <div className="mb-4 overflow-hidden rounded-md">
            <img src={image} alt={title} className="w-full h-48 object-cover" />
          </div>
        )}

        {/* Details Section */}
        <div className="space-y-2 mb-4 px-2">
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
               <span className="font-semibold">Price:</span> ${price}
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