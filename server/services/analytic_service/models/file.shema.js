import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    fileId: { type: String, required: true, unique: true }, // ✅ consistent key
    fileName: { type: String },
    sweetviz_html: { type: String },
    ydata_html: { type: String },
    sweetviz_path: { type: String },
    ydata_path: { type: String },
    analyzed: { type: Boolean, default: false },
    success: { type: Boolean },
    message: { type: String },
  },
  { timestamps: true }
);

export const AnalyticsResult = mongoose.model(
  "AnalyticsResult",
  analyticsSchema
);
