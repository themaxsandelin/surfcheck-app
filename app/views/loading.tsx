import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SPIN_DURATION = 300;
const PAUSE_DURATION = 600;

export default function LoadingView() {
  const [letter, setLetter] = useState('S');
  const rotation = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const swapLetter = () => {
      setLetter((prev) => (prev === 'S' ? '?' : 'S'));
    };

    const onSpinComplete = () => {
      timeoutRef.current = setTimeout(startCycle, PAUSE_DURATION);
    };

    const startCycle = () => {
      rotation.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(360, {
          duration: SPIN_DURATION,
          easing: Easing.inOut(Easing.ease),
        }, () => {
          scheduleOnRN(onSpinComplete);
        }),
      );
      setTimeout(swapLetter, SPIN_DURATION / 2);
    };

    startCycle();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.letter}>{letter}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: 'BebasNeue_400Regular',
    color: '#fff',
    fontSize: 54,
    lineHeight: 60,
    textAlign: 'center',
    transformOrigin: 'center',
  },
});