import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Dimensions } from "react-native";

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to home screen after delay
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000)

    return () => clearTimeout(timer);
  }, [onFinish, fadeAnim, scaleAnim, slideAnim]);

  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      {/* Background decorations */}
      <View className="absolute top-0 right-0 h-64 w-64 -mr-32 -mt-32 rounded-full bg-primary/20 opacity-50" />
      <View className="absolute bottom-0 left-0 h-80 w-80 -ml-40 -mb-40 rounded-full bg-primary/20 opacity-50" />

      {/* Main Content */}
      <View className="items-center z-10">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="mb-8"
        >
          <View className="h-40 w-40 items-center justify-center rounded-3xl bg-white shadow-xl overflow-hidden">
            <Image
              source={require('../assets/logo.jpg')}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="items-center"
        >
          <Text className="text-5xl font-bold text-slate-800 tracking-wider">
            Hab<Text className="text-primary">ik</Text>
          </Text>
          <Text className="mt-3 text-lg font-medium text-slate-500 tracking-wide">
            Build Better Habits
          </Text>
        </Animated.View>
      </View>

      {/* Loading Indicator */}
      <View className="absolute bottom-16">
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex-row items-center space-x-2"
        >
          <View className="h-1.5 w-1.5 rounded-full bg-primary" />
          <View className="h-1.5 w-1.5 rounded-full bg-primary" />
          <View className="h-1.5 w-1.5 rounded-full bg-primary" />
        </Animated.View>
      </View>
    </View>
  );
}
