import { useFonts } from "expo-font";
import { useLocalSearchParams } from "expo-router";
import { Image, ImageBackground, StyleSheet, Text, View, } from "react-native";

const ThankYouScreen = () => {
  const { playerCount, birdCount, finalPlayer, finalBird } = useLocalSearchParams();
    const [fontsLoaded] = useFonts({
      DKSnippitySnap: require("../assets/fonts/DKSnippitySnap.ttf"),
    });

  const playerCountNum = Number(playerCount) || 0;
  const birdCountNum = Number(birdCount) || 0;

  let parsedFinalPlayer = null;
  let parsedFinalBird = null;

  try {
    parsedFinalPlayer = finalPlayer ? JSON.parse(finalPlayer) : null;
  } catch (e) {
    console.warn("Failed to parse finalPlayer", e);
  }

  try {
    parsedFinalBird = finalBird ? JSON.parse(finalBird) : null;
  } catch (e) {
    console.warn("Failed to parse finalBird", e);
  }

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/images/frame/ThankYou.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <Image
          source={require("../assets/images/frame/flightComplete.png")}
          style={styles.note}
          resizeMode="cover"
        />
        <View style={styles.textBox}>
          <Text style={styles.count}>Player Collisions: {playerCountNum}</Text>
          <Text style={styles.count}>Bird Collisions: {birdCountNum}</Text>

          {parsedFinalPlayer && (
            <Text style={styles.count}>
              Final Player Collision: {JSON.stringify(parsedFinalPlayer)}
            </Text>
          )}
          {parsedFinalBird && (
            <Text style={styles.count}>
              Final Bird Collision: {JSON.stringify(parsedFinalBird)}
            </Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  background: {
    flex: 1,
    left: -4,
    width: "101.5%",
    height: "100.7%",
    position: "absolute",
    overflow: "hidden",
  },
  note:{
    height:"70%",
    width:"100%",
    resizeMode:"contain",
    alignSelf:"center",
    marginTop: 100, 
  },
  textBox:{
    position: "absolute",
    alignSelf: "center",
    justifyContent:"center", 
    marginTop: 345, 
    transform: [{ rotate: "-3deg" }],
  },
  count: {
    fontFamily: "DKSnippitySnap",
    fontSize: 16,
    marginVertical: 4,
    color: "#402e1dff",
  },
});
