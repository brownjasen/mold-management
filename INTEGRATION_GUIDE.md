# 如何集成导出和协作功能

## 快速集成指南

### 步骤 1: 安装后端依赖

```bash
cd server
npm install socket.io exceljs pdfkit moment
```

### 步骤 2: 启动后端服务

```bash
# 开发模式
npm run dev

# 生产模式
NODE_ENV=production npm start

# 验证服务
curl http://localhost:5000/health
```

验证输出应包含：
```json
{
  "status": "ok",
  "features": {
    "export": true,
    "collaboration": true,
    "socketio": true
  }
}
```

### 步骤 3: 前端导入

```javascript
// 在你的 Vue/React 组件中导入
import { exportService, CollaborationClient } from '@/api/exportAndCollaboration';
```

---

## 使用示例

### 示例 1: 导出模具数据

```javascript
// MoldList.vue 或类似组件
import { exportService } from '@/api/exportAndCollaboration';

export default {
  methods: {
    async handleExportExcel() {
      try {
        // 获取当前表格数据
        const moldsData = this.molds.map(mold => ({
          id: mold.id,
          name: mold.name,
          model: mold.model,
          status: mold.status,
          usageCount: mold.usageCount,
          lastMaintenance: mold.lastMaintenance,
          createdAt: mold.createdAt
        }));

        // 调用导出
        await exportService.exportMoldsExcel(
          moldsData,
          `模具数据_${new Date().toISOString().split('T')[0]}`
        );

        this.$message.success('导出成功！');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    },

    async handleExportPDF() {
      try {
        const moldsData = this.molds.map(mold => ({
          id: mold.id,
          name: mold.name,
          model: mold.model,
          status: mold.status,
          usageCount: mold.usageCount
        }));

        await exportService.exportMoldsPDF(moldsData, '模具数据报告');
        this.$message.success('导出成功！');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    }
  }
};
```

在模板中添加按钮：

```html
<template>
  <div class="mold-list">
    <div class="toolbar">
      <button @click="handleExportExcel" class="btn btn-primary">
        📥 导出 Excel
      </button>
      <button @click="handleExportPDF" class="btn btn-primary">
        📄 导出 PDF
      </button>
    </div>

    <!-- 模具列表表格 -->
    <table>
      <!-- 表格内容 -->
    </table>
  </div>
</template>
```

### 示例 2: 库存数据导出

```javascript
// InventoryList.vue
import { exportService } from '@/api/exportAndCollaboration';

export default {
  methods: {
    async exportInventory() {
      try {
        const inventoryData = this.inventoryItems.map(item => ({
          name: item.name,
          code: item.code,
          quantity: item.quantity,
          unit: item.unit,
          location: item.location,
          updatedAt: item.updatedAt
        }));

        await exportService.exportInventoryExcel(
          inventoryData,
          `库存清单_${new Date().toISOString().split('T')[0]}`
        );

        this.$message.success('库存数据已导出！');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    }
  }
};
```

### 示例 3: 统计报告导出

```javascript
// Analytics.vue
import { exportService } from '@/api/exportAndCollaboration';

export default {
  methods: {
    async exportStatisticsReport() {
      try {
        const summary = {
          '总模具数': this.totalMolds,
          '运行中': this.runningMolds,
          '维修中': this.repairingMolds,
          '已报废': this.scrapMolds,
          '平均使用次数': this.averageUsage,
          '完成率': `${this.completionRate.toFixed(2)}%`
        };

        const details = this.dailyStats.map(stat => ({
          '日期': stat.date,
          '新增': stat.newMolds,
          '完成': stat.completedTasks,
          '故障': stat.failures,
          '运行时间': stat.runtime
        }));

        await exportService.exportReport(
          '月度统计报告',
          summary,
          details
        );

        this.$message.success('报告已导出！');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      }
    }
  }
};
```

### 示例 4: 实时协作

```javascript
// CollaborativeEditor.vue
import { CollaborationClient } from '@/api/exportAndCollaboration';

export default {
  data() {
    return {
      collab: null,
      activeUsers: [],
      remoteCursors: [],
      comments: [],
      content: {}
    };
  },

  async mounted() {
    // 初始化协作客户端
    this.collab = new CollaborationClient();
    
    try {
      // 连接到服务器
      await this.collab.connect(
        this.getUserId(),
        this.getCurrentUsername()
      );

      // 加入文档
      this.collab.joinDocument(this.$route.params.docId);

      // 设置事件监听
      this.setupEventListeners();
    } catch (error) {
      this.$message.error('连接失败: ' + error.message);
    }
  },

  methods: {
    setupEventListeners() {
      // 文档加载
      this.collab.on('documentLoaded', (data) => {
        this.content = data.content;
        this.activeUsers = data.users;
        this.$message.success('文档已加载');
      });

      // 文档更新
      this.collab.on('documentChanged', (data) => {
        this.updateContent(data.change);
      });

      // 用户加入
      this.collab.on('userJoined', (data) => {
        this.activeUsers = this.collab.getActiveUsers();
        this.$message.info(`${data.username} 加入了协作`);
      });

      // 用户离开
      this.collab.on('userLeft', (data) => {
        this.activeUsers = this.collab.getActiveUsers();
      });

      // 光标更新
      this.collab.on('cursorUpdated', () => {
        this.remoteCursors = this.collab.getAllCursors();
      });

      // 评论添加
      this.collab.on('commentAdded', (comment) => {
        this.comments.push(comment);
      });
    },

    updateContent(change) {
      if (change.type === 'update') {
        Object.assign(this.content, change.data);
      } else if (change.type === 'insert') {
        this.content[change.key] = change.value;
      } else if (change.type === 'delete') {
        delete this.content[change.key];
      }
    },

    handleInputChange() {
      // 发送变更
      this.collab.sendChange('update', {
        data: this.content
      });
    },

    handleMouseMove(event) {
      // 更新光标位置
      this.collab.updateCursor({
        x: event.clientX,
        y: event.clientY
      });
    },

    addComment(text) {
      this.collab.addComment(text, {
        timestamp: new Date(),
        userId: this.getUserId()
      });
    },

    getUserId() {
      return localStorage.getItem('userId') || 'user_' + Math.random();
    },

    getCurrentUsername() {
      return localStorage.getItem('username') || '匿名用户';
    }
  },

  beforeUnmount() {
    // 清理连接
    if (this.collab) {
      this.collab.leaveDocument();
      this.collab.disconnect();
    }
  }
};
```

在模板中：

```html
<template>
  <div class="collaborative-editor">
    <!-- 活跃用户列表 -->
    <div class="users-panel">
      <h3>在线用户 ({{ activeUsers.length }})</h3>
      <div class="user-list">
        <div v-for="user in activeUsers" :key="user.userId" class="user-item">
          <span class="dot" :style="{ background: user.color }"></span>
          {{ user.username }}
        </div>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-area" @mousemove="handleMouseMove">
      <!-- 远程光标 -->
      <div v-for="cursor in remoteCursors" :key="cursor.userId"
           class="remote-cursor" :style="{ left: cursor.position.x, top: cursor.position.y }">
      </div>

      <!-- 编辑内容 -->
      <div class="form-group">
        <label>模具名称</label>
        <input v-model="content.name" @input="handleInputChange" placeholder="输入模具名称" />
      </div>

      <div class="form-group">
        <label>型号</label>
        <input v-model="content.model" @input="handleInputChange" placeholder="输入型号" />
      </div>

      <div class="form-group">
        <label>状态</label>
        <select v-model="content.status" @change="handleInputChange">
          <option>良好</option>
          <option>维修中</option>
          <option>报废</option>
        </select>
      </div>
    </div>

    <!-- 评论区域 -->
    <div class="comments-panel">
      <h3>评论</h3>
      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <strong>{{ comment.userId }}</strong>
          <p>{{ comment.text }}</p>
          <small>{{ comment.createdAt }}</small>
        </div>
      </div>

      <div class="comment-input">
        <textarea v-model="newComment" placeholder="添加评论..."></textarea>
        <button @click="addComment(newComment)">发送</button>
      </div>
    </div>
  </div>
</template>
```

### 示例 5: 导出按钮组件

```vue
<!-- ExportButtonGroup.vue -->
<template>
  <div class="export-button-group">
    <div class="dropdown">
      <button @click="isOpen = !isOpen" class="btn btn-default">
        📥 导出 <span class="arrow">▼</span>
      </button>

      <div v-if="isOpen" class="dropdown-menu">
        <button @click="exportAsExcel" class="menu-item">
          <span class="icon">📊</span> 导出 Excel
        </button>
        <button @click="exportAsPDF" class="menu-item">
          <span class="icon">📄</span> 导出 PDF
        </button>
        <button @click="exportReport" class="menu-item">
          <span class="icon">📈</span> 导出报告
        </button>
        <hr />
        <button @click="downloadTemplate" class="menu-item">
          <span class="icon">📑</span> 下载模板
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-spinner">
      <span class="spinner"></span> 导出中...
    </div>
  </div>
</template>

<script>
import { exportService } from '@/api/exportAndCollaboration';

export default {
  props: {
    data: Array,
    type: String // 'molds' 或 'inventory'
  },

  data() {
    return {
      isOpen: false,
      isLoading: false
    };
  },

  methods: {
    async exportAsExcel() {
      this.isLoading = true;
      try {
        await exportService.exportMoldsExcel(this.data, this.getTitle());
        this.$message.success('Excel 导出成功');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      } finally {
        this.isLoading = false;
        this.isOpen = false;
      }
    },

    async exportAsPDF() {
      this.isLoading = true;
      try {
        await exportService.exportMoldsPDF(this.data, this.getTitle());
        this.$message.success('PDF 导出成功');
      } catch (error) {
        this.$message.error('导出失败: ' + error.message);
      } finally {
        this.isLoading = false;
        this.isOpen = false;
      }
    },

    async exportReport() {
      this.$emit('export-report');
    },

    async downloadTemplate() {
      try {
        await exportService.getTemplate(this.type);
        this.$message.success('模板下载成功');
      } catch (error) {
        this.$message.error('下载失败: ' + error.message);
      } finally {
        this.isOpen = false;
      }
    },

    getTitle() {
      return `${this.type}_${new Date().toISOString().split('T')[0]}`;
    }
  }
};
</script>

<style scoped>
.export-button-group {
  position: relative;
  display: inline-block;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.btn:hover {
  background: #f5f5f5;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 150px;
}

.menu-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 16px;
  border: none;
  background: none;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}

.loading-spinner {
  display: inline-block;
  margin-left: 10px;
  color: #666;
}
</style>
```

---

## 文件结构

```
moldmanagement/
├── server/
│   ├── app.js (已更新 - Socket.IO 集成)
│   ├── package.json (已更新 - 新依赖)
│   ├── services/
│   │   └── ExportService.js (新增)
│   ├── collaboration/
│   │   ├── CollaborationManager.js (新增)
│   │   └── CollaborationServer.js (新增)
│   ├── routes/
│   │   ├── export.js (新增)
│   │   ├── collaboration.js (新增)
│   │   ├── moldsDemo.js (既存)
│   │   └── inventoryDemo.js (既存)
│   └── utils/
│       └── fileHandler.js (新增)
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js (已更新)
│   │   │   └── exportAndCollaboration.js (新增)
│   │   ├── components/
│   │   │   ├── ExportButtonGroup.vue (新增)
│   │   │   ├── CollaborativeEditor.vue (新增)
│   │   │   └── ...
│   │   └── views/
│   │       └── ...
│
├── EXPORT_COLLABORATION_GUIDE.md (新增 - 完整指南)
├── FEATURES_SUMMARY.md (新增 - 功能总结)
└── test-export-collaboration.sh (新增 - 测试脚本)
```

---

## 验证集成

### 检查清单

- [ ] `npm install` 已在 server 目录执行
- [ ] 后端已重新启动
- [ ] 健康检查返回 export/collaboration/socketio 为 true
- [ ] 前端已导入 exportAndCollaboration 模块
- [ ] 导出按钮已添加到相应页面
- [ ] 协作功能已在编辑页面集成
- [ ] 多个浏览器标签页测试了实时协作
- [ ] 下载的 Excel 和 PDF 文件能正常打开
- [ ] WebSocket 连接能正常建立

### 测试导出功能

```bash
# 1. 启动后端
cd server
npm run dev

# 2. 在另一个终端运行测试脚本
bash test-export-collaboration.sh

# 3. 检查 /tmp 目录生成的文件
ls -lh /tmp/test_*.xlsx /tmp/test_*.pdf
```

### 测试协作功能

```javascript
// 在浏览器控制台运行

// 打开两个标签页，在每个标签页都运行以下代码
import { CollaborationClient } from '@/api/exportAndCollaboration';

const collab = new CollaborationClient();
await collab.connect('user_' + Math.random(), '测试用户');
collab.joinDocument('test_doc_123');

// 标签页1: 发送变更
collab.sendChange('update', {
  data: { name: '新数据', status: '完成' }
});

// 标签页2: 监听变更
collab.on('documentChanged', (data) => {
  console.log('收到变更:', data);
});
```

---

## 常见集成问题

### Q: Socket.IO 连接超时

**解决**: 检查 CORS 设置

```javascript
// 在 server/app.js 中
const io = socketIo(server, {
  cors: {
    origin: '*', // 改为特定的 origin
    methods: ['GET', 'POST']
  }
});
```

### Q: 导出文件没有样式

**解决**: 确保已安装 exceljs

```bash
npm list exceljs
npm install exceljs --save
```

### Q: 光标位置不准确

**解决**: 检查坐标系统，可能需要转换

```javascript
// 获取元素相对位置
const rect = element.getBoundingClientRect();
const position = {
  x: event.clientX - rect.left,
  y: event.clientY - rect.top
};
```

---

更多问题？查看 `EXPORT_COLLABORATION_GUIDE.md` 的常见问题部分。
