# 🚀 从这里开始

## 欢迎使用 模具精益生产管理系统！

这是一个完整的、生产级别的系统。让我们 **5 分钟内** 启动它。

---

## ⚡ 3 步快速启动

### 1️⃣ 初始化数据库

打开命令行，运行：
```bash
mysql -u root -p < java-server/init.sql
```

### 2️⃣ 启动后端

进入 `java-server` 目录，运行：

**Windows:**
```bash
cd java-server
run.bat
```

**Linux/Mac:**
```bash
cd java-server
chmod +x run.sh
./run.sh
```

**输出应该显示:**
```
 .   ____          _            __ _ _
/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/
Started MoldManagementApplication...
```

### 3️⃣ 启动前端和访问

打开新命令行窗口：
```bash
cd client
python -m http.server 8000
```

然后在浏览器中访问：
```
http://localhost:8000
```

**完成！🎉**

---

## 📚 了解更多

### 快速参考（推荐）
看这个 5 分钟就能读完：
👉 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

### 详细指南
想要深入了解？
👉 [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md)

### API 示例
需要调用 API？
👉 [java-server/API_EXAMPLES.md](java-server/API_EXAMPLES.md)

### 完整文档索引
要找什么都能查到：
👉 [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

## 🎯 典型操作

### 创建一个模具

```bash
curl -X POST http://localhost:8080/api/molds/create \
  -H "Content-Type: application/json" \
  -d '{
    "moldNumber": "MOL-2025-001",
    "modules": [
      {"moduleName": "模架", "stageName": "设计", "stagePercentage": 2.0},
      {"moduleName": "模架", "stageName": "加工", "stagePercentage": 50.0}
    ]
  }'
```

### 查看所有模具

```bash
curl http://localhost:8080/api/molds/list
```

### 标记工序完成

```bash
curl -X PUT http://localhost:8080/api/molds/1/update-stage \
  -H "Content-Type: application/json" \
  -d '{"moduleId": 1, "status": "completed"}'
```

更多例子查看 → [API 示例](java-server/API_EXAMPLES.md)

---

## ❓ 常见问题

### Q: MySQL 连接失败
**A:** 检查 MySQL 是否运行：
```bash
mysql -u root -p -e "SELECT 1;"
```

### Q: 端口被占用
**A:** 编辑 `java-server/src/main/resources/application.properties`：
```properties
server.port=8081
```

### Q: Maven 编译失败
**A:** 运行：
```bash
mvn clean install -U
```

### Q: 前后端无法通信
**A:** 
1. 检查后端是否正常：访问 http://localhost:8080/api/molds/list
2. 检查浏览器控制台是否有错误
3. 查看前端 API 配置

更多问题 → [QUICK_REFERENCE.md](QUICK_REFERENCE.md#常见问题速解)

---

## 📖 文档指南

| 对象 | 推荐阅读 |
|------|---------|
| **首次用户** | [QUICK_REFERENCE.md](QUICK_REFERENCE.md) ⭐ |
| **开发者** | [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md) |
| **运维人员** | [java-server/QUICKSTART.md](java-server/QUICKSTART.md) |
| **所有人** | [README.md](README.md) |

---

## 🎓 学习路径

### 第1步（5分钟）：快速上手
1. 按上面的 3 步快速启动
2. 访问 http://localhost:8000
3. 点击几个按钮体验功能

### 第2步（15分钟）：了解系统
1. 阅读 [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. 了解主要功能和 API
3. 试试不同的操作

### 第3步（1小时）：深入学习
1. 阅读 [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md)
2. 查看 [API 示例](java-server/API_EXAMPLES.md)
3. 浏览 [java-server/src](java-server/src) 下的源代码

### 第4步（持续）：掌握系统
1. 参考 [DIRECTORY_GUIDE.md](DIRECTORY_GUIDE.md) 理解项目结构
2. 基于 [COMPLETION_CHECKLIST.md](java-server/COMPLETION_CHECKLIST.md) 理解功能
3. 根据 [JAVA_BACKEND_GUIDE.md](JAVA_BACKEND_GUIDE.md#扩展建议) 进行扩展

---

## ✨ 系统特点

✅ **开箱即用** - 无需复杂配置，下载即用  
✅ **生产级质量** - 代码规范，可用于生产环境  
✅ **完整功能** - 模具管理、库存管理、进度追踪  
✅ **详尽文档** - 11+ 份文档，覆盖各个层面  
✅ **易于扩展** - 清晰的分层架构，便于功能扩展  

---

## 🚀 下一步

### 立即行动
```bash
# 1. 进入项目目录
cd E:\java\MoldManagement

# 2. 初始化数据库
mysql -u root -p < java-server\init.sql

# 3. 启动后端
cd java-server && run.bat

# 4. 在新窗口启动前端
cd client && python -m http.server 8000

# 5. 打开浏览器访问
http://localhost:8000
```

### 或者查看文档
- [快速参考卡](QUICK_REFERENCE.md) - 5 分钟速览
- [后端指南](JAVA_BACKEND_GUIDE.md) - 30 分钟详学
- [项目总览](README.md) - 全面了解

---

## 📞 需要帮助？

1. 查看 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) 的常见问题
2. 查看 [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) 查找相关文档
3. 查看 [java-server/API_EXAMPLES.md](java-server/API_EXAMPLES.md) 学习 API 调用

---

## 🎉 准备好了吗？

**让我们开始吧！**

运行这个命令：
```bash
cd java-server && run.bat
```

然后访问: http://localhost:8000

---

**💡 提示：** 在阅读本文档后，建议把 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) 放在手边，作为快速查阅表。

**祝您使用愉快！** 🚀✨
