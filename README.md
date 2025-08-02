# PhileHub - Simple File Sharing

A minimal web-based file sharing application.

## Features

- 📁 **File Operations**: Upload (10MB max), download, list files
- 🎨 **Responsive UI**: Clean Bootstrap 5 interface
- 🚀 **Drag & Drop**: Easy file uploads
- 💾 **In-Memory Storage**: No persistent database

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Open http://localhost:3000

## API Endpoints

- `POST /api/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/download/:filename` - Download file

## Features

- No authentication required
- File size limits (10MB)
- Simple drag & drop interface