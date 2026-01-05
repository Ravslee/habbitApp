import React from "react";
import { View, Text } from "react-native";

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  React.useEffect(() => {
    // Navigate to home screen after 3 seconds
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View className="flex-1 items-center justify-center bg-blue-950 px-6">
      {/* Header with Logo */}
      <View className="mb-8 items-center">
        <Text className="text-4xl font-bold text-white">
          Habbit<Text className="text-blue-400"> Tracker</Text>
        </Text>
      </View>

      {/* Illustration Area */}
      <View className="mb-12 h-80 w-80 items-center justify-center rounded-2xl bg-slate-800">
        {/* Placeholder for illustration - you can replace with SVG or Image */}
        <View className="items-center">
          {/* Person icon representation */}
          <View className="mb-4 h-32 w-32 items-center justify-center rounded-full bg-pink-300">
            <Text className="text-6xl">👤</Text>
          </View>

          {/* Checkmark circle */}
          <View className="absolute -right-2 -top-2 h-16 w-16 items-center justify-center rounded-full bg-blue-400">
            <Text className="text-3xl font-bold text-white">✓</Text>
          </View>
        </View>

        {/* Card representation */}
        <View className="absolute bottom-8 w-48 rounded-lg bg-white p-4">
          <View className="mb-2 h-2 w-20 rounded bg-blue-400" />
          <View className="h-2 w-32 rounded bg-gray-300" />
        </View>
      </View>

      {/* Description Text */}
      <Text className="mb-8 text-center text-lg font-semibold text-white">
        Transform Your Life with Habbit Tracker: How to Build Lasting Habits
        and Achieve Your Goals
      </Text>

      {/* Blue Underline */}
      <View className="h-1 w-24 rounded-full bg-blue-400" />
    </View>
  );
}
