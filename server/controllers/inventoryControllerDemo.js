// 内存中的库存数据存储
let inventoryData = [];

exports.getInventory = async (req, res) => {
  try {
    res.json({ success: true, data: inventoryData });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.addInventory = async (req, res) => {
  try {
    const { partName, partModel, inboundQuantity, safetyStock } = req.body;
    let item = inventoryData.find(i => i.partName === partName && i.partModel === partModel);
    
    if (item) {
      item.currentStock += inboundQuantity;
      item.inboundQuantity = inboundQuantity;
      item.inboundTime = new Date();
    } else {
      item = {
        _id: Date.now().toString(),
        partName,
        partModel,
        currentStock: inboundQuantity,
        safetyStock: safetyStock || 200,
        inboundTime: new Date(),
        inboundQuantity,
        outboundTime: null,
        outboundQuantity: 0,
        outboundPerson: '',
        outboundRemark: ''
      };
      inventoryData.push(item);
    }
    
    item.lowStockAlert = item.currentStock < (item.safetyStock || 200);
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.deductInventory = async (req, res) => {
  try {
    const { partName, partModel, quantity, outboundPerson, remark } = req.body;
    const item = inventoryData.find(i => i.partName === partName && i.partModel === partModel);
    
    if (!item || item.currentStock < quantity) {
      return res.status(400).json({ success: false, error: '库存不足' });
    }
    
    item.currentStock -= quantity;
    item.outboundTime = new Date();
    item.outboundQuantity = quantity;
    item.outboundPerson = outboundPerson;
    item.outboundRemark = remark;
    item.lowStockAlert = item.currentStock < (item.safetyStock || 200);
    
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.getLowStockAlerts = async (req, res) => {
  try {
    const alerts = inventoryData.filter(i => i.lowStockAlert);
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
