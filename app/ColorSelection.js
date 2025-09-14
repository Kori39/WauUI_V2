// usingColorSelect.js
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { presetColorSelection } from "../lib/presetColorSelection";
import { sendCustomAction } from '../utils/sendActionMsg';

const { width, height } = Dimensions.get("window");

// Scaling utilities for responsive sizing
const scaleWidth = (size) => (width / 375) * size;
const scaleHeight = (size) => (height / 667) * size;

export default function ColorSelection() {
  const router = useRouter();
  const { kiteBase, kitePattern } = useLocalSearchParams();

  // --- Filter: Get all patterns that belong to the selected kite shape ---
  const availablePatterns = Object.values(presetColorSelection).filter(
    (pattern) => pattern.pattern === kitePattern
  );

  const [selectedPattern, setSelectedPattern] = useState(
    availablePatterns.length > 0 ? availablePatterns[0] : null
  );
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const videoRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handlePresetSelect = (pattern, index) => {
    setSelectedPattern(pattern);
    setSelectedColorIndex(index);
  };

  if (!selectedPattern) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "red" }}>No patterns found for this kite.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background */}
      <ImageBackground
        source={require("../assets/images/bg/background3.jpg")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Header */}
        <Image
          source={require("../assets/images/icons/header2.png")}
          style={styles.headerImage}
        />

        {/* <Image
            source={require("../assets/images/bg/colorpaint.png")}
            style={styles.colorPaint}
            resizeMode="contain"
          /> */}

        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Image
            source={require("../assets/images/icons/back.png")}
            style={styles.backButtonImage}
          />
        </TouchableOpacity>

        {/* Kite Preview */}
        <View style={styles.previewContainer}>
          <Image
            source={selectedPattern.image}
            style={styles.previewImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.presetsContainer}>
          {/* Background frame image */}
          <Image
            source={require("../assets/images/frame/colorpaint.png")}
            style={styles.presetsBackground}
            resizeMode="contain"
          />

          {/* Top row */}
          <View style={styles.presetsRow}>
            {availablePatterns.slice(0, 4).map((pattern, index) => (
              <TouchableOpacity
                key={pattern.id}
                style={[
                  styles.presetSlot,
                  index === selectedColorIndex && styles.selectedSlot,
                ]}
                onPress={() => handlePresetSelect(pattern, index)}
              >
                <Image
                  source={pattern.thumb}
                  style={styles.thumbImage}
                  resizeMode="contain"
                />
                
                {/* Selected Overlay */}
                {index === selectedColorIndex && (
                  <Image
                    source={require("../assets/images/Color/selected.png")}
                    style={styles.selectedOverlay}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom row */}
          <View style={styles.presetsRow}>
            {availablePatterns.slice(4, 8).map((pattern, index) => {
              const actualIndex = index + 4;
              return (
                <TouchableOpacity
                  key={pattern.id}
                  style={[
                    styles.presetSlot,
                    actualIndex === selectedColorIndex && styles.selectedSlot,
                  ]}
                  onPress={() => handlePresetSelect(pattern, actualIndex)}
                >
                  <Image
                    source={pattern.thumb}
                    style={styles.thumbImage}
                    resizeMode="contain"
                  />
                  {/* Selected Overlay */}
                  {actualIndex === selectedColorIndex && (
                  <Image
                    source={require("../assets/images/Color/selected.png")}
                    style={styles.selectedOverlay}
                    resizeMode="contain"
                  />
                )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowPopup(true)}
        >
          <Image
            source={require("../assets/images/frame/select.png")}
            style={styles.selectButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Popup Modal */}
        <Modal
          visible={showPopup}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPopup(false)}
        >
          <View style={styles.popupOverlay}>
            <ImageBackground
              source={require("../assets/images/frame/popup.png")}
              style={styles.popupBox}
              resizeMode="contain"
            >
              {/* Back inside popup */}
              <TouchableOpacity
                style={styles.popupBackButton}
                onPress={() => setShowPopup(false)}
              >
                <Image
                  source={require("../assets/images/icons/back.png")}
                  style={styles.popupBackIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/* Kite Preview in Popup */}
              <Image
                source={selectedPattern.image}
                style={styles.popupKite}
                resizeMode="contain"
              />

              {/* Launch Button */}
              <TouchableOpacity
                onPress={() => {
                  const wauDesign = {
                    shape: kiteBase,
                    pattern: selectedPattern.id,
                  };
                  console.log('Launching with design:', wauDesign);
                  sendCustomAction('launch', wauDesign);
                  setShowPopup(false);
                  router.push({
                    pathname: "/ControlCombineTest",
                    params: {
                      kiteBase,
                      kitePattern: selectedPattern.id,
                    },
                  });
                }}
              >
                <Image
                  source={require("../assets/images/frame/launch.png")}
                  style={styles.launchButton}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e7dbc6ff" },
  background: { flex: 1, width: "100%", height: "100.6%", position: "absolute" },

  headerImage: {
    position: "absolute",
    top: scaleHeight(130),
    left: scaleWidth(-85),
    width: scaleWidth(410),
    height: scaleHeight(45),
    resizeMode: "contain",
    zIndex: 999,
  },

  backButton: {
    position: "absolute",
    top: scaleHeight(90),
    left: scaleWidth(30),
    width: scaleWidth(65),
    height: scaleHeight(45),
    zIndex: 999,
  },
    colorPaint: {
    position: "absolute",
    top: scaleHeight(70),
    left: scaleWidth(25),
    width: scaleWidth(330),
    height: scaleHeight((335 * 280) / 120),
    zIndex: 1,
  },
  backButtonImage: { width: "70%", height: "70%" },

  previewContainer: {
    position: "absolute",
    top: scaleHeight(80),
    width: width*0.95,
    height: scaleHeight(400),
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },

//   presetsRow: {
//   position: "absolute",
//   bottom: scaleHeight(200),
//   flexDirection: "row",
//   flexWrap: "wrap",
//   justifyContent: "center", // can change to "space-between" if you want
//   alignItems: "center",
//   width: "100%",
//   gap: 10, // optional RN 71+, otherwise use margin in presetSlot
// },
// presetSlot: {
//   width: "20%",  // ~25% minus margins, ensures 4 per row
//   aspectRatio: 1.2, // keeps a consistent shape (adjust ratio)
//   margin: 5,       // gap between slots
//   borderWidth: 2,
//   borderColor: "transparent",
//   justifyContent: "center",
//   alignItems: "center",
// },
selectedSlot: { },
selectedOverlay: {
  position: "absolute",
  width: "100%",
  height: "100%",
  zIndex: 3, // ensures it's above thumb
  // backgroundColor:"#000000ff",
},
thumbImage: { width: "80%", height: "80%", resizeMode: "contain" },

presetsContainer: {
  position: "absolute",
  bottom: scaleHeight(180),
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  bottom:height*0.28,
},

presetsBackground: {
  position: "absolute",
  left:25,
  width: width * 0.9,    // adjust so it matches the total width of your presets
  resizeMode:"contain",
},

presetsRow: {
  flexDirection: "row",
  // justifyContent: "center",
  marginBottom: 3.8,
},

presetSlot: {
  width: width * 0.165,
  aspectRatio: 1,
  marginHorizontal: 1.7,
  borderWidth: 2,
  borderColor: "transparent",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2, // ensures presets stay above the background
},

  selectButton: {
    position: "absolute",
    bottom: scaleHeight(110),
    alignSelf:"center",
    width: scaleWidth(150),
    height: scaleHeight(50),
    zIndex: 999,
  },
  selectButtonImage: { width: "100%", height: "100%" },

  // Popup
  popupOverlay: {
    flex:1,
    backgroundColor: "rgba(0, 0, 0, 0.14)",
    justifyContent: "center",
    alignItems: "center",
  },
  popupBox: {
    position: "absolute",
    top:100,
    width: width * 1.2,
    height: height * 0.75,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  popupBackButton: {
    position: "absolute",
    top: height * 0.13,
    left: width * 0.85,
    width: 40,
    height: 40,
    zIndex: 10,
  },
  popupBackIcon: { width: "100%", height: "100%" },
  popupKite: { width: "60%", height: "55%", marginBottom: height * 0.03 },
  launchButton: {
    width: width * 0.35,
    height: height * 0.08,
    marginTop: height * 0.05,
  },
});
