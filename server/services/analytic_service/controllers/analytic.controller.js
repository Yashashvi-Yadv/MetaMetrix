import fs from "fs";
import path from "path";
import axios from "axios";
import { AnalyticsResult } from "../models/file.shema.js";

export const analyzeFile = async (req, res) => {
  try {
    const { id } = req.params;

    const uploadDir = path.resolve(
      "D:/Projects/MetaMetrix/shared_storage/Uploads"
    );

    const files = fs.readdirSync(uploadDir);
    const fileName = files.find((f) => f.startsWith(id));

    if (!fileName) {
      return res.status(404).json({
        success: false,
        message: `File not found for ID: ${id}`,
      });
    }

    const fname = fileName.split(".")[0];

    // ✅ Check existing record
    const existingReport = await AnalyticsResult.findOne({ fileId: fname });

    if (existingReport && existingReport.analyzed) {
      console.log(`🟢 Returning cached analysis for ${fname}`);
      return res.status(200).json({
        success: true,
        message: `Cached report fetched for ${fname}`,
        ...existingReport.toObject(),
      });
    }

    // ✅ Call Django
    const djangoUrl = `http://127.0.0.1:8000/reports/analyze/${fname}`;
    console.log(`🧠 Sending request to Django: ${djangoUrl}`);

    const response = await axios.get(djangoUrl, {
      headers: { Accept: "application/json" },
    });

    const {
      success,
      message,
      file_name,
      sweetviz_html,
      ydata_html,
      sweetviz_path,
      ydata_path,
    } = response.data;

    // ✅ Save or Update
    const newReport = await AnalyticsResult.findOneAndUpdate(
      { fileId: fname },
      {
        fileId: fname,
        fileName: file_name,
        sweetviz_html,
        ydata_html,
        sweetviz_path,
        ydata_path,
        analyzed: true,
        message,
        success,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Report saved for ${fname}`);

    res.status(200).json({
      success: true,
      message: `Reports generated successfully for ${file_name}`,
      ...newReport.toObject(),
    });
  } catch (err) {
    console.error("❌ Error in analyzeFile:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
