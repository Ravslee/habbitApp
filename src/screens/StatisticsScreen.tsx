import React from "react";
import { View, Text, ScrollView } from "react-native";
import BarChart from "../components/BarChart";
import CircleProgress from "../components/CircleProgress";

export default function StatisticsScreen() {
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const completedDays = [1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 15, 16, 17, 18, 20];

  return (
    <View className="flex-1 bg-slate-900">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Statistics</Text>
        </View>

        {/* Overview Section */}
        <View className="mx-6 mb-6">
          <Text className="mb-3 text-base font-semibold text-white">Overview</Text>
        </View>

        {/* History Review */}
        <View className="mx-6 mb-6 rounded-lg bg-slate-800/50 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-semibold text-white">History Review</Text>
              <Text className="mt-1 text-sm text-gray-400">
                Archived by Hertz Handle
              </Text>
              <Text className="text-xs text-gray-500">4 History Habit Tracker</Text>
            </View>
            <CircleProgress percentage={80} />
          </View>
        </View>

        {/* Calendar Section */}
        <View className="mx-6 mb-6 rounded-lg bg-slate-800/50 px-4 py-4">
          <View className="mb-4 flex-row items-center justify-between">
            <TouchableOpacity>
              <Text className="text-lg">←</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-white">March</Text>
            <TouchableOpacity>
              <Text className="text-lg">→</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Header */}
          <View className="mb-3 flex-row justify-between">
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <Text
                key={day}
                className="w-8 text-center text-xs font-semibold text-gray-400"
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap">
            {calendarDays.map((day) => {
              const isCompleted = completedDays.includes(day);
              return (
                <View key={day} className="mb-2 w-1/7 items-center">
                  <View
                    className={`h-8 w-8 items-center justify-center rounded ${isCompleted ? "bg-blue-500" : "border border-gray-600"
                      }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${isCompleted ? "text-white" : "text-gray-300"
                        }`}
                    >
                      {day}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Statistics Section */}
        <View className="mx-6 mb-6 rounded-lg bg-blue-900 p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">Statistic</Text>
            <View className="rounded-full bg-blue-500 px-3 py-1">
              <Text className="text-xs font-semibold text-white">weekly</Text>
            </View>
          </View>
          <View className="mt-4 items-center justify-center py-6">
            <BarChart />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import { TouchableOpacity } from "react-native";
