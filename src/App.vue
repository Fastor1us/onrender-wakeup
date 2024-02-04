<script setup>
import { ref, computed, reactive } from 'vue';

import { TIMER_DELAY, SERVERS } from './data';

let intervalFetch = null;
let intervalTimer = null;
const requestCount = ref(0);
const endpointStats = reactive(
  SERVERS.reduce((acc, server) => {
    acc[server.name] = {
      resolve: 0,
      reject: 0,
    };
    return acc;
  }, {})
);
const secondsPassed = ref(0);
const fetchStatus = ref('');

const resetStats = () => {
  if (!SERVERS) return;
  for (const server of SERVERS) {
    endpointStats[server.name].resolve = 0;
    endpointStats[server.name].reject = 0;
  }
  requestCount.value = 0;
};
resetStats();

const resetTimerInterval = () => {
  clearInterval(intervalTimer);
  intervalTimer = null;
  secondsPassed.value = 0;
};

const serversFetch = async () => {
  fetchStatus.value = 'fetching...';
  for (const server of SERVERS) {
    try {
      const response = await fetch(server.endpoint)
        .then((res) => console.log(res))
        .catch((error) => console.log(error));
      if (response.ok) {
        endpointStats[server.name].resolve++;
      } else {
        endpointStats[server.name].reject++;
      }
    } catch (error) {
      console.log(error);
      endpointStats[server.name].reject++;
    }
  }
  requestCount.value++;
  fetchStatus.value = '';
};

const startIntervals = () => {
  if (intervalFetch) return;
  resetStats();
  if (intervalTimer) resetTimerInterval();
  intervalTimer = setInterval(() => {
    secondsPassed.value++;
  }, 1000);
  serversFetch();
  intervalFetch = setInterval(async () => {
    serversFetch();
    resetTimerInterval();
    intervalTimer = setInterval(() => {
      secondsPassed.value++;
    }, 1000);
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
  <section v-if="SERVERS && TIMER_DELAY">
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
      <p style="margin: 0">
        <span class="resolve"> resolve </span>
        /
        <span class="reject"> reject </span>
      </p>
      <ul>
        <li v-for="server in SERVERS" :key="server.name">
          {{ server.name }}:
          <span class="resolve">
            {{ endpointStats[server.name].resolve }}
          </span>
          /
          <span class="reject">
            {{ endpointStats[server.name].reject }}
          </span>
        </li>
      </ul>
    </div>
  </section>
  <section v-else>
    <p>
      Задайте переменные окружения VUE_APP_SERVERS_DATA, VUE_APP_TIMER_DELAY
    </p>
    <p>
      Подробней -&nbsp;
      <a href="https://github.com/Fastor1us/onrender-wakeup">README.md</a>
    </p>
  </section>
  <footer>
    2024 @
    <a
      href="https://github.com/Fastor1us/onrender-wakeup"
      target="_blank"
      rel="noreferrer"
      class="link"
    >
      github
    </a>
  </footer>
</template>

<style>
body {
  background-color: rgb(114, 105, 197);
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

.resolve {
  color: rgb(147, 243, 147);
  font-weight: bold;
}

.reject {
  color: rgb(253, 201, 201);
  font-weight: bold;
}

.link {
  color: rgb(0, 255, 157);
}
</style>
