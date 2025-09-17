import { useFocusEffect } from "@react-navigation/native";
import { Video } from "expo-av";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { kiteShapeImage } from "../lib/kiteShapeImage";

const { width, height } = Dimensions.get("window");

// Scaling utilities (same as pattern.js for consistency)
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 667) * size;

export default function KiteShapeStep() {
  const router = useRouter();

  // ---------- State ----------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showKite, setShowKite] = useState(false);
  const [showSelectAnimation, setShowSelectAnimation] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  // ---------- Animation refs ----------
  const position = useRef(new Animated.Value(0)).current;
  const videoFadeAnim = useRef(new Animated.Value(1)).current;

  // ---------- Fonts ----------
  const [fontsLoaded] = useFonts({
    Biko_Bold: require("../assets/fonts/Biko_Bold.ttf"),
    Rencana: require("../assets/fonts/Rencana.ttf"),
    Biko_Regular: require("../assets/fonts/Biko_Regular.ttf"),
    DKSnippitySnap: require("../assets/fonts/DKSnippitySnap.ttf"),
  });

  // ---------- Data ----------
  const kiteArray = Object.values(kiteShapeImage).filter(
    (item) => item?.image && item?.imageShape
  );

  // ---------- Gestures ----------
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        position.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;

        if (dx < -80) {
          Animated.timing(position, {
            toValue: -width,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex((prev) => (prev + 1) % kiteArray.length);
            position.setValue(0);
          });
        } else if (dx > 80) {
          Animated.timing(position, {
            toValue: width,
            duration: 150,
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex(
              (prev) => (prev - 1 + kiteArray.length) % kiteArray.length
            );
            position.setValue(0);
          });
        } else {
          Animated.spring(position, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // ---------- Handlers ----------
  const handleSelect = () => {
    setShowKite(false);
    setShowSelectAnimation(true);
    setVideoKey((prev) => prev + 1);
    Animated.timing(videoFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleFinishAnimation = () => {
    router.push({
      pathname: "/PatternStep",
      params: { kiteBase: kiteArray[currentIndex].id },
    });
  };

  const hasPlayedIntro = useRef(false);

  useEffect(() => {
  if (Platform.OS === "web") {
    document.body.style.overflow = "hidden";
  }
}, []);

  useFocusEffect(
    useCallback(() => {
      if (hasPlayedIntro.current) {
        setShowKite(true);
      } else {
        setShowKite(true);
        hasPlayedIntro.current = true;
      }
      setShowSelectAnimation(false);
    }, [])
  );

  if (!fontsLoaded) return null;

  // ---------- Kite Selection helpers ----------
  const currentItem = kiteArray[currentIndex];
  const nextIndex = (currentIndex + 1) % kiteArray.length;
  const prevIndex = (currentIndex - 1 + kiteArray.length) % kiteArray.length;

  const renderKite = (item, translateX) => (
    <Animated.View style={[styles.kiteStack, { transform: [{ translateX }] }]}>
      <Image
        source={item.imageShape}
        style={styles.shapeImage}
        resizeMode="contain"
      />
      <Image
        source={item.image}
        style={styles.kiteImage}
        resizeMode="contain"
      />
    </Animated.View>
  );

  // ---------- Render ----------
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
        source={require("../assets/images/bg/background2.jpg")}
        style={styles.fullscreen}
        resizeMode="cover"
      >
        <View style={styles.scrollIndicator}>
          <Image
            source={require("../assets/images/icons/Hand.gif")}
            style={styles.hand}
          />
          <Text style={styles.indicatorText}>Swipe to switch Waus!</Text>
        </View>

        {/* Kite Selection */}
        {showKite && currentItem?.image && (
          <>
            <View style={styles.topLabelWrapper}>
              <Image
                source={require("../assets/images/frame/ChooseWauLabel.png")}
                style={styles.topLabel}
              />
            </View>

            <View style={styles.kiteWrapper}>
              {renderKite(
                kiteArray[prevIndex],
                Animated.add(position, new Animated.Value(-width * 15))
              )}
              {renderKite(currentItem, position)}
              {renderKite(
                kiteArray[nextIndex],
                Animated.add(position, new Animated.Value(width * 15))
              )}
            </View>

            <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
              <Image
                source={require("../assets/images/frame/select.png")}
                style={styles.selectImage}
              />
            </TouchableOpacity>
          </>
        )}

        {/* Fade-in Select Animation */}
        {showSelectAnimation && (
          <Animated.View style={[styles.fullscreen, { opacity: videoFadeAnim }]}>
            <Video
              key={`fadein-${videoKey}`}
              source={require("../assets/vid/bg2.mp4")}
              style={[styles.fullscreen, { backgroundColor: "#e7dbc6ff" }]}
              resizeMode="cover"
              isLooping={false}
              isMuted
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setShowSelectAnimation(false);
                  handleFinishAnimation();
                }
              }}
            />
          </Animated.View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#e7dbc6ff",
    alignItems: "center", 
    justifyContent: "center",
    overflow: "hidden",
  },
  background: {
    flex: 1,
    width: "103%",
    height: "100.6%",
    position: "absolute",
  },
  // Top decorative label ("Choose Wau")
  topLabelWrapper: {
    position: "absolute",
    top: scaleHeight(120),
    left: scaleWidth(25),
    width: scaleWidth(180),
    height: scaleHeight(50),
    zIndex: 5,
  },
  topLabel: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  // Scroll/hand indicator
  scrollIndicator: {
    position: "absolute",
    top: scaleHeight(150),
    left: scaleWidth(-70),
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "15deg" }],
    zIndex: 20,
  },
  hand: {
    height: scaleHeight(40),
    resizeMode: "contain",
    opacity: 0.5,
  },
  indicatorText: {
    fontFamily: "DKSnippitySnap",
    fontSize: scaleHeight(10),
    color: "#350b0bff",
    opacity: 0.6,
    textAlign: "center",
    marginTop: 2,
  },
  // Kite selection area
  kiteWrapper: {
    position: "absolute",
    top: scaleHeight(100),
    width: "100%",
    height: scaleHeight(380),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  kiteStack: {
    width: scaleWidth(240),
    height: scaleHeight(380),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scaleWidth(30),
    position: "absolute",
  },
  kiteImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 2,
    left:-20,
  },
  shapeImage: {
    width: "170%",
    height: "170%",
    position: "absolute",
    zIndex: 1,
    top: scaleHeight(-160),
    left: -100,
  },
  // Select button
  selectButton: {
    position: "absolute",
    bottom: scaleHeight(110),
    alignSelf: "center",
    width: scaleWidth(150),
    height: scaleHeight(50),
    zIndex: 999,
  },
  selectImage: { 
    width: "100%", 
    height: "100%", 
    resizeMode: "contain" 
  },
  // Video fullscreen fade-in
  fullscreen: {
    position: "absolute",
    top: 0,
    left: -4,
    width: "101%",
    height: "101%",
    zIndex: 2000,
  },
});