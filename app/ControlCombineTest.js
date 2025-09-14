import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { disconnectWebSocket } from "../components/WebSocket/web-socket-manager";
import { sendCollisionRequest } from "../utils/sendActionMsg";

import GyroDot from "./Gyro";
import TouchPad from "./TouchPad";

export default function FlightControlPrototype() {
  const [useGyro, setUseGyro] = useState(false);
  const router = useRouter();
  const { kitePattern } = useLocalSearchParams();

  const TOTAL_TIME = 10 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  const timerIdRef = useRef(null);
  const intervalIdRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);

  const toggleControl = () => setUseGyro((prev) => !prev);

  // ✅ Connect WebSocket on mount
  useEffect(() => {

    return () => {
      disconnectWebSocket();
      clearTimeout(timerIdRef.current);
      clearInterval(intervalIdRef.current);
    };
  }, []);

  // ✅ Start countdown timer
  useEffect(() => {
    startTimer();
    return () => {
      clearTimeout(timerIdRef.current);
      clearInterval(intervalIdRef.current);
    };
  }, []);

  const startTimer = () => {
    clearTimeout(timerIdRef.current);
    clearInterval(intervalIdRef.current);

    setTimeLeft(TOTAL_TIME);

    // Main disconnect timer
    timerIdRef.current = setTimeout(() => {
      console.log("⏳ Timer ended — showing session over alert...");
      sendCollisionRequest();
      router.push("/ThankYou");
    }, TOTAL_TIME * 1000);

    // Countdown updater every second
    intervalIdRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent />
      <View style={{ height: StatusBar.currentHeight, backgroundColor: "black" }} />

      <ImageBackground
        source={require("../assets/controls/BG.png")}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Top Container */}
        <View style={styles.topContainer}>
          {/* Countdown Display */}
          <View style={styles.timerWrapper}>
            <Image
              source={require("../assets/controls/timerContainer.png")}
              style={styles.timerBG}
            />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>

          {/* End Flight Button */}
          <TouchableOpacity
            style={styles.endButtonHolder}
            onPress={() => setShowPopup(true)}
          >
            <Image
              source={require("../assets/controls/EndFlightButton.png")}
              style={styles.endButton}
            />
          </TouchableOpacity>
        </View>

        {/* Control Area */}
        <View style={styles.controlArea}>
          {useGyro ? (
            <GyroDot kitePattern={kitePattern} />
          ) : (
            <TouchPad kitePattern={kitePattern} />
          )}
        </View>

        {/* Bottom Container */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={toggleControl} style={styles.toggleButton}>
            <Image
              source={
                useGyro
                  ? require("../assets/controls/GyroOn.png")
                  : require("../assets/controls/JoystickOn.png")
              }
              style={styles.toggleBox}
            />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.subtitle}>
              {useGyro ? "Tilt your phone to control." : "Move Wau as joystick."}
            </Text>
          </View>
        </View>

        {/* End Flight Popup */}
        <Modal
          visible={showPopup}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPopup(false)}
        >
          <View style={styles.popupOverlay}>
            <ImageBackground
              source={require("../assets/images/frame/endFlightPopup.png")}
              style={styles.popupBox}
              resizeMode="contain"
            >
              <View style={styles.buttonHolder}>
                {/* Yes button */}
                <TouchableOpacity
                  onPress={() => {
                    sendCollisionRequest();
                    setShowPopup(false);
                    router.push("/ThankYou");
                  }}
                >
                  <Image
                    source={require("../assets/images/frame/yes.png")}
                    style={styles.popupButton}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

                {/* No button */}
                <TouchableOpacity onPress={() => setShowPopup(false)}>
                  <Image
                    source={require("../assets/images/frame/no.png")}
                    style={styles.popupButton}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor:"#000000ff"
},
background: {
  flex: 1,
  width:"100%",
  height: "105%",
  justifyContent: "center",
  alignItems: "center",
},
header: {
  alignItems: "center",
},
title: {
  fontSize: 24,
  fontWeight: "bold",
},
subtitle: {
  fontSize: 16,
  fontWeight:"bold",
  color: "#666",
},
topContainer:{
  position:"absolute",
  width: "100%",
  alignItems: "center",   // center children horizontally
  justifyContent: "center", // center vertically
  top: 140, // push it down from the very top
  marginBottom:55,
},
timerWrapper: {
  width: "42%",
  alignItems: "center",   // center children horizontally
  justifyContent: "center", // center vertically
  marginBottom:46,
},

timerBG: {
  position: "absolute",
  width: "100%",
  height: undefined,  // let aspectRatio control height
  aspectRatio: 2.2,     // adjust based on your image proportions
  resizeMode: "contain",
},
timerText: {
  left:20,
  fontSize: 20,
  fontWeight: "bold",
  color: "#5B4129",       // make sure it shows clearly
  textAlign: "center",
},
endButtonHolder: {
  zIndex: 1000,        // ensure it's on top
  elevation: 10, 
  width: "40%",
  alignItems: "center",
  justifyContent:"center",
},
endButton:{
  position: "absolute",
  width: "100%",
  height: undefined,  // let aspectRatio control height
  aspectRatio: 2.2,     // adjust based on your image proportions
  resizeMode: "contain",

},
controlArea: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
},
bottomContainer:{
  position:"absolute",
  width: "100%",
  alignItems: "center",   // center children horizontally
  justifyContent: "center", // center vertically
  bottom: 100, 
},
toggleButton: {
  width: "80%",
  height: 40,
  justifyContent: "center",
  alignItems: "center",

},
popupOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.75)", // semi-transparent dim
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
},

popupBox: {
  width: "100%",      // responsive sizing
  aspectRatio: 1.2,  // keep frame proportion
  justifyContent: "flex-end",
  alignItems: "center",
},

buttonHolder: {
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  width: "80%",
  position: "absolute",
  bottom: "30%",   // moves buttons up from bottom of frame
},

popupButton: {
  width:70,
  height: 50,
  marginHorizontal: 15,
  resizeMode: "contain",
},

toggleBox: {
  width: "100%",   // or a % like "60%"
  height: undefined,
  aspectRatio: 4.9, // matches image shape
  resizeMode: "contain",
},



});

