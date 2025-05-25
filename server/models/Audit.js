const mongoose = require("mongoose");

const auditSchema = new mongoose.Schema({
  outletName: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  cleanliness: {
    type: Number,
    required: true,
    min: 1,
    max: 5, // You can adjust this based on your rating scale
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  imageUrls: { type: [String] },
});

const Audit = mongoose.model("Audit", auditSchema);
module.exports = Audit;
