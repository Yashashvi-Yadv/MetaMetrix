import multer from "multer";
import path from "path";
import fs from "fs";
import FileModel from "../models/file.shema.js";

// ✅ Shared storage directory (don’t change this if you already use it)
const uploadDir = "../../../shared_storage/Uploads/";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // temporary unique filename
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ✅ Export multer instance
export const upload = multer({ storage });

// ✅ Upload controller
export const file_upload = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // 1️⃣ Create temporary DB entry with placeholders (we’ll rename the file soon)
    const tempDoc = new FileModel({
      filename: "temp", // will be replaced
      path: "temp", // will be replaced
      mimetype: req.file.mimetype,
      size: req.file.size,
      userId: req.user?._id || null,
    });
    await tempDoc.save();

    // 2️⃣ Rename file using MongoDB ID
    const ext = path.extname(req.file.originalname);
    const newFileName = `${tempDoc._id}${ext}`;
    const oldPath = req.file.path;
    const newPath = path.join(uploadDir, newFileName);

    fs.renameSync(oldPath, newPath);

    // 3️⃣ Update DB with actual filename + path
    tempDoc.filename = req.file.originalname; // actual name user uploaded
    tempDoc.path = newPath;
    await tempDoc.save();

    res.json({
      success: true,
      message: "File uploaded successfully",
      file: {
        id: tempDoc._id,
        filename: tempDoc.filename,
        path: tempDoc.path,
      },
    });
  } catch (err) {
    console.error("File upload failed:", err);
    res
      .status(500)
      .json({ success: false, message: "Upload failed", error: err.message });
  }
};

// ✅ Fetch upload history
export const get_history = async (req, res) => {
  try {
    const files = await FileModel.find().sort({ createdAt: -1 });
    res.json({ success: true, files });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch history" });
  }
};

// ✅ Delete history item
export const delete_history = async (req, res) => {
  try {
    const file = await FileModel.findById(req.params.id);
    if (!file)
      return res
        .status(404)
        .json({ success: false, message: "File not found" });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    await FileModel.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
