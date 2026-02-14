import React from "react";
import { View, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
            className={`flex-row items-center p-4 mb-3 rounded-2xl ${unlocked
                ? isDark
                    ? "bg-[#1e1e20]" // Unlocked: Dark Card
                    : "bg-amber-50"
                : isDark
                    ? "bg-[#1e1e20]" // Locked: Dark Card
                    : "bg-white"
                }`}
        >
            {/* Icon */}
            <View
                className={`w-14 h-14 items-center justify-center rounded-xl ${unlocked
                    ? isDark ? "bg-[#2c2c2e]" : "bg-amber-100"
                    : isDark ? "bg-[#2c2c2e]" : "bg-gray-100"
                    }`}
            >
                <Icon
                    name={icon}
                    size={32}
                    color={unlocked
                        ? isDark ? "#8b56fc" : "#d97706"
                        : isDark ? "#4b5563" : "#9ca3af"}
                    style={{ opacity: unlocked ? 1 : 0.5 }}
                />
            </View>

            {/* Content */}
            <View className="flex-1 ml-4">
                <Text
                    className={`text-base font-bold ${unlocked
                        ? isDark ? "text-white" : "text-amber-600"
                        : isDark ? "text-gray-500" : "text-gray-500"
                        }`}
                >
                    {name}
                </Text>
                <Text
                    className={`text-xs mt-0.5 ${unlocked
                        ? isDark ? "text-gray-400" : "text-amber-500"
                        : isDark ? "text-gray-600" : "text-gray-400"
                        }`}
                >
                    {description}
                </Text>

                {/* Progress bar for locked achievements */}
                {!unlocked && progress > 0 && (
                    <View className="mt-3 relative h-4 justify-center">
                        {/* Track */}
                        <View className={`absolute w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-200'}`}>
                            <View
                                className={`h-full rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`}
                                style={{ width: `${progress}%` }}
                            />
                        </View>

                        {/* Tick Indicator */}
                        <View
                            className="absolute"
                            style={{
                                left: `${progress}%`,
                                marginLeft: -6, // Center the icon
                            }}
                        >
                            <Icon name="check-bold" size={12} color={isDark ? '#9ca3af' : '#4b5563'} />
                        </View>
                    </View>
                )}
            </View>

            {/* Status indicator */}
            <View className="w-10 h-10 items-center justify-center">
                {unlocked ? (
                    <Icon name="star" size={32} color="#8b56fc" />
                ) : (
                    <Icon name="lock" size={30} color={isDark ? '#4b5563' : '#9ca3af'} style={{ opacity: 0.5 }} />
                )}
            </View>
        </View>
    );
}
