import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Habit, HabitHistory } from "../../App";
import BarChart from "../components/BarChart";
import AdBanner from "../components/AdBanner";
import { ThemeMode } from "../context/ThemeContext";
import { screenPropsAreEqual } from "../utils/memoization";

interface StatisticsScreenProps {
  habits: Habit[];
  habitHistory: HabitHistory;
  theme: ThemeMode;
  isDark: boolean;
  isVisible: boolean;
}

const { width } = Dimensions.get('window');

function StatisticsScreen({ habits, habitHistory, theme, isDark, isVisible }: StatisticsScreenProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const allDates = Object.keys(habitHistory).sort();

    // 1. Consistency Streak (Active days in current week)
    // Get start of week (Monday)
    const dayOfWeek = today.getDay(); // 0 = Sun, 1 = Mon
    const diffToMon = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMon);

    let activeDaysThisWeek = 0;
    for (let i = 0; i <= 6; i++) { // Check Mon-Sun
      const checkDate = new Date(monday);
      checkDate.setDate(monday.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      // Future check
      if (checkDate > today) break;

      if (habitHistory[dateStr] && habitHistory[dateStr].length > 0) {
        activeDaysThisWeek++;
      }
    }

    // 2. Current Streak
    let currentStreak = 0;
    // Check backwards from today
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];

      const hasActivity = habitHistory[dStr] && habitHistory[dStr].length > 0;

      if (i === 0) {
        if (hasActivity) currentStreak++;
        // If no activity today, don't break yet, check yesterday
      } else {
        if (hasActivity) {
          currentStreak++;
        } else {
          if (i === 0 && !hasActivity) continue; // Skip today if empty
          break;
        }
      }
    }

    // 3. Consistency % (Active days / Total days since first habit)
    // Simple version: Active days in last 30 days
    let activeDaysLast30 = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      if (habitHistory[dStr] && habitHistory[dStr].length > 0) activeDaysLast30++;
    }
    const consistency = Math.round((activeDaysLast30 / 30) * 100);

    return { activeDaysThisWeek, currentStreak, consistency };
  }, [habitHistory]);

  // Monthly Rhythm Data (Grid of 7 columns)
  const monthlyRhythm = useMemo(() => {
    const today = new Date();
    // Show last 35 days (5 weeks) to fill space nicely.
    const days = [];
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().substr(0, 2);
      const isActive = habitHistory[dateStr] && habitHistory[dateStr].length > 0;
      const isToday = i === 0;
      days.push({ date: d, dayName, isActive, isToday });
    }
    return days;
  }, [habitHistory]);

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 pt-12">

        {/* Header */}
        <View className="mb-0">
          <Text className="text-[#8b56fc] text-xs font-bold tracking-widest uppercase mb-1">Overview</Text>
          <View className="flex-row justify-between items-center">
            <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Your Progress</Text>

          </View>
        </View>

        {/* Consistency Card (Main) */}
        <View className={`rounded-3xl p-6 mt-8 items-center border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200 shadow-sm'}`}>
          <Text className="text-gray-500 text-sm mb-2">Consistency streak</Text>
          <View className="flex-row items-baseline mb-2">
            <Text className={`text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeDaysThisWeek}</Text>
            <Text className="text-xl text-[#8b56fc] font-medium ml-2">days</Text>
          </View>
          <Text className="text-gray-400 text-center text-sm">
            You showed up {stats.activeDaysThisWeek} days this week.
          </Text>
        </View>

        {/* Weekly Performance */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase">WEEKLY PERFORMANCE</Text>
            <Text className="text-[#8b56fc] text-xs font-bold">
              {(() => {
                const now = new Date();
                const monday = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)));
                const sunday = new Date(now.setDate(monday.getDate() + 6));
                const start = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const end = sunday.toLocaleDateString('en-US', sunday.getMonth() === monday.getMonth() ? { day: 'numeric' } : { month: 'short', day: 'numeric' });
                return `${start} - ${end}`;
              })()}
            </Text>
          </View>
          <View className={`rounded-3xl p-6 h-48 justify-end border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}>
            <BarChart habits={habits} habitHistory={habitHistory} isDark={isDark} />
          </View>
        </View>

        {/* Small Stats Row */}
        <View className="flex-row justify-between mt-6">
          <View className={`rounded-2xl p-5 w-[48%] border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}>
            <Text className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-3">CURRENT STREAK</Text>
            <View className="flex-row items-baseline">
              <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.currentStreak}</Text>
              <Icon name="fire" size={24} color="#ef4444" style={{ marginLeft: 6 }} />
            </View>
          </View>
          <View className={`rounded-2xl p-5 w-[48%] border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}>
            <Text className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-3">CONSISTENCY</Text>
            <View className="flex-row items-baseline">
              <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.consistency}%</Text>
              <Icon name="chart-line" size={24} color="#8b56fc" style={{ marginLeft: 6 }} />
            </View>
          </View>
        </View>

        {/* Monthly Rhythm */}
        <View className="mt-8 mb-4">
          <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">MONTHLY RHYTHM</Text>
          <View className={`rounded-3xl p-6 border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}>
            {/* Grid Header */}
            <View className="flex-row justify-between mb-4 px-2">
              {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
                <Text key={d} className="text-gray-600 text-[10px] font-bold w-6 text-center">{d}</Text>
              ))}
            </View>

            {/* Dots Grid */}
            <View className="flex-row flex-wrap justify-between">
              {monthlyRhythm.map((day, index) => (
                <View key={index} className="w-[14%] items-center mb-4">
                  <View
                    className={`w-2 h-2 rounded-full ${day.isActive ? 'bg-[#8b56fc]' : (isDark ? 'bg-[#2c2c2e]' : 'bg-gray-200')}`}
                  />
                  {day.isToday && (
                    <View className="absolute -top-1.5 w-5 h-5 rounded-full border border-[#8b56fc]/50" />
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        <Text className="text-gray-600 text-xs italic text-center mb-12 mt-4">
          "Calm consistency leads to lasting change."
        </Text>

      </ScrollView>
      {/* <View className="pb-6">
        <AdBanner isDark={isDark} shouldLoad={isVisible} />
      </View> */}
    </View>
  );
}

export default React.memo(StatisticsScreen, screenPropsAreEqual);
