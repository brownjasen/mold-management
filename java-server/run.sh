#!/bin/bash

# 模具管理系统 - Java 后端启动脚本

echo ""
echo "========================================"
echo "模具精益生产管理系统 - Java 后端"
echo "========================================"
echo ""

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "错误: 未检测到 Java，请先安装 Java 17 或更高版本"
    echo "下载地址: https://www.oracle.com/java/technologies/downloads/"
    exit 1
fi

# 检查 Maven
if ! command -v mvn &> /dev/null; then
    echo "错误: 未检测到 Maven，请先安装 Maven 3.6 或更高版本"
    echo "下载地址: https://maven.apache.org/download.cgi"
    exit 1
fi

# 检查 MySQL
if command -v mysql &> /dev/null; then
    echo "正在初始化数据库..."
    mysql -u root -proot < init.sql
    if [ $? -ne 0 ]; then
        echo "数据库初始化警告: 请检查 MySQL 用户名和密码"
    else
        echo "数据库初始化完成"
    fi
else
    echo "警告: 未检测到 MySQL 命令行工具"
    echo "请确保 MySQL 服务已启动并且可访问"
fi

echo ""
echo "正在构建项目..."
echo ""

mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "错误: Maven 构建失败"
    exit 1
fi

echo ""
echo "========================================"
echo "项目构建完成，启动应用..."
echo "========================================"
echo ""
echo "应用地址: http://localhost:8080"
echo "API 文档: http://localhost:8080/api/molds/list"
echo ""
echo "按 Ctrl+C 停止应用"
echo ""

java -jar target/mold-management-server-1.0.0.jar
