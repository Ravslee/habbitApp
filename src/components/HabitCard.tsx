import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface HabitCardProps {
  icon?: string;
  name: string;
  completed?: boolean;
  onPress?: () => void;
  isDark?: boolean;
}

export default function HabitCard({
  icon,
  name,
  completed,
  onPress,
  isDark = true,
}: HabitCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`mb-3 flex-row items-center rounded-2xl px-4 py-4 ${completed
        ? isDark
          ? "bg-emerald-900/80 border border-emerald-600"
          : "bg-gradient-to-r bg-emerald-500"
        : isDark
          ? "bg-slate-800 border border-slate-700"
          : "bg-white border border-gray-200"
        }`}
      style={{
        shadowColor: completed && !isDark ? "#10b981" : "#000",
        shadowOffset: { width: 0, height: completed && !isDark ? 4 : 2 },
        shadowOpacity: completed && !isDark ? 0.2 : (isDark ? 0.15 : 0.08),
        shadowRadius: completed && !isDark ? 8 : 4,
        elevation: completed && !isDark ? 6 : 3,
      }}
    >
      {/* Icon */}
      {icon && (
        <View className={`h-12 w-12 items-center justify-center rounded-xl mr-4 ${completed
            ? isDark ? 'bg-emerald-700/50' : 'bg-white/25'
            : isDark ? 'bg-slate-700' : 'bg-blue-50'
          }`}>
          <Text className="text-2xl">{icon}</Text>
        </View>
      )}

      {/* Habit Name */}
      <View className="flex-1">
        <Text
          className={`text-base font-bold ${completed
            ? "text-white"
            : isDark ? "text-gray-100" : "text-slate-800"
            }`}
        >
          {name}
        </Text>
        <Text
          className={`text-xs mt-1 ${completed
            ? isDark ? "text-emerald-300" : "text-emerald-100"
            : isDark ? "text-gray-500" : "text-gray-500"
            }`}
        >
          {completed ? "Completed ✨" : "Tap to complete"}
        </Text>
      </View>

      {/* Checkbox */}
      <View
        className={`h-8 w-8 items-center justify-center rounded-full ${completed
          ? isDark
            ? "bg-emerald-500 border-2 border-emerald-400"
            : "bg-white"
          : isDark
            ? "bg-transparent border-2 border-gray-500"
            : "bg-transparent border-2 border-blue-400"
          }`}
      >
        {completed ? (
          <Text className={`text-sm font-bold ${isDark ? 'text-white' : 'text-emerald-500'}`}>✓</Text>
        ) : (
          <View className={`h-3 w-3 rounded-full ${isDark ? 'bg-slate-600' : 'bg-blue-100'}`} />
        )}
      </View>
    </TouchableOpacity>
  );
}
