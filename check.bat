@echo off
chcp 65001 >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     模具精益生产管理系统 - 项目检查工具                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 正在检查项目结构...
echo.

REM 检查关键文件
if exist "package.json" (
    echo ✓ package.json
) else (
    echo ✗ package.json 缺失
)

if exist "start.bat" (
    echo ✓ start.bat
) else (
    echo ✗ start.bat 缺失
)

if exist "README.md" (
    echo ✓ README.md
) else (
    echo ✗ README.md 缺失
)

if exist "USAGE.md" (
    echo ✓ USAGE.md
) else (
    echo ✗ USAGE.md 缺失
)

if exist "server\app.js" (
    echo ✓ server\app.js
) else (
    echo ✗ server\app.js 缺失
)

if exist "server\package.json" (
    echo ✓ server\package.json
) else (
    echo ✗ server\package.json 缺失
)

if exist "server\routes\moldsDemo.js" (
    echo ✓ server\routes\moldsDemo.js
) else (
    echo ✗ server\routes\moldsDemo.js 缺失
)

if exist "server\controllers\moldControllerDemo.js" (
    echo ✓ server\controllers\moldControllerDemo.js
) else (
    echo ✗ server\controllers\moldControllerDemo.js 缺失
)

if exist "client\index.html" (
    echo ✓ client\index.html
) else (
    echo ✗ client\index.html 缺失
)

if exist "client\detail.html" (
    echo ✓ client\detail.html
) else (
    echo ✗ client\detail.html 缺失
)

echo.
echo 🔍 正在检查依赖...
echo.

if exist "server\node_modules" (
    echo ✓ 后端依赖已安装
) else (
    echo ⚠ 后端依赖未安装，请运行 start.bat 自动安装
)

echo.
echo 🔍 环境检查...
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Node.js 已安装
    node -v
) else (
    echo ✗ Node.js 未安装，请从 https://nodejs.org 下载安装
)

echo.

REM 检查 Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo ✓ Python 已安装
    python --version
) else (
    echo ⚠ Python 未安装，使用其他服务器也可以
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                     检查完成！                                ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  下一步：双击运行 start.bat 启动项目                         ║
echo ║  然后访问：http://localhost:8000                             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

pause
