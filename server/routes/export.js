const express = require('express');
const router = express.Router();
const ExportService = require('../services/ExportService');
const { sendFile } = require('../utils/fileHandler');

/**
 * 导出模具数据为 Excel
 */
router.post('/export/molds/excel', async (req, res) => {
  try {
    const { moldsData, title = '模具数据导出' } = req.body;

    if (!Array.isArray(moldsData)) {
      return res.status(400).json({ 
        success: false, 
        error: '数据格式不正确' 
      });
    }

    // 清理敏感数据，保留必要字段
    const cleanedData = moldsData.map(mold => ({
      ID: mold.id,
      '名称': mold.name,
      '型号': mold.model,
      '状态': mold.status,
      '使用次数': mold.usageCount,
      '最后检修': mold.lastMaintenance,
      '创建日期': mold.createdAt
    }));

    const filename = `moldsData_${Date.now()}.xlsx`;
    const filepath = await ExportService.exportToExcel(
      cleanedData,
      filename,
      '模具数据'
    );

    res.download(filepath, filename, (err) => {
      if (err) console.error('下载失败:', err);
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * 导出模具数据为 PDF
 */
router.post('/export/molds/pdf', async (req, res) => {
  try {
    const { moldsData, title = '模具数据导出' } = req.body;

    if (!Array.isArray(moldsData)) {
      return res.status(400).json({ 
        success: false, 
        error: '数据格式不正确' 
      });
    }

    // 数据清理
    const cleanedData = moldsData.map(mold => ({
      'ID': mold.id,
      '名称': mold.name,
      '型号': mold.model,
      '状态': mold.status,
      '使用次数': mold.usageCount
    }));

    const filename = `moldsData_${Date.now()}.pdf`;
    const filepath = await ExportService.exportToPDF(
      cleanedData,
      filename,
      title
    );

    res.download(filepath, filename, (err) => {
      if (err) console.error('下载失败:', err);
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * 导出库存数据为 Excel
 */
router.post('/export/inventory/excel', async (req, res) => {
  try {
    const { inventoryData, title = '库存数据导出' } = req.body;

    if (!Array.isArray(inventoryData)) {
      return res.status(400).json({ 
        success: false, 
        error: '数据格式不正确' 
      });
    }

    // 数据清理
    const cleanedData = inventoryData.map(item => ({
      '物品名称': item.name,
      '物品编码': item.code,
      '数量': item.quantity,
      '单位': item.unit,
      '存放位置': item.location,
      '最后更新': item.updatedAt
    }));

    const filename = `inventoryData_${Date.now()}.xlsx`;
    const filepath = await ExportService.exportToExcel(
      cleanedData,
      filename,
      '库存数据'
    );

    res.download(filepath, filename, (err) => {
      if (err) console.error('下载失败:', err);
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * 导出统计报告
 */
router.post('/export/report', async (req, res) => {
  try {
    const { 
      title = '统计报告', 
      summary = {},
      details = []
    } = req.body;

    const stats = { summary, details };
    const filename = `report_${Date.now()}.xlsx`;

    const filepath = await ExportService.exportStatisticsReport(
      stats,
      filename,
      title
    );

    res.download(filepath, filename, (err) => {
      if (err) console.error('下载失败:', err);
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * 批量导出多个数据集
 */
router.post('/export/batch', async (req, res) => {
  try {
    const { datasets = [] } = req.body;

    if (!Array.isArray(datasets) || datasets.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '数据集不能为空' 
      });
    }

    // 这里可以返回多个文件下载链接
    const downloadLinks = await Promise.all(
      datasets.map(async (dataset) => {
        const filename = `${dataset.name}_${Date.now()}.xlsx`;
        const filepath = await ExportService.exportToExcel(
          dataset.data,
          filename,
          dataset.sheetName || dataset.name
        );
        return {
          name: dataset.name,
          filename,
          filepath
        };
      })
    );

    res.json({ 
      success: true, 
      downloads: downloadLinks 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * 获取导出模板
 */
router.get('/export/template/:type', async (req, res) => {
  try {
    const { type } = req.params;

    let templateData = [];
    let sheetName = '模板';

    if (type === 'molds') {
      templateData = [
        {
          ID: '示例1',
          '名称': '常用模具A',
          '型号': 'M001',
          '状态': '良好',
          '使用次数': 1000,
          '最后检修': '2024-01-15',
          '创建日期': '2023-01-01'
        }
      ];
      sheetName = '模具模板';
    } else if (type === 'inventory') {
      templateData = [
        {
          '物品名称': '螺钉',
          '物品编码': 'SC001',
          '数量': 500,
          '单位': '个',
          '存放位置': 'A-1-1',
          '最后更新': '2024-01-15'
        }
      ];
      sheetName = '库存模板';
    }

    const filename = `template_${type}_${Date.now()}.xlsx`;
    const filepath = await ExportService.exportToExcel(
      templateData,
      filename,
      sheetName
    );

    res.download(filepath, filename, (err) => {
      if (err) console.error('下载失败:', err);
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
