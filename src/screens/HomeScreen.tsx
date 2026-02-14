import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import CircularProgress from "../components/CircularProgress";
import HabitCard from "../components/HabitCard";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Habit, HabitHistory, UserProfile } from "../../App";
import { calculateStreak } from "../utils/streak";
import { ThemeMode } from "../context/ThemeContext";

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  habits: Habit[];
  habitHistory: HabitHistory;
  onToggleHabit: (id: number) => void;
  userName: string;
  userProfile: UserProfile | null;
  theme: ThemeMode;
  isDark: boolean;
}

export default function HomeScreen({ habits, habitHistory, onToggleHabit, userName, userProfile, theme, isDark }: HomeScreenProps) {
  // Date Formatting for Header
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  // Progress Calculation
  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
      {/* Main Background Color should match the "Dark Mode" aesthetic (Approx #0f0f11 or similar deep black/purple) */}

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

        {/* HEADER SECTION */}
        <View className="flex-row justify-between items-start px-6 pt-10 pb-6">
          <View>
            <Text className="text-xs font-bold text-primary tracking-widest ">
              {formattedDate}
            </Text>
            <Text className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Hello, {userName}
            </Text>

            <Text className="text-base text-gray-400 italic">
              "Just don't break the streak today"
            </Text>
          </View>
          <View className={`h-10 w-10 rounded-full overflow-hidden border border-white items-center justify-center ${isDark ? 'bg-[#1e1e20]' : 'bg-gray-200'}`}>
            {userProfile?.profileImage ? (
              <Image
                source={{ uri: userProfile.profileImage }}
                className="h-full w-full"
              />
            ) : (
              <Icon name="account" size={24} color={isDark ? "#FFF" : "#8b56fc"} />
            )}
          </View>
        </View>

        {/* CIRCULAR PROGRESS SECTION */}
        <View className="items-center justify-center my-8">
          <CircularProgress
            progress={progress}
            size={220}
            strokeWidth={20}
            color="#8b56fc"       // Purple
            backgroundColor={isDark ? "#2c2c2e" : "#e5e7eb"} // Dark Gray Track vs Light Gray
            containerColor={isDark ? "#0f0f11" : "#F9FAFB"} // Match screen background for seamless shadow
          >
            <View className="items-center">
              <View className="flex-row items-baseline">
                <Text className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{completedCount}</Text>
                <Text className="text-2xl font-medium text-gray-500">/{totalCount}</Text>
              </View>
              <Text className="text-xs font-bold text-gray-400 tracking-widest mt-1">HABITS DONE</Text>
            </View>
          </CircularProgress>
        </View>

        {/* TODAY SECTION HEADER */}
        <View className="flex-row items-center justify-between px-6 mb-4">
          <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Today</Text>
          {/* <TouchableOpacity className={`px-4 py-1.5 rounded-full ${isDark ? 'bg-[#1e1e20]' : 'bg-gray-200'}`}>
            <Text className="text-xs font-bold text-primary">EDIT</Text>
          </TouchableOpacity> */}
        </View>

        {/* HABIT LIST */}
        <View className="px-6 pb-24">
          {habits.length === 0 ? (
            <View className={`p-6 rounded-3xl items-center border ${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-gray-200'}`}>
              <Text className="text-gray-400 text-center">No habits added yet.</Text>
            </View>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                name={habit.name}
                icon={habit.icon}
                completed={habit.completed}
                streak={calculateStreak(habit.id, habitHistory)}
                onPress={() => onToggleHabit(habit.id)}
                isDark={isDark}
              />
            ))
          )}
        </View>

      </ScrollView>
    </View>
  );
}
