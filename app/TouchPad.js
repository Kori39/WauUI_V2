
// import { useRef } from 'react';
// import {
//   Animated,
//   Image,
//   PanResponder,
//   StyleSheet
// } from 'react-native';
// import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
// import { presetColorSelection } from '../lib/presetColorSelection';
// import { sendDirectionalAction } from '../utils/sendActionMsg';

// const TouchPad = ({ kitePattern}) => {
//   const pan = useRef(new Animated.ValueXY()).current;
//   const lastDirection = useRef({ vertical: 'Neutral', horizontal: 'Neutral' });
//   const kite = presetColorSelection[kitePattern];  // now matches correctly

//   const threshold = 50;

//   const determineDirection = (dx, dy) => {
//     let horizontal = 'Neutral';
//     let vertical = 'Neutral';

//     if (dx > threshold) horizontal = 'Right';
//     else if (dx < -threshold) horizontal = 'Left';

//     if (dy > threshold) vertical = 'Down';
//     else if (dy < -threshold) vertical = 'Up';

//     return { horizontal, vertical };
//   };

//   const panResponder = useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (evt, gestureState) => {
//         pan.setValue({ x: gestureState.dx, y: gestureState.dy });

//         const { horizontal, vertical } = determineDirection(
//           gestureState.dx,
//           gestureState.dy
//         );

//         if (horizontal !== lastDirection.current.horizontal) {
//           if (lastDirection.current.horizontal !== 'Neutral') {
//             sendDirectionalAction(lastDirection.current.horizontal, 'up');
//           }
//           if (horizontal !== 'Neutral') {
//             sendDirectionalAction(horizontal, 'down');
//           }
//           lastDirection.current.horizontal = horizontal;
//         }

//         if (vertical !== lastDirection.current.vertical) {
//           if (lastDirection.current.vertical !== 'Neutral') {
//             sendDirectionalAction(lastDirection.current.vertical, 'up');
//           }
//           if (vertical !== 'Neutral') {
//             sendDirectionalAction(vertical, 'down');
//           }
//           lastDirection.current.vertical = vertical;
//         }
//       },
//       onPanResponderRelease: () => {
//         Animated.spring(pan, {
//           toValue: { x: 0, y: 0 },
//           useNativeDriver: false,
//         }).start();

//         const { horizontal, vertical } = lastDirection.current;
//         if (horizontal !== 'Neutral') {
//           sendDirectionalAction(horizontal, 'up');
//         }
//         if (vertical !== 'Neutral') {
//           sendDirectionalAction(vertical, 'up');
//         }

//         lastDirection.current = { horizontal: 'Neutral', vertical: 'Neutral' };
//       },
//     })
//   ).current;

//   return (
//     <SafeAreaProvider>
//       <SafeAreaView style={styles.container}>
//         <Animated.View
//           style={[
//             styles.box,
//             {
//               transform: [
//                 { translateX: pan.x },
//                 { translateY: pan.y },
//               ],
//             },
//           ]}
//           {...panResponder.panHandlers}
//           pointerEvents="box-none"
//         >
//           {kite && (
//             <Image source={kite.image} style={styles.kiteImage} />
//           )}
//         </Animated.View>
//       </SafeAreaView>
//     </SafeAreaProvider>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   box: {
//     height: 120,
//     width: 120,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   kiteImage: {
//     width: 200,
//     height: 200,
//     resizeMode: 'contain',
//   },
// });

// export default TouchPad;

import { useRef } from "react";
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { presetColorSelection } from "../lib/presetColorSelection";
import { sendDirectionalAction } from "../utils/sendActionMsg";

const TouchPad = ({ kitePattern }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const lastDirection = useRef({ vertical: "Neutral", horizontal: "Neutral" });
  const kite = presetColorSelection[kitePattern];

  const joystickSize = 200; // match kite image
  const threshold = 50;     // movement threshold
  const maxOffset = 80;     // max movement from center

  const determineDirection = (dx, dy) => {
    let horizontal = "Neutral";
    let vertical = "Neutral";

    if (dx > threshold) horizontal = "Right";
    else if (dx < -threshold) horizontal = "Left";

    if (dy > threshold) vertical = "Down";
    else if (dy < -threshold) vertical = "Up";

    return { horizontal, vertical };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        // only respond if touch is inside joystick area
        return (
          locationX >= 0 &&
          locationX <= joystickSize &&
          locationY >= 0 &&
          locationY <= joystickSize
        );
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        // clamp movement to maxOffset
        const dx = Math.max(-maxOffset, Math.min(maxOffset, gestureState.dx));
        const dy = Math.max(-maxOffset, Math.min(maxOffset, gestureState.dy));

        pan.setValue({ x: dx, y: dy });

        const { horizontal, vertical } = determineDirection(dx, dy);

        // send directional actions
        if (horizontal !== lastDirection.current.horizontal) {
          if (lastDirection.current.horizontal !== "Neutral") {
            sendDirectionalAction(lastDirection.current.horizontal, "up");
          }
          if (horizontal !== "Neutral") {
            sendDirectionalAction(horizontal, "down");
          }
          lastDirection.current.horizontal = horizontal;
        }

        if (vertical !== lastDirection.current.vertical) {
          if (lastDirection.current.vertical !== "Neutral") {
            sendDirectionalAction(lastDirection.current.vertical, "up");
          }
          if (vertical !== "Neutral") {
            sendDirectionalAction(vertical, "down");
          }
          lastDirection.current.vertical = vertical;
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();

        // reset directions
        const { horizontal, vertical } = lastDirection.current;
        if (horizontal !== "Neutral") sendDirectionalAction(horizontal, "up");
        if (vertical !== "Neutral") sendDirectionalAction(vertical, "up");

        lastDirection.current = { horizontal: "Neutral", vertical: "Neutral" };
      },
    })
  ).current;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} pointerEvents="box-none">
        {/* Joystick container */}
        <View style={styles.joystickArea} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.box,
              { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
            ]}
            {...panResponder.panHandlers}
          >
            {kite && <Image source={kite.image} style={styles.kiteImage} />}
          </Animated.View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  joystickArea: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: "absolute",
    bottom: 250, // adjust to your layout
    left: -95,    // adjust to your layout
    justifyContent: "center",
    alignItems: "center",
    alignSelf:"center",
  },
  box: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",

  },
  kiteImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default TouchPad;
