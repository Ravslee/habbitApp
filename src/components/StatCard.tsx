import React from "react";
import { View, Text } from "react-native";

interface StatCardProps {
    icon: string;
    value: string | number;
    label: string;
    color?: "blue" | "emerald" | "purple" | "amber";
    isDark?: boolean;
}

const colorClasses = {
    blue: {
        bgDark: "bg-blue-900/50",
        bgLight: "bg-blue-100",
        borderDark: "border-blue-700/50",
        borderLight: "border-blue-200",
        text: "text-blue-500",
    },
    emerald: {
        bgDark: "bg-emerald-900/50",
        bgLight: "bg-emerald-100",
        borderDark: "border-emerald-700/50",
        borderLight: "border-emerald-200",
        text: "text-emerald-500",
    },
    purple: {
        bgDark: "bg-purple-900/50",
        bgLight: "bg-purple-100",
        borderDark: "border-purple-700/50",
        borderLight: "border-purple-200",
        text: "text-purple-500",
    },
    amber: {
        bgDark: "bg-amber-900/50",
        bgLight: "bg-amber-100",
        borderDark: "border-amber-700/50",
        borderLight: "border-amber-200",
        text: "text-amber-500",
    },
};

export default function StatCard({ icon, value, label, color = "blue", isDark = true }: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <View className={`flex-1 rounded-xl ${isDark ? colors.bgDark : colors.bgLight} ${isDark ? colors.borderDark : colors.borderLight} border p-3 mx-1`}>
            <Text className="text-xl mb-1">{icon}</Text>
            <Text className={`text-2xl font-bold ${colors.text}`}>{value}</Text>
            <Text className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</Text>
        </View>
    );
}
