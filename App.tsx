import "./global.css"
import { useState, useEffect } from "react";
import { View } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import StatisticsScreen from "./src/screens/StatisticsScreen";
import JourneyScreen from "./src/screens/JourneyScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import BottomTabNavigation from "./src/components/BottomTabNavigation";

type Tab = "home" | "statistics" | "journey" | "profile";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case "statistics":
        return <StatisticsScreen />;
      case "journey":
        return <JourneyScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View className="flex-1">
      {renderScreen()}
      <BottomTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}