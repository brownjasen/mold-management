# 🚀 快速参考卡

## 安装 & 启动（3步搞定）

### 第一步：准备数据库
```bash
mysql -u root -p < java-server/init.sql
```

### 第二步：启动后端
**Windows:**
```bash
cd java-server
run.bat
```

**Linux/Mac:**
```bash
cd java-server
./run.sh
```

**手动启动:**
```bash
cd java-server
mvn spring-boot:run
```

### 第三步：启动前端
```bash
cd client
python -m http.server 8000
```

**访问:** http://localhost:8000

---

## API 速查表

### 创建模具
```bash
curl -X POST http://localhost:8080/api/molds/create \
  -H "Content-Type: application/json" \
  -d '{
    "moldNumber": "MOL-001",
    "modules": [
      {"moduleName": "模架", "stageName": "设计", "stagePercentage": 2.0}
    ]
  }'
```

### 获取模具列表
```bash
curl http://localhost:8080/api/molds/list
```

### 更新工序状态
```bash
curl -X PUT http://localhost:8080/api/molds/1/update-stage \
  -H "Content-Type: application/json" \
  -d '{"moduleId": 1, "status": "completed"}'
```

### 加急处理
```bash
curl -X PUT http://localhost:8080/api/molds/1/reprioritize
```

### 库存出库
```bash
curl -X POST http://localhost:8080/api/inventory/deduct \
  -H "Content-Type: application/json" \
  -d '{"partName": "铜板", "quantity": 50}'
```

---

## 关键配置文件

### 数据库配置
📄 `java-server/src/main/resources/application.properties`

修改以下内容：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mold_management
spring.datasource.username=root
spring.datasource.password=root
server.port=8080
```

### 初始化脚本
📄 `java-server/init.sql`

包含：
- 数据库创建
- 表结构创建
- 示例数据插入

---

## 文件位置导图

```
MoldManagement/
├── java-server/
│   ├── src/                     代码目录
│   ├── pom.xml                 Maven配置 ← 依赖配置在这里
│   ├── init.sql                数据库脚本 ← 首先运行这个
│   ├── run.bat                 启动脚本（Windows） ← 使用这个启动
│   ├── run.sh                  启动脚本（Linux）
│   └── src/main/resources/
│       └── application.properties ← 修改数据库配置
├── client/                      前端代码
└── 其他文档...
```

---

## 常见问题速解

### ❌ MySQL 连接失败
```bash
# 检查 MySQL 是否运行
mysql -u root -p -e "SELECT 1"

# 检查用户名密码
# 编辑 application.properties
# 重新运行 init.sql
```

### ❌ 端口被占用
```properties
# 修改 application.properties
server.port=8081
```

### ❌ Maven 编译失败
```bash
mvn clean install -U
```

### ❌ 前后端无法通信
1. 检查后端是否运行：http://localhost:8080/api/molds/list
2. 检查前端 API 地址配置
3. 检查浏览器控制台的错误信息

---

## 文件清单

### 必需文件
- ✅ pom.xml
- ✅ init.sql
- ✅ application.properties

### 启动脚本
- ✅ run.bat (Windows)
- ✅ run.sh (Linux/Mac)

### 源代码（17 个 Java 文件）
- Entity: Mold, MoldModule, Inventory
- Service: MoldService, InventoryService
- Controller: MoldController, InventoryController
- Repository: MoldRepository, InventoryRepository
- DTO: ApiResponse, MoldDTO, InventoryDTO
- Config: CorsConfig
- Util: ProgressCalculator, QueueManager, TimeUtil

---

## API 响应格式

### ✅ 成功响应
```json
{
  "code": 0,
  "message": "操作成功",
  "data": { /* 数据 */ }
}
```

### ❌ 错误响应
```json
{
  "code": -1,
  "message": "错误信息",
  "data": null
}
```

---

## 工序状态值

| 状态 | 值 | 含义 |
|------|--------|------|
| 未开始 | pending | 红色，未处理 |
| 进行中 | in_progress | 黄色，正在处理 |
| 已完成 | completed | 绿色，处理完成 |

---

## 快速链接

- 📖 完整指南: [JAVA_BACKEND_GUIDE.md](../JAVA_BACKEND_GUIDE.md)
- 🚀 快速开始: [QUICKSTART.md](QUICKSTART.md)
- 📚 API 示例: [API_EXAMPLES.md](API_EXAMPLES.md)
- ✅ 完成清单: [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)
- 📊 项目总结: [README.md](../README.md)

---

## 技术栈速览

| 组件 | 版本 | 说明 |
|------|------|------|
| Java | 17 | 编程语言 |
| Spring Boot | 3.1.5 | 框架 |
| Spring Data JPA | 3.1.5 | ORM |
| MySQL | 8.0 | 数据库 |
| Maven | 3.6+ | 构建工具 |
| Lombok | 1.18 | 代码简化 |

---

## 电梯演讲 (30秒版)

这是一个**模具精益生产管理系统**的 **Java 后端**实现：

- 🎯 完整的 REST API（14 个端点）
- 📊 支持多工序流程管理
- 📈 自动进度计算
- 🏭 库存管理和预警
- ✅ 生产级别代码质量
- 🚀 一键启动脚本

**立即开始**: 运行 `java-server/run.bat` 或 `run.sh`

---

**💡 提示**: 这个卡片应该印出来贴在显示器旁边！
