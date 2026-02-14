import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Linking, Platform, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserProfile, HabitHistory, Habit } from "../../App";
import { ThemeMode } from "../context/ThemeContext";
import AdBanner from "../components/AdBanner";

interface ProfileScreenProps {
  userProfile: UserProfile;
  habits: Habit[];
  habitHistory: HabitHistory;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onManageHabits: () => void;
  onEditProfile: () => void;
  onShowTerms: () => void;
  onShowAbout: () => void;
  onShowHelp: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isDark: boolean;
}

export default function ProfileScreen({
  userProfile,
  habits,
  habitHistory,
  onUpdateProfile,
  onManageHabits,
  onEditProfile,
  onShowTerms,
  onShowAbout,
  onShowHelp,
  theme,
  onToggleTheme,
  isDark,
}: ProfileScreenProps) {

  // Open system notification settings
  const openNotificationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  // Calculate generic stats for the UI
  const stats = useMemo(() => {
    const allDates = Object.keys(habitHistory);
    const totalCompleted = allDates.reduce((sum, date) => sum + habitHistory[date].length, 0);

    // Points logic: 10 points per habit
    const points = totalCompleted * 10;

    // Level logic: 1 level per 50 habits
    const level = Math.floor(totalCompleted / 50) + 1;

    return { points, level };
  }, [habitHistory]);

  const joinDate = userProfile.joinedDate ? new Date(userProfile.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  }) : 'June 2023';

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3 mt-6 ml-1">
      {title}
    </Text>
  );

  const SettingItem = ({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    color = "#8b56fc"
  }: {
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode,
    color?: string
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={!onPress}
      className="flex-row items-center justify-between p-4"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-10 h-10 rounded-full items-center justify-center mr-4" style={{ backgroundColor: `${color}20` }}>
          <Icon name={icon} size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className={`font-medium text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</Text>
          {subtitle && <Text className="text-gray-500 text-xs mt-0.5">{subtitle}</Text>}
        </View>
      </View>
      {rightElement || <Icon name="chevron-right" size={20} color={isDark ? "#4b5563" : "#9ca3af"} />}
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
      {/* Header */}
      {/* <View className="px-6 pt-6 pb-2 flex-row items-center">
        <Icon name="chevron-left" size={28} color={isDark ? "#FFF" : "#374151"} />
        <Text className={`text-xl font-bold flex-1 text-center mr-7 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</Text>
      </View> */}


      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6  pt-12">
        <View className="mb-8">
          <Text className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</Text>
        </View>
        {/* Profile Section */}
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <View className={`w-28 h-28 rounded-full border-2 border-[#8b56fc] p-1 mb-3 items-center justify-center ${isDark ? 'bg-[#1e1e20]' : 'bg-gray-200'}`}>
              {userProfile.profileImage ? (
                <Image
                  source={{ uri: userProfile.profileImage }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <Icon name="account" size={60} color="#8b56fc" />
              )}
            </View>
            <TouchableOpacity
              onPress={onEditProfile}
              className={`absolute bottom-3 right-0 bg-[#8b56fc] w-8 h-8 rounded-full items-center justify-center border-2 ${isDark ? 'border-[#0f0f11]' : 'border-gray-50'}`}
            >
              <Icon name="pencil" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{userProfile.name}</Text>
          <Text className="text-gray-500 text-sm">Joined {joinDate}</Text>
        </View>

        {/* Stats Row */}
        {/* <View className="flex-row justify-between mb-2">
          <View className="bg-[#1e1e20] rounded-3xl p-5 w-[48%] items-center border border-[#2c2c2e]">
            <Text className="text-[#8b56fc] text-2xl font-bold mb-1">{stats.points.toLocaleString()}</Text>
            <Text className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">HABIK POINTS</Text>
          </View>
          <View className="bg-[#1e1e20] rounded-3xl p-5 w-[48%] items-center border border-[#2c2c2e]">
            <Text className="text-[#8b56fc] text-2xl font-bold mb-1"> Lvl {stats.level}</Text>
            <Text className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">MASTERY LEVEL</Text>
          </View>
        </View> */}

        {/* PREFERENCES */}
        <SectionHeader title="PREFERENCES" />
        <View className={`rounded-3xl overflow-hidden mb-6 border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}>
          {/* Push Notifications */}
          <SettingItem
            icon="bell"
            title="Push Notifications"
            onPress={openNotificationSettings}
            rightElement={
              <Switch
                value={true} // Visual only for now
                trackColor={{ false: "#3f3f46", true: "#8b56fc" }}
                thumbColor={"#FFF"}
                onValueChange={openNotificationSettings}
              />
            }
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          {/* Manage Habits */}
          <SettingItem
            icon="sparkles"
            title="Manage Habits"
            subtitle="Add, edit or remove habits"
            onPress={onManageHabits}
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          {/* App Theme */}
          <SettingItem
            icon="theme-light-dark"
            title="App Theme"
            subtitle={isDark ? "Always Dark" : "Always Light"}
            onPress={onToggleTheme}
            color="#6366f1"
          />
        </View>

        {/* SUPPORT */}
        <SectionHeader title="SUPPORT" />
        <View className={`rounded-3xl overflow-hidden mb-8 border ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={onShowHelp}
            color="#ec4899"
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          <SettingItem
            icon="shield-check-outline"
            title="Privacy Policy"
            onPress={onShowTerms}
            color="#ec4899"
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          <SettingItem
            icon="information-outline"
            title="About Habik"
            onPress={onShowAbout}
            color="#ec4899"
          />
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>
    </View >
  );
}
