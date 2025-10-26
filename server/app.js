require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes（使用内存版本，无需MongoDB）
app.use('/api/molds', require('./routes/moldsDemo'));
app.use('/api/inventory', require('./routes/inventoryDemo'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: '模具精益生产管理系统 API',
    version: '1.0.0',
    endpoints: {
      molds: '/api/molds',
      inventory: '/api/inventory'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════════════════╗`);
  console.log(`║   模具精益生产管理系统 - 服务器已启动              ║`);
  console.log(`╠═══════════════════════════════════════════════════════╣`);
  console.log(`║   ✓ API 地址: http://localhost:${PORT}`);
  console.log(`║   ✓ 前端地址: http://localhost:8000`);
  console.log(`║   ✓ 数据库: 内存存储（Demo模式）`);
  console.log(`╚═══════════════════════════════════════════════════════╝\n`);
});
