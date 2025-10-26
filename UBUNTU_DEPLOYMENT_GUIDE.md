# Ubuntu 服务器完整部署教程

本教程适用于在 Ubuntu 20.04/22.04 服务器上部署**模具精益生产管理系统**。

---

## 📋 目录

1. [系统环境准备](#系统环境准备)
2. [环境变量配置](#环境变量配置)
3. [后端部署 (Node.js)](#后端部署-nodejs)
4. [前端部署 (Nginx)](#前端部署-nginx)
5. [数据库配置](#数据库配置)
6. [开机自启设置](#开机自启设置)
7. [监控和维护](#监控和维护)
8. [常见问题排查](#常见问题排查)

---

## 系统环境准备

### 1. 更新系统包

```bash
sudo apt update
sudo apt upgrade -y
```

### 2. 安装必要的工具

```bash
sudo apt install -y curl wget git build-essential
```

### 3. 安装 Node.js (v18+)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

验证安装：
```bash
node --version
npm --version
```

### 4. 安装 Nginx（用于前端和反向代理）

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 5. 安装 MySQL 8.0（如需数据库）

```bash
sudo apt install -y mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 6. 安装 PM2（进程管理器）

```bash
sudo npm install -g pm2
```

---

## 环境变量配置

### 1. 克隆项目到服务器

```bash
cd /opt
sudo git clone <your-repo-url> moldmanagement
sudo chown -R $USER:$USER moldmanagement
cd moldmanagement
```

### 2. 创建生产环境配置文件

#### 后端环境变量 (server/.env)

```bash
cat > server/.env << 'EOF'
# 服务器配置
PORT=5000
NODE_ENV=production

# 数据库配置（如果使用数据库）
MONGO_URI=mongodb://localhost:27017/moldmanagement
# 或 MySQL
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=moldmanagement
# DB_PASSWORD=your-secure-password
# DB_NAME=moldmanagement

# API 配置
API_HOST=0.0.0.0
CORS_ORIGIN=http://your-server-ip

# 其他配置
LOG_LEVEL=info
EOF
```

#### 前端环境变量 (创建 .env.production)

```bash
cat > client/.env.production << 'EOF'
VITE_API_BASE_URL=http://your-server-ip/api
EOF
```

**替换 `your-server-ip` 为实际的服务器IP地址或域名**

---

## 后端部署 (Node.js)

### 1. 安装后端依赖

```bash
cd /opt/moldmanagement/server
npm install
```

### 2. 启动后端服务（使用 PM2）

```bash
pm2 start app.js --name "mold-backend"
```

### 3. 保存 PM2 配置

```bash
pm2 save
sudo pm2 startup
```

### 4. 验证后端运行

```bash
# 查看 PM2 进程列表
pm2 list

# 查看日志
pm2 logs mold-backend

# 测试 API
curl http://localhost:5000/health
```

### 5. PM2 常用命令

```bash
pm2 start app.js --name "mold-backend"      # 启动
pm2 stop mold-backend                        # 停止
pm2 restart mold-backend                     # 重启
pm2 delete mold-backend                      # 删除
pm2 logs mold-backend                        # 查看日志
pm2 monit                                    # 监控
```

---

## 前端部署 (Nginx)

### 1. 构建前端

首先在**本地机器**上构建前端（如果使用构建工具如 Vite/Webpack）：

```bash
cd client
npm install
npm run build  # 生成 dist 文件夹
```

或者直接使用静态文件：

```bash
# 如果客户端是纯 HTML/JS，复制所有文件到服务器
scp -r client/* user@your-server-ip:/tmp/client-build/
```

### 2. 上传前端到服务器

```bash
# 从本地机器上执行
scp -r client/dist user@your-server-ip:/tmp/client-build/

# 或通过 SSH 登录服务器执行
ssh user@your-server-ip
```

### 3. 配置 Nginx

创建 Nginx 配置文件：

```bash
sudo vim /etc/nginx/sites-available/moldmanagement
```

插入以下配置：

```nginx
server {
    listen 80;
    server_name your-server-ip your-domain.com;

    # 前端静态文件
    location / {
        root /opt/moldmanagement/client;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # API 代理到后端
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端健康检查端点
    location /health {
        proxy_pass http://localhost:5000/health;
    }
}
```

### 4. 启用 Nginx 配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/moldmanagement /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

### 5. 设置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp  # 或仅限内网访问

# 启用防火墙（如果未启用）
sudo ufw enable
```

---

## 数据库配置

### MySQL 初始化（如使用 Java + MySQL）

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库和用户
CREATE DATABASE moldmanagement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'moldmanagement'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON moldmanagement.* TO 'moldmanagement'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 导入初始数据（如有 SQL 文件）

```bash
mysql -u moldmanagement -p moldmanagement < /opt/moldmanagement/java-server/init.sql
```

---

## 开机自启设置

### 1. 创建 systemd 服务文件

```bash
sudo tee /etc/systemd/system/mold-backend.service > /dev/null << 'EOF'
[Unit]
Description=Mold Management Backend Service
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/moldmanagement/server
ExecStart=/usr/bin/node /opt/moldmanagement/server/app.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

### 2. 启用服务

```bash
sudo systemctl daemon-reload
sudo systemctl enable mold-backend
sudo systemctl start mold-backend

# 查看状态
sudo systemctl status mold-backend
```

### 3. 验证开机自启

```bash
# 重启服务器测试
sudo reboot

# 登录后检查
sudo systemctl status mold-backend
```

---

## 监控和维护

### 1. 实时监控

```bash
# 使用 PM2 监控
pm2 monit

# 或查看系统资源
top
htop  # 需要先安装：sudo apt install htop
```

### 2. 日志查看

```bash
# PM2 日志
pm2 logs mold-backend

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 系统日志
sudo journalctl -u mold-backend -f
```

### 3. 定期备份

```bash
#!/bin/bash
# 创建备份脚本：backup.sh

BACKUP_DIR="/opt/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# 备份前端文件
tar -czf $BACKUP_DIR/frontend_$TIMESTAMP.tar.gz /opt/moldmanagement/client/

# 备份数据库
mysqldump -u moldmanagement -p moldmanagement > $BACKUP_DIR/db_$TIMESTAMP.sql

echo "备份完成: $TIMESTAMP"

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

添加到定时任务（crontab）：

```bash
crontab -e

# 添加每天 2:00 AM 执行备份
0 2 * * * /opt/moldmanagement/backup.sh
```

### 4. 性能优化

#### Nginx 优化

```bash
# 编辑 Nginx 主配置
sudo vim /etc/nginx/nginx.conf

# 添加以下优化配置
worker_processes auto;
worker_connections 2048;
keepalive_timeout 65;
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css application/json;
```

#### Node.js 优化

```bash
# 设置环境变量
export NODE_ENV=production
export NODE_OPTIONS=--max-old-space-size=2048  # 2GB 内存限制
```

---

## 常见问题排查

### 1. 前端连不上后端

**问题症状：** 浏览器控制台显示 CORS 错误或网络错误

**解决步骤：**

```bash
# 1. 检查后端是否运行
pm2 list

# 2. 检查后端端口是否开放
sudo netstat -tlnp | grep 5000
# 或
sudo ss -tlnp | grep 5000

# 3. 测试后端连接
curl http://localhost:5000/health

# 4. 测试从客户端 IP 连接
curl http://your-server-ip:5000/health

# 5. 检查防火墙
sudo ufw status
sudo ufw allow 5000/tcp

# 6. 检查 CORS 配置
# 在 server/app.js 中确保 CORS 已启用
```

### 2. Nginx 返回 502 Bad Gateway

**原因：** 后端服务未运行或端口错误

```bash
# 1. 检查后端状态
pm2 status

# 2. 查看后端日志
pm2 logs mold-backend

# 3. 检查 Nginx 配置中的 proxy_pass 是否正确
sudo vim /etc/nginx/sites-available/moldmanagement

# 4. 重启 Nginx
sudo systemctl restart nginx
```

### 3. 静态文件 404

**原因：** 前端文件路径不对

```bash
# 1. 检查前端文件位置
ls -la /opt/moldmanagement/client/

# 2. 确保有 index.html
file /opt/moldmanagement/client/index.html

# 3. 检查 Nginx 配置中的 root 路径
cat /etc/nginx/sites-available/moldmanagement | grep root
```

### 4. 服务重启后消失

**原因：** PM2 未设置开机自启

```bash
# 重新配置开机自启
pm2 save
sudo pm2 startup

# 验证
pm2 list
sudo systemctl status pm2-$USER
```

### 5. 内存占用过高

```bash
# 查看进程内存占用
ps aux | grep node

# 限制 PM2 进程内存
pm2 restart mold-backend --max-memory-restart 500M

# 查看 PM2 配置
pm2 show mold-backend
```

---

## 完整部署检查清单

- [ ] 系统已更新，安装了 Node.js 和 Nginx
- [ ] 项目已克隆到 `/opt/moldmanagement`
- [ ] 后端 `.env` 文件已配置
- [ ] 后端依赖已安装，PM2 启动成功
- [ ] 前端文件已上传到服务器
- [ ] Nginx 已配置并重启
- [ ] 防火墙规则已配置
- [ ] 可通过浏览器访问 `http://your-server-ip`
- [ ] 前端能成功连接后端 API
- [ ] 开机自启已配置
- [ ] 备份脚本已部署

---

## 快速启动脚本

将以下脚本保存为 `deploy.sh`：

```bash
#!/bin/bash

set -e  # 任何错误都会停止脚本

echo "=== 模具管理系统 Ubuntu 部署脚本 ==="

# 配置变量
SERVER_IP=${1:-"localhost"}
PROJECT_PATH="/opt/moldmanagement"

echo "📦 安装系统依赖..."
sudo apt update
sudo apt install -y curl wget git build-essential nginx

echo "📦 安装 Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

echo "📦 安装 PM2..."
sudo npm install -g pm2

echo "📁 配置项目..."
cd $PROJECT_PATH

echo "📝 更新环境变量..."
sed -i "s/your-server-ip/$SERVER_IP/g" server/.env
sed -i "s/your-server-ip/$SERVER_IP/g" client/.env.production

echo "📦 安装后端依赖..."
cd server
npm install
pm2 start app.js --name "mold-backend"
pm2 save

echo "🌐 配置 Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/moldmanagement
sudo ln -sf /etc/nginx/sites-available/moldmanagement /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

echo "✅ 部署完成！"
echo "📍 访问地址: http://$SERVER_IP"
echo "📊 后端 API: http://$SERVER_IP/api"
```

使用方法：

```bash
chmod +x deploy.sh
./deploy.sh your-server-ip
```

---

## 支持和反馈

如有问题，请查看：
- 后端日志: `pm2 logs mold-backend`
- Nginx 日志: `sudo tail -f /var/log/nginx/error.log`
- 系统日志: `sudo journalctl -xe`

**最后更新：** 2024 年
