import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, Linking, Platform, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserProfile, HabitHistory, Habit } from "../../App";
import { ThemeMode } from "../context/ThemeContext";
import AdBanner from "../components/AdBanner";
import { screenPropsAreEqual } from "../utils/memoization";

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
  isVisible: boolean;
}

// Sub-components defined outside to avoid re-creation
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
  color = "#8b56fc",
  isDark
}: {
  icon: string,
  title: string,
  subtitle?: string,
  onPress?: () => void,
  rightElement?: React.ReactNode,
  color?: string,
  isDark: boolean
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

function ProfileScreen({
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
  isVisible,
}: ProfileScreenProps) {

  // Open system notification settings
  const openNotificationSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };

  // Format joined date
  const joinDate = useMemo(() => {
    if (!userProfile.joinedDate) return "recently";
    return new Date(userProfile.joinedDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, [userProfile.joinedDate]);

  return (
    <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
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
            isDark={isDark}
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          {/* Manage Habits */}
          <SettingItem
            icon="sparkles"
            title="Manage Habits"
            subtitle="Add, edit or remove habits"
            onPress={onManageHabits}
            isDark={isDark}
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          {/* App Theme */}
          <SettingItem
            icon="theme-light-dark"
            title="App Theme"
            subtitle={isDark ? "Always Dark" : "Always Light"}
            onPress={onToggleTheme}
            color="#6366f1"
            isDark={isDark}
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
            isDark={isDark}
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          <SettingItem
            icon="shield-check-outline"
            title="Privacy Policy"
            onPress={onShowTerms}
            color="#ec4899"
            isDark={isDark}
          />
          <View className={`h-[1px] ml-16 ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`} />

          <SettingItem
            icon="information-outline"
            title="About Habik"
            onPress={onShowAbout}
            color="#ec4899"
            isDark={isDark}
          />
        </View>

        {/* Bottom Spacing */}
        <View className="h-24" />
      </ScrollView>

      {/* Put Banner inside View if you want it sticky bottom, or inside ScrollView for scrollable. 
          Usually strictly sticky bottom is better for ads. 
          Here we use a generic View to hold it. 
      */}
      <View className="pb-6">
        <AdBanner isDark={isDark} shouldLoad={isVisible} />
      </View>
    </View >
  );
}

export default React.memo(ProfileScreen, screenPropsAreEqual);
