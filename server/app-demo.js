require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 内存数据存储（Demo用）
let moldsData = [];
let inventoryData = [];
let moldIdCounter = 1;

// Routes
app.use('/api/molds', require('./routes/molds'));
app.use('/api/inventory', require('./routes/inventory'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

// 导出数据存储供路由使用
app.locals.moldsData = moldsData;
app.locals.inventoryData = inventoryData;
app.locals.moldIdCounter = moldIdCounter;

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ 服务器运行在 http://localhost:${PORT}`);
  console.log('✓ API 文档: http://localhost:${PORT}/api/');
});
