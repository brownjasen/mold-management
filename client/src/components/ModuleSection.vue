<template>
  <div class="module-section">
    <h2 class="module-title">{{ title }}</h2>
    <div class="stages-container">
      <div v-for="(stage, idx) in module?.stages" :key="idx" class="stage-card" :class="{ [stage.status]: true }">
        <div class="stage-name">{{ stage.name }}</div>
        <div class="stage-percentage">{{ stage.percentage }}%</div>
        <div class="stage-actions">
          <button 
            v-if="stage.status === 'pending'" 
            @click="startStage(idx)" 
            class="btn-action btn-yellow"
          >开始</button>
          <button 
            v-if="stage.status === 'in_progress'" 
            @click="completeStage(idx)" 
            class="btn-action btn-green"
          >完成</button>
          <button v-if="stage.status !== 'pending'" disabled class="btn-action btn-disabled">
            {{ formatTime(stage.startTime) }}
          </button>
        </div>
        <div class="stage-status" :class="getStatusClass(stage.status)">
          {{ getStatusLabel(stage.status) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { api } from '../api/client';

const props = defineProps(['title', 'mold', 'moduleKey']);

const module = computed(() => props.mold?.modules[props.moduleKey]);

const startStage = async (idx) => {
  try {
    await api.put('/molds/update-stage', {
      moldId: props.mold._id,
      module: props.moduleKey,
      stageIndex: idx,
      status: 'in_progress'
    });
  } catch (err) {
    console.error('Failed to start stage:', err);
  }
};

const completeStage = async (idx) => {
  try {
    await api.put('/molds/update-stage', {
      moldId: props.mold._id,
      module: props.moduleKey,
      stageIndex: idx,
      status: 'completed'
    });
  } catch (err) {
    console.error('Failed to complete stage:', err);
  }
};

const getStatusClass = (status) => {
  const classMap = {
    'pending': 'status-red',
    'in_progress': 'status-yellow',
    'completed': 'status-green'
  };
  return classMap[status] || '';
};

const getStatusLabel = (status) => {
  const labels = {
    'pending': '未开始',
    'in_progress': '进行中',
    'completed': '已完成'
  };
  return labels[status] || status;
};

const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return date.toLocaleString('zh-CN');
};
</script>

<style scoped>
.module-section {
  margin-bottom: 30px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2196F3;
}

.module-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.stages-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stage-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #ddd;
  text-align: center;
  transition: all 0.3s;
}

.stage-card.pending {
  border-color: #f44336;
  background: #ffebee;
}

.stage-card.in_progress {
  border-color: #ff9800;
  background: #fff3e0;
}

.stage-card.completed {
  border-color: #4CAF50;
  background: #e8f5e9;
}

.stage-name {
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.stage-percentage {
  font-size: 18px;
  color: #2196F3;
  margin-bottom: 10px;
}

.stage-actions {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
}

.btn-action {
  flex: 1;
  padding: 6px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-yellow {
  background: #ffb74d;
  color: white;
}

.btn-yellow:hover {
  background: #ffa726;
}

.btn-green {
  background: #66bb6a;
  color: white;
}

.btn-green:hover {
  background: #4caf50;
}

.btn-disabled {
  background: #ddd;
  color: #666;
  cursor: not-allowed;
  font-size: 10px;
  padding: 4px;
}

.stage-status {
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.status-red {
  background: #f44336;
  color: white;
}

.status-yellow {
  background: #ff9800;
  color: white;
}

.status-green {
  background: #4CAF50;
  color: white;
}
</style>
