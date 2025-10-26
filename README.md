# 模具精益生产管理系统

## 项目概述
模具精益生产管理系统用于管理模具从订单到完成的整个生产流程。系统支持多个生产模块的并行管理，流程追踪，库存管理，以及返修控制。

## 功能特性

### 1. 一级页面 - 模具列表
- 显示所有模具订单
- 实时进度条展示（百分比）
- 按下单时间和优先级排序
- 支持加急排队功能
- 搜索和筛选

### 2. 二级页面 - 生产详情
分为6个独立模块，每个模块有专属的生产小组：

#### 模架模块
- 设计图纸 (2%)
- 模料 (7%)
- 深孔钻 (3%)
- 数控铣 (6%)
- 卧加 (2%)
- 加工中心 (4%)
- 倒角磨床 (4%)
- 真空淬火 (2%)
- 清洁 (1%)
- 质检 (0.5%)

#### 三大件模块
- 设计图纸 (0.2%)
- 模料 (5%)
- 开粗 (包含子项：模芯、模腔、安装座、法兰、螺纹)
- 真空淬火 (20%)
- 精加工 (20%)
- 抛光 (3%)
- 清洁
- 质检 (1.2%)

#### 辅料模块
- 铜板+铜工字
- 铜导套
- 导柱
- 导套
- 变径弯头
- 阀针
- 止转片
- 活塞
- 活塞盖
- 加热圈
- 热电偶
- 各类密封圈
- 格莱圈

#### 组装模块
- 组装 (1%)

#### 试模模块
- 初试 (0.3%)
- 加克重抛光 (1%)
- 试样品 (0.3%)
- 发货

#### 返修模块
- 支持优先级最高，可插队
- 记录返修工件、原因、内容、责任人
- 追踪工时和报废金额

### 3. 三级页面 - 工序详情
- 显示每道工序的时间记录
- 已开始时间：几月几号几点几分
- 已完成时间：几月几号几点几分

### 4. 状态色彩系统
- **红色**：未开始
- **黄色**：进行中
- **绿色**：已完成

### 5. 库存管理
- 辅料库存追踪
- 安全库存预警（默认200件）
- 库存低于预警值时自动提示
- 根据每套模具使用量自动扣减库存

## 技术栈

### 后端（两个版本可选）
**推荐：Java/Spring Boot 版本** ⭐
- Java 17 + Spring Boot 3.1.5
- Spring Data JPA + Hibernate
- MySQL 8.0（数据库）
- CORS（跨域支持）

或者使用 **Node.js 版本**：
- Node.js + Express
- MongoDB（数据库）
- Mongoose（ORM）
- CORS（跨域支持）

### 前端
- 原生 HTML/CSS/JavaScript
- 响应式设计
- RESTful API调用

## 安装与运行

### 快速开始（Java 后端 + 前端）⭐ 推荐

1. **初始化数据库**
```bash
mysql -u root -p < java-server/init.sql
```

2. **启动后端**
```bash
cd java-server
# Windows
run.bat

# 或 Linux/Mac
./run.sh

# 或手动启动
mvn spring-boot:run
```

3. **启动前端**
```bash
cd client
python -m http.server 8000
```

4. **访问应用**
打开浏览器访问 `http://localhost:8000`

### 或使用 Node.js 后端

```bash
# 后端
cd server
npm install
npm start

# 前端
cd client
python -m http.server 8000
```

### 前置条件
- **Java 后端**: Java 17+, Maven 3.6+, MySQL 5.7+
- **Node.js 后端**: Node.js 14+, MongoDB


## API 端点

### 模具管理
- `POST /api/molds/create` - 创建新模具订单
- `GET /api/molds/list` - 获取所有模具
- `GET /api/molds/detail/:id` - 获取模具详情
- `PUT /api/molds/update-stage` - 更新工序状态
- `PUT /api/molds/reprioritize` - 调整优先级（加急）
- `POST /api/molds/add-repair` - 申请返修

### 库存管理
- `GET /api/inventory` - 获取所有库存
- `POST /api/inventory/add` - 入库
- `POST /api/inventory/deduct` - 出库
- `GET /api/inventory/alerts` - 获取库存预警

## 数据模型

### Mold（模具）
```javascript
{
  moldNumber: String,          // 模具编号 (唯一)
  orderTime: Date,             // 下单时间
  startTime: Date,             // 开始生产时间
  completionTime: Date,        // 完成时间
  overallProgress: Number,     // 整体进度百分比
  modules: {
    moldFrame: {...},          // 模架
    threeParts: {...},         // 三大件
    accessories: {...},        // 辅料
    assembly: {...},           // 组装
    trialMold: {...},          // 试模
    repair: {...}              // 返修
  },
  priority: Number,            // 优先级
  queue: Number,               // 队列位置
  status: String               // 状态: pending/in_progress/completed/repair
}
```

### Inventory（库存）
```javascript
{
  partName: String,            // 品名
  partModel: String,           // 型号
  currentStock: Number,        // 当前库存
  safetyStock: Number,         // 安全库存
  inboundTime: Date,           // 入库时间
  outboundTime: Date,          // 出库时间
  lowStockAlert: Boolean       // 低库存预警
}
```

## 关键功能实现

### 1. 进度自动计算
系统自动计算模具整体进度：
- 每个工序完成时，自动加上该工序的百分比
- 实时更新总进度条

### 2. 加急排队
- 可将任何模具设为最高优先级
- 在队列中排到最前面

### 3. 返修管理
- 返修可绕过正常流程
- 最高优先级执行
- 完整的时间和成本追踪

### 4. 库存联动
- 申报辅料完成时自动从库存中扣减
- 库存不足时提前预警

## 未来改进方向
- 用户权限管理（不同生产小组登录）
- 数据报表导出（Excel、PDF）
- 任务通知提醒
- 实时协作功能
- 生产效率分析
- 质检数据集成
