import { useLocalSearchParams } from "expo-router";
import { ImageBackground, StyleSheet } from "react-native";

const ThankYouScreen = () => {
  const { playerCollision, birdCollision } = useLocalSearchParams();

  // Parse params safely
  let parsedPlayer = [];
  let parsedBird = [];

  try {
    parsedPlayer = playerCollision ? JSON.parse(playerCollision) : [];
  } catch (e) {
    console.warn("Failed to parse playerCollision", e);
  }

  try {
    parsedBird = birdCollision ? JSON.parse(birdCollision) : [];
  } catch (e) {
    console.warn("Failed to parse birdCollision", e);
  }

  // Count values
  const playerCount = Array.isArray(parsedPlayer) ? parsedPlayer.length : 0;
  const birdCount = Array.isArray(parsedBird) ? parsedBird.length : 0;

  return (
    <ImageBackground
      source={require("../assets/images/frame/ThankYou.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* <Text style={styles.count}>Player Collisions: {playerCount}</Text>
      <Text style={styles.count}>Bird Collisions: {birdCount}</Text> */}
    </ImageBackground>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:"102%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:"#000000ff"
  },
  count: {
    top:20,
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 4,
    color: "#5B4129", // white text for contrast
  },
});
