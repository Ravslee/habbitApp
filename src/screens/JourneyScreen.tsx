import React, { useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { Habit, HabitHistory } from "../../App";
import AchievementBadge from "../components/AchievementBadge";
import AdBanner from "../components/AdBanner";
import { ThemeMode } from "../context/ThemeContext";

interface JourneyScreenProps {
  habits: Habit[];
  habitHistory: HabitHistory;
  theme: ThemeMode;
  isDark: boolean;
}

interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  check: (data: AchievementData) => boolean;
  progress?: (data: AchievementData) => number;
}

interface AchievementData {
  totalCompleted: number;
  currentStreak: number;
  longestStreak: number;
  perfectDays: number;
  habitCount: number;
  daysOnJourney: number;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    icon: "🌱",
    name: "First Step",
    description: "Complete your first habit",
    check: (d) => d.totalCompleted >= 1,
  },
  {
    id: "habit_starter",
    icon: "📝",
    name: "Habit Starter",
    description: "Create 3 habits",
    check: (d) => d.habitCount >= 3,
    progress: (d) => Math.min((d.habitCount / 3) * 100, 100),
  },
  {
    id: "habit_builder",
    icon: "🏗️",
    name: "Habit Builder",
    description: "Create 5 habits",
    check: (d) => d.habitCount >= 5,
    progress: (d) => Math.min((d.habitCount / 5) * 100, 100),
  },
  {
    id: "on_fire",
    icon: "🔥",
    name: "On Fire",
    description: "Maintain a 3-day streak",
    check: (d) => d.longestStreak >= 3,
    progress: (d) => Math.min((d.currentStreak / 3) * 100, 100),
  },
  {
    id: "week_warrior",
    icon: "⭐",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    check: (d) => d.longestStreak >= 7,
    progress: (d) => Math.min((d.currentStreak / 7) * 100, 100),
  },
  {
    id: "consistent",
    icon: "💎",
    name: "Consistent",
    description: "Maintain a 14-day streak",
    check: (d) => d.longestStreak >= 14,
    progress: (d) => Math.min((d.currentStreak / 14) * 100, 100),
  },
  {
    id: "month_master",
    icon: "🏆",
    name: "Month Master",
    description: "Maintain a 30-day streak",
    check: (d) => d.longestStreak >= 30,
    progress: (d) => Math.min((d.currentStreak / 30) * 100, 100),
  },
  {
    id: "perfect_day",
    icon: "🎯",
    name: "Perfect Day",
    description: "Complete all habits in a single day",
    check: (d) => d.perfectDays >= 1,
  },
  {
    id: "five_perfect",
    icon: "🌟",
    name: "Five Star",
    description: "Have 5 perfect days",
    check: (d) => d.perfectDays >= 5,
    progress: (d) => Math.min((d.perfectDays / 5) * 100, 100),
  },
  {
    id: "centurion",
    icon: "💯",
    name: "Centurion",
    description: "Complete 100 habits total",
    check: (d) => d.totalCompleted >= 100,
    progress: (d) => Math.min((d.totalCompleted / 100) * 100, 100),
  },
];

export default function JourneyScreen({ habits, habitHistory, theme, isDark }: JourneyScreenProps) {

  // Calculate achievement data from habit history
  const achievementData = useMemo((): AchievementData => {
    const allDates = Object.keys(habitHistory).sort();

    // Total completed habits
    const totalCompleted = allDates.reduce(
      (sum, date) => sum + habitHistory[date].length, 0
    );

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();

    for (let i = 0; i <= 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (habitHistory[dateStr] && habitHistory[dateStr].length > 0) {
        tempStreak++;
        if (i === currentStreak) {
          currentStreak++;
        }
      } else if (i > 0) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Perfect days (days where all habits were completed)
    const perfectDays = allDates.filter(date => {
      const completed = habitHistory[date].length;
      return completed >= habits.length && habits.length > 0;
    }).length;

    // Days on journey (from first completion to now)
    const daysOnJourney = allDates.length > 0
      ? Math.ceil((today.getTime() - new Date(allDates[0]).getTime()) / (1000 * 60 * 60 * 24)) + 1
      : 0;

    return {
      totalCompleted,
      currentStreak,
      longestStreak,
      perfectDays,
      habitCount: habits.length,
      daysOnJourney,
    };
  }, [habits, habitHistory]);

  // Count unlocked achievements
  const unlockedCount = ACHIEVEMENTS.filter(a => a.check(achievementData)).length;

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Your Journey</Text>
          <Text className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Track your achievements</Text>
        </View>

        {/* Journey Stats */}
        <View className={`mx-4 mb-6 p-5 rounded-2xl shadow-sm ${isDark ? 'bg-purple-900/40 border border-purple-700/50' : 'bg-white border border-purple-100'}`}>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className={`text-3xl font-bold ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                {achievementData.daysOnJourney}
              </Text>
              <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Days</Text>
            </View>
            <View className={`w-px ${isDark ? 'bg-purple-700/50' : 'bg-purple-200'}`} />
            <View className="items-center">
              <Text className={`text-3xl font-bold ${isDark ? 'text-amber-300' : 'text-amber-500'}`}>
                {unlockedCount}
              </Text>
              <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Badges</Text>
            </View>
            <View className={`w-px ${isDark ? 'bg-purple-700/50' : 'bg-purple-200'}`} />
            <View className="items-center">
              <Text className={`text-3xl font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-500'}`}>
                {achievementData.longestStreak}
              </Text>
              <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Best Streak</Text>
            </View>
          </View>
        </View>

        {/* Current Progress Section */}
        {achievementData.currentStreak > 0 && (
          <View className={`mx-4 mb-6 p-4 rounded-2xl shadow-sm ${isDark ? 'bg-orange-900/30 border border-orange-700/50' : 'bg-gradient-to-r bg-orange-50 border border-orange-200'}`}>
            <View className="flex-row items-center">
              <View className={`h-14 w-14 items-center justify-center rounded-xl mr-3 ${isDark ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                <Text className="text-3xl">🔥</Text>
              </View>
              <View>
                <Text className={`text-xl font-bold ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                  {achievementData.currentStreak} Day Streak!
                </Text>
                <Text className={`text-sm ${isDark ? 'text-orange-400/70' : 'text-orange-500'}`}>Keep it going!</Text>
              </View>
            </View>
          </View>
        )}

        {/* Achievements Section */}
        <View className="px-4 mb-4">
          <Text className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-700'}`}>
            Achievements ({unlockedCount}/{ACHIEVEMENTS.length})
          </Text>

          {/* Unlocked Achievements */}
          {ACHIEVEMENTS.filter(a => a.check(achievementData)).map(achievement => (
            <AchievementBadge
              key={achievement.id}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.description}
              unlocked={true}
              isDark={isDark}
            />
          ))}

          {/* Locked Achievements */}
          {ACHIEVEMENTS.filter(a => !a.check(achievementData)).map(achievement => (
            <AchievementBadge
              key={achievement.id}
              icon={achievement.icon}
              name={achievement.name}
              description={achievement.description}
              unlocked={false}
              progress={achievement.progress?.(achievementData) || 0}
              isDark={isDark}
            />
          ))}
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
