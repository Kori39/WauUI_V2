import { Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';

export function useGyroscope() {
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const baseline = useRef({ x: 0, y: 0, z: 0 });

  // Subscribe/unsubscribe
  useEffect(() => {
    let subscription;
    if (enabled) {
      subscription = Gyroscope.addListener(gyroscopeData => {
        setData({
          x: gyroscopeData.x - baseline.current.x,
          y: gyroscopeData.y - baseline.current.y,
          z: gyroscopeData.z - baseline.current.z,
        });
      });

      Gyroscope.setUpdateInterval(20); // ms
    }
    return () => {
      if (subscription) subscription.remove();
    };
  }, [enabled]);

  // Public functions
  const start = () => setEnabled(true);
  const stop = () => setEnabled(false);
  const calibrate = () => {
    baseline.current = { ...data };
  };

  return {
    enabled,
    data,       // { x, y, z } ready to use anywhere
    start,      // function to enable gyro
    stop,       // function to disable gyro
    calibrate,  // reset baseline
  };
}