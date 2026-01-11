import React from "react";
import { View, Text, ScrollView } from "react-native";
import HabitCard from "../components/HabitCard";
import BarChart from "../components/BarChart";
import AdBanner from "../components/AdBanner";
import { Habit, HabitHistory } from "../../App";
import { ThemeMode } from "../context/ThemeContext";

interface HomeScreenProps {
  habits: Habit[];
  habitHistory: HabitHistory;
  onToggleHabit: (id: number) => void;
  userName: string;
  theme: ThemeMode;
  isDark: boolean;
}

export default function HomeScreen({ habits, habitHistory, onToggleHabit, userName, theme, isDark }: HomeScreenProps) {

  // Get today's date formatted
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });

  // Calculate completed habits
  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Hello, {userName}</Text>
          <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Welcome back to your habit journey
          </Text>
        </View>

        {/* Today Section */}
        <View className={`mx-6 mb-4 rounded-xl shadow-sm ${isDark ? 'border border-slate-700 bg-slate-800/50' : 'bg-white border border-gray-100'} px-4 py-4`}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Today</Text>
              <Text className={`mt-1 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{formattedDate}</Text>
            </View>
            <View className={`rounded-full px-4 py-2 ${totalCount === 0
              ? isDark ? 'bg-slate-600' : 'bg-gray-200'
              : completedCount === totalCount
                ? 'bg-emerald-500'
                : 'bg-purple-500'
              }`}>
              <Text className={`text-sm font-bold ${totalCount === 0 && !isDark ? 'text-gray-500' : 'text-white'}`}>
                {totalCount === 0 ? 'No habits' : `${completedCount}/${totalCount}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Section */}
        <View
          className={`mx-6 mb-6 rounded-2xl overflow-hidden ${isDark ? 'bg-purple-900' : 'bg-white border border-gray-100'}`}
          style={{
            height: 300,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.1,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {/* Gradient accent bar for light mode */}
          {!isDark && (
            <View className="h-1.5 bg-gradient-to-r" style={{ backgroundColor: '#8b5cf6' }}>
              <View className="flex-row h-full">
                <View className="flex-1 bg-purple-500" />
                <View className="flex-1 bg-violet-500" />
                <View className="flex-1 bg-fuchsia-500" />
              </View>
            </View>
          )}

          <View className="p-4 flex-1">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Weekly Stats</Text>
                <Text className={`text-xs mt-0.5 ${isDark ? 'text-purple-300' : 'text-gray-500'}`}>Your progress this week</Text>
              </View>
              <View className={`rounded-full px-3 py-1.5 ${isDark ? 'bg-purple-500' : 'bg-purple-50'}`}>
                <Text className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-purple-600'}`}>📊 Weekly</Text>
              </View>
            </View>
            <View className="mt-3 flex-1">
              <BarChart
                habits={habits}
                habitHistory={habitHistory}
                isDark={isDark}
              />
            </View>
          </View>
        </View>

        {/* Ad Banner */}
        <View className="mx-6 mb-6 rounded-xl overflow-hidden">
          <AdBanner isDark={isDark} />
        </View>

        {/* Daily Habits Section */}
        <View className="mx-6 mb-6">
          <Text className={`mb-3 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Daily Habits</Text>
          {habits.length === 0 ? (
            <View className={`items-center py-8 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
              <Text className="text-4xl mb-2">📝</Text>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                No habits yet!{"\n"}Go to Profile to add habits.
              </Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                name={habit.name}
                icon={habit.icon}
                completed={habit.completed}
                onPress={() => onToggleHabit(habit.id)}
                isDark={isDark}
              />
            ))
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
