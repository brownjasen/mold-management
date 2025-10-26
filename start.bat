@echo off
chcp 65001 >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     模具精益生产管理系统 - 一键启动脚本                      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo ⏳ 正在启动后端服务...
echo.

cd server

if not exist "node_modules" (
    echo ⏳ 正在安装依赖...
    call npm install
    echo.
)

echo ✓ 启动后端服务器...
start "MoldManagement-Server" cmd /k npm start

timeout /t 3 /nobreak

echo.
echo ⏳ 正在启动前端服务...
cd ..\client

echo ✓ 启动前端服务器...
start "MoldManagement-Frontend" python -m http.server 8000

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║            模具精益生产管理系统 - 启动完成！                 ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  后端 API 地址: http://localhost:5000                        ║
echo ║  前端服务器:   http://localhost:8000                         ║
echo ║                                                              ║
echo ║  📱 访问主系统（推荐）:                                       ║
echo ║     http://localhost:8000/app.html                          ║
echo ║                                                              ║
echo ║  其他页面:                                                   ║
echo ║  • 工序管理: http://localhost:8000/stages.html              ║
echo ║  • 库存管理: http://localhost:8000/inventory.html           ║
echo ║  • 流程审批: http://localhost:8000/approval.html            ║
echo ║  • 诊断测试: http://localhost:8000/test.html                ║
echo ║                                                              ║
echo ║  ✨ 系统功能:                                                ║
echo ║  • 仪表板、模具管理、工序管理                                ║
echo ║  • 库存管理、流程审批、统计分析                              ║
echo ║  • 系统设置、权限管理、数据备份                              ║
echo ║                                                              ║
echo ║  🎯 快速开始:                                                ║
echo ║  1. 在浏览器打开上面的主系统链接                             ║
echo ║  2. 点击"+ 新建模具"创建测试数据                             ║
echo ║  3. 点击模具进入详情页查看6个生产模块                        ║
echo ║  4. 标记工序状态（开始/完成）                                ║
echo ║  5. 查看库存、审批、统计功能                                 ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo.
echo 💡 系统已就绪，按任意键打开浏览器...
echo.
pause

REM 自动打开浏览器
start http://localhost:8000/app.html
echo.
echo ✓ 浏览器已打开，请稍候加载...
