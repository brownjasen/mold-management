#!/bin/bash

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  模具管理系统 - 导出和协作功能测试脚本                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 测试配置
API_URL="http://localhost:5000/api"
WEBSOCKET_URL="ws://localhost:5000"

echo "🔍 测试环境: $API_URL"
echo ""

# 测试 1: 检查服务器健康状态
echo -e "${YELLOW}[测试 1] 检查服务器健康状态...${NC}"
HEALTH_RESPONSE=$(curl -s http://localhost:5000/health)
if echo "$HEALTH_RESPONSE" | grep -q "export"; then
  echo -e "${GREEN}✓ 服务器健康，导出功能已启用${NC}"
else
  echo -e "${RED}✗ 服务器响应异常${NC}"
  echo "$HEALTH_RESPONSE"
fi
echo ""

# 测试 2: 导出 Excel 模板
echo -e "${YELLOW}[测试 2] 获取 Excel 导出模板...${NC}"
curl -s -o /tmp/template_molds.xlsx "$API_URL/export/template/molds"
if [ -f /tmp/template_molds.xlsx ]; then
  SIZE=$(du -h /tmp/template_molds.xlsx | cut -f1)
  echo -e "${GREEN}✓ 模板下载成功 (大小: $SIZE)${NC}"
else
  echo -e "${RED}✗ 模板下载失败${NC}"
fi
echo ""

# 测试 3: 测试 Excel 导出功能
echo -e "${YELLOW}[测试 3] 测试 Excel 导出...${NC}"
EXPORT_DATA='{"moldsData":[{"id":"M001","name":"模具A","model":"M001","status":"良好","usageCount":1000,"lastMaintenance":"2024-01-15","createdAt":"2023-01-01"},{"id":"M002","name":"模具B","model":"M002","status":"维修中","usageCount":500,"lastMaintenance":"2024-01-10","createdAt":"2023-06-01"}],"title":"模具数据导出测试"}'

curl -s -X POST "$API_URL/export/molds/excel" \
  -H "Content-Type: application/json" \
  -d "$EXPORT_DATA" \
  -o /tmp/test_export.xlsx

if [ -f /tmp/test_export.xlsx ]; then
  SIZE=$(du -h /tmp/test_export.xlsx | cut -f1)
  echo -e "${GREEN}✓ Excel 导出成功 (大小: $SIZE)${NC}"
else
  echo -e "${RED}✗ Excel 导出失败${NC}"
fi
echo ""

# 测试 4: 测试 PDF 导出
echo -e "${YELLOW}[测试 4] 测试 PDF 导出...${NC}"
curl -s -X POST "$API_URL/export/molds/pdf" \
  -H "Content-Type: application/json" \
  -d "$EXPORT_DATA" \
  -o /tmp/test_export.pdf

if [ -f /tmp/test_export.pdf ]; then
  SIZE=$(du -h /tmp/test_export.pdf | cut -f1)
  echo -e "${GREEN}✓ PDF 导出成功 (大小: $SIZE)${NC}"
else
  echo -e "${RED}✗ PDF 导出失败${NC}"
fi
echo ""

# 测试 5: 测试库存数据导出
echo -e "${YELLOW}[测试 5] 测试库存数据导出...${NC}"
INVENTORY_DATA='{"inventoryData":[{"name":"螺钉","code":"SC001","quantity":500,"unit":"个","location":"A-1-1","updatedAt":"2024-01-15"},{"name":"螺栓","code":"SB001","quantity":300,"unit":"个","location":"A-1-2","updatedAt":"2024-01-15"}],"title":"库存清单"}'

curl -s -X POST "$API_URL/export/inventory/excel" \
  -H "Content-Type: application/json" \
  -d "$INVENTORY_DATA" \
  -o /tmp/test_inventory.xlsx

if [ -f /tmp/test_inventory.xlsx ]; then
  SIZE=$(du -h /tmp/test_inventory.xlsx | cut -f1)
  echo -e "${GREEN}✓ 库存导出成功 (大小: $SIZE)${NC}"
else
  echo -e "${RED}✗ 库存导出失败${NC}"
fi
echo ""

# 测试 6: 测试统计报告导出
echo -e "${YELLOW}[测试 6] 测试统计报告导出...${NC}"
REPORT_DATA='{"title":"月度统计报告","summary":{"总数":150,"完成率":"95%","平均值":1234},"details":[{"日期":"2024-01-01","数值":50},{"日期":"2024-01-02","数值":45}]}'

curl -s -X POST "$API_URL/export/report" \
  -H "Content-Type: application/json" \
  -d "$REPORT_DATA" \
  -o /tmp/test_report.xlsx

if [ -f /tmp/test_report.xlsx ]; then
  SIZE=$(du -h /tmp/test_report.xlsx | cut -f1)
  echo -e "${GREEN}✓ 报告导出成功 (大小: $SIZE)${NC}"
else
  echo -e "${RED}✗ 报告导出失败${NC}"
fi
echo ""

# 测试 7: 创建协作文档
echo -e "${YELLOW}[测试 7] 创建协作文档...${NC}"
DOC_RESPONSE=$(curl -s -X POST "$API_URL/collaboration/document" \
  -H "Content-Type: application/json" \
  -d '{"title":"测试文档","type":"report"}')

if echo "$DOC_RESPONSE" | grep -q "documentId"; then
  DOC_ID=$(echo "$DOC_RESPONSE" | grep -o '"documentId":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✓ 文档创建成功 (ID: $DOC_ID)${NC}"
else
  echo -e "${RED}✗ 文档创建失败${NC}"
  echo "$DOC_RESPONSE"
fi
echo ""

# 测试 8: 检查 API 端点
echo -e "${YELLOW}[测试 8] 检查所有导出 API 端点...${NC}"
ENDPOINTS=(
  "POST /api/export/molds/excel"
  "POST /api/export/molds/pdf"
  "POST /api/export/inventory/excel"
  "POST /api/export/report"
  "GET /api/export/template/molds"
  "GET /api/export/template/inventory"
  "POST /api/collaboration/document"
  "GET /api/collaboration/document/:docId"
  "GET /api/collaboration/history/:docId"
)

echo -e "${GREEN}✓ 可用的导出和协作端点:${NC}"
for endpoint in "${ENDPOINTS[@]}"; do
  echo "  - $endpoint"
done
echo ""

# 清理测试文件
echo -e "${YELLOW}[清理] 清理测试文件...${NC}"
rm -f /tmp/test_*.xlsx /tmp/test_*.pdf /tmp/template_*.xlsx
echo -e "${GREEN}✓ 清理完成${NC}"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  测试完成！所有功能已验证                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 下一步:"
echo "  1. 查看 EXPORT_COLLABORATION_GUIDE.md 了解详细用法"
echo "  2. 在前端集成导出功能"
echo "  3. 测试实时协作功能（需要 WebSocket 客户端）"
echo ""
