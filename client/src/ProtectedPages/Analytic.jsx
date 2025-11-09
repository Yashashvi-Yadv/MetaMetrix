import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Analytic.css";

const Analytic = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]); // ✅ chat history
  const [newMessage, setNewMessage] = useState(""); // ✅ current input
  const [sending, setSending] = useState(false);

  const fileId = window.location.pathname.split("/").pop();

  // ✅ Fetch analytics data once
  useEffect(() => {
    if (analytics) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_ANALYTIC_URL}/analyzefile/${fileId}`,
          { withCredentials: true }
        );
        if (res.data?.success) setAnalytics(res.data);
        else setError(res.data?.message || "Unknown error.");
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to fetch analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [fileId]);

  // ✅ Send message to backend
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const msg = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_ANALYTIC_URL}/chat/${fileId}`,
        { message: msg },
        { withCredentials: true }
      );

      if (res.data?.success) {
        setMessages((prev) => [...prev, { sender: "user", message: msg }]);
      } else {
        console.error("⚠️ Chat send failed:", res.data?.message);
      }
    } catch (err) {
      console.error("❌ Chat send error:", err);
    } finally {
      setSending(false);
    }
  };

  // ✅ Shimmer Loading
  if (loading)
    return (
      <div className="analytics-page shimmer-container">
        <div className="card shimmer-card">
          <div className="shimmer-line title"></div>
          <div className="shimmer-line short"></div>
          <div className="shimmer-line"></div>
        </div>
      </div>
    );

  // ✅ Error state
  if (error || !analytics)
    return (
      <div className="analytics-page">
        <div className="card shimmer-not-found">
          <h2>❌ Not Found</h2>
          <p>{error || "Data not available."}</p>
        </div>
      </div>
    );

  const { filename, sweetviz_html, ydata_html } = analytics;

  const createBlobURL = (html) => {
    if (!html) return null;
    const blob = new Blob([html], { type: "text/html" });
    return URL.createObjectURL(blob);
  };

  const sweetvizURL = createBlobURL(sweetviz_html);
  const ydataURL = createBlobURL(ydata_html);

  return (
    <section className="analytics-page">
      {/* ✅ Header */}
      <div className="card header-card">
        <h1>📁 File Report</h1>
        <div className="file-info">
          <div>
            <strong>File ID:</strong> {fileId}
          </div>
          <div className="file-line">
            <strong>Filename:</strong> {filename}
          </div>
        </div>
      </div>

      {/* ✅ Reports Section */}
      <div className="report-section">
        {sweetvizURL && (
          <div className="card reports-card">
            <h2 className="report-title">📊 Sweetviz Report</h2>
            <div className="report-box">
              <object
                data={sweetvizURL}
                type="text/html"
                className="report-object"
              ></object>
            </div>
            <a
              href={sweetvizURL}
              target="_blank"
              rel="noopener noreferrer"
              className="report-link"
            >
              🔗 Open Full Sweetviz Report
            </a>
          </div>
        )}

        {ydataURL && (
          <div className="card reports-card">
            <h2 className="report-title">📈 YData Profiling Report</h2>
            <div className="report-box">
              <object
                data={ydataURL}
                type="text/html"
                className="report-object"
              ></object>
            </div>
            <a
              href={ydataURL}
              target="_blank"
              rel="noopener noreferrer"
              className="report-link"
            >
              🔗 Open Full YData Report
            </a>
          </div>
        )}
      </div>

      {/* ✅ Chat Section */}
      <div className="card chat-card">
        <h2 className="chat-title">💬 Chat About This Report</h2>

        <div className="chat-box">
          {messages.length === 0 ? (
            <p className="muted">No messages yet. Start a discussion!</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.sender}`}>
                <p>{m.message}</p>
              </div>
            ))
          )}
        </div>

        <div className="chat-input-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={sending}
          />
          <button onClick={sendMessage} disabled={sending} className="send-btn">
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>

      {/* ✅ Back Button */}
      <div className="card actions-card">
        <button className="back-btn" onClick={() => window.history.back()}>
          ← Back
        </button>
      </div>
    </section>
  );
};

export default Analytic;
