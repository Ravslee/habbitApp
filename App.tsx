import "./global.css"
import { useState, useEffect, useCallback, useRef } from "react";
import { View, BackHandler, StatusBar } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import JourneyScreen from "./src/screens/JourneyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ManageHabitsScreen from "./src/screens/ManageHabitsScreen";
import HabitSettingsScreen from "./src/screens/HabitSettingsScreen";
import ProfileEditScreen from "./src/screens/ProfileEditScreen";
import TermsScreen from "./src/screens/TermsScreen";
import AboutScreen from "./src/screens/AboutScreen";
import HelpScreen from "./src/screens/HelpScreen";
import BottomTabNavigation from "./src/components/BottomTabNavigation";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { loadAppData, saveAppData, AppData } from "./src/utils/storage";
import { ThemeMode } from "./src/context/ThemeContext";
import { initializeNotifications, scheduleHabitNotification, cancelHabitNotification } from "./src/services/notificationService";
import mobileAds from 'react-native-google-mobile-ads';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
  notification?: NotificationSettings;
}

export interface UserProfile {
  name: string;
  dob: string;
  profileImage?: string;
  joinedDate?: string;
}

// Habit history: date string (YYYY-MM-DD) -> array of completed habit IDs
export interface HabitHistory {
  [date: string]: number[];
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitHistory, setHabitHistory] = useState<HabitHistory>({});
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [showManageHabits, setShowManageHabits] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Ref to track if we should save (to debounce saves)
  const saveTimeoutRef = useRef<number | null>(null);

  // Debug: render counter to detect infinite loops
  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log('App render #', renderCount.current, 'theme:', theme);

  // Calculate isDark based on theme
  const isDark = theme === 'dark';

  // Load data on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize AdMob SDK
        await mobileAds().initialize();

        // Initialize notification system
        await initializeNotifications();

        const data = await loadAppData();
        setUserProfile(data.userProfile);
        setHabits(data.habits);
        setHabitHistory(data.habitHistory);
        // Restore saved theme or default to light if not set
        if (data.theme) {
          setTheme(data.theme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading app data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeApp();
  }, []);

  // Debounced save function
  const debouncedSave = useCallback((data: AppData) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveAppData(data).catch(err => console.error('Save error:', err));
    }, 500);
  }, []);

  // Save data whenever it changes (debounced)
  useEffect(() => {
    if (!isLoading) {
      const data: AppData = {
        userProfile,
        habits,
        habitHistory,
        theme,
        version: 1,
      };
      debouncedSave(data);
    }
  }, [userProfile, habits, habitHistory, theme, isLoading, debouncedSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Show splash for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = useCallback((profile: { name: string; dob: string }) => {
    const fullProfile: UserProfile = {
      ...profile,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUserProfile(fullProfile);
  }, []);

  // Theme change handler removed - light theme is now permanent

  const toggleHabit = useCallback((id: number) => {
    const today = new Date().toISOString().split('T')[0];

    setHabits((prev) => {
      const habit = prev.find(h => h.id === id);
      const wasCompleted = habit?.completed;

      setHabitHistory((prevHistory) => {
        const todayHistory = prevHistory[today] || [];
        if (wasCompleted) {
          return {
            ...prevHistory,
            [today]: todayHistory.filter(hId => hId !== id)
          };
        } else {
          if (!todayHistory.includes(id)) {
            return {
              ...prevHistory,
              [today]: [...todayHistory, id]
            };
          }
          return prevHistory;
        }
      });

      return prev.map((h) =>
        h.id === id ? { ...h, completed: !h.completed } : h
      );
    });
  }, []);

  const addHabit = useCallback(async (habitData: {
    name: string;
    icon: string;
    frequency: string;
    motivation: string;
    reminderTime: string;
    reminderEnabled: boolean;
    recurring: boolean;
    interval?: number;
  }) => {
    const newHabit: Habit = {
      id: Date.now(),
      name: habitData.name,
      icon: habitData.icon,
      completed: false,
      notification: {
        enabled: habitData.reminderEnabled,
        reminderTime: habitData.reminderTime,
        recurring: habitData.recurring,
        intervalMinutes: habitData.interval || 60,
      }
    };

    setHabits((prev) => [...prev, newHabit]);

    // Schedule notification if enabled
    if (newHabit.notification?.enabled) {
      await scheduleHabitNotification(newHabit, newHabit.notification);
    }
  }, []);

  const updateHabit = useCallback(async (id: number, updates: Partial<Habit> & {
    frequency?: string;
    motivation?: string;
    reminderTime?: string;
    reminderEnabled?: boolean;
    recurring?: boolean;
    interval?: number;
  }) => {
    setHabits((prev) => {
      const existing = prev.find(h => h.id === id);
      if (!existing) return prev;

      const updatedHabit = {
        ...existing,
        ...updates,
        // Map flat fields to notification object if present in updates
        notification: (updates.reminderEnabled !== undefined || updates.reminderTime !== undefined) ? {
          enabled: updates.reminderEnabled ?? existing.notification?.enabled ?? false,
          reminderTime: updates.reminderTime ?? existing.notification?.reminderTime ?? "09:00",
          recurring: updates.recurring ?? existing.notification?.recurring ?? false,
          intervalMinutes: updates.interval ?? existing.notification?.intervalMinutes ?? 60,
        } : existing.notification
      };

      // Handle side effects (notifications) outside the state setter if possible, 
      // but here we just need to know the new state to schedule.
      // We'll schedule after state update or do it here if we have the object.
      // Async in setState is bad, so we'll do it after.
      return prev.map(h => h.id === id ? updatedHabit : h);
    });

    // We need to fetch the *latest* habit to schedule effectively, 
    // or just construct it here.
    // Let's reconstruct for scheduling:
    const existing = habits.find(h => h.id === id);
    if (existing) {
      const updatedNotification = (updates.reminderEnabled !== undefined) ? {
        enabled: updates.reminderEnabled,
        reminderTime: updates.reminderTime ?? existing.notification?.reminderTime ?? "09:00",
        recurring: updates.recurring ?? existing.notification?.recurring ?? false,
        intervalMinutes: updates.interval ?? existing.notification?.intervalMinutes ?? 60,
      } : existing.notification;

      const updatedHabitForSchedule = { ...existing, ...updates, notification: updatedNotification };

      if (updatedNotification?.enabled) {
        scheduleHabitNotification(updatedHabitForSchedule, updatedNotification);
      } else {
        cancelHabitNotification(id);
      }
    }

  }, [habits]);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  const updateHabitNotification = useCallback(async (habitId: number, notification: NotificationSettings) => {
    // Find the habit to get its details
    const habit = habits.find(h => h.id === habitId);

    if (habit) {
      // Schedule or cancel notification based on settings
      if (notification.enabled) {
        await scheduleHabitNotification({ ...habit, notification }, notification);
      } else {
        await cancelHabitNotification(habitId);
      }
    }

    setHabits((prev) =>
      prev.map((h) =>
        h.id === habitId ? { ...h, notification } : h
      )
    );
    setEditingHabit(null);
  }, [habits]);

  const handleManageHabits = useCallback(() => {
    setShowManageHabits(true);
  }, []);

  const handleBackFromManageHabits = useCallback(() => {
    setShowManageHabits(false);
  }, []);

  const handleEditHabit = useCallback((habit: Habit) => {
    setEditingHabit(habit);
  }, []);

  const handleBackFromHabitSettings = useCallback(() => {
    setEditingHabit(null);
  }, []);

  const handleDeleteHabit = useCallback((id: number) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  const handleEditProfile = useCallback(() => {
    setEditingProfile(true);
  }, []);

  const handleBackFromEditProfile = useCallback(() => {
    setEditingProfile(false);
  }, []);

  const handleShowTerms = useCallback(() => {
    setShowTerms(true);
  }, []);

  const handleBackFromTerms = useCallback(() => {
    setShowTerms(false);
  }, []);

  const handleShowAbout = useCallback(() => {
    setShowAbout(true);
  }, []);

  const handleBackFromAbout = useCallback(() => {
    setShowAbout(false);
  }, []);

  const handleShowHelp = useCallback(() => {
    setShowHelp(true);
  }, []);

  const handleBackFromHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      if (editingHabit) {
        setEditingHabit(null);
        return true;
      }
      if (editingProfile) {
        setEditingProfile(false);
        return true;
      }
      if (showTerms) {
        setShowTerms(false);
        return true;
      }
      if (showAbout) {
        setShowAbout(false);
        return true;
      }
      if (showHelp) {
        setShowHelp(false);
        return true;
      }
      if (showManageHabits) {
        setShowManageHabits(false);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [editingHabit, editingProfile, showTerms, showManageHabits, showAbout, showHelp]);

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen />;
  }

  // Show Onboarding if user hasn't completed it (null profile OR empty name)
  if (!userProfile || !userProfile.name) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </SafeAreaProvider>
    );
  }

  // Show HabitSettings screen
  if (editingHabit) {
    return (
      <SafeAreaProvider>
        <HabitSettingsScreen
          habit={editingHabit}
          onSave={(settings) => updateHabitNotification(editingHabit.id, settings)}
          onBack={handleBackFromHabitSettings}
          isDark={isDark}
        />
      </SafeAreaProvider>
    );
  }

  // Show ProfileEdit screen
  if (editingProfile) {
    return (
      <SafeAreaProvider>
        <ProfileEditScreen
          userProfile={userProfile}
          onSave={updateProfile}
          onBack={handleBackFromEditProfile}
          isDark={isDark}
        />
      </SafeAreaProvider>
    );
  }

  // Show Terms screen
  if (showTerms) {
    return (
      <SafeAreaProvider>
        <TermsScreen
          onBack={handleBackFromTerms}
          isDark={isDark}
        />
      </SafeAreaProvider>
    );
  }

  // Show About screen
  if (showAbout) {
    return (
      <SafeAreaProvider>
        <AboutScreen
          onBack={handleBackFromAbout}
          isDark={isDark}
        />
      </SafeAreaProvider>
    );
  }

  // Show Help screen
  if (showHelp) {
    return (
      <SafeAreaProvider>
        <HelpScreen
          onBack={handleBackFromHelp}
          isDark={isDark}
        />
      </SafeAreaProvider>
    );
  }

  // Show ManageHabits screen
  if (showManageHabits) {
    return (
      <SafeAreaProvider>
        <ManageHabitsScreen
          habits={habits}
          onAddHabit={addHabit}
          onUpdateHabit={updateHabit}
          onDeleteHabit={handleDeleteHabit}
          onEditHabit={handleEditHabit}
          onBack={handleBackFromManageHabits}
          isDark={isDark}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle={isDark ? 'light-content' : 'dark-content'}
          />
          <View style={{ display: activeTab === "statistics" ? 'flex' : 'none', flex: 1 }}>
            <StatisticsScreen habits={habits} habitHistory={habitHistory} theme={theme} isDark={isDark} isVisible={activeTab === "statistics"} />
          </View>
          <View style={{ display: activeTab === "journey" ? 'flex' : 'none', flex: 1 }}>
            <JourneyScreen habits={habits} habitHistory={habitHistory} theme={theme} isDark={isDark} isVisible={activeTab === "journey"} />
          </View>
          <View style={{ display: activeTab === "profile" ? 'flex' : 'none', flex: 1 }}>
            <ProfileScreen
              userProfile={userProfile}
              habits={habits}
              habitHistory={habitHistory}
              onUpdateProfile={updateProfile}
              onManageHabits={handleManageHabits}
              onEditProfile={handleEditProfile}
              onShowTerms={handleShowTerms}
              onShowAbout={handleShowAbout}
              onShowHelp={handleShowHelp}
              theme={theme}
              onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              isDark={isDark}
              isVisible={activeTab === "profile"}
            />
          </View>
          <View style={{ display: activeTab === "home" ? 'flex' : 'none', flex: 1 }}>
            <HomeScreen
              habits={habits}
              habitHistory={habitHistory}
              onToggleHabit={toggleHabit}
              userName={userProfile?.name || "User"}
              userProfile={userProfile}
              theme={theme}
              isDark={isDark}
              isVisible={activeTab === "home"}
            />
          </View>
          <BottomTabNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onAddHabit={handleManageHabits}
            isDark={isDark}
          />
        </View>
      </ErrorBoundary>
    </SafeAreaProvider>

  );
}