import React from "react";

const FileTable = ({ files, onDelete, onDownload }) => {
  return (
    <div style={{ marginTop: "20px", color: "white" }}>
      <h3>Files</h3>

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan="2">No files</td>
            </tr>
          ) : (
            files.map((file) => (
              <tr key={file._id}>
                <td>{file.filename}</td>
                <td>
                  <button onClick={() => onDownload(file._id)}>
                    Download
                  </button>

                  <button
                    onClick={() => onDelete(file._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;