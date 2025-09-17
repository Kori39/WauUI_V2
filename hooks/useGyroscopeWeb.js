import { useEffect, useRef, useState } from "react";

export function useGyroscopeWeb() {
  const [enabled, setEnabled] = useState(false);
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const baseline = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (!enabled) return;

    let orientationHandler;
    let motionHandler;

    const startSensors = async () => {
      // iOS Safari permission
      if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
      ) {
        try {
          const response = await DeviceMotionEvent.requestPermission();
          if (response !== "granted") {
            console.warn("Motion permission not granted on iOS Safari.");
            return;
          }
        } catch (err) {
          console.error("Error requesting motion permission:", err);
          return;
        }
      }

      // deviceorientation (alpha, beta, gamma)
      orientationHandler = (event) => {
        const alpha = event.alpha ?? 0;
        const beta = event.beta ?? 0;
        const gamma = event.gamma ?? 0;

        // If all zero, probably not supported
        if (alpha === 0 && beta === 0 && gamma === 0) return;

        setData({
          x: beta - baseline.current.x,   // front-back tilt
          y: gamma - baseline.current.y,  // left-right tilt
          z: alpha - baseline.current.z,  // compass rotation
        });
      };
      window.addEventListener("deviceorientation", orientationHandler);

      // fallback: devicemotion (rotationRate)
      motionHandler = (event) => {
        const alpha = event.rotationRate?.alpha ?? 0;
        const beta = event.rotationRate?.beta ?? 0;
        const gamma = event.rotationRate?.gamma ?? 0;

        setData({
          x: beta - baseline.current.x,
          y: gamma - baseline.current.y,
          z: alpha - baseline.current.z,
        });
      };
      window.addEventListener("devicemotion", motionHandler);
    };

    startSensors();

    return () => {
      if (orientationHandler) window.removeEventListener("deviceorientation", orientationHandler);
      if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
    };
  }, [enabled]);

  // Public functions
  const start = () => setEnabled(true);
  const stop = () => setEnabled(false);
  const calibrate = () => {
    baseline.current = { ...data };
  };

  return { enabled, data, start, stop, calibrate };
}
