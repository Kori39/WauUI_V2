export default function createFlightTimer(onTimeout, delayMs) {
  let timeoutId = null;

  const start = () => {
    clear();
    timeoutId = setTimeout(() => {
      onTimeout();
    }, delayMs);
  };

  const reset = () => {
    start();
  };

  const clear = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { start, reset, clear };
}