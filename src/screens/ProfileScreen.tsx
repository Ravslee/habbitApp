import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Linking, Platform } from "react-native";
import { UserProfile } from "../../App";
import { ThemeMode } from "../context/ThemeContext";
import AdBanner from "../components/AdBanner";

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onManageHabits: () => void;
  onEditProfile: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isDark: boolean;
}

export default function ProfileScreen({
  userProfile,
  onUpdateProfile,
  onManageHabits,
  onEditProfile,
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

  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View
          className={`mx-6 mb-6 flex-row items-center rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white'} px-4 py-6`}
          style={{ elevation: isDark ? 0 : 2 }}
        >
          {/* Avatar */}
          <View
            className="h-20 w-20 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-500/20"
            style={{ marginRight: 16 }}
          >
            <Text className="text-3xl">👤</Text>
          </View>

          {/* User Info */}
          <View className="flex-1">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{userProfile.name}</Text>
            <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>@{userProfile.name.toLowerCase().replace(/\s+/g, '')}</Text>
            <View className="mt-2 flex-row">
              <TouchableOpacity
                className="rounded bg-purple-500 px-3 py-1"
                onPress={onEditProfile}
                style={{ marginRight: 8 }}
              >
                <Text className="text-xs font-semibold text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`rounded border ${isDark ? 'border-gray-500' : 'border-gray-300'} px-3 py-1`}>
                <Text className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Manage Habits - Entry Point */}
        <TouchableOpacity
          className={`mx-6 mb-6 flex-row items-center rounded-lg px-4 py-4 ${isDark ? 'bg-purple-600' : 'bg-purple-500'}`}
          onPress={onManageHabits}
          activeOpacity={0.7}
        >
          <View
            className={`h-12 w-12 items-center justify-center rounded-lg ${isDark ? 'bg-white/20' : 'bg-white/30'}`}
            style={{ marginRight: 16 }}
          >
            <Text className="text-2xl">✨</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">Manage Habits</Text>
            <Text className={`text-sm ${isDark ? 'text-purple-200' : 'text-purple-100'}`}>Add or create new habits</Text>
          </View>
          <Text className="text-xl text-white">→</Text>
        </TouchableOpacity>

        {/* Appearance Section */}
        <View className="mx-6 mb-6">
          <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Appearance</Text>

          {/* Theme Toggle */}
          <View
            className={`flex-row items-center justify-between rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}
            style={{ elevation: isDark ? 0 : 2 }}
          >
            <View className="flex-row items-center">
              <View
                className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}
                style={{ marginRight: 16 }}
              >
                <Text className="text-lg">{isDark ? '🌙' : '☀️'}</Text>
              </View>
              <View>
                <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Dark Mode</Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isDark ? 'Currently on' : 'Currently off'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={onToggleTheme}
              trackColor={{ false: "#d1d5db", true: "#8b5cf6" }}
              thumbColor={isDark ? "#a78bfa" : "#f3f4f6"}
            />
          </View>
        </View>

        {/* Settings Section */}
        <View className="mx-6">
          <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Settings</Text>

          {/* Notification Settings */}
          <TouchableOpacity
            className={`mb-3 flex-row items-center rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white'} px-4 py-4`}
            style={{ elevation: isDark ? 0 : 2 }}
            activeOpacity={0.7}
            onPress={openNotificationSettings}
          >
            <View
              className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}
              style={{ marginRight: 16 }}
            >
              <Text className="text-lg">🔔</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Notification Settings</Text>
              <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage app notifications</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>

          {/* Contact Us */}
          <TouchableOpacity
            className={`mb-3 flex-row items-center rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white'} px-4 py-4`}
            style={{ elevation: isDark ? 0 : 2 }}
            activeOpacity={0.7}
          >
            <View
              className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}
              style={{ marginRight: 16 }}
            >
              <Text className="text-lg">📞</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Contact Us</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>

          {/* Terms and Condition */}
          <TouchableOpacity
            className={`flex-row items-center rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white'} px-4 py-4`}
            style={{ elevation: isDark ? 0 : 2 }}
            activeOpacity={0.7}
          >
            <View
              className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}
              style={{ marginRight: 16 }}
            >
              <Text className="text-lg">📄</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Terms and Conditions</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Ad Banner */}
        <View className="mx-6 my-6 rounded-xl overflow-hidden">
          <AdBanner isDark={isDark} />
        </View>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
