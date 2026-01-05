import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface JourneyCardProps {
  title: string;
  description: string;
  icon?: string;
  bgColor?: string;
}

export default function JourneyCard({
  title,
  description,
  icon,
  bgColor = "bg-blue-600",
}: JourneyCardProps) {
  return (
    <TouchableOpacity
      className={`mb-4 overflow-hidden rounded-lg ${bgColor} p-4 shadow-lg`}
    >
      {icon && <Text className="mb-2 text-3xl">{icon}</Text>}
      <Text className="text-lg font-bold text-white">{title}</Text>
      <Text className="mt-1 text-sm text-gray-200">{description}</Text>
    </TouchableOpacity>
  );
}
