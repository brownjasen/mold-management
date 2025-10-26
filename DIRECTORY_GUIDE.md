# 📁 项目完整结构

## 项目概览

```
MoldManagement/
├── 📄 README.md                    # 项目主文档
├── 📄 JAVA_BACKEND_GUIDE.md        # Java 后端集成指南 ⭐ 新增
├── 📄 PROJECT_SUMMARY.md           # 项目完成总结
├── 📄 COMPLETE_GUIDE.md            # 完整使用指南
├── 📄 USAGE.md                     # 快速使用指南
├── 📄 QUICKSTART.md                # 快速开始指南
├── 📄 MANIFEST.md                  # 项目清单
├── 📄 WELCOME.txt                  # 欢迎文档
│
├── 🗂️ client/                      # 前端应用
│   ├── 📄 index.html               # 首页
│   ├── 📄 detail.html              # 详情页
│   ├── 🗂️ css/                    # 样式文件
│   ├── 🗂️ js/                     # JavaScript 文件
│   │   └── api.js                 # API 调用
│   └── 🗂️ assets/                # 资源文件
│
├── 🗂️ server/                      # Node.js 后端（可选）
│   ├── 📄 app.js                   # Express 应用
│   ├── 📄 package.json             # npm 依赖配置
│   ├── 🗂️ controllers/            # 控制器
│   ├── 🗂️ routes/                 # 路由配置
│   ├── 🗂️ models/                 # 数据模型
│   └── 🗂️ middleware/             # 中间件
│
├── 🗂️ java-server/                 # Java 后端 ⭐ 新增 推荐
│   ├── 📄 pom.xml                  # Maven 配置
│   ├── 📄 init.sql                 # 数据库初始化脚本
│   ├── 📄 run.bat                  # Windows 启动脚本
│   ├── 📄 run.sh                   # Linux/Mac 启动脚本
│   ├── 📄 README.md                # Java 后端说明
│   ├── 📄 QUICKSTART.md            # 快速开始指南
│   ├── 📄 API_EXAMPLES.md          # API 使用示例
│   ├── 📄 COMPLETION_CHECKLIST.md  # 完成清单
│   │
│   └── 🗂️ src/
│       ├── main/
│       │   ├── java/com/moldmanagement/
│       │   │   ├── MoldManagementApplication.java  # 启动类
│       │   │   ├── config/
│       │   │   │   └── CorsConfig.java            # CORS 配置
│       │   │   ├── controller/
│       │   │   │   ├── MoldController.java        # 模具 API
│       │   │   │   └── InventoryController.java   # 库存 API
│       │   │   ├── service/
│       │   │   │   ├── MoldService.java           # 模具业务逻辑
│       │   │   │   └── InventoryService.java      # 库存业务逻辑
│       │   │   ├── repository/
│       │   │   │   ├── MoldRepository.java        # 模具 DAO
│       │   │   │   └── InventoryRepository.java   # 库存 DAO
│       │   │   ├── entity/
│       │   │   │   ├── Mold.java                  # 模具实体
│       │   │   │   ├── MoldModule.java            # 工序实体
│       │   │   │   └── Inventory.java             # 库存实体
│       │   │   ├── dto/
│       │   │   │   ├── ApiResponse.java           # 通用响应
│       │   │   │   ├── MoldDTO.java               # 模具 DTO
│       │   │   │   └── InventoryDTO.java          # 库存 DTO
│       │   │   └── util/
│       │   │       ├── ProgressCalculator.java    # 进度计算
│       │   │       ├── QueueManager.java          # 队列管理
│       │   │       └── TimeUtil.java              # 时间处理
│       │   └── resources/
│       │       └── application.properties         # 应用配置
│       └── test/                                   # 测试（待完成）
│
├── 📄 start.bat                    # 一键启动脚本（Node.js 版）
├── 📄 check.bat                    # 环境检查脚本
└── 📄 package.json                 # 项目根配置
```

## 🚀 快速导航

### 获取帮助
| 需求 | 位置 |
|------|------|
| 项目概述 | [README.md](README.md) |
| Java 后端指南 | [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md) ⭐ |
| 快速开始 | [QUICKSTART.md](QUICKSTART.md) |
| 详细使用指南 | [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) |
| API 文档 | [java-server/API_EXAMPLES.md](java-server/API_EXAMPLES.md) |
| 项目完成清单 | [java-server/COMPLETION_CHECKLIST.md](java-server/COMPLETION_CHECKLIST.md) |

### 启动应用
| 方式 | 命令 |
|------|------|
| Java 后端（推荐）| `cd java-server && run.bat` 或 `./run.sh` |
| Node.js 后端 | `cd server && npm install && npm start` |
| 前端 | `cd client && python -m http.server 8000` |

## 📊 技术架构

### Java 后端架构（推荐）⭐

```
前端 (HTML/CSS/JavaScript)
         ↓
    HTTP/REST API
         ↓
  Spring Boot 应用
    ├── Controller    (REST 接口)
    ├── Service       (业务逻辑)
    ├── Repository    (数据访问)
    └── Entity        (数据模型)
         ↓
    Spring Data JPA
         ↓
    MySQL 数据库
```

### Node.js 后端架构

```
前端 (HTML/CSS/JavaScript)
         ↓
    HTTP/REST API
         ↓
  Express 应用
    ├── Router
    ├── Controller
    └── Middleware
         ↓
    MongoDB 驱动
         ↓
    MongoDB 数据库
```

## 🔑 核心功能

### 1. 模具管理
- ✅ 创建/查看/删除模具
- ✅ 多工序流程管理
- ✅ 实时进度计算
- ✅ 优先级排序和加急处理
- ✅ 返修管理

### 2. 库存管理
- ✅ 库存追踪
- ✅ 入库/出库处理
- ✅ 安全库存预警
- ✅ 库存自动扣减

### 3. 数据跟踪
- ✅ 工序时间记录
- ✅ 状态实时更新
- ✅ 进度可视化

## 📝 文档指南

### 新用户
1. 先读 [README.md](README.md) 了解项目
2. 选择后端版本：推荐 Java
3. 按 [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md) 部署
4. 参考 [QUICKSTART.md](java-server/QUICKSTART.md) 快速开始

### 开发者
1. 查看 [java-server/COMPLETION_CHECKLIST.md](java-server/COMPLETION_CHECKLIST.md)
2. 阅读 [java-server/API_EXAMPLES.md](java-server/API_EXAMPLES.md)
3. 查阅源代码中的注释
4. 参考 [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md) 的扩展建议

### 运维人员
1. 查看启动脚本：`java-server/run.bat` 或 `run.sh`
2. 配置数据库：`java-server/init.sql`
3. 修改配置：`java-server/src/main/resources/application.properties`
4. 部署指南：参考 [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md) 的生产部署章节

## 🎯 典型工作流

### 场景 1: 创建并跟踪模具

```
1. POST /api/molds/create
   ├─ 创建模具记录
   └─ 初始化多个工序

2. PUT /api/molds/{id}/update-stage
   ├─ 标记工序开始
   └─ 自动计算进度

3. GET /api/molds/list
   └─ 查看模具列表和进度

4. PUT /api/molds/{id}/reprioritize
   └─ 加急处理（如需要）
```

### 场景 2: 库存管理

```
1. POST /api/inventory/add
   └─ 入库新零件

2. GET /api/inventory/alerts
   └─ 检查库存预警

3. POST /api/inventory/deduct
   └─ 为模具出库

4. POST /api/inventory/restock
   └─ 补充库存
```

## 🛠️ 故障排除

| 问题 | 解决方案 |
|------|---------|
| 后端无法启动 | 检查 Java 版本，确保 MySQL 运行 |
| 数据库连接失败 | 修改 application.properties 中的凭证 |
| 前后端无法通信 | 检查 CORS 配置和端口号 |
| Maven 编译失败 | 运行 `mvn clean install -U` |

## 📞 支持

- Java 文档：[spring.io](https://spring.io)
- MySQL 文档：[mysql.com](https://www.mysql.com)
- Node.js 文档：[nodejs.org](https://nodejs.org)

---

**项目完成度**: 100% ✨

**最后更新**: 2025年10月26日
