# 🚀 Distributed File System (DFS)

A scalable **Distributed File System** built using **Node.js, MongoDB (GridFS), and React** that supports file upload, download, deletion, and replication.

The system implements **file chunking + consistent hashing** to distribute data across multiple nodes, ensuring **fault tolerance and efficient storage**.

---
## 🚀 Live Demo

🌐 Demo: https://distributed-file-system-dfs.vercel.app  

## 📌 Features

- Upload files
- Download files
- Delete files
- Distributed storage using consistent hashing
- File chunking and replication

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
- Axios
- React Router

---

## 📂 Project Structure
```

dfs-project/
├── config/
│ └── nodes.js # GridFS nodes setup
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── App.js
│ │ └── index.js
│ └── package.json
├── models/
│ └── FileManifest.js
├── routes/
│ ├── upload.js
│ ├── download.js
│ ├── files.js
├── services/
│ ├── chunkService.js
│ └── hashRing.js
├── .env
├── server.js
├── package.json
```

---

## ⚙️ How It Works

1. File is uploaded via frontend/Postman  
2. Backend splits file into chunks  
3. Each chunk:
   - Stored in MongoDB (GridFS)  
   - Replicated to another node  
4. Metadata is stored in MongoDB   
5. On download:  
   - Chunks are fetched  
   - Reassembled into original file    

---

## 🔧 Setup Instructions

## 1. Clone Repository
```bash
git clone https://github.com/rahulpandey7722/dfs-project.git
cd dfs-project
```
## 2. Install Backend Dependencies
```
npm install
```
## 3. Setup Environment Variables

Create .env file:
```
MONGO_URI=your_mongodb_connection_string
```
## 4. Run Backend
```
node server.js
```

Backend runs on:
```
http://localhost:3001
```
👉 The server automatically handles port conflicts and shifts port if needed

## 5. Setup Frontend
cd frontend
npm install
npm start

Frontend runs on:
```
http://localhost:3000
```
## 🔌 API Endpoints 

| Method | Endpoint          | Access           | Description                              |
| ------ | ----------------- | ---------------- | ---------------------------------------- |
| POST   | /api/auth/signup  | Public           | Register new user account                |
| POST   | /api/auth/login   | Public           | Authenticate user & return JWT Token     |
| GET    | /api/auth/me      | Protected (JWT)  | Get current user profile                 |
| POST   | /api/upload       | Protected (JWT)  | Upload file (sets `owner` to user ID)    |
| GET    | /api/download/:id | Protected/Token  | Download file                            |
| GET    | /api/view/:id     | Protected/Token  | Stream/view file inline in browser modal |
| GET    | /api/files        | Protected (JWT)  | List user files (`?scope=my` or `all`)   |
| DELETE | /api/delete/:id   | Protected (Owner)| Delete file (ONLY allowed for owner)     |

---

## 🔒 Security & Authorization Architecture

### 1. User Authentication (JWT + Bcrypt)
- Users register via `/api/auth/signup` and sign in via `/api/auth/login`.
- Passwords are hashed using `bcryptjs` before being saved to MongoDB.
- Backend issues a signed JSON Web Token (JWT) valid for 7 days.
- Requests pass the token in header: `Authorization: Bearer <token>`.

### 2. User-Specific Authorization (Data Isolation)
- Every uploaded file stores an `owner` reference linking to the uploading user's ID (`models/FileManifest.js`).
- When a user requests to delete a file (`DELETE /api/delete/:id`), the backend verifies:
  ```js
  if (!file.owner || !file.owner.equals(req.user._id)) {
    return res.status(403).json({ message: "Unauthorized: You can only delete files that you own!" });
  }
  ```
- If a user attempts to delete a file owned by another user, the request is rejected with `403 Forbidden`.


## 🧪 Testing with Postman

1. Upload File  
Method: POST  
URL: http://localhost:3001/api/upload  
Body → form-data  
Key: file (type: File)
 
2. Download File  
GET http://localhost:3001/api/download/<file_id>

3. List Files  
GET http://localhost:3001/api/files

4. Delete File  
DELETE http://localhost:3001/api/delete/<file_id>  

## 📊 System Architecture  
Files are split into chunks  
Each chunk is distributed using consistent hashing  
Replication ensures:  
Fault tolerance  
High availability  
MongoDB GridFS acts as distributed storage nodes  

## 🧠 Core Concepts Used  
Distributed Systems  
Consistent Hashing  
Fault Tolerance  
Data Replication  
Chunk-based Storage  
GridFS (MongoDB)  

## 📸 UI Features  
Upload files  
View file list  
Download/Delete files  
Sidebar navigation  
Dashboard overview  

## Author  
Rahul Shankar Pandey  
B.Tech CSE Student  
