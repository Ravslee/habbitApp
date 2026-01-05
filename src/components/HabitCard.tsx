import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HabitCardProps {
  icon?: string;
  name: string;
  completed?: boolean;
  onPress?: () => void;
  highlight?: boolean;
}

export default function HabitCard({
  icon,
  name,
  completed,
  onPress,
  highlight,
}: HabitCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-3 flex-row items-center rounded-lg px-4 py-3 ${
        highlight ? "bg-blue-500" : "bg-slate-800"
      }`}
    >
      {icon && <Text className="mr-3 text-xl">{icon}</Text>}
      <Text className={`flex-1 font-medium ${highlight ? "text-white" : "text-gray-300"}`}>
        {name}
      </Text>
      {completed && <Text className="text-lg">✓</Text>}
      {!completed && (
        <View className="h-5 w-5 rounded border border-gray-400" />
      )}
    </TouchableOpacity>
  );
}
