/**
 * 实时协作管理器
 * 管理文档共享、光标位置、在线用户等
 */
class CollaborationManager {
  constructor() {
    this.documents = new Map(); // 文档ID -> 文档数据
    this.users = new Map(); // 用户ID -> 用户信息
    this.cursors = new Map(); // 用户ID -> 光标位置
    this.changeLog = []; // 变更日志
  }

  /**
   * 创建或获取文档
   */
  getOrCreateDocument(docId, initialData = {}) {
    if (!this.documents.has(docId)) {
      this.documents.set(docId, {
        id: docId,
        content: initialData,
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 0,
        locks: new Map() // 用于防止并发冲突
      });
    }
    return this.documents.get(docId);
  }

  /**
   * 用户加入协作
   */
  addUser(userId, docId, userInfo = {}) {
    const key = `${docId}:${userId}`;
    this.users.set(key, {
      userId,
      docId,
      joinedAt: new Date(),
      isActive: true,
      ...userInfo
    });
    return this.users.get(key);
  }

  /**
   * 用户离开
   */
  removeUser(userId, docId) {
    const key = `${docId}:${userId}`;
    this.users.delete(key);
    this.cursors.delete(userId);
  }

  /**
   * 获取文档中的活跃用户
   */
  getActiveUsers(docId) {
    const users = [];
    for (const [key, user] of this.users.entries()) {
      if (user.docId === docId && user.isActive) {
        users.push(user);
      }
    }
    return users;
  }

  /**
   * 更新光标位置
   */
  updateCursorPosition(userId, docId, position) {
    this.cursors.set(userId, {
      userId,
      docId,
      position,
      updatedAt: new Date()
    });
  }

  /**
   * 获取所有光标
   */
  getCursors(docId) {
    const cursors = [];
    for (const [userId, cursor] of this.cursors.entries()) {
      if (cursor.docId === docId) {
        cursors.push(cursor);
      }
    }
    return cursors;
  }

  /**
   * 应用变更（使用 Operational Transform）
   */
  applyChange(docId, change) {
    const doc = this.getOrCreateDocument(docId);

    // 检查版本冲突
    if (change.version !== doc.version) {
      throw new Error(`Version mismatch: expected ${doc.version}, got ${change.version}`);
    }

    // 应用变更
    try {
      if (change.type === 'update') {
        Object.assign(doc.content, change.data);
      } else if (change.type === 'delete') {
        delete doc.content[change.key];
      } else if (change.type === 'insert') {
        doc.content[change.key] = change.value;
      }

      doc.version++;
      doc.updatedAt = new Date();

      // 记录变更
      this.changeLog.push({
        docId,
        change,
        timestamp: new Date(),
        userId: change.userId
      });

      return {
        success: true,
        newVersion: doc.version,
        content: doc.content
      };
    } catch (error) {
      throw new Error(`Failed to apply change: ${error.message}`);
    }
  }

  /**
   * 获取变更历史
   */
  getChangeHistory(docId, fromVersion = 0) {
    return this.changeLog.filter(log => 
      log.docId === docId && log.change.version >= fromVersion
    );
  }

  /**
   * 获取文档快照
   */
  getSnapshot(docId) {
    const doc = this.getOrCreateDocument(docId);
    return {
      id: doc.id,
      content: JSON.parse(JSON.stringify(doc.content)),
      version: doc.version,
      updatedAt: doc.updatedAt
    };
  }

  /**
   * 冲突解决 - 合并策略
   */
  resolveConflict(change1, change2) {
    // 按时间戳排序
    if (change1.timestamp < change2.timestamp) {
      return change1;
    }
    return change2;
  }

  /**
   * 清理过期的光标
   */
  cleanupStaleCursors(timeoutMs = 60000) {
    const now = new Date();
    for (const [userId, cursor] of this.cursors.entries()) {
      if (now - cursor.updatedAt > timeoutMs) {
        this.cursors.delete(userId);
      }
    }
  }
}

module.exports = CollaborationManager;
