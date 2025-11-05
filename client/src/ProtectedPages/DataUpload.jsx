import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DataUplaod.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DataUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/data/get-history");
      if (res.data.success) {
        setHistory(res.data.files);
      } else {
        setHistory([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Failed to load upload history.");
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const validExts = [".csv", ".json", ".xlsx", ".xls"];
    const ext = selected.name
      .slice(selected.name.lastIndexOf("."))
      .toLowerCase();

    if (!validExts.includes(ext)) {
      setError("Only CSV, JSON, or Excel files are allowed.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/data/file-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setStatus("Upload complete!");
        setFile(null);
        toast.success(res.data.message || "File uploaded successfully!");
        document.getElementById("file-input").value = "";
        navigate(`/dashboard/analytic/${res.data.file.id}`);
        //fetchHistory();
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setTimeout(() => setStatus(""), 2000);
    }
  };

  // ✅ DELETE history item by ID
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/data/delete-history/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Deleted successfully!");
        setHistory((prev) => prev.filter((item) => item._id !== id)); // update UI instantly
      } else {
        toast.error(res.data.message || "Failed to delete item.");
      }
    } catch (err) {
      console.error("Error deleting history:", err);
      toast.error("Error deleting item. Please try again.");
    }
  };

  return (
    <section className="data-upload-page">
      <div className="upload-container">
        {/* Upload Panel */}
        <div className="upload-panel">
          <h2 className="panel-title">Upload Dataset</h2>
          <p className="panel-subtitle">
            Supports <strong>CSV</strong>, <strong>JSON</strong>,{" "}
            <strong>Excel</strong>
          </p>

          <div
            className="drop-zone"
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange({ target: { files: e.dataTransfer.files } });
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <input
              id="file-input"
              type="file"
              accept=".csv,.json,.xlsx,.xls"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-input" className="drop-label">
              {file ? (
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ) : (
                <>
                  <svg className="upload-icon" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p>
                    Drag & drop or <span className="browse">browse</span>
                  </p>
                </>
              )}
            </label>
          </div>

          {error && <p className="error-msg">{error}</p>}
          {status && <p className="status-text">{status}</p>}

          <button
            onClick={handleUpload}
            disabled={!file}
            className="upload-btn"
          >
            Upload Dataset
          </button>
        </div>

        {/* ✅ History Panel */}
        <div className="history-panel">
          <h2 className="panel-title">Upload History</h2>

          {history.length === 0 ? (
            <div className="no-history">
              <svg className="history-icon" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              <p>No upload history</p>
            </div>
          ) : (
            <ul className="history-list">
              {history.map((item, id) => (
                <li key={id} className="history-item">
                  <div className="file-meta">
                    <span className="file-name">{item.filename}</span>
                    <span className="file-size">{item.size}</span>
                  </div>
                  <div className="upload-meta">
                    <span className="upload-date">{item.mimetype}</span>
                    {item.duration && (
                      <span className="duration">({item.duration})</span>
                    )}
                  </div>

                  {/* ✅ Delete Button */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    🗑 Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default DataUpload;
