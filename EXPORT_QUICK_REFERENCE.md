# 🚀 导出和协作功能 - 快速参考卡

## 📌 核心功能

### 导出功能
```javascript
// Excel 导出
await exportService.exportMoldsExcel(data, '标题');

// PDF 导出  
await exportService.exportMoldsPDF(data, '标题');

// 统计报告
await exportService.exportReport('标题', summary, details);

// 下载模板
await exportService.getTemplate('molds');
```

### 协作功能
```javascript
// 初始化
const collab = new CollaborationClient();
await collab.connect('user_id', 'username');

// 加入文档
collab.joinDocument('doc_id');

// 发送变更
collab.sendChange('update', { data: {...} });

// 更新光标
collab.updateCursor({ x: 100, y: 200 });

// 添加评论
collab.addComment('评论文本', { position: {...} });
```

---

## 📦 API 快速查询

### 导出端点
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/export/molds/excel` | POST | 模具 Excel |
| `/api/export/molds/pdf` | POST | 模具 PDF |
| `/api/export/inventory/excel` | POST | 库存 Excel |
| `/api/export/report` | POST | 统计报告 |
| `/api/export/template/:type` | GET | 导出模板 |

### 协作端点
| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/collaboration/document` | POST | 创建文档 |
| `/api/collaboration/document/:id` | GET | 获取文档 |
| `/api/collaboration/history/:id` | GET | 变更历史 |
| `/api/collaboration/snapshot/:id` | GET | 文档快照 |

### WebSocket 事件
| 事件 | 方向 | 说明 |
|------|------|------|
| `join-document` | ↑ | 加入文档 |
| `document-loaded` | ↓ | 文档已加载 |
| `document-change` | ↑ | 发送变更 |
| `document-changed` | ↓ | 文档已更新 |
| `cursor-move` | ↑ | 光标移动 |
| `cursor-updated` | ↓ | 光标已更新 |
| `add-comment` | ↑ | 添加评论 |
| `comment-added` | ↓ | 评论已添加 |
| `user-joined` | ↓ | 用户加入 |
| `user-left` | ↓ | 用户离开 |

---

## 🔧 安装和启动

```bash
# 安装
cd server
npm install

# 开发
npm run dev

# 生产
NODE_ENV=production npm start

# 验证
curl http://localhost:5000/health
```

---

## 📚 文档快速导航

| 需求 | 文档 | 时间 |
|------|------|------|
| 了解功能 | RELEASE_NOTES.md | 5 分钟 |
| 部署系统 | UBUNTU_DEPLOYMENT_GUIDE.md | 30 分钟 |
| 集成导出 | INTEGRATION_GUIDE.md - 示例 1 | 15 分钟 |
| 集成协作 | INTEGRATION_GUIDE.md - 示例 4 | 20 分钟 |
| 查阅 API | EXPORT_COLLABORATION_GUIDE.md | 30 分钟 |
| 故障排查 | EXPORT_COLLABORATION_GUIDE.md - Q&A | 10 分钟 |

---

## ⚡ 常用命令

```bash
# 启动后端
npm run dev

# 测试功能
bash test-export-collaboration.sh

# 查看日志
pm2 logs mold-backend

# 导出 Excel
curl -X POST http://localhost:5000/api/export/molds/excel \
  -H "Content-Type: application/json" \
  -d '{"moldsData":[...],"title":"标题"}'
```

---

## ✅ 集成检查

- [ ] 后端依赖已安装
- [ ] 服务已启动
- [ ] 健康检查通过
- [ ] 测试脚本通过
- [ ] 前端已导入模块
- [ ] 导出按钮已添加
- [ ] 协作功能已测试

---

## 🆘 快速排查

| 问题 | 解决 |
|------|------|
| 导出文件为空 | 检查 /tmp 权限 |
| WebSocket 连接失败 | 检查防火墙 |
| 变更冲突 | 检查版本号 |
| 找不到模块 | 运行 npm install |
| 端口已占用 | 更改 PORT 或关闭占用进程 |

---

## 📞 获取帮助

1. 查看 RELEASE_NOTES.md
2. 查看 EXPORT_COLLABORATION_GUIDE.md 常见问题
3. 运行 test-export-collaboration.sh
4. 查看错误日志

---

**版本**: 1.1.0 | **状态**: 生产就绪 ✅
