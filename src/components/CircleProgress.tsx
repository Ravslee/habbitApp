import React from "react";
import { View, Text } from "react-native";

interface CircleProgressProps {
  percentage: number;
  label?: string;
}

export default function CircleProgress({ percentage, label }: CircleProgressProps) {
  return (
    <View className="items-center">
      <View className="relative h-24 w-24 items-center justify-center rounded-full border-4 border-blue-400 bg-blue-900/30">
        <Text className="text-2xl font-bold text-blue-400">{percentage}%</Text>
      </View>
      {label && (
        <Text className="mt-2 text-center text-sm font-semibold text-gray-300">
          {label}
        </Text>
      )}
    </View>
  );
}
