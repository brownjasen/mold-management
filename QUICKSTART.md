# 快速开始指南

## 项目结构
```
MoldManagement/
├── server/                    # 后端服务
│   ├── models/               # 数据模型
│   │   ├── Mold.js
│   │   └── Inventory.js
│   ├── controllers/          # 业务逻辑
│   │   ├── moldController.js
│   │   └── inventoryController.js
│   ├── routes/               # API 路由
│   │   ├── molds.js
│   │   └── inventory.js
│   ├── app.js               # 主应用文件
│   ├── package.json
│   └── .env                 # 环境变量
│
├── client/                   # 前端
│   ├── src/
│   │   ├── views/           # 页面组件
│   │   │   ├── MoldList.vue
│   │   │   └── MoldDetail.vue
│   │   ├── components/      # 组件
│   │   │   ├── ModuleSection.vue
│   │   │   ├── AccessorySection.vue
│   │   │   └── RepairSection.vue
│   │   ├── api/
│   │   │   └── client.js    # API 客户端
│   │   └── stores/          # 状态管理
│   ├── index.html           # 首页
│   └── detail.html          # 详情页
│
└── README.md               # 项目文档
```

## 环境要求
- Node.js v14+
- MongoDB v4.0+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 一键启动

### Windows 用户
创建 `start.bat` 文件：
```batch
@echo off
echo 启动 MongoDB...
start mongod

echo 启动后端服务...
cd server
npm install
start npm start

echo 启动前端服务...
cd ..\client
timeout /t 5
python -m http.server 8000
```

### Mac/Linux 用户
创建 `start.sh` 文件：
```bash
#!/bin/bash

# 启动 MongoDB
mongod --dbpath ~/mongod-data &

# 启动后端
cd server
npm install
npm start &

# 启动前端
cd ../client
sleep 5
python -m http.server 8000
```

## 手动启动步骤

### 1. 启动 MongoDB
```bash
mongod
```

### 2. 启动后端服务
```bash
cd server
npm install
npm start
```

输出示例：
```
MongoDB connected
Server running on port 5000
```

### 3. 启动前端
```bash
cd client
# 方式 1: 使用 Python
python -m http.server 8000

# 方式 2: 使用 Node 的 http-server
npx http-server

# 方式 3: 使用 Ruby
ruby -run -ehttpd . -p8000
```

### 4. 打开浏览器
访问 `http://localhost:8000`

## 测试数据导入

创建 `server/seed.js` 文件用于初始化数据：

```javascript
const mongoose = require('mongoose');
const Mold = require('./models/Mold');

mongoose.connect('mongodb://localhost:27017/moldmanagement');

const seedData = {
  moldNumber: 'SC25-01',
  orderTime: new Date(),
  modules: {
    moldFrame: {
      name: '模架',
      stages: [
        { name: '设计图纸', percentage: 2, status: 'pending' },
        { name: '模料', percentage: 7, status: 'pending' },
        { name: '深孔钻', percentage: 3, status: 'pending' },
        { name: '数控铣', percentage: 6, status: 'pending' },
        { name: '卧加', percentage: 2, status: 'pending' },
        { name: '加工中心', percentage: 4, status: 'pending' },
        { name: '倒角磨床', percentage: 4, status: 'pending' },
        { name: '真空淬火', percentage: 2, status: 'pending' },
        { name: '清洁', percentage: 1, status: 'pending' },
        { name: '质检', percentage: 0.5, status: 'pending' }
      ]
    },
    threeParts: {
      name: '三大件',
      stages: [
        { name: '设计图纸', percentage: 0.2, status: 'pending' },
        { name: '模料', percentage: 5, status: 'pending' },
        { name: '开粗', percentage: 10, status: 'pending' },
        { name: '真空淬火', percentage: 20, status: 'pending' },
        { name: '精加工', percentage: 20, status: 'pending' },
        { name: '抛光', percentage: 3, status: 'pending' },
        { name: '清洁', percentage: 1, status: 'pending' },
        { name: '质检', percentage: 1.2, status: 'pending' }
      ]
    },
    accessories: {
      name: '辅料',
      items: [
        { name: '阀针', quantity: 20, orderStatus: 'pending', completed: false },
        { name: '导柱', quantity: 10, orderStatus: 'pending', completed: false }
      ]
    },
    assembly: {
      name: '组装',
      stages: [
        { name: '组装', percentage: 1, status: 'pending' }
      ]
    },
    trialMold: {
      name: '试模',
      stages: [
        { name: '初试', percentage: 0.3, status: 'pending' },
        { name: '加克重抛光', percentage: 1, status: 'pending' },
        { name: '试样品', percentage: 0.3, status: 'pending' }
      ]
    },
    repair: {
      name: '返修',
      items: []
    }
  }
};

Mold.create(seedData)
  .then(() => {
    console.log('测试数据导入成功');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('导入失败:', err);
    mongoose.connection.close();
  });
```

运行：
```bash
node server/seed.js
```

## 功能体验流程

### 1. 首页 (http://localhost:8000)
- 查看所有模具订单列表
- 查看每个模具的进度百分比
- 点击模具进入详情页

### 2. 详情页 (http://localhost:8000/detail.html?id=xxx)
- 查看模具的所有生产模块
- 查看每个工序的状态（红/黄/绿）
- 点击"开始"按钮开始工序
- 点击"完成"按钮完成工序
- 观看进度条实时更新

### 3. 主要操作
- **新建订单**：首页右上角"新建模具订单"按钮
- **加急**：在模具列表中点击"加急"按钮
- **申请返修**：详情页"返修"模块中"申请返修"按钮
- **库存管理**：辅料模块中管理库存状态

## 常见问题

### MongoDB 连接失败
**错误信息**：`MongooseError: Cannot connect to MongoDB`

**解决方案**：
```bash
# 确保 MongoDB 已启动
mongod

# 如果仍然失败，检查连接字符串
# 编辑 server/.env
MONGO_URI=mongodb://localhost:27017/moldmanagement
```

### 端口被占用
**错误信息**：`Port 5000 is already in use`

**解决方案**：
```bash
# 修改 server/.env 中的 PORT
PORT=5001
```

### 前端无法连接后端
**错误信息**：`CORS 错误` 或 `网络连接失败`

**解决方案**：
1. 确保后端服务已启动
2. 检查后端地址是否正确：http://localhost:5000
3. 检查防火墙设置

### 页面样式显示异常
**解决方案**：
- 清除浏览器缓存 (Ctrl+Shift+Delete)
- 尝试不同浏览器
- 检查浏览器控制台错误信息

## 生产环境部署

### 后端部署 (使用 PM2)
```bash
npm install -g pm2

cd server
npm install --production

pm2 start app.js --name "mold-server"
pm2 save
pm2 startup
```

### 前端部署 (使用 Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/client;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 性能优化建议

1. **数据库**：为经常查询的字段建立索引
2. **缓存**：使用 Redis 缓存频繁查询的数据
3. **负载均衡**：使用 Nginx 进行负载均衡
4. **CDN**：前端资源使用 CDN 加速
5. **监控**：部署日志和性能监控系统

## 支持与反馈

如有问题，请查看详细文档或联系开发团队。
