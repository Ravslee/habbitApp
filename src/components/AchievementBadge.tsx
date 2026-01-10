import React from "react";
import { View, Text } from "react-native";

interface AchievementBadgeProps {
    icon: string;
    name: string;
    description: string;
    unlocked: boolean;
    progress?: number; // 0-100 for partial progress
    isDark?: boolean;
}

export default function AchievementBadge({
    icon,
    name,
    description,
    unlocked,
    progress = 0,
    isDark = true,
}: AchievementBadgeProps) {
    return (
        <View
            className={`flex-row items-center p-4 mb-3 rounded-2xl border shadow-sm ${unlocked
                ? isDark
                    ? "bg-amber-900/30 border-amber-600/50"
                    : "bg-amber-50 border-amber-200"
                : isDark
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-white border-gray-200"
                }`}
        >
            {/* Icon */}
            <View
                className={`w-14 h-14 items-center justify-center rounded-xl ${unlocked
                    ? isDark ? "bg-amber-500/30" : "bg-amber-100"
                    : isDark ? "bg-slate-700/50" : "bg-gray-100"
                    }`}
            >
                <Text className={`text-2xl ${unlocked ? "" : "opacity-50"}`}>{icon}</Text>
            </View>

            {/* Content */}
            <View className="flex-1 ml-4">
                <Text
                    className={`text-base font-bold ${unlocked
                        ? isDark ? "text-amber-300" : "text-amber-600"
                        : isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                >
                    {name}
                </Text>
                <Text
                    className={`text-xs mt-0.5 ${unlocked
                        ? isDark ? "text-amber-400/70" : "text-amber-500"
                        : isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                >
                    {description}
                </Text>

                {/* Progress bar for locked achievements */}
                {!unlocked && progress > 0 && (
                    <View className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <View
                            className={`h-full rounded-full ${isDark ? 'bg-amber-500/50' : 'bg-amber-400'}`}
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                )}
            </View>

            {/* Status indicator */}
            <View
                className={`w-8 h-8 items-center justify-center rounded-full ${unlocked
                    ? "bg-amber-500"
                    : isDark ? "bg-slate-700" : "bg-gray-200"
                    }`}
            >
                {unlocked ? (
                    <Text className="text-white text-sm">✓</Text>
                ) : (
                    <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>🔒</Text>
                )}
            </View>
        </View>
    );
}
