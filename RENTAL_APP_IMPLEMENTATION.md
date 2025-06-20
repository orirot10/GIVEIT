# Full-Stack Rental App Implementation

This document outlines the complete implementation of a rental app with Firebase Authentication, Firebase Storage, Firestore messaging, and MongoDB for structured data.

## Architecture Overview

### Frontend (React)
- **Firebase Authentication**: User signup/login with email/password and Google OAuth
- **Firebase Storage**: Image uploads for listings and profiles
- **Firestore**: Real-time messaging between users
- **React Context**: Authentication state management

### Backend (Node.js/Express)
- **Firebase Admin SDK**: Token verification and user management
- **MongoDB**: Structured data storage (users, listings, etc.)
- **Express Middleware**: Authentication protection for API routes

## Key Components

### 1. Authentication Flow

#### Frontend (`AuthContext.jsx`)
```javascript
// Firebase Authentication with token management
const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  // Store token for API calls
};
```

#### Backend (`authMiddleware.js`)
```javascript
// Verify Firebase token and sync with MongoDB
const decodedToken = await auth.verifyIdToken(token);
let mongoUser = await User.findOne({ firebaseUid: decodedToken.uid });
if (!mongoUser) {
  // Create user in MongoDB
}
```

### 2. Image Upload System

#### Component (`ImageUpload.jsx`)
```javascript
// Upload to Firebase Storage and get download URL
const handleFileUpload = async (files) => {
  const uploadPromises = files.map(async (file) => {
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  });
  const urls = await Promise.all(uploadPromises);
  onImageUpload(urls);
};
```

### 3. Real-time Messaging

#### Chat Component (`RealtimeChat.jsx`)
```javascript
// Firestore real-time messaging
const chatId = [user.uid, otherUserId].sort().join('_');
const messagesRef = collection(db, 'chats', chatId, 'messages');
const q = query(messagesRef, orderBy('timestamp', 'asc'));

const unsubscribe = onSnapshot(q, (snapshot) => {
  const messageList = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  setMessages(messageList);
});
```

### 4. Protected API Routes

#### Example: Create Listing
```javascript
// Frontend
const response = await fetch('/api/rentals', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  },
  body: JSON.stringify(listingData)
});

// Backend
router.post('/', protect, async (req, res) => {
  // req.user contains Firebase UID and MongoDB user data
  const newRental = await Rental.create({
    firebaseUid: req.user.uid,
    ...req.body
  });
});
```

## Data Models

### MongoDB User Model
```javascript
{
  firebaseUid: String, // Links to Firebase Auth
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  city: String,
  photoURL: String, // Firebase Storage URL
  createdAt: Date
}
```

### MongoDB Rental Model
```javascript
{
  firebaseUid: String, // Owner's Firebase UID
  title: String,
  description: String,
  category: String,
  price: Number,
  images: [String], // Firebase Storage URLs
  location: String,
  status: String,
  createdAt: Date
}
```

### Firestore Chat Structure
```
chats/{chatId}
├── participants: [uid1, uid2]
├── participantNames: {uid1: "Name1", uid2: "Name2"}
├── lastMessage: String
├── lastMessageTime: Timestamp
└── messages/{messageId}
    ├── text: String
    ├── senderId: String
    ├── senderName: String
    └── timestamp: Timestamp
```

## Key Features Implemented

### ✅ Authentication
- Firebase Auth with email/password and Google OAuth
- JWT token verification on backend
- Automatic MongoDB user creation/sync

### ✅ Image Upload
- Firebase Storage integration
- Multiple image upload support
- URL storage in MongoDB

### ✅ Real-time Messaging
- Firestore-based chat system
- Real-time message updates
- Chat list with last message preview

### ✅ Protected API Routes
- Firebase token verification middleware
- MongoDB user data access
- Secure CRUD operations

### ✅ User Interface
- Profile editing with image upload
- Listing creation forms
- Chat interface
- Dashboard with all features

## Usage Instructions

### 1. Start a Chat
```javascript
// From any listing, users can click "Contact Owner"
<ContactButton 
  ownerId={listing.firebaseUid}
  ownerName={listing.firstName}
  listingTitle={listing.title}
/>
```

### 2. Create a Listing
```javascript
// Dashboard includes modal forms for rentals/services
<ListingForm 
  type="rental" 
  onSuccess={handleListingSuccess}
/>
```

### 3. Upload Images
```javascript
// Integrated into forms and profile editing
<ImageUpload 
  onImageUpload={handleImageUpload} 
  multiple={true} 
/>
```

## API Endpoints

### Authentication
- `GET /api/test/protected` - Test protected route
- `GET /api/test/public` - Test public route

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Listings
- `POST /api/rentals` - Create rental listing
- `GET /api/rentals` - Get all rentals
- `GET /api/rentals/user` - Get user's rentals

## Security Features

1. **Firebase Token Verification**: All protected routes verify Firebase ID tokens
2. **MongoDB User Sync**: Automatic user creation and data synchronization
3. **CORS Configuration**: Proper cross-origin request handling
4. **Input Validation**: Server-side validation for all inputs
5. **File Upload Security**: Secure image upload with Firebase Storage

## Testing the Implementation

1. **Authentication Test**:
   ```bash
   # Get token from frontend localStorage
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5173/api/test/protected
   ```

2. **Create Listing Test**:
   ```bash
   curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN" \
   -d '{"title":"Test Item","description":"Test","category":"Electronics","price":50,"location":"Test City"}' \
   http://localhost:5173/api/rentals
   ```

3. **Real-time Chat Test**:
   - Login with two different accounts
   - Create a listing with one account
   - Contact the owner from the other account
   - Verify real-time message delivery

This implementation provides a complete full-stack rental application with modern authentication, real-time features, and secure data handling.