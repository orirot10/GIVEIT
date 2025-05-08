const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Import fs module

// Define the upload directory
const uploadDir = path.join(__dirname, '../uploads');

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

const upload = multer({ storage });

module.exports = upload;