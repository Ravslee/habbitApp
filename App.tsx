import "./global.css"
import { useState, useEffect } from "react";
import { View } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import JourneyScreen from "./src/screens/JourneyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ManageHabitsScreen from "./src/screens/ManageHabitsScreen";
import HabitSettingsScreen from "./src/screens/HabitSettingsScreen";
import BottomTabNavigation from "./src/components/BottomTabNavigation";

type Tab = "home" | "statistics" | "journey" | "profile";

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string;  // "HH:MM" format
  recurring: boolean;
  intervalMinutes: number;  // 15, 30, 60, 120, 240
}

export interface Habit {
  id: number;
  name: string;
  icon: string;
  completed: boolean;
  highlight?: boolean;
  notification?: NotificationSettings;
}

export interface UserProfile {
  name: string;
  dob: string;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showManageHabits, setShowManageHabits] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const toggleHabit = (id: number) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      )
    );
  };

  const addHabit = (habit: { name: string; icon: string }) => {
    const newHabit: Habit = {
      id: Date.now(),
      name: habit.name,
      icon: habit.icon,
      completed: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updates });
    }
  };

  const updateHabitNotification = (habitId: number, notification: NotificationSettings) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, notification } : h
      )
    );
    setEditingHabit(null);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show onboarding if user hasn't completed it
  if (!userProfile) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Show HabitSettings screen
  if (editingHabit) {
    return (
      <HabitSettingsScreen
        habit={editingHabit}
        onSave={(settings) => updateHabitNotification(editingHabit.id, settings)}
        onBack={() => setEditingHabit(null)}
      />
    );
  }

  // Show ManageHabits screen
  if (showManageHabits) {
    return (
      <ManageHabitsScreen
        habits={habits}
        onAddHabit={addHabit}
        onDeleteHabit={(id) => setHabits(prev => prev.filter(h => h.id !== id))}
        onEditHabit={(habit) => setEditingHabit(habit)}
        onBack={() => setShowManageHabits(false)}
      />
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "statistics":
        return <StatisticsScreen />;
      case "journey":
        return <JourneyScreen />;
      case "profile":
        return (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={updateProfile}
            onManageHabits={() => setShowManageHabits(true)}
          />
        );
      default:
        return (
          <HomeScreen
            habits={habits}
            onToggleHabit={toggleHabit}
            userName={userProfile.name}
          />
        );
    }
  };

  return (
    <View className="flex-1">
      {renderScreen()}
      <BottomTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}