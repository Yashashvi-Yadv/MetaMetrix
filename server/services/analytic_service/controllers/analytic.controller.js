import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import XLSX from "xlsx";
import { AnalyticsResult } from "../models/file.shema.js";

export const analyzeFile = async (req, res) => {
  try {
    const { id } = req.params; // this is your fileId

    // ✅ 1. Define upload directory
    const uploadDir = path.resolve(
      "D:/Projects/MetaMetrix/shared_storage/Uploads"
    );

    if (!fs.existsSync(uploadDir)) {
      return res.status(404).json({
        success: false,
        message: `Upload directory not found at ${uploadDir}`,
      });
    }

    // ✅ 2. Find file by ID prefix
    const files = fs.readdirSync(uploadDir);
    const fileName = files.find((f) => f.startsWith(id));

    if (!fileName) {
      return res.status(404).json({
        success: false,
        message: `File not found for ID: ${id}`,
      });
    }

    const filePath = path.join(uploadDir, fileName);
    const ext = path.extname(fileName).toLowerCase();

    let rows = [];

    // ✅ 3. Parse based on file extension
    if (ext === ".csv") {
      const content = fs.readFileSync(filePath, "utf-8");
      rows = parse(content, { columns: true, skip_empty_lines: true });
    } else if (ext === ".xlsx" || ext === ".xls") {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.SheetNames[0];
      rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    } else if (ext === ".json") {
      const content = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(content);
      rows = Array.isArray(json) ? json : [json];
    } else {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format",
      });
    }

    // ✅ 4. Save or update MongoDB entry
    const existing = await AnalyticsResult.findOne({ filename: fileName });

    if (existing) {
      existing.analysis = { data: rows };
      existing.analyzed = true;
      existing.analyzedAt = new Date();
      await existing.save();
      console.log(`♻️ Updated existing analytics record for ${fileName}`);
    } else {
      await AnalyticsResult.create({
        fileId: id, // ✅ correct field
        filename: fileName,
        analyzed: true,
        analyzedAt: new Date(),
        analysis: { data: rows }, // ✅ matches schema
      });
    }

    // ✅ 5. Respond with analysis summary
    res.json({
      success: true,
      message: "File analyzed and saved to database successfully",
      filename: fileName,
      totalRows: rows.length,
      totalColumns: Object.keys(rows[0] || {}).length,
      sampleData: rows.slice(0, 5),
    });
  } catch (err) {
    console.error("❌ Analysis Error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
