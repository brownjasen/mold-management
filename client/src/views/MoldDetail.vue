<template>
  <div class="mold-detail">
    <div class="header">
      <button @click="goBack" class="btn-back">← 返回列表</button>
      <h1>{{ mold?.moldNumber }} 生产详情</h1>
      <div class="overall-progress">
        <div class="progress-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" class="bg"></circle>
            <circle cx="50" cy="50" r="45" class="fill" :style="{ strokeDashoffset: 282 - (282 * mold?.overallProgress / 100) }"></circle>
          </svg>
          <div class="percentage">{{ mold?.overallProgress }}%</div>
        </div>
      </div>
    </div>

    <!-- 模架 -->
    <module-section title="模架" :mold="mold" module-key="moldFrame" />

    <!-- 三大件 -->
    <module-section title="三大件" :mold="mold" module-key="threeParts" />

    <!-- 辅料 -->
    <accessory-section :mold="mold" />

    <!-- 组装 -->
    <module-section title="组装" :mold="mold" module-key="assembly" />

    <!-- 试模 -->
    <module-section title="试模" :mold="mold" module-key="trialMold" />

    <!-- 返修 -->
    <repair-section :mold="mold" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from '../api/client';
import ModuleSection from '../components/ModuleSection.vue';
import AccessorySection from '../components/AccessorySection.vue';
import RepairSection from '../components/RepairSection.vue';

const moldId = new URLSearchParams(window.location.search).get('id');
const mold = ref(null);

const loadMold = async () => {
  try {
    const res = await api.get(`/molds/detail/${moldId}`);
    mold.value = res.data.data;
  } catch (err) {
    console.error('Failed to load mold detail:', err);
  }
};

const goBack = () => {
  window.history.back();
};

onMounted(() => {
  loadMold();
  setInterval(loadMold, 5000); // Auto-refresh every 5 seconds
});
</script>

<style scoped>
.mold-detail {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
  padding-bottom: 20px;
}

.header h1 {
  flex: 1;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.btn-back {
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-back:hover {
  background: #e0e0e0;
}

.overall-progress {
  width: 120px;
}

.progress-circle {
  position: relative;
  width: 100px;
  height: 100px;
}

.progress-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-circle circle {
  fill: none;
}

.progress-circle circle.bg {
  stroke: #eee;
  stroke-width: 3;
}

.progress-circle circle.fill {
  stroke: #4CAF50;
  stroke-width: 3;
  stroke-dasharray: 282;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 18px;
  color: #333;
}
</style>
