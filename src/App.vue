<script setup>
import { computed, onMounted, ref } from 'vue';

const SERVERS = [
  {
    name: 'game2cube',
    endpoint: 'https://game2cube-backend.onrender.com/user/avatars',
  },
  {
    name: 'portfolio',
    endpoint: 'https://portfolio-okir-backend.onrender.com/projects',
  },
];
const TIMER_DELAY = 870000; // 14.5 min

let intervalFetch = null;
let intervalTimer = null;
const requestCount = ref(0);
const endpointStats = ref({});
const secondsPassed = ref(0);
const fetchStatus = ref('');

const resetEndpointStats = () => {
  for (const server of SERVERS) {
    endpointStats.value[server.endpoint] = 0;
  }
};
resetEndpointStats();

const resetTimerInterval = () => {
  clearInterval(intervalTimer);
  intervalTimer = null;
  secondsPassed.value = 0;
};

const serversFetch = async () => {
  fetchStatus.value = 'fetching...';
  for (const server of SERVERS) {
    try {
      const response = await fetch(server.endpoint);
      if (response.ok) {
        endpointStats.value[server.endpoint]++;
      }
    } catch (error) {
      console.error(error);
    }
  }
  requestCount.value++;
  fetchStatus.value = '';
};

const startIntervals = () => {
  if (intervalFetch) return;
  resetEndpointStats();
  if (intervalTimer) resetTimerInterval();
  intervalTimer = setInterval(() => {
    secondsPassed.value++;
  }, 1000);
  console.log(1);
  serversFetch();
  console.log(4);
  intervalFetch = setInterval(async () => {
    serversFetch();
  }, TIMER_DELAY);
};

const stopIntervals = () => {
  clearInterval(intervalFetch);
  intervalFetch = null;
  resetTimerInterval();
};

const toggleInterval = () => {
  if (intervalFetch) {
    stopIntervals();
  } else {
    startIntervals();
  }
};

const timeRamaining = computed(() => {
  const secondsLeft = (TIMER_DELAY - secondsPassed.value * 1000) / 1000;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});
</script>

<template>
  <section>
    <div class="control-panel">
      <button class="control-button" v-on:click="toggleInterval">
        {{ intervalFetch ? 'Stop' : 'Start' }} service
      </button>
      <div class="control-indicator" :class="{ active: intervalFetch }"></div>
      <div class="control-timer">Time remaining: {{ timeRamaining }}</div>
    </div>
    <div class="statistics">
      <div style="display: flex; gap: 10px">
        <p>Request Count: {{ requestCount }}</p>
        <p>{{ fetchStatus }}</p>
      </div>
      <ul>
        <li v-for="server in SERVERS" :key="server.endpoint">
          {{ server.name }}: {{ endpointStats[server.endpoint] }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style>
body {
  background-color: rgb(114, 129, 124);
  color: white;
  font-size: 20px;
}

.control-panel {
  display: flex;
  align-items: center;
}

.control-button {
  width: 200px;
  height: 30px;
  font-size: 20px;
}

.control-indicator {
  width: 30px;
  height: 30px;
  box-sizing: border-box;
  background-color: red;
  border: 2px solid black;
}

.control-indicator.active {
  background-color: green;
}

.control-timer {
  margin-left: 10px;
}

.statistics {
  margin-top: 20px;
}
</style>
