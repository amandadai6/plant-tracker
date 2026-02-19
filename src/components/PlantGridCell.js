import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, Animated, Easing, StyleSheet } from 'react-native';

const genericSprite = require('../../assets/sprites/plant-generic.png');

export default function PlantGridCell({ plant, onPress, cellSize }) {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = Math.random() * 1000;
    let animation = null;
    const timeout = setTimeout(() => {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(rotation, {
            toValue: 3,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: -3,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      animation.start();
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (animation) animation.stop();
    };
  }, [rotation]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [-3, 3],
    outputRange: ['-3deg', '3deg'],
  });

  const spriteSize = cellSize * 0.65;

  return (
    <Pressable
      onPress={() => onPress(plant)}
      style={({ pressed }) => [
        styles.cell,
        { width: cellSize, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {plant.nickname}
      </Text>
      <Animated.View
        style={[
          styles.plantWrapper,
          { transform: [{ rotate: rotateInterpolation }] },
        ]}
      >
        <Image
          source={plant.thumbnail ? { uri: plant.thumbnail } : genericSprite}
          style={{ width: spriteSize, height: spriteSize }}
          resizeMode="contain"
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  plantWrapper: {
    alignItems: 'center',
  },
  name: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    maxWidth: '100%',
  },
});
