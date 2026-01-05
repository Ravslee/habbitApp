import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

interface BottomTabNavigationProps {
  activeTab: "home" | "statistics" | "journey" | "profile";
  onTabChange: (tab: "home" | "statistics" | "journey" | "profile") => void;
}

export default function BottomTabNavigation({
  activeTab,
  onTabChange,
}: BottomTabNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "statistics", label: "Statistics", icon: "📊" },
    { id: "journey", label: "Journey", icon: "🎯" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  return (
    <View className="border-t border-slate-700 bg-slate-900/95 px-4 py-2">
      <View className="flex-row items-center justify-around">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id as any)}
            className={`flex-1 items-center py-3 ${
              activeTab === tab.id ? "border-b-2 border-blue-400" : ""
            }`}
          >
            <Text className="text-2xl">{tab.icon}</Text>
            <Text
              className={`text-xs font-semibold ${
                activeTab === tab.id ? "text-blue-400" : "text-gray-400"
              }`}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
