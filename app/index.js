import { Video } from 'expo-av';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { connectWebSocket } from '../components/WebSocket/web-socket-manager';

const { width, height } = Dimensions.get('window');

const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Biko: require('../assets/fonts/Biko_Regular.ttf'),
    Biko_Bold: require('../assets/fonts/Biko_Bold.ttf'),
    Rencana: require('../assets/fonts/Rencana.ttf'),
    DKSnippitySnap: require('../assets/fonts/DKSnippitySnap.ttf'),
  });

  const tapFadeAnim = useRef(new Animated.Value(0)).current;
  const tapTranslateYAnim = useRef(new Animated.Value(verticalScale(20))).current;

  const router = useRouter();
  const [tapped, setTapped] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);

  // Animate "Tap to Start" when video ends
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
    if (tapped || !videoFinished) return; // block until video finishes
    setTapped(true);

    Animated.timing(tapFadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      connectWebSocket();
      router.push('/ShapeStep');
    });
  };

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar hidden />
      <View style={styles.fullScreenContainer}>
        {/* Fullscreen Video */}
        <Video
          source={require('../assets/vid/Intro.mp4')}
          style={[styles.videoBackground,{ backgroundColor: "#3a3a39ff" }]}
          resizeMode="cover"
          shouldPlay
          isMuteds
           isLooping={false} // play only once
  rate={1.5} // speed up the video by 25%
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish && !videoFinished) {
              setVideoFinished(true);
              showTapToStart();
            }
          }}
        />

        {/* Dark overlay */}
        <View style={styles.overlay} />

        {/* Safe area for UI */}
        <SafeAreaView style={styles.safeArea}>
          {videoFinished && (
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
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#aa9674ff',
  },
  videoBackground: {
    position: 'absolute',
    top: 0,
    left: 2,
    width: width,
    height: height*1.05,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  safeArea: {
    flex: 1,
  },
  pressableContainer: {
    flex: 1,
    bottom:160,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(10),
  },
  tapText: {
    fontSize: scale(20),
    fontFamily: 'DKSnippitySnap',
    color: '#350b0bff',
    opacity: 0.9,
    letterSpacing: 1.5,
    marginBottom: verticalScale(120),
    shadowColor: "#ffff",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.5,
  },
});
