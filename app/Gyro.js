import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDirectionalInput } from "../hooks/direction-track-gyro";
import { useGyroscope } from "../hooks/gyro-hook";
import { presetColorSelection } from "../lib/presetColorSelection";

export default function GyroDot({kitePattern}) {
  const { data, start, stop } = useGyroscope();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [dotPos, setDotPos] = useState({ x: 0, y: 0 });
  const [baseline, setBaseline] = useState({ x: 0, y: 0, z: 0 });
  const [direction, setDirection] = useState({ vertical: "Neutral", horizontal: "Neutral" });
  const { releaseAllDirections } = useDirectionalInput(dotPos, containerSize.width, containerSize.height, setDirection);
  const kite = presetColorSelection[kitePattern]; 

  // Mount/unmount
  useEffect(() => {
    calibrate();
    start();
    return () => {
      stop();
      releaseAllDirections();
    };
  }, []);

  // Center dot when container size changes
  useEffect(() => {
    if (!containerSize.width || !containerSize.height) return;
    setDotPos({
      x: containerSize.width / 2,
      y: containerSize.height / 2,
    });
  }, [containerSize]);

  // Update dot position from gyro
  useEffect(() => {
    if (!containerSize.width || !containerSize.height) return;

    const scaleX = 8;
    const scaleY = 10;

    setDotPos((prev) => {
      const offsetX = data.y - baseline.y;
      const offsetY = data.x - baseline.x;

      const newX = prev.x + offsetX * scaleX;
      const newY = prev.y + offsetY * scaleY;

      const clampedX = Math.max(15, Math.min(containerSize.width - 15, newX));
      const clampedY = Math.max(15, Math.min(containerSize.height - 15, newY));

      return { x: clampedX, y: clampedY };
    });
  }, [data, baseline, containerSize]);

  // Reset baseline + recenter
  const calibrate = () => {
    setBaseline(data);
    if (containerSize.width && containerSize.height) {
      setDotPos({
        x: containerSize.width / 2,
        y: containerSize.height / 2,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Visualizer */}
      <View
        style={styles.visualizerContainer}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          setContainerSize({ width, height });
        }}
      >
         {/* Kite image positioned at dot center */}
          <Image
            source={kite.image}
            style={[
              styles.kiteImage,
              {
                position: "absolute",
                left: dotPos.x - 80, // half of image width
                top: dotPos.y - 80,  // half of image height
              },
            ]}
          />

          {/* Optional: keep the red dot for debugging */}
          <View
            style={[
              styles.dot,
              {
                transform: [
                  { translateX: dotPos.x - 15 },
                  { translateY: dotPos.y - 15 },
                ],
              },
            ]}
          />
        </View>
        
      

      {/* Floating buttons */}
      <TouchableOpacity onPress={calibrate} style={styles.buttonHolder}>
            <Image source={require("../assets/controls/calibrateButton.png")}
            style={styles.calibrateBut}
            />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  visualizerContainer: {
    width: "85%",
    aspectRatio: 1, // keeps square, responsive
    maxWidth: 400,
    maxHeight: 400,
    // backgroundColor: "#a7b7c7",
    borderRadius: 20,
  },
  dot: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    // backgroundColor: "tomato",
  },
  buttonHolder: {
    position:"absolute",
    width: "35%",
    height:60,
    alignItems: "center",
    justifyContent:"center",
    bottom: 170,
    
  },
  calibrateBut:{
    position: "absolute",
    width: "100%",
    height: undefined,  // let aspectRatio control height
    aspectRatio: 1,     // adjust based on your image proportions
    resizeMode: "contain",
  },
    kiteImage: {
    width: 160,
    height: 160,
    resizeMode: 'overflow',
  },
});