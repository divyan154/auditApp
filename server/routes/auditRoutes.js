const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const supabase = require("../utils/supabase");
const Audit = require("../models/Audit");

router.post("/audit", upload.array("images"), async (req, res) => {
  try {
    const { outletName, location, cleanliness } = req.body;
    const uploadedUrls = [];

    for (const file of req.files) {
      const { originalname, buffer } = file;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(`${Date.now()}_${originalname}`, buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const publicURL = supabase.storage.from("uploads").getPublicUrl(data.path)
        .data.publicUrl;

      uploadedUrls.push(publicURL);
    }

    const newAudit = new Audit({
      outletName,
      location,
      cleanliness,
      imageUrls: uploadedUrls, // You may need to adjust schema
    });

    await newAudit.save();
    res.status(201).send("Audit received successfully");
  } catch (err) {
    console.error("Error saving audit:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
