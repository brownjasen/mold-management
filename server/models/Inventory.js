const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  partName: { type: String, required: true },
  partModel: String,
  currentStock: { type: Number, default: 0 },
  safetyStock: { type: Number, default: 200 },
  inboundTime: Date,
  inboundQuantity: Number,
  inboundPerson: String,
  outboundTime: Date,
  outboundQuantity: Number,
  outboundPerson: String,
  outboundRemark: String,
  lowStockAlert: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
