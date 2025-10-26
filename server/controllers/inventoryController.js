const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json({ success: true, data: inventory });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.addInventory = async (req, res) => {
  try {
    const { partName, partModel, inboundQuantity, safetyStock } = req.body;
    let item = await Inventory.findOne({ partName, partModel });
    
    if (item) {
      item.currentStock += inboundQuantity;
      item.inboundQuantity = inboundQuantity;
      item.inboundTime = new Date();
    } else {
      item = new Inventory({
        partName,
        partModel,
        currentStock: inboundQuantity,
        safetyStock: safetyStock || 200,
        inboundTime: new Date(),
        inboundQuantity
      });
    }
    
    item.lowStockAlert = item.currentStock < (item.safetyStock || 200);
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deductInventory = async (req, res) => {
  try {
    const { partName, partModel, quantity, outboundPerson, remark } = req.body;
    const item = await Inventory.findOne({ partName, partModel });
    
    if (!item || item.currentStock < quantity) {
      return res.status(400).json({ success: false, error: 'Insufficient stock' });
    }
    
    item.currentStock -= quantity;
    item.outboundTime = new Date();
    item.outboundQuantity = quantity;
    item.outboundPerson = outboundPerson;
    item.outboundRemark = remark;
    item.lowStockAlert = item.currentStock < (item.safetyStock || 200);
    
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const alerts = await Inventory.find({ lowStockAlert: true });
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
