import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "text/csv",
    "application/json",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only CSV, JSON, and Excel are allowed."),
      false,
    );
  }
};

export const uploadFile = multer({
  storage: storage,
  limits: { fileSize: 4 * 1024 * 1024 }, // 4 MB limit
  fileFilter: fileFilter,
}).single("file");
