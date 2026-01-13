import "./global.css"
import { useState, useEffect, useCallback, useRef } from "react";
import { View, BackHandler } from "react-native";
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
import BottomTabNavigation from "./src/components/BottomTabNavigation";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { loadAppData, saveAppData, AppData } from "./src/utils/storage";
import { ThemeMode } from "./src/context/ThemeContext";
import { initializeNotifications, scheduleHabitNotification, cancelHabitNotification } from "./src/services/notificationService";

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
        // Initialize notification system
        await initializeNotifications();

        const data = await loadAppData();
        setUserProfile(data.userProfile);
        setHabits(data.habits);
        setHabitHistory(data.habitHistory);
        // Theme is now fixed to light - ignore saved theme
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

  const handleOnboardingComplete = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
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

  const addHabit = useCallback((habit: { name: string; icon: string }) => {
    const newHabit: Habit = {
      id: Date.now(),
      name: habit.name,
      icon: habit.icon,
      completed: false,
    };
    setHabits((prev) => [...prev, newHabit]);
  }, []);

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

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen />;
  }

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
  }, [editingHabit, editingProfile, showTerms, showManageHabits]);

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
        onBack={handleBackFromHabitSettings}
        isDark={isDark}
      />
    );
  }

  // Show ProfileEdit screen
  if (editingProfile) {
    return (
      <ProfileEditScreen
        userProfile={userProfile}
        onSave={updateProfile}
        onBack={handleBackFromEditProfile}
        isDark={isDark}
      />
    );
  }

  // Show Terms screen
  if (showTerms) {
    return (
      <TermsScreen
        onBack={handleBackFromTerms}
        isDark={isDark}
      />
    );
  }

  // Show ManageHabits screen
  if (showManageHabits) {
    return (
      <ManageHabitsScreen
        habits={habits}
        onAddHabit={addHabit}
        onDeleteHabit={handleDeleteHabit}
        onEditHabit={handleEditHabit}
        onBack={handleBackFromManageHabits}
        isDark={isDark}
      />
    );
  }

  return (
    <ErrorBoundary>
      <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
        {activeTab === "statistics" && (
          <StatisticsScreen habits={habits} habitHistory={habitHistory} theme={theme} isDark={isDark} />
        )}
        {activeTab === "journey" && (
          <JourneyScreen habits={habits} habitHistory={habitHistory} theme={theme} isDark={isDark} />
        )}
        {activeTab === "profile" && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={updateProfile}
            onManageHabits={handleManageHabits}
            onEditProfile={handleEditProfile}
            onShowTerms={handleShowTerms}
            theme={theme}
            onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            isDark={isDark}
          />
        )}
        {activeTab === "home" && (
          <HomeScreen
            habits={habits}
            habitHistory={habitHistory}
            onToggleHabit={toggleHabit}
            userName={userProfile.name}
            theme={theme}
            isDark={isDark}
          />
        )}
        <BottomTabNavigation activeTab={activeTab} onTabChange={handleTabChange} isDark={isDark} />
      </View>
    </ErrorBoundary>
  );
}