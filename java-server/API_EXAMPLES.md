curl 命令示例 - 测试 Java 后端 API

=================================
1. 模具管理 API
=================================

# 创建模具
curl -X POST http://localhost:8080/api/molds/create \
  -H "Content-Type: application/json" \
  -d '{
    "moldNumber": "MOL-2025-0001",
    "modules": [
      {
        "moduleName": "模架",
        "stageName": "设计图纸",
        "stagePercentage": 2.0
      },
      {
        "moduleName": "模架",
        "stageName": "模料",
        "stagePercentage": 7.0
      }
    ]
  }'

# 获取所有模具
curl http://localhost:8080/api/molds/list

# 获取指定模具详情
curl http://localhost:8080/api/molds/1

# 更新工序状态为进行中
curl -X PUT http://localhost:8080/api/molds/1/update-stage \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": 1,
    "status": "in_progress"
  }'

# 更新工序状态为完成
curl -X PUT http://localhost:8080/api/molds/1/update-stage \
  -H "Content-Type: application/json" \
  -d '{
    "moduleId": 1,
    "status": "completed"
  }'

# 加急（优先级设为最高）
curl -X PUT http://localhost:8080/api/molds/1/reprioritize

# 申请返修
curl -X POST http://localhost:8080/api/molds/1/repair \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "尺寸偏差，需要返修"
  }'

# 删除模具
curl -X DELETE http://localhost:8080/api/molds/1

=================================
2. 库存管理 API
=================================

# 获取所有库存
curl http://localhost:8080/api/inventory

# 获取指定库存
curl http://localhost:8080/api/inventory/1

# 添加库存
curl -X POST http://localhost:8080/api/inventory/add \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "铜板新型",
    "partModel": "A-200",
    "currentStock": 1000,
    "safetyStock": 300
  }'

# 出库
curl -X POST http://localhost:8080/api/inventory/deduct \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "铜板",
    "quantity": 50
  }'

# 补货
curl -X POST http://localhost:8080/api/inventory/restock \
  -H "Content-Type: application/json" \
  -d '{
    "partName": "铜板",
    "quantity": 200
  }'

# 获取低库存预警
curl http://localhost:8080/api/inventory/alerts

# 删除库存记录
curl -X DELETE http://localhost:8080/api/inventory/1

=================================
3. 响应格式说明
=================================

成功响应（HTTP 200）:
{
  "code": 0,
  "message": "操作成功",
  "data": { ... }
}

错误响应（HTTP 400）:
{
  "code": -1,
  "message": "错误信息",
  "data": null
}

=================================
4. 工序状态值
=================================

- pending: 未开始（红色）
- in_progress: 进行中（黄色）
- completed: 已完成（绿色）

=================================
5. 使用 PowerShell 测试（Windows）
=================================

# 创建模具
$body = @{
    moldNumber = "MOL-PS-001"
    modules = @(
        @{
            moduleName = "模架"
            stageName = "设计"
            stagePercentage = 2.0
        }
    )
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:8080/api/molds/create" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json

# 获取模具列表
$response = Invoke-WebRequest -Uri "http://localhost:8080/api/molds/list"
$response.Content | ConvertFrom-Json | ConvertTo-Json

=================================
6. 使用 Postman 测试
=================================

1. 导入集合或新建请求
2. 设置方法（GET/POST/PUT/DELETE）
3. 输入 URL：http://localhost:8080/api/molds/list
4. 如需请求体，设置 Headers:
   - Content-Type: application/json
5. 在 Body 标签页输入 JSON 数据
6. 点击 Send 发送请求

推荐 Header:
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
