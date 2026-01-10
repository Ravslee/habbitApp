import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { UserProfile } from "../../App";

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onManageHabits: () => void;
  isDark: boolean;
}

export default function ProfileScreen({
  userProfile,
  onUpdateProfile,
  onManageHabits,
  isDark,
}: ProfileScreenProps) {
  return (
    <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View className={`mx-6 mb-6 flex-row items-center gap-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm'} px-4 py-6`}>
          {/* Avatar */}
          <View className="h-20 w-20 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-500/20">
            <Text className="text-3xl">👤</Text>
          </View>

          {/* User Info */}
          <View className="flex-1">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{userProfile.name}</Text>
            <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>@{userProfile.name.toLowerCase().replace(/\s+/g, '')}</Text>
            <View className="mt-2 flex-row gap-2">
              <TouchableOpacity className="rounded bg-blue-500 px-3 py-1">
                <Text className="text-xs font-semibold text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`rounded border ${isDark ? 'border-gray-500' : 'border-gray-300'} px-3 py-1`}>
                <Text className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Manage Habits - Entry Point */}
        <TouchableOpacity
          className={`mx-6 mb-6 flex-row items-center gap-4 rounded-lg px-4 py-4 ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
          onPress={onManageHabits}
        >
          <View className={`h-12 w-12 items-center justify-center rounded-lg ${isDark ? 'bg-white/20' : 'bg-white/30'}`}>
            <Text className="text-2xl">✨</Text>
          </View>
          <View className="flex-1">
            <Text className="text-lg font-bold text-white">Manage Habits</Text>
            <Text className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-100'}`}>Add or create new habits</Text>
          </View>
          <Text className="text-xl text-white">→</Text>
        </TouchableOpacity>

        {/* Settings Section */}
        <View className="mx-6">
          <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</Text>

          {/* Setting Items */}
          <TouchableOpacity className={`mb-3 flex-row items-center gap-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm'} px-4 py-4`}>
            <View className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Text className="text-lg">⚙️</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>General Setting</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`mb-3 flex-row items-center gap-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm'} px-4 py-4`}>
            <View className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Text className="text-lg">🔔</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notification</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`mb-3 flex-row items-center gap-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm'} px-4 py-4`}>
            <View className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Text className="text-lg">📞</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Contact Us</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity className={`flex-row items-center gap-4 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-white shadow-sm'} px-4 py-4`}>
            <View className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <Text className="text-lg">📄</Text>
            </View>
            <View className="flex-1">
              <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Term and Condition</Text>
            </View>
            <Text className={isDark ? 'text-gray-400' : 'text-gray-500'}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
