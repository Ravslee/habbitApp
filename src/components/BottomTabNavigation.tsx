import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdBanner from "./AdBanner";

interface BottomTabNavigationProps {
  activeTab: "home" | "statistics" | "journey" | "profile";
  onTabChange: (tab: "home" | "statistics" | "journey" | "profile") => void;
  onAddHabit: () => void;
  isDark?: boolean;
}

export default function BottomTabNavigation({
  activeTab,
  onTabChange,
  onAddHabit,
  isDark = true,
}: BottomTabNavigationProps) {
  const tabs = [
    { id: "home", label: "Home", icon: "home" },
    { id: "statistics", label: "Statistics", icon: "chart-bar" },
    // Placeholder for spacing
    { id: "add", label: "", icon: "plus", isAction: true },
    { id: "journey", label: "Journey", icon: "map-marker-path" },
    { id: "profile", label: "Profile", icon: "account" },
  ];

  return (
    <View>
      <AdBanner isDark={isDark} shouldLoad={true} />
      <View className={`flex-row items-end justify-between px-2 border-t pt-2 ${isDark ? 'border-[#0f0f11] bg-[#0f0f11]' : 'border-gray-200 bg-white'}`}>
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <View key="add-button" className="items-center py-2" style={{ width: '20%' }}>
                <TouchableOpacity
                  onPress={onAddHabit}
                  className="h-16 w-16 bg-[#8b56fc] rounded-full items-center justify-center shadow-lg shadow-purple-500/50 "
                >
                  <Icon name="plus" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                {/* <Text className="text-xs font-semibold text-gray-500 opacity-0">Create</Text> */}
              </View>
            );
          }

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id as any)}
              style={{ width: '20%' }}
              className={`items-center py-2 ${activeTab === tab.id ? "" : ""
                }`}
            >
              <Icon
                name={tab.icon}
                size={24}
                color={activeTab === tab.id ? "#8b56fc" : isDark ? "#9ca3af" : "#6b7280"}
              />
              <Text
                className={`text-xs font-semibold mt-1 ${activeTab === tab.id
                  ? "text-[#8b56fc]"
                  : isDark ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  );
}
