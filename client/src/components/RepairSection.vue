<template>
  <div class="repair-section">
    <h2 class="module-title">返修管理</h2>
    <button @click="showRepairForm = true" class="btn-primary">申请返修</button>

    <table class="repair-table">
      <thead>
        <tr>
          <th>工件</th>
          <th>原因</th>
          <th>返修内容</th>
          <th>责任人</th>
          <th>工时</th>
          <th>报废金额</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in repairs" :key="item._id" :class="['repair-row', item.status]">
          <td>{{ item.workpiece }}</td>
          <td>{{ item.reason }}</td>
          <td>{{ item.content }}</td>
          <td>{{ item.responsible }}</td>
          <td>{{ item.hours }}h</td>
          <td>¥{{ item.lossAmount }}</td>
          <td>
            <span :class="['status-badge', item.status]">
              {{ getRepairStatus(item.status) }}
            </span>
          </td>
          <td>
            <button v-if="item.status === 'pending'" @click="startRepair(item)" class="btn-small btn-yellow">
              开始
            </button>
            <button v-if="item.status === 'in_progress'" @click="completeRepair(item)" class="btn-small btn-green">
              完成
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showRepairForm" class="modal">
      <div class="modal-content">
        <h3>申请返修</h3>
        <div class="form-group">
          <label>返修工件</label>
          <input v-model="newRepair.workpiece" type="text">
        </div>
        <div class="form-group">
          <label>返修原因</label>
          <textarea v-model="newRepair.reason"></textarea>
        </div>
        <div class="form-group">
          <label>返修内容</label>
          <textarea v-model="newRepair.content"></textarea>
        </div>
        <div class="form-group">
          <label>责任人</label>
          <input v-model="newRepair.responsible" type="text">
        </div>
        <div class="form-group">
          <label>工时（小时）</label>
          <input v-model.number="newRepair.hours" type="number">
        </div>
        <div class="form-group">
          <label>报废金额（元）</label>
          <input v-model.number="newRepair.lossAmount" type="number">
        </div>
        <div class="modal-buttons">
          <button @click="addRepair" class="btn-primary">申请</button>
          <button @click="showRepairForm = false" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['mold']);
const showRepairForm = ref(false);
const newRepair = ref({
  workpiece: '',
  reason: '',
  content: '',
  responsible: '',
  hours: 0,
  lossAmount: 0
});

const repairs = computed(() => props.mold?.modules?.repair?.items || []);

const getRepairStatus = (status) => {
  const labels = {
    'pending': '等待中',
    'in_progress': '返修中',
    'completed': '已完成'
  };
  return labels[status] || status;
};

const startRepair = (item) => {
  item.status = 'in_progress';
  item.startTime = new Date();
};

const completeRepair = (item) => {
  item.status = 'completed';
  item.endTime = new Date();
};

const addRepair = () => {
  if (newRepair.value.workpiece) {
    repairs.value.push({
      ...newRepair.value,
      status: 'pending',
      startTime: null,
      endTime: null
    });
    newRepair.value = {
      workpiece: '',
      reason: '',
      content: '',
      responsible: '',
      hours: 0,
      lossAmount: 0
    };
    showRepairForm.value = false;
  }
};
</script>

<style scoped>
.repair-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #f44336;
  margin-bottom: 30px;
}

.module-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.btn-primary {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
}

.repair-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  font-size: 13px;
}

.repair-table thead {
  background: #f5f5f5;
}

.repair-table th,
.repair-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.repair-row.pending {
  background: #ffebee;
}

.repair-row.in_progress {
  background: #fff3e0;
}

.repair-row.completed {
  background: #e8f5e9;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.status-badge.pending {
  background: #f44336;
}

.status-badge.in_progress {
  background: #ff9800;
}

.status-badge.completed {
  background: #4CAF50;
}

.btn-small {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.btn-yellow {
  background: #ffb74d;
  color: white;
}

.btn-green {
  background: #66bb6a;
  color: white;
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
  padding: 20px;
  border-radius: 8px;
  min-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-secondary {
  flex: 1;
  padding: 8px;
  background: #ddd;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
