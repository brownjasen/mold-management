# ✅ start.bat 使用说明（v1.1.0 更新）

## 📌 简短答案

**YES！start.bat 完全可用！✓**

---

## 🚀 使用步骤

### 最简单的方式（3 步）

1. **双击 `start.bat`** 文件
   - 位置：`E:\java\MoldManagement\start.bat`

2. **等待启动完成**
   - 会自动打开 2 个命令窗口
   - 第一个：后端服务 (Node.js)
   - 第二个：前端服务 (Python HTTP Server)

3. **浏览器自动打开**
   - 应用地址：`http://localhost:8000/app.html`

---

## 📊 start.bat 做了什么

```batch
1. 进入 server 目录
2. 如果没有 node_modules，自动运行 npm install
3. 启动后端服务：npm start (端口 5000)
4. 等待 3 秒
5. 进入 client 目录  
6. 启动前端服务：python -m http.server 8000
7. 自动打开浏览器到 http://localhost:8000/app.html
```

---

## ✨ v1.1.0 新增内容会被包含

当 `npm install` 运行时，会自动安装：

```json
{
  "socket.io": "^4.7.0",       // ← 新！实时协作
  "exceljs": "^4.4.0",         // ← 新！Excel 导出
  "pdfkit": "^0.14.0",         // ← 新！PDF 导出
  "moment": "^2.29.4"          // ← 新！日期处理
}
```

### 新增的功能模块会自动加载：
- ✓ `server/services/ExportService.js` - 导出服务
- ✓ `server/collaboration/CollaborationManager.js` - 协作管理
- ✓ `server/collaboration/CollaborationServer.js` - WebSocket
- ✓ `server/routes/export.js` - 导出 API
- ✓ `server/routes/collaboration.js` - 协作 API

---

## ⚙️ 系统需求

| 工具 | 版本 | 状态 |
|------|------|------|
| Node.js | v18+ | ✓ 已安装 (v22.21.0) |
| npm | v8+ | ✓ 已安装 (v10.9.4) |
| Python | v3+ | ✓ 已安装 (v3.11.9) |

---

## 🌐 启动后访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| 应用首页 | http://localhost:8000/app.html | 主应用（推荐） |
| API 服务 | http://localhost:5000 | 后端 API |
| WebSocket | ws://localhost:5000 | 实时协作 |

### 其他页面
- 工序管理：http://localhost:8000/stages.html
- 库存管理：http://localhost:8000/inventory.html
- 流程审批：http://localhost:8000/approval.html
- 诊断测试：http://localhost:8000/test.html

---

## 🆘 常见问题

### Q1: 如果启动失败？

**检查清单**:
```bash
# 1. 检查 npm 是否正确安装
npm --version

# 2. 检查 Python 是否正确安装
python --version

# 3. 检查端口是否被占用
netstat -ano | findstr :5000
netstat -ano | findstr :8000

# 4. 手动清理并重新安装
cd server
rmdir node_modules /s /q
npm install
npm start
```

### Q2: 浏览器没有自动打开？

手动打开：
```
http://localhost:8000/app.html
```

### Q3: 新功能怎么使用？

参考文档：
- **导出功能**：查看 `INTEGRATION_GUIDE.md` 示例 1
- **协作功能**：查看 `INTEGRATION_GUIDE.md` 示例 4
- **完整 API**：查看 `EXPORT_COLLABORATION_GUIDE.md`

### Q4: WebSocket 连接失败？

检查防火墙：
```bash
# Windows Defender 防火墙允许端口 5000
netsh advfirewall firewall add rule name="Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
```

---

## 🔧 高级用法

### 如果想分别启动

**启动后端**:
```bash
cd server
npm install
npm run dev  # 开发模式 (热重载)
# 或
npm start    # 生产模式
```

**启动前端**:
```bash
cd client
python -m http.server 8000
```

### 如果想使用 PM2 管理

```bash
npm install -g pm2
pm2 start server/app.js --name "mold-backend"
pm2 startup
pm2 save
```

---

## 📝 更新说明

### v1.1.0 新增（自动包含）
- ✓ 数据导出功能 (Excel/PDF)
- ✓ 实时协作功能 (WebSocket)
- ✓ 新依赖自动安装
- ✓ Socket.IO 集成
- ✓ 新 API 端点

### 兼容性
- ✓ 完全向后兼容
- ✓ 不需要修改启动脚本
- ✓ 新功能自动可用

---

## ✅ 完整流程

```
双击 start.bat
    ↓
检查 node_modules（如果不存在则 npm install）
    ↓
启动后端服务 (localhost:5000)
    ↓
等待 3 秒
    ↓
启动前端服务 (localhost:8000)
    ↓
自动打开浏览器 (localhost:8000/app.html)
    ↓
✅ 应用就绪
```

---

## 🎯 总结

| 问题 | 答案 |
|------|------|
| start.bat 还能用吗？ | ✓ **完全可用** |
| 需要修改吗？ | ✗ **不需要** |
| 新功能会包含吗？ | ✓ **自动包含** |
| 怎么使用新功能？ | 查看集成文档 |

---

**立即开始**：双击 `start.bat` 🚀

**遇到问题**：查看本文档或 `EXPORT_COLLABORATION_GUIDE.md`

---

*版本：1.1.0 | 更新：2024 年 1 月*
