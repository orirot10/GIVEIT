const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs module

// Define the upload directory using absolute path
const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
},
filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
},
});

// Add file filter to only allow images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;