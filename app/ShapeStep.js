import { Video } from "expo-av";
import { useFonts } from "expo-font";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { kiteShapeImage } from "../lib/kiteShapeImage";


const { width, height } = Dimensions.get("window");

export default function KiteShapeStep() {
  const router = useRouter();

  // ---------- State ----------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showKite, setShowKite] = useState(false);
  const [showBookFlip, setShowBookFlip] = useState(true);
  const [showSelectAnimation, setShowSelectAnimation] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  // ---------- Animation refs ----------
  const position = useRef(new Animated.Value(0)).current;
  const videoFadeAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  const bookFlipRef = useRef(null);
  const fadeInRef = useRef(null);

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
    setShowBookFlip(false);
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

useFocusEffect(
  useCallback(() => {
    if (hasPlayedIntro.current) {
      // Already played once → show kite directly
      setShowBookFlip(false);
      setShowKite(true);
    } else {
      // First entry → play book flip
      setShowBookFlip(true);
      setShowKite(false);
      hasPlayedIntro.current = true;
    }
    setShowSelectAnimation(false);
  }, [])
);

  // ---------- Screen Fade-in ----------
  // useFocusEffect(
  //   useCallback(() => {
  //     overlayOpacity.setValue(1);
  //     Animated.timing(overlayOpacity, {
  //       toValue: 0,
  //       duration: 1000,
  //       easing: Easing.inOut(Easing.ease),
  //       useNativeDriver: true,
  //     }).start();
  //   }, [])
  // );

  if (!fontsLoaded) return null;

  // ---------- Kite Selection helpers ----------
  const currentItem = kiteArray[currentIndex];
  const nextIndex = (currentIndex + 1) % kiteArray.length;
  const prevIndex = (currentIndex - 1 + kiteArray.length) % kiteArray.length;

  const renderKite = (item, translateX) => (
    <Animated.View style={[styles.kiteStack, { transform: [{ translateX }] }]}>
      <Image source={item.imageShape} style={styles.shapeImage} resizeMode="contain" />
      <Image source={item.image} style={styles.kiteImage} resizeMode="contain" />
    </Animated.View>
  );

  // ---------- Render ----------
  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* White overlay fade-in */}
      {/* <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "white", opacity: overlayOpacity, zIndex: 9999 },
        ]}
      /> */}

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

        {/* Book Flip Animation */}
        {showBookFlip && (
          <Animated.View style={[styles.fullscreen, { opacity: videoFadeAnim }]}>
            <Video
              ref={bookFlipRef}
              key={`bookflip-${videoKey}`}
              source={require("../assets/vid/TapStart.mp4")}
              style={styles.fullscreen}
              resizeMode="cover"
              isLooping={false}
              isMuted
              shouldPlay
              onPlaybackStatusUpdate={(status) => {
                if (status.didJustFinish) {
                  setShowBookFlip(false);
                  setShowKite(true);
                }
              }}
            />
          </Animated.View>
        )}

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
              ref={fadeInRef}
              key={`fadein-${videoKey}`}
              source={require("../assets/vid/bg2.mp4")}
              style={[styles.fullscreen,{ backgroundColor: "#e7dbc6ff" }]}
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
    backgroundColor:"#bba993ff",
    position: "relative",
  },
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 1.06,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },
  topLabelWrapper: {
    position: "absolute",
    top: 130,    // push down from top
    left: 20,   // push right from left
    // optional: width if you want relative sizing
    width: width * 0.48,  
    height: height *0.07,
    backgroundColor:"#f6d78759"
  },
  topLabel: {
    width: "110%",       // take full width of wrapper
    height: undefined,   // let aspectRatio control height
    aspectRatio: 3.5,      // adjust to your image’s proportions
    resizeMode: "contain",
  },
  kiteWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -height * 0.15,
  },
  kiteStack: {
    width: width * 0.65,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: width * 0.175,
    position: "relative",
  },
  kiteImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 2,
    left: -width * 0.06,
  },
  shapeImage: {
    width: "170%",
    height: "170%",
    position: "absolute",
    zIndex: 1,
    top: -height * 0.25,
    left: -width * 0.25,
  },
  selectButton: {
    position: "absolute",
    bottom: height * 0.12,
    alignSelf: "center",
    zIndex: 1,
    top: height * 0.75,
  },
  selectImage: {
    width: width * 0.4,
    height: (width * 0.4 * 50) / 120,
    resizeMode: "contain",
  },
  scrollIndicator:{
    position:"absolute",
    width:100,
    height:100,
    top:180,
    right:40,
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"center",
    transform: [{ rotate: "15deg" }],
  },
  hand :{
    height:"40%",
    resizeMode:"contain",
    opcaity:0.5,
  },
  indicatorText:{
    fontFamily: 'DKSnippitySnap',
    fontSize:12,
    color: '#350b0bff',
    opacity: 0.5,
    textAlign:"center",
  }
});
