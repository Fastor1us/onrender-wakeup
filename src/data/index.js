
export const TIMER_DELAY = process.env.VUE_APP_TIMER_DELAY || 870000;

export const SERVERS = Object.entries(process.env)
  .filter(([key]) => key.startsWith('VUE_APP_WAKE_UP_'))
  .map(([key, value]) => ({
    name: key.slice(16),
    endpoint: value
  }));
