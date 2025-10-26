# 项目整合指南 - Node.js 前端 + Java 后端

本项目包含两个后端实现版本：
- **Node.js/Express** 版本（在 `server/` 目录）
- **Java/Spring Boot** 版本（在 `java-server/` 目录）

可根据需要选择使用。

## 架构概览

```
MoldManagement/
├── client/                 # 前端（HTML/CSS/JavaScript）
├── server/                 # Node.js 后端（可选）
├── java-server/            # Java 后端（推荐）
└── 其他文档
```

## 快速开始

### 前端 + Java 后端

#### 第一步：准备数据库

```bash
# 使用 MySQL
mysql -u root -p < java-server/init.sql
```

#### 第二步：启动后端

**方式 1: 使用启动脚本（推荐）**

Windows:
```bash
cd java-server
run.bat
```

Linux/Mac:
```bash
cd java-server
chmod +x run.sh
./run.sh
```

**方式 2: 手动启动**

```bash
cd java-server
mvn clean package
java -jar target/mold-management-server-1.0.0.jar
```

**方式 3: 开发模式**

```bash
cd java-server
mvn spring-boot:run
```

#### 第三步：启动前端

```bash
cd client
python -m http.server 8000
# 或使用其他 HTTP 服务器
```

#### 第四步：访问应用

打开浏览器访问：http://localhost:8000

## 前端配置

### 修改 API 地址

如果后端不是运行在 `http://localhost:8080`，需要修改前端 API 配置：

**文件**: `client/js/api.js`（如果存在）或 HTML 文件中的 fetch 调用

从：
```javascript
fetch('http://localhost:8080/api/molds/list')
```

改为：
```javascript
fetch('http://localhost:YOUR_PORT/api/molds/list')
```

## Java 后端详细信息

### 环境要求

- Java 17+
- Maven 3.6+
- MySQL 5.7+

### 项目结构

```
java-server/
├── src/main/java/com/moldmanagement/
│   ├── config/          # Spring 配置
│   ├── controller/      # REST 控制器
│   ├── service/         # 业务逻辑
│   ├── repository/      # 数据访问层
│   ├── entity/          # JPA 实体
│   ├── dto/             # 数据传输对象
│   └── util/            # 工具类
├── src/main/resources/
│   └── application.properties
├── pom.xml
├── init.sql
├── run.bat
├── run.sh
└── QUICKSTART.md
```

### 配置文件

**文件**: `src/main/resources/application.properties`

关键配置：
```properties
# 数据库
spring.datasource.url=jdbc:mysql://localhost:3306/mold_management
spring.datasource.username=root
spring.datasource.password=root

# 服务器端口
server.port=8080
```

### API 端点

所有 API 都遵循 REST 风格，使用标准 HTTP 方法。

#### 模具管理

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | /api/molds/create | 创建模具 |
| GET | /api/molds/list | 获取模具列表 |
| GET | /api/molds/{id} | 获取模具详情 |
| PUT | /api/molds/{id}/update-stage | 更新工序 |
| PUT | /api/molds/{id}/reprioritize | 加急 |
| POST | /api/molds/{id}/repair | 返修申请 |
| DELETE | /api/molds/{id} | 删除模具 |

#### 库存管理

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | /api/inventory | 获取库存列表 |
| GET | /api/inventory/{id} | 获取库存详情 |
| POST | /api/inventory/add | 入库 |
| POST | /api/inventory/deduct | 出库 |
| POST | /api/inventory/restock | 补货 |
| GET | /api/inventory/alerts | 低库存预警 |
| DELETE | /api/inventory/{id} | 删除库存 |

## Node.js 后端（可选）

如果想使用原有的 Node.js 后端：

```bash
cd server
npm install
npm start
```

服务器运行在 `http://localhost:5000`

## 常见问题

### 问题 1: 前后端无法通信

**检查清单**：
1. 后端是否正常运行（http://localhost:8080/api/molds/list）
2. 前端 API 地址配置是否正确
3. 浏览器控制台是否有跨域错误
4. 防火墙是否阻止了连接

### 问题 2: 数据库连接失败

**解决方案**：
1. 确保 MySQL 服务已启动
2. 检查数据库用户名和密码
3. 确认数据库已创建：`mysql -u root -p -e "SHOW DATABASES;"`
4. 检查 `application.properties` 中的数据库 URL 是否正确

### 问题 3: Maven 编译失败

**解决方案**：
```bash
# 清理缓存并重新下载依赖
mvn clean install -U
```

### 问题 4: 端口已被占用

**解决方案**：
- 修改 `application.properties` 中的 `server.port`
- 或关闭占用该端口的其他程序

## 性能优化建议

### 后端
- 启用数据库连接池
- 添加 Redis 缓存
- 实现分页查询
- 添加数据库索引

### 前端
- 实现虚拟滚动
- 使用浏览器缓存
- 压缩资源文件
- 懒加载组件

## 扩展建议

### 短期
- [ ] 添加用户认证（JWT）
- [ ] 数据验证和错误处理
- [ ] 日志记录和监控
- [ ] 单元测试

### 中期
- [ ] 权限管理（RBAC）
- [ ] 数据报表导出
- [ ] WebSocket 实时通知
- [ ] 文件上传功能

### 长期
- [ ] 微服务架构
- [ ] 分布式系统
- [ ] 机器学习优化
- [ ] 移动端应用

## 生产部署

### Java 应用部署

1. **构建 JAR 包**
```bash
mvn clean package -DskipTests
```

2. **上传到服务器**
```bash
scp target/mold-management-server-1.0.0.jar user@server:/path/
```

3. **后台运行**
```bash
nohup java -jar mold-management-server-1.0.0.jar &
```

4. **使用 systemd 管理**（Linux）
```bash
# 创建 /etc/systemd/system/mold-server.service
[Service]
ExecStart=/usr/bin/java -jar /path/mold-management-server-1.0.0.jar
```

## 技术支持

### Java 后端相关
- Spring Boot: https://spring.io/projects/spring-boot
- Spring Data JPA: https://spring.io/projects/spring-data-jpa
- Maven: https://maven.apache.org/

### Node.js 后端相关
- Express: https://expressjs.com/
- MongoDB: https://www.mongodb.com/

## 许可证

MIT License

---

**提示**: 推荐使用 Java 后端，提供更好的性能和可维护性。
