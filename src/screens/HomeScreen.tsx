import React from "react";
import { View, Text, ScrollView } from "react-native";
import HabitCard from "../components/HabitCard";
import BarChart from "../components/BarChart";
import { Habit } from "../../App";

interface HomeScreenProps {
  habits: Habit[];
  onToggleHabit: (id: number) => void;
  userName: string;
}

export default function HomeScreen({ habits, onToggleHabit, userName }: HomeScreenProps) {
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
    <View className="flex-1 bg-slate-900">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Hello, {userName}</Text>
          <Text className="mt-1 text-sm text-gray-400">
            Welcome back to your habit journey
          </Text>
        </View>

        {/* Today Section */}
        <View className="mx-6 mb-4 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-gray-400">Today</Text>
              <Text className="mt-1 text-lg font-bold text-white">{formattedDate}</Text>
            </View>
            <View className={`rounded-full px-3 py-1 ${totalCount === 0
              ? 'bg-slate-600'
              : completedCount === totalCount
                ? 'bg-green-500'
                : 'bg-blue-500'
              }`}>
              <Text className="text-sm font-semibold text-white">
                {totalCount === 0 ? 'No habits' : `${completedCount}/${totalCount}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Statistics Section */}
        <View className="mx-6 mb-6 rounded-lg bg-blue-900 p-4 h-56">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">Statistic</Text>
            <View className="rounded-full bg-blue-500 px-3 py-1">
              <Text className="text-xs font-semibold text-white">weekly</Text>
            </View>
          </View>
          <View className="mt-4">
            <BarChart
              completedToday={completedCount}
              totalToday={totalCount}
            />
          </View>
        </View>

        {/* Daily Habits Section */}
        <View className="mx-6 mb-6">
          <Text className="mb-3 text-lg font-bold text-white">Daily Habits</Text>
          {habits.length === 0 ? (
            <View className="items-center py-8">
              <Text className="text-4xl mb-2">📝</Text>
              <Text className="text-gray-400 text-center">
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
                highlight={habit.highlight}
                onPress={() => onToggleHabit(habit.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
