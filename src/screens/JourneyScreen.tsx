import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import JourneyCard from "../components/JourneyCard";

export default function JourneyScreen() {
  const journeys = [
    {
      title: "Fit Journey",
      description: "A Beginner's Guide to Fitness Habits",
      bgColor: "bg-orange-500",
      icon: "🏃",
    },
    {
      title: "Only Record of Fitness Habits",
      description: "",
      bgColor: "bg-green-600",
      icon: "💪",
    },
    {
      title: "Tracking Progress The Evolution of My Habits",
      description: "",
      bgColor: "bg-blue-600",
      icon: "📈",
    },
    {
      title: "Habitual Growth Keeping Track of Progress",
      description: "",
      bgColor: "bg-red-600",
      icon: "🎯",
    },
    {
      title: "Habit by Nolan Personal Growth Story",
      description: "",
      bgColor: "bg-green-700",
      icon: "📚",
    },
  ];

  return (
    <View className="flex-1 bg-slate-900">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-white">Journey</Text>
        </View>

        {/* Journey Cards */}
        <View className="px-6">
          {journeys.map((journey, index) => (
            <JourneyCard
              key={index}
              title={journey.title}
              description={journey.description}
              icon={journey.icon}
              bgColor={journey.bgColor}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
