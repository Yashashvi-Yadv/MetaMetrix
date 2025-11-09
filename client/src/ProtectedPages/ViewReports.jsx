// src/pages/ViewReports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/DataUplaod.css";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ViewReports = () => {
  const navigate = useNavigate();
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

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/data/delete-history/${id}`
      );
      if (res.data.success) {
        toast.success(res.data.message || "Deleted successfully!");
        setHistory((prev) => prev.filter((item) => item._id !== id));
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
              {history.map((item) => (
                <li
                  key={item._id}
                  className="history-item"
                  onClick={() => navigate(`/dashboard/analytic/${item._id}`)}
                  style={{ cursor: "pointer" }}
                >
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

                  {/* ✅ Prevent delete click from triggering navigation */}
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item._id);
                    }}
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

export default ViewReports;
