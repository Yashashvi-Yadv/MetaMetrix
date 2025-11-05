import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  fileId: { type: String }, // for tracking uploaded file
  filename: { type: String, required: true, unique: true },
  analyzed: { type: Boolean, default: false },
  analysis: { type: Object }, // changed from 'data' to 'analysis'
  analyzedAt: { type: Date },
});

export const AnalyticsResult = mongoose.model(
  "AnalyticsResult",
  analyticsSchema
);
