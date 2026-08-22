import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const loadFiles = async () => {
    const res = await axios.get(API + "/files");
    setFiles(res.data);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const uploadFile = async () => {
    if (!file) return alert("Select file first");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(API + "/upload", formData);
    setFile(null);
    loadFiles();
  };

  const deleteFile = async (id) => {
    await axios.delete(API + "/delete/" + id);
    loadFiles();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>DFS File Manager</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      <h3>Files:</h3>

      {files.map((f) => (
        <div key={f._id}>
          {f.filename}
          <button onClick={() => window.open(API + "/download/" + f._id)}>
            Download
          </button>
          <button onClick={() => deleteFile(f._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;