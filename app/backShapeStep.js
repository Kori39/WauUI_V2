import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { kiteShapeImage } from "../lib/kiteShapeImage";

const { width, height } = Dimensions.get("window");

export default function KiteShapeStep() {
  const router = useRouter();

  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    Biko_Bold: require("../assets/fonts/Biko_Bold.ttf"),
    Rencana: require("../assets/fonts/Rencana.ttf"),
    Biko_Regular: require("../assets/fonts/Biko_Regular.ttf"),
    DKSnippitySnap: require("../assets/fonts/DKSnippitySnap.ttf"),
  });

  const kiteArray = Object.values(kiteShapeImage).filter(
    (item) => item?.image && item?.imageShape
  );

  // Swipe gestures
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

  const handleSelect = () => {
    router.push(`/PatternStep?kiteBase=${kiteArray[currentIndex].id}`);
  };

  if (!fontsLoaded) return null;

  const currentItem = kiteArray[currentIndex];
  const nextIndex = (currentIndex + 1) % kiteArray.length;
  const prevIndex = (currentIndex - 1 + kiteArray.length) % kiteArray.length;

  const renderKite = (item, translateX) => (
    <Animated.View style={[styles.kiteStack, { transform: [{ translateX }] }]}>
      <Image source={item.imageShape} style={styles.shapeImage} resizeMode="contain" />
      <Image source={item.image} style={styles.kiteImage} resizeMode="contain" />
    </Animated.View>
  );

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <ImageBackground
        source={require("../assets/images/bg/background2.jpg")}
        style={styles.fullscreen}
        resizeMode="cover"
      >
        <View style={styles.kiteWrapper}>
          {renderKite(
            kiteArray[prevIndex],
            Animated.add(position, new Animated.Value(-width))
          )}
          {renderKite(currentItem, position)}
          {renderKite(
            kiteArray[nextIndex],
            Animated.add(position, new Animated.Value(width))
          )}
        </View>

        <TouchableOpacity style={styles.selectButton} onPress={handleSelect}>
          <Image
            source={require("../assets/images/frame/select.png")}
            style={styles.selectImage}
          />
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  fullscreen: { position: "absolute", top: 0, left: 0, width, height, justifyContent: "center", alignItems: "center" },
  kiteWrapper: { flexDirection: "row", width: width * 3, height: height * 0.6, position: "absolute", top: height * 0.15, left: -width, justifyContent: "center", alignItems: "center" },
  kiteStack: { width: width * 0.65, height: height * 0.6, justifyContent: "center", alignItems: "center", marginHorizontal: width * 0.175, position: "relative" },
  kiteImage: { width: "100%", height: "100%", position: "absolute", zIndex: 2, left: -width * 0.06 },
  shapeImage: { width: "170%", height: "170%", position: "absolute", zIndex: 1, top: -height * 0.25, left: -width * 0.25 },
  selectButton: { position: "absolute", bottom: height * 0.2, alignSelf: "center", zIndex: 2 },
  selectImage: { width: width * 0.4, height: (width * 0.4 * 50) / 120, resizeMode: "contain" },
});
