const express = require('express');
const router = express.Router();
const moldController = require('../controllers/moldController');

router.post('/create', moldController.createMold);
router.get('/list', moldController.getMoldList);
router.get('/detail/:id', moldController.getMoldDetail);
router.put('/update-stage', moldController.updateStageStatus);
router.put('/reprioritize', moldController.reprioritizeMold);
router.post('/add-repair', moldController.addRepair);

module.exports = router;
