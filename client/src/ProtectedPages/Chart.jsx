// ✅ UploadPlotly.jsx — Multi-Series Plotly + Sample Data Support

import React, { useState, useMemo } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function UploadPlotly({ sampleData = [] }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xCol, setXCol] = useState("");
  const [yCols, setYCols] = useState([]);

  // ✅ Parse CSV, JSON, Excel Upload
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") parseCSV(file);
    else if (["xlsx", "xls"].includes(ext)) parseExcel(file);
    else if (ext === "json") parseJSON(file);
    else alert("❌ Unsupported file type");
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: (res) => onDataParsed(res.data),
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "array" });
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      onDataParsed(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const parseJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => onDataParsed(JSON.parse(e.target.result));
    reader.readAsText(file);
  };

  // ✅ Parse Backend Sample Data
  const loadSampleData = () => {
    if (!sampleData.length) {
      alert("⚠ No sample data found!");
      return;
    }

    const key = Object.keys(sampleData[0])[0];
    const headers = key.split(";");

    const rows = sampleData.slice(1).map((r) => {
      const vals = Object.values(r)[0].split(";");
      return Object.fromEntries(headers.map((h, i) => [h, vals[i]]));
    });

    onDataParsed(rows);
  };

  const onDataParsed = (rows) => {
    const valid = rows.filter((r) => Object.values(r).some((v) => v !== ""));
    setData(valid);

    const keys = Object.keys(valid[0] || {});
    setColumns(keys);
    setXCol(keys[0]);
    setYCols(keys.slice(1));
  };

  // ✅ Generate Multi-Series Plot Data
  const chartData = useMemo(() => {
    return yCols.map((col) => ({
      x: data.map((d) => d[xCol]),
      y: data.map((d) => parseFloat(d[col])),
      type: "scatter",
      mode: "lines+markers",
      name: col,
    }));
  }, [data, xCol, yCols]);

  return (
    <div style={{ width: "100%", padding: "1rem", color: "white" }}>
      <h3>📊 Select Data Source</h3>

      <label style={{ marginRight: "10px" }}>
        <input
          type="radio"
          name="datasource"
          defaultChecked
          onChange={() => setData([])}
        />{" "}
        Upload File
      </label>

      <label>
        <input type="radio" name="datasource" onChange={loadSampleData} /> Use
        Sample Data
      </label>

      <br />
      <br />

      <input
        id="fileInput"
        type="file"
        accept=".csv,.json,.xlsx,.xls"
        onChange={handleFile}
      />

      {/* ✅ Axis Select UI */}
      {columns.length > 1 && (
        <>
          <div style={{ marginTop: "1rem" }}>
            <strong>X-Axis: </strong>
            <select value={xCol} onChange={(e) => setXCol(e.target.value)}>
              {columns.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <strong>Y-Axis: </strong>
            <select
              multiple
              value={yCols}
              onChange={(e) =>
                setYCols([...e.target.selectedOptions].map((o) => o.value))
              }
            >
              {columns.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* ✅ Final Dynamic Chart */}
          <Plot
            data={chartData}
            layout={{
              title: `📈 ${xCol} vs Multiple Series`,
              paper_bgcolor: "#0f172a",
              plot_bgcolor: "#0f172a",
              font: { color: "#fff" },
            }}
            config={{ responsive: true }}
            style={{ width: "100%", height: "450px" }}
          />
        </>
      )}
    </div>
  );
}
