const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const { createWriteStream } = require('fs');
const { join } = require('path');

class ExportService {
  /**
   * 导出为 Excel
   */
  static async exportToExcel(data, filename, sheetName = '数据') {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(sheetName);

      // 添加标题和时间戳
      worksheet.addRow(['数据导出报告']);
      worksheet.addRow([`导出时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`]);
      worksheet.addRow([]);

      if (!Array.isArray(data) || data.length === 0) {
        worksheet.addRow(['暂无数据']);
        const filepath = join('/tmp', filename);
        await workbook.xlsx.writeFile(filepath);
        return filepath;
      }

      // 获取列标题
      const headers = Object.keys(data[0]);
      worksheet.addRow(headers);

      // 设置标题样式
      const headerRow = worksheet.lastRow;
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      };

      // 添加数据行
      data.forEach(row => {
        const values = headers.map(header => {
          const value = row[header];
          if (value instanceof Date) {
            return moment(value).format('YYYY-MM-DD HH:mm:ss');
          }
          return value || '';
        });
        worksheet.addRow(values);
      });

      // 自动调整列宽
      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const cellLength = cell.value ? String(cell.value).length : 0;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        });
        column.width = Math.min(maxLength + 2, 50);
      });

      const filepath = join('/tmp', filename);
      await workbook.xlsx.writeFile(filepath);
      return filepath;
    } catch (error) {
      console.error('Excel 导出失败:', error);
      throw error;
    }
  }

  /**
   * 导出为 PDF
   */
  static async exportToPDF(data, filename, title = '数据报告') {
    try {
      const filepath = join('/tmp', filename);
      const stream = createWriteStream(filepath);

      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
      });

      doc.pipe(stream);

      // 标题
      doc.fontSize(20).font('Courier').text(title, { align: 'center' });
      doc.moveDown(0.5);

      // 导出时间
      doc.fontSize(10).text(`导出时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`, {
        align: 'right'
      });
      doc.moveDown(1);

      if (!Array.isArray(data) || data.length === 0) {
        doc.fontSize(12).text('暂无数据');
        doc.end();
        return filepath;
      }

      // 生成表格
      const headers = Object.keys(data[0]);
      const tableTop = doc.y;
      const rowHeight = 25;
      const colWidth = 550 / headers.length;

      // 表头
      doc.fontSize(10).font('Courier-Bold');
      let xPos = 50;
      headers.forEach(header => {
        doc.rect(xPos, tableTop, colWidth, rowHeight).stroke();
        doc.text(header, xPos + 5, tableTop + 7, { width: colWidth - 10 });
        xPos += colWidth;
      });

      // 数据行
      doc.font('Courier');
      let yPos = tableTop + rowHeight;
      data.forEach(row => {
        xPos = 50;
        headers.forEach(header => {
          const value = row[header];
          const displayValue = value instanceof Date
            ? moment(value).format('YYYY-MM-DD HH:mm:ss')
            : String(value || '');

          doc.rect(xPos, yPos, colWidth, rowHeight).stroke();
          doc.fontSize(9).text(displayValue, xPos + 5, yPos + 7, {
            width: colWidth - 10,
            ellipsis: true
          });
          xPos += colWidth;
        });
        yPos += rowHeight;

        // 分页处理
        if (yPos > doc.page.height - 100) {
          doc.addPage();
          yPos = 50;
        }
      });

      // 页码
      const pageCount = doc.bufferedPageRange().count;
      for (let i = 0; i < pageCount; i++) {
        doc.switchToPage(i);
        doc.fontSize(10).text(
          `第 ${i + 1} 页`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }

      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => resolve(filepath));
        stream.on('error', reject);
      });
    } catch (error) {
      console.error('PDF 导出失败:', error);
      throw error;
    }
  }

  /**
   * 导出统计报告
   */
  static async exportStatisticsReport(stats, filename, title = '统计报告') {
    try {
      const workbook = new ExcelJS.Workbook();

      // 汇总页
      const summarySheet = workbook.addWorksheet('汇总');
      summarySheet.addRow(['统计报告']);
      summarySheet.addRow([`生成时间: ${moment().format('YYYY-MM-DD HH:mm:ss')}`]);
      summarySheet.addRow([]);

      // 添加统计数据
      if (stats.summary) {
        summarySheet.addRow(['项目', '数值']);
        Object.entries(stats.summary).forEach(([key, value]) => {
          summarySheet.addRow([key, value]);
        });
      }

      summarySheet.moveDown(2);

      // 详细数据
      if (stats.details && Array.isArray(stats.details) && stats.details.length > 0) {
        const detailSheet = workbook.addWorksheet('详细数据');
        const headers = Object.keys(stats.details[0]);
        detailSheet.addRow(headers);

        stats.details.forEach(row => {
          const values = headers.map(header => {
            const value = row[header];
            return value instanceof Date
              ? moment(value).format('YYYY-MM-DD HH:mm:ss')
              : value || '';
          });
          detailSheet.addRow(values);
        });

        // 自动调整列宽
        detailSheet.columns.forEach(column => {
          column.width = 20;
        });
      }

      const filepath = join('/tmp', filename);
      await workbook.xlsx.writeFile(filepath);
      return filepath;
    } catch (error) {
      console.error('统计报告导出失败:', error);
      throw error;
    }
  }
}

module.exports = ExportService;
