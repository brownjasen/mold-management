const fs = require('fs');
const path = require('path');

/**
 * 文件处理工具
 */
class FileHandler {
  /**
   * 确保目录存在
   */
  static ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 获取临时文件路径
   */
  static getTempFilePath(filename) {
    const tempDir = process.env.TEMP_DIR || '/tmp';
    this.ensureDirectoryExists(tempDir);
    return path.join(tempDir, filename);
  }

  /**
   * 删除过期文件
   */
  static cleanupOldFiles(directory, maxAgeMs = 24 * 60 * 60 * 1000) {
    if (!fs.existsSync(directory)) return;

    const now = Date.now();
    fs.readdirSync(directory).forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAgeMs) {
        try {
          fs.unlinkSync(filePath);
          console.log(`清理过期文件: ${file}`);
        } catch (error) {
          console.error(`无法删除文件 ${file}:`, error);
        }
      }
    });
  }

  /**
   * 获取文件大小（人类可读格式）
   */
  static getReadableFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * 验证文件类型
   */
  static isValidFileType(filename, allowedTypes = ['xlsx', 'pdf']) {
    const ext = path.extname(filename).slice(1).toLowerCase();
    return allowedTypes.includes(ext);
  }

  /**
   * 生成唯一文件名
   */
  static generateUniqueFilename(baseFilename) {
    const ext = path.extname(baseFilename);
    const name = path.basename(baseFilename, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${name}_${timestamp}_${random}${ext}`;
  }

  /**
   * 配置 Express 文件下载
   */
  static sendFile(res, filepath, originalFilename) {
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: '文件不存在' });
    }

    res.download(filepath, originalFilename, (err) => {
      if (err) {
        console.error('文件下载错误:', err);
      } else {
        // 下载完成后删除临时文件
        setTimeout(() => {
          try {
            fs.unlinkSync(filepath);
          } catch (error) {
            console.error('清理临时文件失败:', error);
          }
        }, 5000);
      }
    });
  }
}

/**
 * 日志工具
 */
class Logger {
  static levels = {
    ERROR: 'ERROR',
    WARN: 'WARN',
    INFO: 'INFO',
    DEBUG: 'DEBUG'
  };

  static format(level, message, data = null) {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ${level}: ${message}`;
    
    if (data) {
      logMessage += ` ${JSON.stringify(data)}`;
    }
    
    return logMessage;
  }

  static error(message, data) {
    console.error(this.format(this.levels.ERROR, message, data));
  }

  static warn(message, data) {
    console.warn(this.format(this.levels.WARN, message, data));
  }

  static info(message, data) {
    console.log(this.format(this.levels.INFO, message, data));
  }

  static debug(message, data) {
    if (process.env.DEBUG === 'true') {
      console.debug(this.format(this.levels.DEBUG, message, data));
    }
  }
}

/**
 * 数据验证工具
 */
class Validator {
  /**
   * 验证数据数组
   */
  static isValidDataArray(data) {
    return Array.isArray(data) && data.length > 0;
  }

  /**
   * 验证导出数据
   */
  static validateExportData(data) {
    if (!this.isValidDataArray(data)) {
      throw new Error('数据必须是非空数组');
    }

    // 检查对象结构
    const firstItem = data[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      throw new Error('数组元素必须是对象');
    }

    return true;
  }

  /**
   * 验证文档 ID
   */
  static isValidDocId(docId) {
    return typeof docId === 'string' && docId.length > 0;
  }

  /**
   * 验证用户 ID
   */
  static isValidUserId(userId) {
    return typeof userId === 'string' && userId.length > 0;
  }

  /**
   * 清理用户输入
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '')
      .trim()
      .slice(0, 1000);
  }
}

/**
 * 性能监控工具
 */
class PerformanceMonitor {
  static metrics = new Map();

  /**
   * 开始计时
   */
  static startTimer(label) {
    this.metrics.set(label, Date.now());
  }

  /**
   * 结束计时并记录
   */
  static endTimer(label) {
    if (!this.metrics.has(label)) {
      Logger.warn(`未找到计时器: ${label}`);
      return null;
    }

    const startTime = this.metrics.get(label);
    const duration = Date.now() - startTime;
    this.metrics.delete(label);

    Logger.info(`性能指标: ${label}`, { duration: `${duration}ms` });
    return duration;
  }

  /**
   * 获取系统信息
   */
  static getSystemInfo() {
    const os = require('os');
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
      uptime: `${(os.uptime() / 3600).toFixed(2)} 小时`
    };
  }
}

module.exports = {
  FileHandler,
  Logger,
  Validator,
  PerformanceMonitor
};
