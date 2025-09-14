import { Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Animated, Dimensions, Pressable, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const videoRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [navigating, setNavigating] = useState(false);

  const navigateWithFade = () => {
    if (navigating) return;
    setNavigating(true);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 600, 
      useNativeDriver: true,
    }).start(() => {
      router.push('/ShapeStep'); 
    });
  };

  const handleTap = () => {
    navigateWithFade();
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      navigateWithFade();
    }
  };

  return (
    <>
      <StatusBar hidden />
      <View style={styles.container}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Pressable style={styles.fullScreenPress} onPress={handleTap}>
            <Video
              ref={videoRef}
              source={require('../assets/vid/bookflip.mp4')}
              style={styles.video}
              resizeMode="cover"
              shouldPlay
              isLooping={false}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            />
          </Pressable>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenPress: {
    flex: 1,
  },
  video: {
    width: width,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
