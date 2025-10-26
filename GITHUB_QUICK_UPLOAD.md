# 📤 GitHub 上传快速卡片

## 3 分钟快速上传

### 1️⃣ 创建 GitHub 仓库（2分钟）
```
1. 访问 https://github.com/new
2. 仓库名: mold-management
3. 选择 Public
4. 点击 Create repository
5. 复制页面上显示的命令
```

### 2️⃣ 运行命令（1分钟）
```bash
cd E:\java\MoldManagement

# 粘贴 GitHub 给你的三行命令
git remote add origin https://github.com/YOUR-USERNAME/mold-management.git
git branch -M main
git push -u origin main
```

### 3️⃣ 输入凭证
- HTTPS: 输入 Personal Token（从 https://github.com/settings/tokens 获取）
- SSH: 如果提示，确认主机密钥

**完成！✅**

---

## 获取 Personal Token（HTTPS 方式）

1. 访问: https://github.com/settings/tokens
2. 点击 "Generate new token"
3. 给 token 起个名字（如 "GitHub Upload"）
4. 勾选 `repo` 权限
5. 点击 "Generate token"
6. **复制 token**（只显示一次！）
7. 作为密码粘贴到命令行

---

## Git 状态检查

```bash
# 查看当前状态
git status

# 查看远程配置
git remote -v

# 查看提交历史
git log --oneline
```

---

## 推送更新（后续使用）

```bash
# 添加变更
git add .

# 提交变更
git commit -m "Your message"

# 推送到 GitHub
git push
```

---

## 常见错误

| 错误 | 解决方案 |
|------|---------|
| `fatal: not a git repository` | 确保在 `E:\java\MoldManagement` 目录 |
| `Permission denied (publickey)` | SSH 配置问题，改用 HTTPS |
| `403 Forbidden` | Token 过期或权限不足，重新生成 |
| `fatal: remote origin already exists` | 运行 `git remote remove origin` 后重试 |

---

## 有用的链接

- GitHub: https://github.com
- 创建仓库: https://github.com/new
- 生成 Token: https://github.com/settings/tokens
- GitHub 文档: https://docs.github.com

---

**准备好了吗？开始上传吧！** 🚀
