import React from "react";
import { View } from "react-native";

export default function BarChart() {
  const bars = [70, 85, 60, 75, 90, 80, 70];

  return (
    <View className="flex-row items-end justify-center gap-2">
      {bars.map((height, index) => (
        <View
          key={index}
          className="w-2 rounded-full bg-blue-400"
          style={{ height: `${height / 10}rem` }}
        />
      ))}
    </View>
  );
}
