import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true }, // Mongo _id based name
  originalName: { type: String }, // user’s uploaded name
  path: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("files", fileSchema);
