# 📋 项目文件清单

## 根目录
```
✓ start.bat                     - 一键启动脚本（Windows）
✓ check.bat                     - 项目检查工具
✓ package.json                  - 项目根配置
✓ README.md                     - 完整项目文档
✓ USAGE.md                      - 使用指南
✓ QUICKSTART.md                 - 快速开始
✓ PROJECT_SUMMARY.md            - 项目总结
✓ MANIFEST.md                   - 本文件
```

## 后端目录 (server/)
### 应用文件
```
✓ app.js                        - 主应用（内存版本，推荐使用）
✓ app-demo.js                   - 备用应用文件
✓ package.json                  - 后端依赖配置
✓ .env                          - 环境变量配置
```

### 控制器 (controllers/)
```
✓ moldControllerDemo.js         - 模具管理业务逻辑
✓ inventoryControllerDemo.js    - 库存管理业务逻辑
✓ moldController.js             - 模具管理（MongoDB版）
✓ inventoryController.js        - 库存管理（MongoDB版）
```

### 路由 (routes/)
```
✓ moldsDemo.js                  - 模具API路由（内存版）
✓ inventoryDemo.js              - 库存API路由（内存版）
✓ molds.js                      - 模具API路由（MongoDB版）
✓ inventory.js                  - 库存API路由（MongoDB版）
```

### 模型 (models/)
```
✓ Mold.js                       - 模具数据模型（Mongoose）
✓ Inventory.js                  - 库存数据模型（Mongoose）
```

## 前端目录 (client/)
### 页面
```
✓ index.html                    - 首页（模具列表）
✓ detail.html                   - 详情页（生产流程）
```

### 组件 (src/components/)
```
✓ ModuleSection.vue             - 工序模块组件（可选）
✓ AccessorySection.vue          - 辅料管理组件（可选）
✓ RepairSection.vue             - 返修管理组件（可选）
```

### 页面 (src/views/)
```
✓ MoldList.vue                  - 模具列表页面（可选）
✓ MoldDetail.vue                - 模具详情页面（可选）
```

### API客户端 (src/api/)
```
✓ client.js                     - API通信客户端
```

## 文档文件
```
✓ README.md                     - 项目完整文档
✓ USAGE.md                      - 快速使用指南
✓ QUICKSTART.md                 - 快速开始指南
✓ PROJECT_SUMMARY.md            - 项目总结
✓ MANIFEST.md                   - 文件清单（本文件）
```

---

## 📊 项目统计

### 代码文件
- 后端 JavaScript: 8 个文件
- 前端 HTML: 2 个文件
- 前端 Vue: 5 个文件（可选）
- 配置文件: 3 个文件

### 文档文件
- Markdown 文档: 5 个文件
- 启动脚本: 2 个文件

### 总计
**约 25+ 个代码和文档文件**

---

## 🚀 核心文件说明

### 必须文件（运行所需）
| 文件 | 用途 | 优先级 |
|------|------|--------|
| server/app.js | 后端主程序 | ⭐⭐⭐ |
| server/package.json | 依赖管理 | ⭐⭐⭐ |
| client/index.html | 首页 | ⭐⭐⭐ |
| client/detail.html | 详情页 | ⭐⭐⭐ |
| start.bat | 启动脚本 | ⭐⭐ |

### 可选文件（功能扩展）
| 文件 | 用途 | 优先级 |
|------|------|--------|
| server/models/Mold.js | MongoDB支持 | ⭐⭐ |
| src/views/MoldList.vue | Vue框架支持 | ⭐⭐ |
| check.bat | 环境检查 | ⭐ |

---

## ✅ 文件完整性检查

### 后端核心
- [x] app.js - 服务器主文件
- [x] package.json - 依赖配置
- [x] .env - 环境变量
- [x] routes/ - API路由
- [x] controllers/ - 业务逻辑

### 前端核心
- [x] index.html - 首页
- [x] detail.html - 详情页
- [x] src/api/client.js - API客户端

### 文档完整性
- [x] README.md - 项目文档
- [x] USAGE.md - 使用指南
- [x] QUICKSTART.md - 快速开始

### 工具脚本
- [x] start.bat - 一键启动
- [x] check.bat - 环境检查

---

## 🔄 文件依赖关系

```
start.bat
  ├── server/package.json
  │   ├── server/app.js
  │   │   ├── server/routes/moldsDemo.js
  │   │   │   └── server/controllers/moldControllerDemo.js
  │   │   └── server/routes/inventoryDemo.js
  │   │       └── server/controllers/inventoryControllerDemo.js
  │   └── node_modules/ (自动安装)
  │
  └── client/
      ├── index.html
      │   └── client/src/api/client.js
      └── detail.html
          └── client/src/api/client.js
```

---

## 📦 依赖管理

### 后端依赖 (server/package.json)
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "mongoose": "^7.0.0"
  }
}
```

### 前端依赖
- 无外部依赖（原生HTML/CSS/JavaScript）
- 可选：Vue 3（组件示例）

---

## 🛠️ 文件修改指南

### 要修改的文件
- `start.bat` - 自定义启动端口
- `server/.env` - 修改数据库连接
- `client/index.html` - 自定义首页样式

### 不要修改的文件
- `server/app.js` - 核心逻辑
- `server/controllers/` - 业务逻辑
- `README.md` 和其他文档

### 可扩展的文件
- `server/routes/` - 添加新路由
- `client/src/` - 添加新组件
- `server/models/` - 扩展数据模型

---

## 📝 文件版本

| 文件 | 版本 | 日期 | 备注 |
|------|------|------|------|
| app.js | 1.0 | 2025-10-26 | 内存版本 |
| index.html | 1.0 | 2025-10-26 | 原生实现 |
| detail.html | 1.0 | 2025-10-26 | 原生实现 |
| README.md | 1.0 | 2025-10-26 | 完整文档 |

---

## 🎯 使用说明

### 新手用户
1. 查看 `USAGE.md`
2. 双击 `start.bat`
3. 访问 `http://localhost:8000`

### 开发人员
1. 查看 `README.md`
2. 修改 `server/` 中的控制器
3. 修改 `client/` 中的页面

### 运维人员
1. 运行 `check.bat` 检查环境
2. 查看 `QUICKSTART.md` 部署指南
3. 配置 `.env` 文件

---

## 🔐 文件权限

- 启动脚本：可执行
- 源代码文件：可读写
- 文档文件：可读
- 配置文件：可读写

---

## 📤 文件分发

### 开发版
- 包含所有源代码文件
- 包含完整的文档
- 适合二次开发

### 生产版
- 仅包含必要的运行文件
- 代码可压缩和混淆
- 文档可精简

---

## 🆘 文件故障排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 找不到 start.bat | 位置错误 | 确保在项目根目录 |
| start.bat 无法运行 | 权限问题 | 右键"以管理员身份运行" |
| 找不到 node_modules | 未安装 | 自动安装或手动 npm install |
| 页面无法加载 | 服务未启动 | 检查命令行窗口 |

---

**文件清单生成时间：2025-10-26**
**项目版本：1.0.0**
**状态：✅ 完成**
