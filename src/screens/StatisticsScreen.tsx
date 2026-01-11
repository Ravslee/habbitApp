import React, { useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Habit, HabitHistory } from "../../App";
import StatCard from "../components/StatCard";
import BarChart from "../components/BarChart";
import AdBanner from "../components/AdBanner";
import { ThemeMode } from "../context/ThemeContext";

interface StatisticsScreenProps {
  habits: Habit[];
  habitHistory: HabitHistory;
  theme: ThemeMode;
  isDark: boolean;
}

export default function StatisticsScreen({ habits, habitHistory, theme, isDark }: StatisticsScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedHabitId, setSelectedHabitId] = useState<number | null>(null);

  // Get month/year for display
  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Navigate months
  const goToPrevMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const allDates = Object.keys(habitHistory).sort();

    // Filter by selected habit if any
    const getCompletions = (date: string) => {
      const dayCompletions = habitHistory[date] || [];
      if (selectedHabitId === null) return dayCompletions;
      return dayCompletions.filter(id => id === selectedHabitId);
    };

    // Total completed habits
    const totalCompleted = allDates.reduce((sum, date) =>
      sum + getCompletions(date).length, 0);

    // Calculate streak (consecutive days with at least one completion)
    let streak = 0;
    const todayDate = new Date();
    for (let i = 0; i <= 365; i++) {
      const checkDate = new Date(todayDate);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      if (getCompletions(dateStr).length > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    // Completion rate (days with completions / total days tracked)
    const daysWithCompletions = allDates.filter(date =>
      getCompletions(date).length > 0).length;
    const totalDays = Math.max(allDates.length, 1);
    const completionRate = Math.round((daysWithCompletions / totalDays) * 100);

    // Best day (most completions)
    let bestDay = { date: '', count: 0 };
    allDates.forEach(date => {
      const count = getCompletions(date).length;
      if (count > bestDay.count) {
        bestDay = { date, count };
      }
    });

    return { totalCompleted, streak, completionRate, bestDay };
  }, [habitHistory, selectedHabitId]);

  // Generate calendar days for selected month
  const calendarData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get day of week for first day (0 = Sunday, we want Monday = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: { day: number; date: string; completions: number; isToday: boolean }[] = [];
    const today = new Date().toISOString().split('T')[0];

    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayCompletions = habitHistory[date] || [];
      const filteredCompletions = selectedHabitId === null
        ? dayCompletions
        : dayCompletions.filter(id => id === selectedHabitId);

      days.push({
        day: i,
        date,
        completions: filteredCompletions.length,
        isToday: date === today,
      });
    }

    return { days, startDay };
  }, [selectedMonth, habitHistory, selectedHabitId]);

  // Weekly data for bar chart
  const weeklyData = useMemo(() => {
    const today = new Date();
    const data: number[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = habitHistory[dateStr] || [];
      const filteredCompletions = selectedHabitId === null
        ? dayCompletions
        : dayCompletions.filter(id => id === selectedHabitId);

      const totalHabits = selectedHabitId === null ? habits.length : 1;
      const percentage = totalHabits > 0
        ? Math.round((filteredCompletions.length / totalHabits) * 100)
        : 0;
      data.push(percentage);
    }

    return data;
  }, [habitHistory, habits, selectedHabitId]);

  const getCompletionColor = (completions: number) => {
    if (completions === 0) return isDark ? "border border-slate-700" : "border border-gray-300";
    if (completions >= habits.length && habits.length > 0) return "bg-emerald-500";
    if (completions >= habits.length / 2) return "bg-purple-500";
    return "bg-purple-400/60";
  };

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Statistics</Text>
          <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Track your habit progress</Text>
        </View>

        {/* Habit Filter */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
          >
            <TouchableOpacity
              onPress={() => setSelectedHabitId(null)}
              className={`px-4 py-2 rounded-full mr-2 ${selectedHabitId === null
                ? 'bg-purple-500'
                : isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                }`}
            >
              <Text className={`text-sm font-medium ${selectedHabitId === null ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                All Habits
              </Text>
            </TouchableOpacity>
            {habits.map(habit => (
              <TouchableOpacity
                key={habit.id}
                onPress={() => setSelectedHabitId(habit.id)}
                className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${selectedHabitId === habit.id
                  ? 'bg-purple-500'
                  : isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`}
              >
                <Text className="mr-1">{habit.icon}</Text>
                <Text className={`text-sm font-medium ${selectedHabitId === habit.id ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  {habit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-4 mb-6">
          <StatCard
            icon="🔥"
            value={stats.streak}
            label="Day Streak"
            color="amber"
            isDark={isDark}
          />
          <StatCard
            icon="✅"
            value={stats.totalCompleted}
            label="Completed"
            color="emerald"
            isDark={isDark}
          />
          <StatCard
            icon="📊"
            value={`${stats.completionRate}%`}
            label="Success Rate"
            color="blue"
            isDark={isDark}
          />
        </View>

        {/* Calendar Section */}
        <View className={`mx-4 mb-6 rounded-2xl p-4 border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-gray-200 shadow-sm'}`}>
          {/* Month Navigation */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={goToPrevMonth}
              className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}
            >
              <Text className={`text-lg ${isDark ? 'text-white' : 'text-slate-700'}`}>←</Text>
            </TouchableOpacity>
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{monthName}</Text>
            <TouchableOpacity
              onPress={goToNextMonth}
              className={`w-10 h-10 items-center justify-center rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}
            >
              <Text className={`text-lg ${isDark ? 'text-white' : 'text-slate-700'}`}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Header */}
          <View className="flex-row justify-between mb-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <Text
                key={day}
                className={`w-10 text-center text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days */}
          <View className="flex-row flex-wrap">
            {/* Empty cells for start day offset */}
            {Array.from({ length: calendarData.startDay }).map((_, index) => (
              <View key={`empty-${index}`} className="w-10 h-10 m-0.5" />
            ))}
            {/* Actual days */}
            {calendarData.days.map(({ day, completions, isToday }) => (
              <View
                key={day}
                className={`w-10 h-10 m-0.5 items-center justify-center rounded-lg ${getCompletionColor(completions)
                  } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Text className={`text-xs font-semibold ${completions > 0 ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Legend */}
          <View className={`flex-row items-center justify-center mt-4 pt-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
            <View className="flex-row items-center mr-4">
              <View className="w-3 h-3 rounded bg-purple-400/60 mr-1" />
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Some</Text>
            </View>
            <View className="flex-row items-center mr-4">
              <View className="w-3 h-3 rounded bg-purple-500 mr-1" />
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Half</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded bg-emerald-500 mr-1" />
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>All</Text>
            </View>
          </View>
        </View>

        {/* Weekly Statistics */}
        <View className={`mx-4 mb-6 rounded-2xl p-4 border ${isDark ? 'bg-purple-900/50 border-purple-700/30' : 'bg-purple-50 border-purple-200'}`}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Weekly Overview</Text>
            <View className={`rounded-full px-3 py-1 ${isDark ? 'bg-purple-500/30' : 'bg-purple-100'}`}>
              <Text className={`text-xs font-semibold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>Last 7 days</Text>
            </View>
          </View>
          <View className="h-32">
            <BarChart habits={habits} habitHistory={habitHistory} isDark={isDark} />
          </View>
        </View>

        {/* Ad Banner */}
        <View className="mx-4 mb-6 rounded-xl overflow-hidden">
          <AdBanner isDark={isDark} />
        </View>

        {/* Bottom Spacing for Tab Navigation */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
