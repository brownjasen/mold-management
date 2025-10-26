# 导出和实时协作功能完全指南

## 📋 目录

1. [功能概述](#功能概述)
2. [后端部署](#后端部署)
3. [导出功能](#导出功能)
4. [实时协作功能](#实时协作功能)
5. [API 文档](#api-文档)
6. [前端集成示例](#前端集成示例)
7. [常见问题](#常见问题)

---

## 功能概述

### 导出功能 ✓

- **Excel 导出** - 支持多种数据表格导出为 .xlsx 格式
- **PDF 导出** - 生成精美的 PDF 报告
- **统计报告** - 自动生成包含汇总和详细数据的报告
- **导出模板** - 提供预定义的导出模板

### 实时协作功能 ✓

- **WebSocket 连接** - 实时双向通信
- **光标位置共享** - 看到其他用户的光标位置
- **在线用户显示** - 显示文档中的活跃用户
- **版本管理** - 自动管理文档版本
- **变更历史** - 完整的操作日志
- **评论系统** - 添加和回复评论
- **字段锁定** - 防止编辑冲突

---

## 后端部署

### 1. 安装依赖

```bash
cd server
npm install
```

新增的依赖包：
- `socket.io` - 实时通信
- `exceljs` - Excel 导出
- `pdfkit` - PDF 导出
- `moment` - 日期处理

### 2. 启动服务

```bash
# 开发模式
npm run dev

# 生产模式
NODE_ENV=production npm start
```

### 3. 验证功能

```bash
# 检查健康状态（包含新功能信息）
curl http://localhost:5000/health

# 输出示例：
# {
#   "status": "ok",
#   "features": {
#     "export": true,
#     "collaboration": true,
#     "socketio": true
#   }
# }
```

---

## 导出功能

### API 端点

#### 导出模具数据为 Excel

```bash
POST /api/export/molds/excel
Content-Type: application/json

{
  "moldsData": [
    {
      "id": "001",
      "name": "模具A",
      "model": "M001",
      "status": "良好",
      "usageCount": 1000,
      "lastMaintenance": "2024-01-15",
      "createdAt": "2023-01-01"
    }
  ],
  "title": "2024年1月模具统计"
}
```

#### 导出模具数据为 PDF

```bash
POST /api/export/molds/pdf
Content-Type: application/json

{
  "moldsData": [数据数组],
  "title": "模具数据报告"
}
```

#### 导出库存数据

```bash
POST /api/export/inventory/excel
Content-Type: application/json

{
  "inventoryData": [
    {
      "name": "螺钉",
      "code": "SC001",
      "quantity": 500,
      "unit": "个",
      "location": "A-1-1",
      "updatedAt": "2024-01-15"
    }
  ],
  "title": "库存清单"
}
```

#### 导出统计报告

```bash
POST /api/export/report
Content-Type: application/json

{
  "title": "月度统计报告",
  "summary": {
    "总数": 100,
    "完成率": "95%",
    "平均值": 1234
  },
  "details": [
    { "日期": "2024-01-01", "数值": 50 },
    { "日期": "2024-01-02", "数值": 45 }
  ]
}
```

#### 获取导出模板

```bash
GET /api/export/template/molds
# 或
GET /api/export/template/inventory
```

---

## 实时协作功能

### WebSocket 事件

#### 客户端发送事件

##### join-document
加入文档协作

```javascript
socket.emit('join-document', 'doc_123', {
  username: '张三'
});
```

##### leave-document
离开文档

```javascript
socket.emit('leave-document', 'doc_123');
```

##### document-change
发送文档变更

```javascript
socket.emit('document-change', 'doc_123', {
  type: 'update',
  data: { name: '新名称', status: '完成' },
  version: 5
});

// 变更类型：
// - update: 更新字段
// - insert: 插入新数据
// - delete: 删除数据
```

##### cursor-move
更新光标位置

```javascript
socket.emit('cursor-move', 'doc_123', {
  line: 10,
  column: 5
});
```

##### add-comment
添加评论

```javascript
socket.emit('add-comment', 'doc_123', {
  text: '这里需要修改',
  position: { line: 10, column: 5 }
});
```

##### lock-field
锁定字段编辑

```javascript
socket.emit('lock-field', 'doc_123', 'moldName');
```

##### unlock-field
解锁字段

```javascript
socket.emit('unlock-field', 'doc_123', 'moldName');
```

#### 服务器广播事件

##### document-loaded
文档加载完成

```javascript
socket.on('document-loaded', (data) => {
  console.log('文档内容:', data.content);
  console.log('当前版本:', data.version);
  console.log('活跃用户:', data.users);
});
```

##### document-changed
文档被修改

```javascript
socket.on('document-changed', (data) => {
  console.log('变更内容:', data.change);
  console.log('新版本号:', data.newVersion);
});
```

##### user-joined
用户加入

```javascript
socket.on('user-joined', (data) => {
  console.log('用户加入:', data.username);
});
```

##### user-left
用户离开

```javascript
socket.on('user-left', (data) => {
  console.log('用户离开:', data.userId);
});
```

##### cursor-updated
光标更新

```javascript
socket.on('cursor-updated', (data) => {
  console.log('用户光标:', data.userId, data.position);
});
```

##### comment-added
评论添加

```javascript
socket.on('comment-added', (data) => {
  console.log('新评论:', data.text);
});
```

---

## API 文档

### REST API

#### 创建协作文档

```bash
POST /api/collaboration/document
Content-Type: application/json

{
  "title": "模具检修报告",
  "description": "2024年1月检修记录",
  "type": "report"
}

# 返回：
{
  "success": true,
  "documentId": "doc_1234567890_abc123",
  "title": "模具检修报告",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### 获取文档信息

```bash
GET /api/collaboration/document/doc_123

# 返回：
{
  "success": true,
  "documentId": "doc_123",
  "message": "文档信息获取成功"
}
```

#### 获取变更历史

```bash
GET /api/collaboration/history/doc_123?from=0

# 返回：
{
  "success": true,
  "documentId": "doc_123",
  "history": [
    {
      "change": {...},
      "timestamp": "2024-01-15T10:30:00Z",
      "userId": "user_123"
    }
  ]
}
```

#### 获取文档快照

```bash
GET /api/collaboration/snapshot/doc_123

# 返回：
{
  "success": true,
  "documentId": "doc_123",
  "version": 5,
  "content": {...},
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

## 前端集成示例

### 1. 导出功能集成

```javascript
import { exportService } from '@/api/exportAndCollaboration';

// 导出模具数据为 Excel
async function exportMoldsAsExcel() {
  try {
    const moldsData = [
      { id: '001', name: '模具A', status: '良好' },
      { id: '002', name: '模具B', status: '维修中' }
    ];
    
    await exportService.exportMoldsExcel(
      moldsData,
      '2024年1月模具统计'
    );
    
    alert('✓ 导出成功！');
  } catch (error) {
    alert('导出失败: ' + error.message);
  }
}

// 导出为 PDF
async function exportAsPDF() {
  try {
    const moldsData = [/* ... */];
    await exportService.exportMoldsPDF(moldsData, '模具统计报告');
  } catch (error) {
    console.error(error);
  }
}

// 导出统计报告
async function exportReport() {
  try {
    await exportService.exportReport(
      '月度统计报告',
      {
        '总模具数': 150,
        '正常运行': 120,
        '维修中': 20,
        '报废': 10
      },
      [
        { '日期': '2024-01-01', '新增': 5 },
        { '日期': '2024-01-02', '新增': 3 }
      ]
    );
  } catch (error) {
    console.error(error);
  }
}
```

### 2. 实时协作集成

```javascript
import { CollaborationClient } from '@/api/exportAndCollaboration';

// 初始化协作客户端
const collabClient = new CollaborationClient();

// 连接
await collabClient.connect('user_123', '张三');

// 加入文档
collabClient.joinDocument('doc_456');

// 监听事件
collabClient.on('documentLoaded', (data) => {
  console.log('文档已加载');
  updateUI(data.content);
});

collabClient.on('documentChanged', (data) => {
  console.log('文档已更新');
  refreshView(data.change);
});

collabClient.on('userJoined', (data) => {
  console.log(data.username + ' 加入了协作');
  updateUserList();
});

collabClient.on('cursorUpdated', (data) => {
  showRemoteCursor(data.userId, data.position);
});

// 发送变更
function updateMoldName(newName) {
  collabClient.sendChange('update', {
    data: { name: newName },
    key: 'moldName'
  });
}

// 更新光标
document.addEventListener('mousemove', (e) => {
  collabClient.updateCursor({
    x: e.clientX,
    y: e.clientY
  });
});

// 添加评论
function addComment(text) {
  collabClient.addComment(text, { line: 10, column: 5 });
}

// 离开协作
function leaveDocument() {
  collabClient.leaveDocument();
  collabClient.disconnect();
}
```

### 3. Vue 组件示例

```vue
<template>
  <div class="collaboration-view">
    <!-- 导出按钮 -->
    <div class="export-buttons">
      <button @click="exportExcel">📥 导出 Excel</button>
      <button @click="exportPDF">📄 导出 PDF</button>
      <button @click="exportReport">📊 导出报告</button>
    </div>

    <!-- 活跃用户 -->
    <div class="active-users">
      <h3>在线用户 ({{ activeUsers.length }})</h3>
      <div class="user-list">
        <div v-for="user in activeUsers" :key="user.userId" class="user-badge">
          <span class="dot" :style="{ backgroundColor: user.color }"></span>
          {{ user.username }}
        </div>
      </div>
    </div>

    <!-- 远程光标 -->
    <div class="content-area">
      <div v-for="cursor in allCursors" :key="cursor.userId" 
           class="remote-cursor" :style="{ left: cursor.position.x, top: cursor.position.y }">
      </div>
      <textarea v-model="content" @input="handleChange" placeholder="开始编辑..."></textarea>
    </div>

    <!-- 评论 -->
    <div class="comments-panel">
      <input v-model="commentText" placeholder="添加评论..." />
      <button @click="addComment">发送</button>
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <strong>{{ comment.username }}</strong>: {{ comment.text }}
      </div>
    </div>
  </div>
</template>

<script>
import { CollaborationClient, exportService } from '@/api/exportAndCollaboration';

export default {
  data() {
    return {
      collabClient: null,
      content: '',
      activeUsers: [],
      allCursors: [],
      comments: [],
      commentText: ''
    };
  },

  async mounted() {
    // 初始化协作
    this.collabClient = new CollaborationClient();
    await this.collabClient.connect('user_123', '当前用户');
    this.collabClient.joinDocument('doc_456');

    // 设置事件监听
    this.collabClient.on('documentLoaded', (data) => {
      this.content = data.content.text || '';
      this.activeUsers = data.users;
    });

    this.collabClient.on('documentChanged', (data) => {
      if (data.change.data?.text) {
        this.content = data.change.data.text;
      }
    });

    this.collabClient.on('userJoined', (data) => {
      this.activeUsers = this.collabClient.getActiveUsers();
    });

    this.collabClient.on('cursorUpdated', () => {
      this.allCursors = this.collabClient.getAllCursors();
    });
  },

  methods: {
    handleChange() {
      this.collabClient.sendChange('update', {
        data: { text: this.content }
      });
    },

    async exportExcel() {
      await exportService.exportMoldsExcel([...]);
    },

    async exportPDF() {
      await exportService.exportMoldsPDF([...]);
    },

    async exportReport() {
      await exportService.exportReport('报告', {...}, [...]);
    },

    addComment() {
      this.collabClient.addComment(this.commentText, {});
      this.commentText = '';
    }
  },

  beforeUnmount() {
    this.collabClient.leaveDocument();
    this.collabClient.disconnect();
  }
};
</script>

<style scoped>
.collaboration-view { padding: 20px; }
.export-buttons { margin-bottom: 20px; }
.export-buttons button { margin-right: 10px; padding: 8px 16px; }
.active-users { margin-bottom: 20px; }
.user-list { display: flex; gap: 8px; flex-wrap: wrap; }
.user-badge { display: flex; align-items: center; gap: 5px; padding: 5px 10px; background: #f0f0f0; border-radius: 20px; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.content-area { position: relative; margin-bottom: 20px; }
.remote-cursor { position: absolute; width: 2px; height: 20px; background: red; }
textarea { width: 100%; height: 300px; padding: 10px; border: 1px solid #ddd; }
.comments-panel { margin-top: 20px; }
.comment { padding: 8px; background: #f9f9f9; margin-top: 8px; border-radius: 4px; }
</style>
```

---

## 常见问题

### Q1: WebSocket 连接失败

**症状：** 无法连接到实时协作功能

**解决：**
```javascript
// 检查服务器是否运行
curl http://localhost:5000/health

// 检查防火墙是否允许 WebSocket
sudo ufw allow 5000/tcp

// 确保 socket.io 已安装
npm list socket.io
```

### Q2: 导出文件为空或格式错误

**症状：** 导出的 Excel/PDF 文件无法打开或为空

**解决：**
```bash
# 确保依赖已安装
npm install exceljs pdfkit

# 检查 /tmp 目录权限
ls -la /tmp/

# 查看服务器错误日志
pm2 logs mold-backend
```

### Q3: 变更冲突

**症状：** 多个用户同时编辑导致数据不一致

**解决：**
- 系统使用 Operational Transform (OT) 处理并发
- 每次变更都包含版本号
- 版本不匹配时会触发 'change-rejected' 事件

### Q4: 性能问题

**优化建议：**
```javascript
// 1. 批量发送变更（而不是逐个发送）
const changes = [];
changes.push(...);
collabClient.sendChange('batch', { changes });

// 2. 定期压缩版本
setInterval(() => {
  collabClient.compressHistory();
}, 60000);

// 3. 限制光标更新频率
let lastCursorUpdate = 0;
const updateCursor = () => {
  const now = Date.now();
  if (now - lastCursorUpdate > 100) {
    collabClient.updateCursor(...);
    lastCursorUpdate = now;
  }
};
```

### Q5: 如何自定义导出格式

```javascript
// 自定义导出字段
const customData = moldsData.map(mold => ({
  '模具ID': mold.id,
  '模具名称': mold.name,
  '使用次数': mold.usageCount,
  '最后检修': formatDate(mold.lastMaintenance),
  '维护成本': calculateCost(mold)
}));

await exportService.exportMoldsExcel(customData, '自定义报告');
```

---

## 部署检查清单

- [ ] 后端已安装所有必需包
- [ ] Socket.IO 已正确配置
- [ ] CORS 已启用
- [ ] 前端已导入 exportAndCollaboration 模块
- [ ] 导出目录有写入权限
- [ ] 防火墙允许 WebSocket 连接
- [ ] 已测试 Excel/PDF 导出
- [ ] 已测试实时协作功能
- [ ] 多用户协作测试通过

---

最后更新：2024年1月
