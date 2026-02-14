import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface HabitCardProps {
  icon?: string;
  name: string;
  completed?: boolean;
  onPress?: () => void;
  // We'll rely on the parent to pass "completed" state, and we'll enforce dark mode styling by default as per design requirement
  // "isDark" prop can still be kept for compatibility but we prioritize the requested design
  style?: any;
  streak?: number;
  isDark?: boolean;
}

export default function HabitCard({
  icon,
  name,
  completed,
  onPress,
  streak = 0,
  isDark = true,
}: HabitCardProps) {
  // Simple heuristic: If it's alphanumeric with dashes, it's likely an icon name.
  // Emojis often have length > 2 (bytes) or are not simple ASCII.
  // But safest is to check if it looks like a valid icon name.
  const isIconName = icon && /^[a-z0-9-]+$/.test(icon);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`mb-4 flex-row items-center rounded-3xl px-4 py-4 border ${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-gray-200 shadow-sm'}`}
    >
      {/* Icon Container */}
      {icon && (
        <View className={`h-12 w-12 items-center justify-center rounded-2xl mr-4 ${isDark ? 'bg-[#2c2c2e]' : 'bg-purple-50'}`}>
          {isIconName ? (
            <Icon name={icon} size={24} color="#8b56fc" style={{ opacity: 0.8 }} />
          ) : (
            <Text className={`text-xl ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ opacity: 0.8 }}>{icon}</Text>
          )}
        </View>
      )}

      {/* Info */}
      <View className="flex-1">
        <Text className={`text-base font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </Text>
        <View className="flex-row items-center">
          <Text className="text-sm text-primary font-medium mr-1">
            {streak > 0 ? `${streak} days` : "Start streak"}
          </Text>
          <Icon name={streak > 0 ? "fire" : "rocket"} size={14} color={streak > 0 ? "#ef4444" : "#8b56fc"} />
        </View>
      </View>

      {/* Checkbox */}
      <View
        className={`h-10 w-10 items-center justify-center rounded-full border-2 ${completed
          ? "bg-[#8b56fc] border-[#8b56fc]"
          : isDark ? "bg-transparent border-gray-600" : "bg-transparent border-gray-300"
          }`}
      >
        {completed && (
          <Icon name="check-bold" size={20} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );
}
