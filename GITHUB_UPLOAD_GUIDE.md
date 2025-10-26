# 📤 GitHub 上传完整指南

## 概述

您的项目已初始化为 Git 仓库，现在可以上传到 GitHub。

---

## 前置条件

### 1. 安装 Git
- 已验证：✅ Git 2.45.1 已安装

### 2. GitHub 账户
- 需要拥有 GitHub 账户
- 访问: https://github.com

### 3. 认证方式（选择其一）
- **HTTPS**: 需要 GitHub Personal Token
- **SSH**: 需要 SSH 密钥对（推荐）

---

## 快速上传（3步）

### 步骤 1: 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写表单：
   - **Repository name**: `mold-management` (或任意名称)
   - **Description**: `模具精益生产管理系统 - Complete Mold Management System`
   - **Public**: ✓ (选中，如果想公开)
   - **Initialize repository**: ✗ (不选，因为已有本地仓库)
3. 点击 "Create repository"
4. 记下仓库 URL

### 步骤 2: 配置远程仓库

打开命令行，进入项目目录：

```bash
cd E:\java\MoldManagement
```

**选项 A: 使用 HTTPS（简单）**

```bash
git remote add origin https://github.com/YOUR-USERNAME/mold-management.git
git branch -M main
git push -u origin main
```

**选项 B: 使用 SSH（推荐，更安全）**

```bash
git remote add origin git@github.com:YOUR-USERNAME/mold-management.git
git branch -M main
git push -u origin main
```

### 步骤 3: 输入凭证

- **HTTPS**: 输入 GitHub Personal Token（或密码）
- **SSH**: 如果第一次使用，可能需要确认主机密钥

完成后，您会看到：

```
Enumerating objects: 74, done.
Counting objects: 100% (74/74), done.
...
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **上传完成！**

---

## 详细步骤

### 第1步：在 GitHub 创建仓库

#### 访问 GitHub

1. 打开浏览器
2. 访问 https://github.com/new
3. 使用您的 GitHub 账户登录

#### 填写仓库信息

| 字段 | 值 |
|------|-----|
| Repository name | `mold-management` |
| Description | `模具精益生产管理系统 / Complete Mold Management System` |
| Visibility | Public (如果想公开) |
| Initialize this repository with | ✗ (不勾选) |

#### 创建仓库

点击 "Create repository" 按钮

您会被重定向到新仓库页面，看到类似：

```
git remote add origin https://github.com/YOUR-USERNAME/mold-management.git
git branch -M main
git push -u origin main
```

### 第2步：添加远程仓库

打开 PowerShell 或命令行：

```powershell
cd E:\java\MoldManagement
```

运行命令（复制上面 GitHub 提供的 URL）：

```bash
git remote add origin https://github.com/YOUR-USERNAME/mold-management.git
```

验证：

```bash
git remote -v
```

应该看到：

```
origin  https://github.com/YOUR-USERNAME/mold-management.git (fetch)
origin  https://github.com/YOUR-USERNAME/mold-management.git (push)
```

### 第3步：重命名分支并推送

```bash
git branch -M main
```

```bash
git push -u origin main
```

输入您的 GitHub 凭证（HTTPS 方式）或确认 SSH 密钥。

### 第4步：验证上传

访问您的 GitHub 仓库：

```
https://github.com/YOUR-USERNAME/mold-management
```

您应该看到所有文件已上传。

---

## 常见问题

### Q1: 我没有 GitHub 账户？

访问 https://github.com/signup 创建一个免费账户。

### Q2: 我想使用 SSH 而不是 HTTPS？

首先配置 SSH 密钥：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

然后在 GitHub Settings → SSH and GPG keys 中添加公钥。

### Q3: 如何生成 Personal Access Token？

1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 选择 `repo` 权限
4. 生成并复制 token
5. 使用 token 作为密码进行 HTTPS 推送

### Q4: 推送时出错？

检查：

```bash
# 确认远程配置
git remote -v

# 查看当前分支
git branch

# 查看提交历史
git log
```

### Q5: 如何推送其他分支？

```bash
# 创建新分支
git checkout -b feature/new-feature

# 进行更改并提交
git add .
git commit -m "Your message"

# 推送分支
git push -u origin feature/new-feature
```

---

## 推送后的操作

### 1. 验证仓库

访问您的 GitHub 仓库检查：

- ✓ 所有文件都已上传
- ✓ README.md 已显示
- ✓ 提交历史正确

### 2. 添加更多信息

在 GitHub 仓库页面：

- 添加 Repository Description
- 添加 Topics（标签）
- 配置 Collaborators

### 3. 后续更新

在本地进行更改后：

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 快速参考

```bash
# 初始化（已完成）
git init
git config user.name "Your Name"
git config user.email "your@email.com"
git add .
git commit -m "Initial commit"

# 添加远程（需要）
git remote add origin https://github.com/YOU/repo.git

# 更改分支名称（可选）
git branch -M main

# 推送（需要）
git push -u origin main

# 后续更新
git add .
git commit -m "message"
git push
```

---

## 仓库结构

您的 GitHub 仓库将包含：

```
mold-management/
├── java-server/              # Java 后端
│   ├── src/                  # Java 源代码
│   ├── pom.xml               # Maven 配置
│   ├── init.sql              # 数据库脚本
│   ├── run.bat / run.sh      # 启动脚本
│   └── *.md                  # 文档
│
├── client/                   # 前端
│   ├── *.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── server/                   # Node.js 后端（可选）
│   ├── app.js
│   ├── package.json
│   ├── controllers/
│   ├── routes/
│   └── models/
│
├── *.md                      # 项目文档
├── .gitignore               # Git 忽略文件
├── package.json             # 项目根配置
└── start.bat                # 启动脚本
```

---

## 下载和使用

其他人可以通过以下方式克隆您的仓库：

```bash
git clone https://github.com/YOUR-USERNAME/mold-management.git
cd mold-management
```

---

## 许可证（可选）

如果想添加许可证，在 GitHub 仓库页面：

1. 点击 "Add file" → "Create new file"
2. 输入文件名：`LICENSE`
3. GitHub 会建议选择许可证类型（如 MIT）

---

## 总结

| 步骤 | 状态 | 说明 |
|------|------|------|
| Git 初始化 | ✅ 完成 | 项目已成为 Git 仓库 |
| 创建 GitHub 仓库 | ⏳ 需要 | 访问 https://github.com/new |
| 添加远程仓库 | ⏳ 需要 | 运行 `git remote add origin ...` |
| 推送代码 | ⏳ 需要 | 运行 `git push -u origin main` |

---

## 需要帮助？

- GitHub 文档: https://docs.github.com
- Git 文档: https://git-scm.com/doc
- 本项目文档: 查看 README.md

---

**现在就可以上传您的项目到 GitHub 了！** 🚀
