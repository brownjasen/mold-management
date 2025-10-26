<template>
  <div class="mold-list">
    <div class="header">
      <h1>模具精益生产管理系统</h1>
      <button @click="showCreateModal = true" class="btn-primary">新建模具订单</button>
    </div>

    <div class="search-bar">
      <input v-model="searchMold" type="text" placeholder="搜索模具编号...">
    </div>

    <table class="mold-table">
      <thead>
        <tr>
          <th>模具编号</th>
          <th>下单时间</th>
          <th>生产进度</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mold in filteredMolds" :key="mold._id" @click="selectMold(mold)">
          <td>{{ mold.moldNumber }}</td>
          <td>{{ formatDate(mold.orderTime) }}</td>
          <td>
            <div class="progress-bar">
              <div class="progress" :style="{ width: mold.overallProgress + '%' }"></div>
              <span>{{ mold.overallProgress }}%</span>
            </div>
          </td>
          <td>
            <span :class="['status', mold.status]">{{ getStatusLabel(mold.status) }}</span>
          </td>
          <td>
            <button @click.stop="editMold(mold)" class="btn-small">编辑</button>
            <button @click.stop="prioritizeMold(mold)" class="btn-small">加急</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h2>{{ editingMold ? '编辑模具' : '新建模具订单' }}</h2>
        <div class="form-group">
          <label>模具编号</label>
          <input v-model="formData.moldNumber" type="text" placeholder="如 SC25-01">
        </div>
        <div class="form-group">
          <label>下单时间</label>
          <input v-model="formData.orderTime" type="datetime-local">
        </div>
        <div class="modal-buttons">
          <button @click="saveMold" class="btn-primary">保存</button>
          <button @click="showCreateModal = false" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api } from '../api/client';

const molds = ref([]);
const searchMold = ref('');
const showCreateModal = ref(false);
const editingMold = ref(null);
const formData = ref({ moldNumber: '', orderTime: '' });

const filteredMolds = computed(() => {
  return molds.value.filter(m => m.moldNumber.includes(searchMold.value));
});

const loadMolds = async () => {
  try {
    const res = await api.get('/molds/list');
    molds.value = res.data.data;
  } catch (err) {
    console.error('Failed to load molds:', err);
  }
};

const saveMold = async () => {
  try {
    await api.post('/molds/create', formData.value);
    showCreateModal.value = false;
    formData.value = { moldNumber: '', orderTime: '' };
    loadMolds();
  } catch (err) {
    console.error('Failed to save mold:', err);
  }
};

const prioritizeMold = async (mold) => {
  try {
    await api.put('/molds/reprioritize', { moldId: mold._id, newQueue: 0 });
    loadMolds();
  } catch (err) {
    console.error('Failed to prioritize mold:', err);
  }
};

const selectMold = (mold) => {
  // Navigate to detail page
  window.location.href = `/detail/${mold._id}`;
};

const editMold = (mold) => {
  editingMold.value = mold;
  formData.value = { moldNumber: mold.moldNumber, orderTime: mold.orderTime };
  showCreateModal.value = true;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN');
};

const getStatusLabel = (status) => {
  const labels = {
    pending: '等待中',
    in_progress: '生产中',
    completed: '已完成',
    repair: '返修中'
  };
  return labels[status] || status;
};

onMounted(() => {
  loadMolds();
});
</script>

<style scoped>
.mold-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 28px;
  color: #333;
}

.search-bar {
  margin-bottom: 20px;
}

.search-bar input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.mold-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.mold-table thead {
  background: #f5f5f5;
}

.mold-table th,
.mold-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.mold-table tbody tr {
  cursor: pointer;
  transition: background 0.2s;
}

.mold-table tbody tr:hover {
  background: #f9f9f9;
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress {
  flex: 1;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  position: relative;
}

.progress::after {
  content: '';
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  border-radius: 3px;
  width: 100%;
}

.progress-bar span {
  min-width: 40px;
  font-weight: bold;
  color: #333;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status.pending {
  background: #ffebee;
  color: #c62828;
}

.status.in_progress {
  background: #fff3e0;
  color: #e65100;
}

.status.completed {
  background: #e8f5e9;
  color: #2e7d32;
}

.status.repair {
  background: #fce4ec;
  color: #c2185b;
}

.btn-small {
  padding: 6px 12px;
  margin-right: 5px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-small:hover {
  background: #0b7dda;
}

.btn-primary {
  padding: 10px 20px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background: #45a049;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 400px;
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary {
  flex: 1;
  padding: 10px;
  background: #ddd;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #ccc;
}
</style>
