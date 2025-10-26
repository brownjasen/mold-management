# Java 后端快速开始

## 前置条件

- Java 17 或更高版本
- Maven 3.6 或更高版本
- MySQL 5.7 或更高版本
- Git（可选）

## 安装步骤

### 1. 准备数据库

**选项 A: 使用 MySQL 命令行**

```bash
mysql -u root -p < init.sql
```

**选项 B: 使用 MySQL Workbench 或其他 GUI 工具**

1. 打开 init.sql 文件
2. 执行所有 SQL 语句

### 2. 配置应用

编辑 `src/main/resources/application.properties`：

```properties
# 数据库配置
spring.datasource.url=jdbc:mysql://localhost:3306/mold_management
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. 构建项目

```bash
mvn clean install
```

### 4. 运行项目

```bash
mvn spring-boot:run
```

或者先编译再运行：

```bash
mvn clean package
java -jar target/mold-management-server-1.0.0.jar
```

### 5. 验证

访问以下 URL 验证应用是否正常运行：

- **API 首页**: http://localhost:8080/api/molds/list
- **库存列表**: http://localhost:8080/api/inventory

预期返回 JSON 响应：
```json
{
  "code": 0,
  "message": "获取成功",
  "data": [...]
}
```

## 常见问题

### 错误: 连接数据库失败
- 检查 MySQL 是否运行：`mysql -u root -p -e "SELECT 1;"`
- 检查数据库凭证是否正确
- 检查数据库是否已创建

### 错误: port 8080 already in use
修改 `application.properties`:
```properties
server.port=8081
```

### 错误: Maven 找不到依赖
```bash
mvn clean install -U
```

## 项目结构

```
java-server/
├── src/
│   ├── main/
│   │   ├── java/com/moldmanagement/
│   │   │   ├── MoldManagementApplication.java
│   │   │   ├── config/          # 配置类
│   │   │   ├── controller/      # 控制器
│   │   │   ├── service/         # 业务逻辑
│   │   │   ├── repository/      # 数据访问
│   │   │   ├── entity/          # 实体类
│   │   │   ├── dto/             # 数据传输对象
│   │   │   └── util/            # 工具类
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── init.sql
└── README.md
```

## API 使用示例

### 创建模具

```bash
curl -X POST http://localhost:8080/api/molds/create \
  -H "Content-Type: application/json" \
  -d '{
    "moldNumber": "MOL-004",
    "modules": [
      {
        "moduleName": "模架",
        "stageName": "设计图纸",
        "stagePercentage": 2.0,
        "status": "pending"
      }
    ]
  }'
```

### 获取所有模具

```bash
curl http://localhost:8080/api/molds/list
```

### 更新工序状态

```bash
curl -X PUT http://localhost:8080/api/molds/1/update-stage \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": 1,
    "status": "completed"
  }'
```

### 添加库存

```bash
curl -X POST http://localhost:8080/api/inventory/add \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "新零件",
    "partModel": "G-700",
    "currentStock": 500,
    "safetyStock": 200
  }'
```

### 出库

```bash
curl -X POST http://localhost:8080/api/inventory/deduct \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "铜板",
    "quantity": 50
  }'
```

## 开发模式

使用 Maven 的热重载功能进行开发：

```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.devtools.restart.enabled=true"
```

或在 IDE 中配置运行配置，选择 Spring Boot 应用并启用 "Enable live reload"。

## 构建生产包

```bash
mvn clean package -DskipTests
```

会在 `target/` 目录下生成 `mold-management-server-1.0.0.jar`

## 停止应用

按 `Ctrl+C` 停止运行中的应用。

## 更多信息

- Spring Boot 官方文档: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- MySQL: https://www.mysql.com/
