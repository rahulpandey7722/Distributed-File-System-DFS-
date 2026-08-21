# Distributed-File-System-DFS-
A scalable Distributed File System built using Node.js, MongoDB (GridFS), and React that supports file upload, download, deletion, and replication. The system implements file chunking and consistent hashing to distribute data across multiple nodes, ensuring fault tolerance and efficient storage management.

# 🚀 Distributed File System (DFS) using MongoDB & React

A full-stack Distributed File System that allows users to upload, store, download, and delete files using a scalable architecture with **Node.js, MongoDB (GridFS), and React**.

---

## 📌 Features

- 📤 Upload any file type (mp4, jpg, pdf, ppt, etc.)
- 📥 Download files seamlessly
- 🗑️ Delete files
- 📂 List all uploaded files
- ⚡ File chunking (splitting large files)
- 🔁 Replication (fault tolerance)
- 🧠 Consistent hashing for node selection
- 🌐 Simple React frontend UI

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (GridFS)
- Mongoose
- Multer

### Frontend
- React.js
 Axios

---

## 📂 Project Structure
-dfs-project/
-│
-├── config/ # MongoDB nodes setup
-├── models/ # File metadata schema
-├── routes/ # API routes
-├── services/ # Hashing & chunk logic
-├── frontend/ # React app
-├── .env # Environment variables
-├── server.js # Entry point
-└── package.json


---

## ⚙️ How It Works

1. File is uploaded via frontend/Postman
2. Backend splits file into chunks
3. Each chunk is:
   - Stored in MongoDB (GridFS)
   - Replicated to another node
4. Metadata is saved in MongoDB
5. On download:
   - Chunks are fetched
   - Reassembled into original file

---

## 🔧 Setup Instructions

---

## 1. Clone Repository

git clone https://github.com/your-username/dfs-project.git(bash)
cd dfs-project

## 2. Install Backend Dependencies
npm install(bash)

## 3. Setup Environment Variables
Create .env file:
MONGO_URI=your_mongodb_connection_string

## 4. Run Backend
node server.js(bash)

## Server will run on:
http://localhost:3000

## 5. Setup Frontend
cd frontend
npm install
npm start

## Frontend will run on:
http://localhost:3001

## 🔌 API Endpoints
Method	Endpoint	          Description
POST	  /api/upload	        Upload file
GET	    /api/download/:id	  Download file
GET	    /api/files	        List files
DELETE	/api/delete/:id	    Delete file

## 🧪 Testing with Postman
Upload File
Method: POST
URL: http://localhost:3000/api/upload
Body → form-data
Key: file (type: File)

## 📸 UI Preview
Upload file
View file list
Download/Delete files
 
## 💡 Future Improvements
✅ File search functionality
✅ Authentication (JWT)
✅ Cloud deployment (AWS)
✅ Progress bar for uploads
✅ Multi-node real distributed setup
🧑‍💻 Author

Rahul Shankar Pandey
B.Tech CSE Student

