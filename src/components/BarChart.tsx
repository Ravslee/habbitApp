import React from "react";
import { View, Text } from "react-native";

interface BarChartProps {
  data?: number[]; // Array of 7 values (0-100) for each day of the week
  completedToday?: number;
  totalToday?: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BarChart({ data, completedToday = 0, totalToday = 0 }: BarChartProps) {
  // Get current day index (0 = Monday, 6 = Sunday)
  const today = new Date();
  const dayIndex = today.getDay();
  const adjustedDayIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Convert Sunday=0 to index 6

  // Default data or use provided data
  // For demo, show some sample weekly data with today's actual progress
  const weeklyData = data || [
    65, 80, 45, 70, 55, 90, 0 // Sample data for Mon-Sun
  ].map((val, idx) => {
    if (idx === adjustedDayIndex) {
      // Today's actual percentage
      return totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
    }
    if (idx > adjustedDayIndex) {
      // Future days
      return 0;
    }
    return val;
  });

  const maxHeight = 80; // Maximum bar height in pixels

  return (
    <View className="w-full">
      {/* Bars */}
      <View className="flex-row items-end justify-between px-2">
        {weeklyData.map((value, index) => {
          const isToday = index === adjustedDayIndex;
          const isFuture = index > adjustedDayIndex;
          const barHeight = Math.max((value / 100) * maxHeight, 4); // Minimum 4px height

          return (
            <View key={index} className="items-center" style={{ width: 36 }}>
              {/* Value label */}
              {!isFuture && value > 0 && (
                <Text className="mb-1 text-xs text-gray-400">
                  {value}%
                </Text>
              )}
              {/* Bar */}
              <View
                className={`w-4 rounded-full ${isToday
                    ? value === 100
                      ? 'bg-green-500'
                      : 'bg-blue-400'
                    : isFuture
                      ? 'bg-slate-700'
                      : 'bg-blue-600'
                  }`}
                style={{ height: isFuture ? 4 : barHeight }}
              />
              {/* Day label */}
              <Text className={`mt-2 text-xs ${isToday ? 'font-bold text-white' : 'text-gray-500'
                }`}>
                {DAYS[index]}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Summary Stats */}
      <View className="mt-4 flex-row justify-around border-t border-slate-700 pt-4">
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">
            {weeklyData.filter(v => v > 0).length}
          </Text>
          <Text className="text-xs text-gray-400">Active Days</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">
            {Math.round(weeklyData.reduce((a, b) => a + b, 0) / 7)}%
          </Text>
          <Text className="text-xs text-gray-400">Avg. Completion</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">
            {weeklyData.filter(v => v === 100).length}
          </Text>
          <Text className="text-xs text-gray-400">Perfect Days</Text>
        </View>
      </View>
    </View>
  );
}
