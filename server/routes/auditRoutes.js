const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5, // max 5 files
  },
});

const supabase = require("../utils/supabase");
const Audit = require("../models/Audit");
const authenticateToken = require("../middleware");

router.post(
  "/audit",
  authenticateToken,
  upload.array("images"),
  async (req, res) => {
    try {
      // Get the user token from cookies/headers
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).send("Missing authentication token");
      }

      // Process file uploads
      const uploadedUrls = [];
      console.log("req.files", req.files);
      for (const file of req.files) {
        const filename = `${Date.now()}_${file.originalname}`;

        const { data, error } = await supabase.storage
          .from("uploads")
          .upload(filename, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) {
          console.error("Supabase upload error:", error);
          throw error;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("uploads").getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      // Save to MongoDB Atlas
      const newAudit = new Audit({
        ...req.body,
        imageUrls: uploadedUrls,
        userId: req.user.id, // Ensure your authenticateToken middleware sets this
      });

      await newAudit.save();
      res.status(201).json({ success: true, audit: newAudit });
    } catch (err) {
      console.error("Error in audit creation:", err);
      res.status(500).json({
        error: "Failed to create audit",
        details: err.message,
      });
    }
  }
);

module.exports = router;
