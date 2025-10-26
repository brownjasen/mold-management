# 模具精益生产管理系统 - Java后端

基于 Spring Boot 3.1.5 和 MySQL 的完整后端实现。

## 项目结构

```
java-server/
├── src/
│   ├── main/
│   │   ├── java/com/moldmanagement/
│   │   │   ├── MoldManagementApplication.java      # 主启动类
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java                 # CORS 配置
│   │   │   ├── controller/
│   │   │   │   ├── MoldController.java             # 模具 API 控制器
│   │   │   │   └── InventoryController.java        # 库存 API 控制器
│   │   │   ├── service/
│   │   │   │   ├── MoldService.java                # 模具业务逻辑
│   │   │   │   └── InventoryService.java           # 库存业务逻辑
│   │   │   ├── repository/
│   │   │   │   ├── MoldRepository.java             # 模具数据访问
│   │   │   │   └── InventoryRepository.java        # 库存数据访问
│   │   │   ├── entity/
│   │   │   │   ├── Mold.java                       # 模具实体
│   │   │   │   ├── MoldModule.java                 # 模具工序
│   │   │   │   └── Inventory.java                  # 库存实体
│   │   │   ├── dto/
│   │   │   │   ├── MoldDTO.java                    # 模具 DTO
│   │   │   │   ├── InventoryDTO.java               # 库存 DTO
│   │   │   │   └── ApiResponse.java                # 通用响应
│   │   │   └── util/
│   │   │       └── ProgressCalculator.java         # 进度计算工具
│   │   └── resources/
│   │       └── application.properties              # 应用配置
│   └── test/
│       └── java/
├── pom.xml                                         # Maven 依赖配置
└── README.md                                       # 项目说明
```

## 快速开始

### 前置条件
- Java 17+
- Maven 3.6+
- MySQL 5.7+

### 安装步骤

1. **配置数据库**
```sql
CREATE DATABASE mold_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **配置环境**
编辑 `src/main/resources/application.properties`：
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mold_management
spring.datasource.username=root
spring.datasource.password=your_password
```

3. **构建和运行**
```bash
mvn clean install
mvn spring-boot:run
```

4. **验证**
访问：http://localhost:8080/api/molds/list

## API 端点

### 模具管理
- `POST /api/molds/create` - 创建模具
- `GET /api/molds/list` - 获取列表
- `GET /api/molds/:id` - 获取详情
- `PUT /api/molds/:id/update-stage` - 更新工序
- `PUT /api/molds/:id/reprioritize` - 加急
- `POST /api/molds/:id/repair` - 申请返修

### 库存管理
- `GET /api/inventory` - 获取库存
- `POST /api/inventory/add` - 入库
- `POST /api/inventory/deduct` - 出库
- `GET /api/inventory/alerts` - 预警列表

## 配置说明

### CORS 配置
默认允许来自前端的跨域请求。

### 数据库自动建表
启用 Hibernate DDL 功能，自动创建表结构。

## 技术栈

- **框架**: Spring Boot 3.1.5
- **ORM**: Spring Data JPA + Hibernate
- **数据库**: MySQL 8.0
- **构建**: Maven
- **日志**: SLF4J + Logback
- **工具**: Lombok
