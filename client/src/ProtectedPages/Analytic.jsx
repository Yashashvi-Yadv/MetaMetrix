// ✅ Analytic.jsx — Clean + Works with Plotly ChartDisplay

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Analytic.css";
import UploadPlotly from "../ProtectedPages/Chart";

const Analytic = () => {
  const [analytics, setAnalytics] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fileId = window.location.pathname.split("/").pop();

  useEffect(() => {
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
        console.error("Fetch error:", err);
        setError("Failed to fetch analytics.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [fileId]);

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

  if (error || !analytics)
    return (
      <div className="analytics-page">
        <div className="card shimmer-not-found">
          <h2>❌ Not Found</h2>
          <p>{error || "Data not available."}</p>
        </div>
      </div>
    );

  const { filename, totalRows, totalColumns, sampleData } = analytics;

  return (
    <section className="analytics-page">
      {/* ✅ Header */}
      <div className="card header-card">
        <h1>📊 File Analytics</h1>
        <div className="file-info">
          <div>
            <strong>File ID:</strong> {fileId}
          </div>
          <div>
            <strong>Filename:</strong> {filename}
          </div>
        </div>
      </div>

      {/* ✅ Summary */}
      <div className="card summary-card">
        <h2>Summary</h2>
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-value">{totalRows}</div>
            <div className="summary-label">Rows</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{totalColumns}</div>
            <div className="summary-label">Columns</div>
          </div>
        </div>
      </div>

      {/* ✅ Sample Preview Table */}
      <div className="card sample-card">
        <h2>Sample Data</h2>
        <SamplePreview sampleData={sampleData} />
      </div>

      {/* ✅ Plotly Chart Section */}
      <div className="card chart-card">
        <h2>Generated Charts</h2>
        {!showChart ? (
          <button className="show-chart-btn" onClick={() => setShowChart(true)}>
            Show Charts
          </button>
        ) : (
          <UploadPlotly sampleData={sampleData} />
        )}
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

// ✅ Table component for sample preview
function SamplePreview({ sampleData }) {
  if (!sampleData || sampleData.length < 2)
    return <div className="muted">No sample available</div>;

  const key = Object.keys(sampleData[0])[0];
  const headers = key.split(";");

  const rows = sampleData
    .slice(1)
    .map((obj) => Object.values(obj)[0].split(";"));

  return (
    <div className="table-wrap">
      <table className="sample-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
