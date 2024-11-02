import { scope } from './scope';

export const runLazy = scope(() => {
  const duration = 50;
  const state = {
    lastTime: 0,
    pending: null as (() => void) | null,
    timerId: null as NodeJS.Timeout | null,
  };

  return (f: () => void): void => {
    const now = Date.now();
    const diff = now - state.lastTime;
    if (diff > duration) {
      f();
      state.lastTime = now;
      state.pending = null;
    } else {
      state.pending = f;
      if (state.timerId === null) {
        state.timerId = setTimeout(() => {
          if (state.pending !== null) {
            state.pending();
            state.lastTime = Date.now();
            state.pending = null;
          }
          state.timerId = null;
        }, diff);
      }
    }
  };
});
