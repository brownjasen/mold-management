<template>
  <div class="accessory-section">
    <h2 class="module-title">辅料库存管理</h2>
    <button @click="showAddForm = true" class="btn-primary">添加辅料</button>

    <table class="accessory-table">
      <thead>
        <tr>
          <th>品名</th>
          <th>规格</th>
          <th>数量</th>
          <th>订单状态</th>
          <th>完成状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in accessories" :key="item._id" :class="['item-row', item.orderStatus]">
          <td>{{ item.name }}</td>
          <td>{{ item.spec || '标准件' }}</td>
          <td>{{ item.quantity }}</td>
          <td>
            <button @click="toggleOrder(item)" :class="['btn-status', item.orderStatus]">
              {{ getOrderStatus(item.orderStatus) }}
            </button>
          </td>
          <td>
            <button @click="toggleComplete(item)" :class="['btn-status', item.completed ? 'completed' : 'pending']">
              {{ item.completed ? '已完成' : '待完成' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showAddForm" class="modal">
      <div class="modal-content">
        <h3>添加辅料</h3>
        <div class="form-group">
          <label>品名</label>
          <input v-model="newItem.name" type="text">
        </div>
        <div class="form-group">
          <label>规格</label>
          <input v-model="newItem.spec" type="text">
        </div>
        <div class="form-group">
          <label>数量</label>
          <input v-model.number="newItem.quantity" type="number">
        </div>
        <div class="modal-buttons">
          <button @click="addAccessory" class="btn-primary">添加</button>
          <button @click="showAddForm = false" class="btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['mold']);
const showAddForm = ref(false);
const newItem = ref({ name: '', spec: '', quantity: 0 });

const accessories = computed(() => props.mold?.modules?.accessories?.items || []);

const getOrderStatus = (status) => {
  const labels = {
    'pending': '未下单',
    'ordered': '已下单',
    'completed': '已完成'
  };
  return labels[status] || status;
};

const toggleOrder = (item) => {
  const statuses = ['pending', 'ordered', 'completed'];
  const currentIdx = statuses.indexOf(item.orderStatus);
  item.orderStatus = statuses[(currentIdx + 1) % statuses.length];
};

const toggleComplete = (item) => {
  item.completed = !item.completed;
};

const addAccessory = () => {
  if (newItem.value.name && newItem.value.quantity > 0) {
    accessories.value.push({
      ...newItem.value,
      orderStatus: 'pending',
      completed: false
    });
    newItem.value = { name: '', spec: '', quantity: 0 };
    showAddForm.value = false;
  }
};
</script>

<style scoped>
.accessory-section {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #ff9800;
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

.accessory-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.accessory-table thead {
  background: #f5f5f5;
}

.accessory-table th,
.accessory-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.item-row.pending {
  background: #ffebee;
}

.item-row.ordered {
  background: #fff3e0;
}

.item-row.completed {
  background: #e8f5e9;
}

.btn-status {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.btn-status.pending {
  background: #f44336;
  color: white;
}

.btn-status.ordered {
  background: #ff9800;
  color: white;
}

.btn-status.completed {
  background: #4CAF50;
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
  min-width: 400px;
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
  padding: 8px;
  background: #ddd;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
