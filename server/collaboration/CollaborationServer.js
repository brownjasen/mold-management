const CollaborationManager = require('./CollaborationManager');

/**
 * Socket.IO 协作事件处理器
 */
class CollaborationServer {
  constructor(io) {
    this.io = io;
    this.collaborationManager = new CollaborationManager();
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', socket => {
      console.log(`[协作] 用户连接: ${socket.id}`);

      // 加入文档协作
      socket.on('join-document', (docId, userInfo) => {
        socket.join(docId);
        this.collaborationManager.addUser(socket.id, docId, {
          username: userInfo.username || '匿名用户',
          color: this.generateColor()
        });

        // 获取当前快照
        const snapshot = this.collaborationManager.getSnapshot(docId);
        const activeUsers = this.collaborationManager.getActiveUsers(docId);

        // 通知加入者
        socket.emit('document-loaded', {
          content: snapshot.content,
          version: snapshot.version,
          users: activeUsers
        });

        // 通知其他用户
        this.io.to(docId).emit('user-joined', {
          userId: socket.id,
          username: userInfo.username || '匿名用户'
        });

        console.log(`[协作] 用户 ${socket.id} 加入文档 ${docId}`);
      });

      // 离开文档
      socket.on('leave-document', docId => {
        this.collaborationManager.removeUser(socket.id, docId);
        socket.leave(docId);

        this.io.to(docId).emit('user-left', {
          userId: socket.id
        });

        console.log(`[协作] 用户 ${socket.id} 离开文档 ${docId}`);
      });

      // 接收变更
      socket.on('document-change', (docId, change) => {
        try {
          change.userId = socket.id;
          change.timestamp = new Date();

          const result = this.collaborationManager.applyChange(docId, change);

          // 广播变更给所有客户端
          this.io.to(docId).emit('document-changed', {
            change,
            newVersion: result.newVersion
          });

          console.log(`[协作] 文档 ${docId} 已更新，版本: ${result.newVersion}`);
        } catch (error) {
          socket.emit('change-rejected', { error: error.message });
          console.error(`[协作] 变更应用失败: ${error.message}`);
        }
      });

      // 光标移动
      socket.on('cursor-move', (docId, position) => {
        this.collaborationManager.updateCursorPosition(socket.id, docId, position);

        // 广播光标位置
        this.io.to(docId).emit('cursor-updated', {
          userId: socket.id,
          position
        });
      });

      // 获取当前光标
      socket.on('get-cursors', (docId, callback) => {
        const cursors = this.collaborationManager.getCursors(docId);
        callback(cursors);
      });

      // 获取活跃用户
      socket.on('get-users', (docId, callback) => {
        const users = this.collaborationManager.getActiveUsers(docId);
        callback(users);
      });

      // 获取文档历史
      socket.on('get-history', (docId, fromVersion, callback) => {
        const history = this.collaborationManager.getChangeHistory(docId, fromVersion);
        callback(history);
      });

      // 离线处理
      socket.on('disconnect', () => {
        // 清理所有关联的用户记录
        for (const [key, user] of this.collaborationManager.users.entries()) {
          if (user.userId === socket.id) {
            const { docId } = user;
            this.collaborationManager.removeUser(socket.id, docId);
            this.io.to(docId).emit('user-left', { userId: socket.id });
          }
        }
        console.log(`[协作] 用户断开连接: ${socket.id}`);
      });

      // 评论功能
      socket.on('add-comment', (docId, comment) => {
        const commentData = {
          id: Date.now(),
          userId: socket.id,
          text: comment.text,
          position: comment.position,
          createdAt: new Date(),
          resolved: false
        };

        this.io.to(docId).emit('comment-added', commentData);
      });

      // 锁定编辑区域（防止冲突）
      socket.on('lock-field', (docId, fieldName) => {
        const doc = this.collaborationManager.getOrCreateDocument(docId);
        doc.locks.set(fieldName, socket.id);

        this.io.to(docId).emit('field-locked', {
          fieldName,
          userId: socket.id
        });
      });

      // 解锁编辑区域
      socket.on('unlock-field', (docId, fieldName) => {
        const doc = this.collaborationManager.getOrCreateDocument(docId);
        doc.locks.delete(fieldName);

        this.io.to(docId).emit('field-unlocked', {
          fieldName
        });
      });
    });

    // 定期清理过期光标
    setInterval(() => {
      this.collaborationManager.cleanupStaleCursors();
    }, 30000);
  }

  /**
   * 生成颜色用于标识用户
   */
  generateColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

module.exports = CollaborationServer;
