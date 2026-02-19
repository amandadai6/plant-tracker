import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PalletTownBanner() {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    // Drop down
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Slide back up after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -120,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.outerFrame,
        { top: insets.top + 12, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.banner}>
        <Text style={styles.label}>PALLET TOWN</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outerFrame: {
    position: 'absolute',
    left: 16,
    backgroundColor: '#a8a8a8',
    padding: 5,
    zIndex: 100,
  },
  banner: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  label: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: '#1a1a1a',
  },
});
