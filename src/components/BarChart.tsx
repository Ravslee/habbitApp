import React from "react";
import { View, Text } from "react-native";
import { Habit, HabitHistory } from "../../App";

interface BarChartProps {
  habits: Habit[];
  habitHistory: HabitHistory;
  isDark?: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BarChart({ habits, habitHistory, isDark = true }: BarChartProps) {
  // Get current day index (0 = Monday, 6 = Sunday)
  const today = new Date();
  const dayIndex = today.getDay();
  const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert Sunday=0 to index 6

  // Calculate real weekly data from habitHistory
  const weeklyData = DAYS.map((_, index) => {
    // Calculate the date for this day of the week
    const date = new Date(today);
    const daysFromToday = index - adjustedDayIndex;
    date.setDate(date.getDate() + daysFromToday);
    const dateStr = date.toISOString().split('T')[0];

    // Future days show 0
    if (index > adjustedDayIndex) {
      return 0;
    }

    // Get completions for this date
    const completedHabits = habitHistory[dateStr] || [];
    const totalHabits = habits.length;

    // Calculate percentage
    if (totalHabits === 0) return 0;
    const percentage = Math.round((completedHabits.length / totalHabits) * 100);
    return Math.min(percentage, 100); // Cap at 100%
  });

  const maxHeight = 80; // Maximum bar height in pixels

  return (
    <View className="w-full">
      {/* Bars */}
      <View className="flex-row items-end justify-between px-2" style={{ height: 100 }}>
        {weeklyData.map((value, index) => {
          const isToday = index === adjustedDayIndex;
          const isFuture = index > adjustedDayIndex;
          const barHeight = Math.max((value / 100) * maxHeight, 4); // Minimum 4px height

          return (
            <View key={index} className="items-center justify-end" style={{ width: 36, height: '100%' }}>
              {/* Value label - always reserve space */}
              <Text className={`mb-1 text-xs ${!isFuture && value > 0 ? (isDark ? 'text-gray-400' : 'text-gray-500') : 'text-transparent'}`}>
                {value > 0 ? `${value}%` : '0%'}
              </Text>
              {/* Bar */}
              <View
                className={`w-4 rounded-full ${value > 0
                  ? 'bg-[#8b56fc]' // Purple for active
                  : 'bg-[#2c2c2e]' // Dark gray for inactive
                  }`}
                style={{ height: isFuture ? 4 : barHeight }}
              />
            </View>
          );
        })}
      </View>

      {/* Day Labels */}
      <View className="flex-row justify-between px-2 mt-4">
        {DAYS.map((day, index) => {
          const isToday = index === adjustedDayIndex;
          return (
            <View key={index} style={{ width: 36 }} className="items-center">
              <Text className={`text-xs font-medium ${isToday ? (isDark ? 'text-white' : 'text-[#8b56fc] font-bold') : 'text-gray-600'}`}>
                {day.charAt(0)}
              </Text>
            </View>
          );
        })}
      </View>
    </View >
  );
}
