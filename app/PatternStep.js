import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { kitePattern } from "../lib/kitePattern";
import { kiteShapeImage } from "../lib/kiteShapeImage";

const { width, height } = Dimensions.get("window");

// Scaling utilities for responsive sizing
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 667) * size;

export default function PatternStep() {
  const { kiteBase } = useLocalSearchParams();
  const router = useRouter();

  // UI state
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [availablePatterns, setAvailablePatterns] = useState([]);
  const [displayShape, setDisplayShape] = useState(null);

  // Animation state (always declared at top!)
  const [showSelectAnimation, setShowSelectAnimation] = useState(false);
  const fadeInRef = useRef(null);
  // const videoFadeAnim = useRef(new Animated.Value(1)).current;
  const [videoKey, setVideoKey] = useState(0);

  useEffect(() => {
    const shape = kiteShapeImage[kiteBase];
    if (!shape) console.warn("No baseShape found for", kiteBase);
    setDisplayShape(shape);

    const patterns = Object.values(kitePattern).filter(
      (pattern) => pattern.shape === kiteBase
    );
    setAvailablePatterns(patterns);
  }, [kiteBase]);

  const handleSelectPattern = (pattern) => {
    setSelectedPattern(pattern);

    const shape = kiteShapeImage[pattern.shape];
    if (shape) {
      // Always show blank base first
      setDisplayShape({
        ...shape,
        imageShape: shape.blank,
      });
    }
  };

  const handleNext = () => {
    if (!selectedPattern) return;

    // Play video before navigating
    setShowSelectAnimation(true);
    setVideoKey((k) => k + 1);
  };

  const handleFinishAnimation = () => {
    router.push({
      pathname: "/ColorSelection",
      params: {
        kiteBase,
        kitePattern: selectedPattern.id,
      },
    });
  };

  return (
    <View style={{ flex: 1,backgroundColor:"#e7dbc6ff"}}>
      {/* Background */}
      <ImageBackground
        source={require("../assets/images/bg/background4.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        <Image
          source={require("../assets/images/bg/colorpaper.png")}
          style={styles.colorPaper}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* Header */}
      <Image
        source={require("../assets/images/icons/header.png")}
        style={styles.headerImage}
        resizeMode="contain"
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Image
          source={require("../assets/images/icons/back.png")}
          style={styles.backButtonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Main container */}
      <View style={styles.container}>
        {/* Kite Display Area */}
        <View style={styles.kiteArea}>
          {/* Blank Base */}
          {displayShape?.imageShape ? (
            <Image
              source={displayShape.imageShape}
              style={styles.kiteImage}
              resizeMode="contain"
            />
          ) : (
            <Text>No base shape found</Text>
          )}

          {/* Selected Pattern Overlay */}
          {selectedPattern?.image && (
            <Image
              source={selectedPattern.image}
              style={[styles.kiteImage, { zIndex: 2 }]}
              resizeMode="contain"
            />
          )}
        </View>

        {/* Pattern Selection */}
        <View style={styles.patternContainer}>
          {availablePatterns.map((pattern) => {
            const isSelected = selectedPattern?.id === pattern.id;
            return (
              <TouchableOpacity
                key={pattern.id}
                onPress={() => handleSelectPattern(pattern)}
                activeOpacity={0.8}
              >
                <Image
                  source={pattern.image}
                  style={[
                    styles.patternImage,
                    { opacity: isSelected ? 1 : 0.5 },
                  ]}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Select Button */}
      {selectedPattern && (
        <TouchableOpacity
          style={styles.selectButton}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Image
            source={require("../assets/images/frame/select.png")}
            style={styles.selectButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Transition Video */}
      {showSelectAnimation && (
        // <Animated.View style={[styles.fullscreen, { opacity: videoFadeAnim }]}>
          <Video
            ref={fadeInRef}
            key={`fadein-${videoKey}`}
            source={require("../assets/vid/bg4.mp4")}
            style={styles.fullscreen}
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
        // </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    overflow: "hidden",
  },
  background: {
    flex: 1,
    left:-4,
    width: "101.5%",
    height: "100.6%",
    position: "absolute",
    overflow: "hidden",
  },
  colorPaper: {
    position: "absolute",
    top: scaleHeight(60),
    left: scaleWidth(25),
    width: scaleWidth(330),
    height: scaleHeight((335 * 280) / 120),
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    top: scaleHeight(80),
    left: scaleWidth(30),
    width: scaleWidth(40),
    height: scaleHeight(50),
    zIndex: 999,
  },
  backButtonImage: { width: "100%", height: "100%" },
  kiteArea: {
    position: "absolute",
    top: scaleHeight(50),
    width: "100%",
    height: scaleHeight(400),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  kiteImage: {
    width: "110%",
    height: "100%",
    position: "absolute",
    zIndex: 2,
    left: -width * 0.09,
    top: scaleHeight(20),
  },
  patternContainer: {
    position: "absolute",
    bottom: scaleHeight(270),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    width: "100%",
    paddingHorizontal: scaleWidth(20),
  },
  patternImage: {
    width: scaleWidth(210),
    height: scaleHeight(145),
    marginHorizontal: scaleWidth(-20),
    resizeMode: "contain",
    top: scaleHeight(120),
  },
  selectButton: {
    position: "absolute",
    bottom: scaleHeight(80),
    alignSelf: "center",
    width: scaleWidth(150),
    height: scaleHeight(50),
    zIndex: 999,
  },
  selectButtonImage: { width: "100%", height: "100%", zIndex: 999, },
  headerImage: {
    position: "absolute",
    top: scaleHeight(130),
    left: scaleWidth(-70),
    width: width,
    height: scaleHeight(45),
    zIndex: 999,
    
  },
  fullscreen: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 2000,
    
  },
});
