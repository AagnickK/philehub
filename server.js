const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// In-memory file storage
const files = [];

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use(express.static('public'));

// API Routes
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const fileInfo = {
    id: Date.now().toString(),
    filename: req.file.originalname,
    storedName: req.file.filename,
    size: req.file.size,
    uploaded: Date.now()
  };
  
  files.push(fileInfo);
  res.json(fileInfo);
});

app.get('/api/files', (req, res) => {
  res.json(files);
});

app.get('/api/download/:filename', (req, res) => {
  const { filename } = req.params;
  const file = files.find(f => f.storedName === filename);
  
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  const filePath = path.join(__dirname, 'uploads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  res.download(filePath, file.filename);
});

app.listen(PORT, () => {
  console.log(`PhileHub running on http://localhost:${PORT}`);
});