import React, { useState } from "react";
import { uploadFile } from "../services/api";

const UploadBox = ({ refreshFiles }) => {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // ⚠️ MUST BE "file"

    try {
      console.log("Uploading...");
      await uploadFile(formData);
      alert("Upload successful ✅");
      if (refreshFiles) refreshFiles();
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Upload File</h3>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
};

export default UploadBox;