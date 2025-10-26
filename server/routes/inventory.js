const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.get('/', inventoryController.getInventory);
router.post('/add', inventoryController.addInventory);
router.post('/deduct', inventoryController.deductInventory);
router.get('/alerts', inventoryController.getLowStockAlerts);

module.exports = router;
