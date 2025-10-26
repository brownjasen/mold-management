import io from 'socket.io-client';

/**
 * 导出模块 - 处理 Excel/PDF 导出
 */
export const exportService = {
  /**
   * 导出模具数据为 Excel
   */
  async exportMoldsExcel(moldsData, title = '模具数据导出') {
    try {
      const response = await fetch('/api/export/molds/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moldsData, title })
      });
      
      if (!response.ok) throw new Error('导出失败');
      
      const blob = await response.blob();
      this.downloadFile(blob, `molds_${Date.now()}.xlsx`);
      return { success: true };
    } catch (error) {
      console.error('导出 Excel 失败:', error);
      throw error;
    }
  },

  /**
   * 导出模具数据为 PDF
   */
  async exportMoldsPDF(moldsData, title = '模具数据导出') {
    try {
      const response = await fetch('/api/export/molds/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moldsData, title })
      });
      
      if (!response.ok) throw new Error('导出失败');
      
      const blob = await response.blob();
      this.downloadFile(blob, `molds_${Date.now()}.pdf`);
      return { success: true };
    } catch (error) {
      console.error('导出 PDF 失败:', error);
      throw error;
    }
  },

  /**
   * 导出库存数据为 Excel
   */
  async exportInventoryExcel(inventoryData, title = '库存数据导出') {
    try {
      const response = await fetch('/api/export/inventory/excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inventoryData, title })
      });
      
      if (!response.ok) throw new Error('导出失败');
      
      const blob = await response.blob();
      this.downloadFile(blob, `inventory_${Date.now()}.xlsx`);
      return { success: true };
    } catch (error) {
      console.error('导出库存失败:', error);
      throw error;
    }
  },

  /**
   * 导出统计报告
   */
  async exportReport(title, summary, details) {
    try {
      const response = await fetch('/api/export/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, summary, details })
      });
      
      if (!response.ok) throw new Error('导出失败');
      
      const blob = await response.blob();
      this.downloadFile(blob, `report_${Date.now()}.xlsx`);
      return { success: true };
    } catch (error) {
      console.error('导出报告失败:', error);
      throw error;
    }
  },

  /**
   * 获取导出模板
   */
  async getTemplate(type) {
    try {
      const response = await fetch(`/api/export/template/${type}`);
      
      if (!response.ok) throw new Error('获取模板失败');
      
      const blob = await response.blob();
      this.downloadFile(blob, `template_${type}_${Date.now()}.xlsx`);
      return { success: true };
    } catch (error) {
      console.error('获取模板失败:', error);
      throw error;
    }
  },

  /**
   * 辅助方法：下载文件
   */
  downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

/**
 * 协作模块 - 处理实时协作
 */
export class CollaborationClient {
  constructor(serverUrl = window.location.origin) {
    this.socket = null;
    this.serverUrl = serverUrl;
    this.documentId = null;
    this.userId = null;
    this.username = null;
    this.listeners = new Map();
    this.cursors = new Map();
    this.activeUsers = new Map();
  }

  /**
   * 连接到协作服务器
   */
  connect(userId, username) {
    return new Promise((resolve, reject) => {
      try {
        this.userId = userId;
        this.username = username;
        
        this.socket = io(this.serverUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5
        });

        this.socket.on('connect', () => {
          console.log('✓ 连接成功');
          resolve(true);
        });

        this.socket.on('disconnect', () => {
          console.log('✗ 连接断开');
          this.emit('disconnected');
        });

        this.socket.on('connect_error', (error) => {
          console.error('连接错误:', error);
          reject(error);
        });

        this.setupEventListeners();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    this.socket.on('document-loaded', (data) => {
      this.emit('documentLoaded', data);
    });

    this.socket.on('document-changed', (data) => {
      this.emit('documentChanged', data);
    });

    this.socket.on('user-joined', (data) => {
      this.activeUsers.set(data.userId, data);
      this.emit('userJoined', data);
    });

    this.socket.on('user-left', (data) => {
      this.activeUsers.delete(data.userId);
      this.cursors.delete(data.userId);
      this.emit('userLeft', data);
    });

    this.socket.on('cursor-updated', (data) => {
      this.cursors.set(data.userId, data.position);
      this.emit('cursorUpdated', data);
    });

    this.socket.on('comment-added', (data) => {
      this.emit('commentAdded', data);
    });

    this.socket.on('field-locked', (data) => {
      this.emit('fieldLocked', data);
    });

    this.socket.on('field-unlocked', (data) => {
      this.emit('fieldUnlocked', data);
    });

    this.socket.on('change-rejected', (data) => {
      this.emit('changeRejected', data);
    });
  }

  /**
   * 加入文档协作
   */
  joinDocument(docId) {
    this.documentId = docId;
    this.socket.emit('join-document', docId, {
      username: this.username
    });
  }

  /**
   * 离开文档
   */
  leaveDocument() {
    if (this.documentId) {
      this.socket.emit('leave-document', this.documentId);
      this.documentId = null;
      this.activeUsers.clear();
      this.cursors.clear();
    }
  }

  /**
   * 发送文档变更
   */
  sendChange(changeType, data) {
    if (!this.socket || !this.documentId) return;

    const change = {
      type: changeType,
      version: 0,
      timestamp: new Date(),
      ...data
    };

    this.socket.emit('document-change', this.documentId, change);
  }

  /**
   * 更新光标位置
   */
  updateCursor(position) {
    if (!this.socket || !this.documentId) return;
    this.socket.emit('cursor-move', this.documentId, position);
  }

  /**
   * 获取活跃用户
   */
  getActiveUsers() {
    return Array.from(this.activeUsers.values());
  }

  /**
   * 获取所有光标
   */
  getAllCursors() {
    const cursors = [];
    for (const [userId, position] of this.cursors.entries()) {
      cursors.push({ userId, position });
    }
    return cursors;
  }

  /**
   * 添加评论
   */
  addComment(text, position) {
    if (!this.socket || !this.documentId) return;
    this.socket.emit('add-comment', this.documentId, { text, position });
  }

  /**
   * 锁定编辑字段
   */
  lockField(fieldName) {
    if (!this.socket || !this.documentId) return;
    this.socket.emit('lock-field', this.documentId, fieldName);
  }

  /**
   * 解锁编辑字段
   */
  unlockField(fieldName) {
    if (!this.socket || !this.documentId) return;
    this.socket.emit('unlock-field', this.documentId, fieldName);
  }

  /**
   * 注册事件监听
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * 触发事件
   */
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default {
  exportService,
  CollaborationClient
};
