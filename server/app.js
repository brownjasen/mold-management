require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// 导入协作服务器
const CollaborationServer = require('./collaboration/CollaborationServer');
new CollaborationServer(io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Routes（使用内存版本，无需MongoDB）
app.use('/api/molds', require('./routes/moldsDemo'));
app.use('/api/inventory', require('./routes/inventoryDemo'));

// 导出和协作路由
app.use('/api', require('./routes/export'));
app.use('/api', require('./routes/collaboration'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    features: {
      export: true,
      collaboration: true,
      socketio: true
    }
  });
});

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: '模具精益生产管理系统 API',
    version: '1.1.0',
    features: ['export', 'collaboration', 'real-time-sync'],
    endpoints: {
      molds: '/api/molds',
      inventory: '/api/inventory',
      export: {
        molds_excel: 'POST /api/export/molds/excel',
        molds_pdf: 'POST /api/export/molds/pdf',
        inventory_excel: 'POST /api/export/inventory/excel',
        report: 'POST /api/export/report'
      },
      collaboration: {
        document_create: 'POST /api/collaboration/document',
        document_info: 'GET /api/collaboration/document/:docId',
        history: 'GET /api/collaboration/history/:docId'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n╔═══════════════════════════════════════════════════════╗`);
  console.log(`║   模具精益生产管理系统 - 服务器已启动              ║`);
  console.log(`╠═══════════════════════════════════════════════════════╣`);
  console.log(`║   ✓ API 地址: http://0.0.0.0:${PORT}`);
  console.log(`║   ✓ WebSocket: ws://0.0.0.0:${PORT}`);
  console.log(`║   ✓ 导出功能: ✓ (Excel/PDF)`);
  console.log(`║   ✓ 实时协作: ✓ (Socket.IO)`);
  console.log(`║   ✓ 数据库: 内存存储（Demo模式）`);
  console.log(`╚═══════════════════════════════════════════════════════╝\n`);
});
