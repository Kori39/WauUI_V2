// import { Video } from "expo-av";
// import { useFonts } from "expo-font";
// import { useRouter } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import { useRef, useState } from "react";
// import {
//   Animated,
//   Dimensions,
//   Platform,
//   Pressable,
//   SafeAreaView,
//   StyleSheet,
//   View,
// } from "react-native";
// import { connectWebSocket } from "../components/WebSocket/web-socket-manager";


// // Force mobile-like dimensions when running on web
// const window = Dimensions.get("window");
// const width = Platform.OS === "web" ? 375 : window.width;
// const height = Platform.OS === "web" ? 812 : window.height;

// const scale = (size) => (width / 375) * size;
// const verticalScale = (size) => (height / 812) * size;


// export default function HomeScreen() {
//   const [fontsLoaded] = useFonts({
//     Biko: require("../assets/fonts/Biko_Regular.ttf"),
//     Biko_Bold: require("../assets/fonts/Biko_Bold.ttf"),
//     Rencana: require("../assets/fonts/Rencana.ttf"),
//     DKSnippitySnap: require("../assets/fonts/DKSnippitySnap.ttf"),
//   });

//   const tapFadeAnim = useRef(new Animated.Value(0)).current;
//   const tapTranslateYAnim = useRef(
//     new Animated.Value(verticalScale(20))
//   ).current;  
  
//   const introOpacity = useRef(new Animated.Value(1)).current;

//   const router = useRouter();
//   const [tapped, setTapped] = useState(false);
//   const [videoFinished, setVideoFinished] = useState(false);
//   const [playTapStart, setPlayTapStart] = useState(false);


//   // Animate "Tap to Start"
//   const showTapToStart = () => {
//     Animated.parallel([
//       Animated.timing(tapFadeAnim, {
//         toValue: 1,
//         duration: 1800,
//         useNativeDriver: true,
//       }),
//       Animated.timing(tapTranslateYAnim, {
//         toValue: 0,
//         duration: 1800,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   // Handle Tap
//   const handleTap = () => {
//     if (tapped || !videoFinished) return;
//     setTapped(true);
//     setPlayTapStart(true);

//     Animated.timing(introOpacity, {
//     toValue: 0,
//     duration: 400, // adjust for speed
//     useNativeDriver: true,
//   }).start();

//   };

//   if (!fontsLoaded) return null;

//   return (
//     <>
//       <StatusBar hidden />
//       <View style={styles.videoBackground}>
//         {/* Intro Video (always mounted) */}
//         <Animated.View style={[styles.videoBackground, { opacity: introOpacity }]}>
//           <Video
//             source={require("../assets/vid/Intro.mp4")}
//             style={StyleSheet.absoluteFill}
//             resizeMode="cover"
//             shouldPlay={!playTapStart}
//             isMuted
//             isLooping={false}
//             rate={1.5}
//             onPlaybackStatusUpdate={(status) => {
//               if (status.didJustFinish && !videoFinished) {
//                 setVideoFinished(true);
//                 showTapToStart();
//               }
//             }}
//           />
//         </Animated.View>

//         {/* Tap Start Video (layered above Intro) */}
//         {playTapStart && (
//           <Video
//             source={require("../assets/vid/TapStart.mp4")}
//             style={[styles.videoBackground, { zIndex: 2 }]}
//             resizeMode="cover"
//             shouldPlay
//             isMuted
//             isLooping={false}
//             onPlaybackStatusUpdate={(status) => {
//               if (status.didJustFinish) {
//                 connectWebSocket();
//                 router.push("/ShapeStep");
//               }
//             }}
//           />
//         )}

//         {/* Dark overlay */}
//         <View style={styles.overlay} />

//         {/* Safe area for UI */}
//         <SafeAreaView style={styles.safeArea}>
//           {videoFinished && !playTapStart && (
//             <Pressable
//               style={styles.pressableContainer}
//               onPress={handleTap}
//               disabled={!videoFinished}
//             >
//               <Animated.Text
//                 style={[
//                   styles.tapText,
//                   {
//                     opacity: tapFadeAnim,
//                     transform: [{ translateY: tapTranslateYAnim }],
//                   },
//                 ]}
//               >
//                 Tap to Start
//               </Animated.Text>
//             </Pressable>
//           )}
//         </SafeAreaView>
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   fullScreenContainer: {
//     flex: 1,
//     backgroundColor: "#000", // keep solid black underneath
//   },
//   videoBackground: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: width,
//     height: height * 1.05,
//   },
//   overlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.2)",
//   },
//   safeArea: {
//     flex: 1,
//   },
//   pressableContainer: {
//     flex: 1,
//     bottom: 160,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     paddingBottom: verticalScale(10),
//   },
//   tapText: {
//     fontSize: scale(20),
//     fontFamily: "DKSnippitySnap",
//     color: "#350b0bff",
//     opacity: 0.9,
//     letterSpacing: 1.5,
//     marginBottom: verticalScale(120),
//     shadowColor: "#ffff",
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     shadowOpacity: 0.5,
//   },
// });

import { Video } from "expo-av";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { connectWebSocket } from "../components/WebSocket/web-socket-manager";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Biko: require("../assets/fonts/Biko_Regular.ttf"),
    Biko_Bold: require("../assets/fonts/Biko_Bold.ttf"),
    Rencana: require("../assets/fonts/Rencana.ttf"),
    DKSnippitySnap: require("../assets/fonts/DKSnippitySnap.ttf"),
  });

  const tapFadeAnim = useRef(new Animated.Value(0)).current;
  const tapTranslateYAnim = useRef(new Animated.Value(20)).current;
  const introOpacity = useRef(new Animated.Value(1)).current;

  const router = useRouter();
  const [tapped, setTapped] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [playTapStart, setPlayTapStart] = useState(false);

  // Responsive height for web & mobile
  const [viewportHeight, setViewportHeight] = useState(
    Platform.OS === "web" ? window.innerHeight : 0
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      const handleResize = () => setViewportHeight(window.innerHeight);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Animate "Tap to Start"
  const showTapToStart = () => {
    Animated.parallel([
      Animated.timing(tapFadeAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }),
      Animated.timing(tapTranslateYAnim, {
        toValue: 0,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleTap = () => {
    if (tapped || !videoFinished) return;
    setTapped(true);
    setPlayTapStart(true);

    Animated.timing(introOpacity, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar hidden />
      <View style={[styles.container, { height: viewportHeight || "100%" }]}>
        {/* Intro Video */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: introOpacity }]}>
          <Video
            source={require("../assets/vid/Intro.mp4")}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            shouldPlay={!playTapStart}
            isMuted
            isLooping={false}
            rate={1.5}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish && !videoFinished) {
                setVideoFinished(true);
                showTapToStart();
              }
            }}
          />
        </Animated.View>

        {/* Tap Start Video */}
        {playTapStart && (
          <Video
            source={require("../assets/vid/TapStart.mp4")}
            style={[StyleSheet.absoluteFill, { zIndex: 2 }]}
            resizeMode="cover"
            shouldPlay
            isMuted
            isLooping={false}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                connectWebSocket();
                router.push("/ShapeStep");
              }
            }}
          />
        )}

        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Safe area UI */}
        <SafeAreaView style={styles.safeArea}>
          {videoFinished && !playTapStart && (
            <Pressable
              style={styles.pressableContainer}
              onPress={handleTap}
              disabled={!videoFinished}
            >
              <Animated.Text
                style={[
                  styles.tapText,
                  {
                    opacity: tapFadeAnim,
                    transform: [{ translateY: tapTranslateYAnim }],
                  },
                ]}
              >
                Tap to Start
              </Animated.Text>
            </Pressable>
          )}
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#000",
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  safeArea: {
    flex: 1,
  },
  pressableContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 200,
  },
  tapText: {
    fontSize: 20,
    fontFamily: "DKSnippitySnap",
    color: "#350b0bff",
    opacity: 0.9,
    letterSpacing: 1.5,
    // shadowColor: "#fff",
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 4,
    // shadowOpacity: 0.5,
  },
});
