import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import HabitCard from "../components/HabitCard";
import BarChart from "../components/BarChart";

interface HomeScreenProps {
  onNavigate?: (screen: string) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [habits, setHabits] = React.useState([]
    //   [
    //   { id: 1, name: "Reading Book", icon: "📚", completed: false },
    //   { id: 2, name: "Upgrade", icon: "⬆️", completed: true, highlight: true },
    //   { id: 3, name: "Healthy breakfasten", icon: "🥗", completed: false },
    //   { id: 4, name: "Sport", icon: "⚽", completed: false },
    //   { id: 5, name: "Gym fitness", icon: "💪", completed: false },
    //   { id: 6, name: "Workout with trainer", icon: "🏋️", completed: false },
    // ]
  );

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  return (
    <View className="flex-1 bg-slate-900">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Hello, Ravi Rajput</Text>
          <Text className="mt-1 text-sm text-gray-400">
            Welcome back to your habit journey
          </Text>
        </View>

        {/* Today Section */}
        <View className="mx-6 mb-4 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-gray-400">Today</Text>
              <Text className="mt-1 text-lg font-bold text-white">23 Oct</Text>
            </View>
            <View className="rounded-full bg-blue-500 px-3 py-1">
              <Text className="text-sm font-semibold text-white">4/5</Text>
            </View>
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

        {/* Daily Habits Section */}
        <View className="mx-6 mb-6">
          <Text className="mb-3 text-lg font-bold text-white">Daily Habits</Text>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              name={habit.name}
              icon={habit.icon}
              completed={habit.completed}
              highlight={habit.highlight}
              onPress={() => toggleHabit(habit.id)}
            />
          ))}
        </View>

        {/* Create Habits Section */}
        <View className="mx-6 mb-6 rounded-lg bg-slate-800/50 px-4 py-4">
          <Text className="mb-3 text-base font-semibold text-white">
            Create habits
          </Text>
          <TouchableOpacity className="rounded-lg bg-blue-500 py-3">
            <Text className="text-center font-semibold text-white">
              + Create Your Own
            </Text>
          </TouchableOpacity>
          <Text className="mt-2 text-center text-xs text-gray-500">
            OR CHOOSE FROM TEMPLATE
          </Text>

          {/* Template Habits */}
          <View className="mt-4 gap-2">
            <View className="flex-row items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
              <Text className="text-lg">📖</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-white">Habits</Text>
                <Text className="text-xs text-gray-400">
                  Develop a new habit with the goals
                </Text>
              </View>
              <TouchableOpacity className="ml-2">
                <Text className="text-lg">→</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
              <Text className="text-lg">🧘</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-white">Meditation</Text>
                <Text className="text-xs text-gray-400">
                  Improve calm habit reflex stressed
                </Text>
              </View>
              <TouchableOpacity className="ml-2">
                <Text className="text-lg">→</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
              <Text className="text-lg">⚽</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-white">Sport</Text>
                <Text className="text-xs text-gray-400">
                  Discipline core help maintain physical
                </Text>
              </View>
              <TouchableOpacity className="ml-2">
                <Text className="text-lg">→</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
              <Text className="text-lg">📖</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-white">Habits</Text>
                <Text className="text-xs text-gray-400">
                  Develop a new habit with the goals
                </Text>
              </View>
              <TouchableOpacity className="ml-2">
                <Text className="text-lg">→</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center gap-3 rounded-lg bg-slate-700/50 px-3 py-2">
              <Text className="text-lg">🧘</Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-white">Meditation</Text>
                <Text className="text-xs text-gray-400">
                  Improve calm habit reflex stressed
                </Text>
              </View>
              <TouchableOpacity className="ml-2">
                <Text className="text-lg">→</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
