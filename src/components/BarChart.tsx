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
    return Math.round((completedHabits.length / totalHabits) * 100);
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
                className={`w-4 rounded-full ${isToday
                  ? value === 100
                    ? 'bg-green-500'
                    : 'bg-purple-400'
                  : isFuture
                    ? isDark ? 'bg-slate-700' : 'bg-gray-300'
                    : 'bg-purple-600'
                  }`}
                style={{ height: isFuture ? 4 : barHeight }}
              />
            </View>
          );
        })}
      </View>
      {/* Day Labels */}
      <View className="flex-row justify-between px-2 mt-2">
        {DAYS.map((day, index) => {
          const isToday = index === adjustedDayIndex;
          return (
            <View key={index} style={{ width: 36 }} className="items-center">
              <Text className={`text-xs ${isToday ? `font-bold ${isDark ? 'text-white' : 'text-slate-700'}` : isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Summary Stats */}
      <View className={`mt-4 flex-row justify-around border-t pt-4 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
        <View className="items-center">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
            {weeklyData.filter(v => v > 0).length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Days</Text>
        </View>
        <View className="items-center">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
            {Math.round(weeklyData.reduce((a, b) => a + b, 0) / 7)}%
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Completion</Text>
        </View>
        <View className="items-center">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
            {weeklyData.filter(v => v === 100).length}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Perfect Days</Text>
        </View>
      </View>
    </View>
  );
}
