import React, { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
} from "react-native";
import { Habit, NotificationSettings } from "../../App";

interface HabitSettingsScreenProps {
    habit: Habit;
    onSave: (settings: NotificationSettings) => void;
    onBack: () => void;
    isDark?: boolean;
}

const INTERVAL_OPTIONS = [
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "1 hour", value: 60 },
    { label: "2 hours", value: 120 },
    { label: "4 hours", value: 240 },
];

const TIME_OPTIONS = [
    { label: "6:00 AM", value: "06:00" },
    { label: "8:00 AM", value: "08:00" },
    { label: "9:00 AM", value: "09:00" },
    { label: "12:00 PM", value: "12:00" },
    { label: "3:00 PM", value: "15:00" },
    { label: "6:00 PM", value: "18:00" },
    { label: "9:00 PM", value: "21:00" },
];

export default function HabitSettingsScreen({
    habit,
    onSave,
    onBack,
    isDark = true,
}: HabitSettingsScreenProps) {
    const [enabled, setEnabled] = useState(habit.notification?.enabled ?? false);
    const [reminderTime, setReminderTime] = useState(habit.notification?.reminderTime ?? "09:00");
    const [recurring, setRecurring] = useState(habit.notification?.recurring ?? false);
    const [intervalMinutes, setIntervalMinutes] = useState(habit.notification?.intervalMinutes ?? 60);

    const handleSave = () => {
        onSave({
            enabled,
            reminderTime,
            recurring,
            intervalMinutes,
        });
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6 pb-4 flex-row items-center gap-4">
                    <TouchableOpacity onPress={onBack}>
                        <Text className={`text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>←</Text>
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Habit Settings</Text>
                    </View>
                </View>

                {/* Habit Info */}
                <View className={`mx-6 mb-6 flex-row items-center gap-4 rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <View className={`h-14 w-14 items-center justify-center rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <Text className="text-3xl">{habit.icon}</Text>
                    </View>
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{habit.name}</Text>
                </View>

                {/* Notification Settings */}
                <View className="mx-6">
                    <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Notifications</Text>

                    {/* Enable Notifications */}
                    <View className={`mb-4 flex-row items-center justify-between rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                        <View className="flex-1">
                            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Enable Reminders</Text>
                            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Get notified about this habit</Text>
                        </View>
                        <Switch
                            value={enabled}
                            onValueChange={setEnabled}
                            trackColor={{ false: isDark ? "#475569" : "#d1d5db", true: "#3b82f6" }}
                            thumbColor={enabled ? "#ffffff" : isDark ? "#94a3b8" : "#9ca3af"}
                        />
                    </View>

                    {enabled && (
                        <>
                            {/* Reminder Time */}
                            <View className="mb-4">
                                <Text className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Reminder Time</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {TIME_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            onPress={() => setReminderTime(option.value)}
                                            className={`rounded-lg px-4 py-2 ${reminderTime === option.value
                                                ? "bg-blue-500"
                                                : isDark ? "bg-slate-800" : "bg-white shadow-sm"
                                                }`}
                                        >
                                            <Text
                                                className={`font-medium ${reminderTime === option.value
                                                    ? "text-white"
                                                    : isDark ? "text-gray-300" : "text-gray-700"
                                                    }`}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Recurring Toggle */}
                            <View className={`mb-4 flex-row items-center justify-between rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                                <View className="flex-1">
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recurring Reminders</Text>
                                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Remind multiple times per day</Text>
                                </View>
                                <Switch
                                    value={recurring}
                                    onValueChange={setRecurring}
                                    trackColor={{ false: isDark ? "#475569" : "#d1d5db", true: "#3b82f6" }}
                                    thumbColor={recurring ? "#ffffff" : isDark ? "#94a3b8" : "#9ca3af"}
                                />
                            </View>

                            {/* Interval Selection */}
                            {recurring && (
                                <View className="mb-4">
                                    <Text className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Reminder Interval</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {INTERVAL_OPTIONS.map((option) => (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => setIntervalMinutes(option.value)}
                                                className={`rounded-lg px-4 py-3 ${intervalMinutes === option.value
                                                    ? "bg-blue-500"
                                                    : isDark ? "bg-slate-800" : "bg-white shadow-sm"
                                                    }`}
                                            >
                                                <Text
                                                    className={`font-medium ${intervalMinutes === option.value
                                                        ? "text-white"
                                                        : isDark ? "text-gray-300" : "text-gray-700"
                                                        }`}
                                                >
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Summary */}
                            <View className={`mb-6 rounded-lg border px-4 py-4 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-white'}`}>
                                <Text className={`mb-2 text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Summary</Text>
                                <Text className={isDark ? 'text-white' : 'text-slate-900'}>
                                    {recurring
                                        ? `You'll be reminded starting at ${TIME_OPTIONS.find(t => t.value === reminderTime)?.label}, then every ${INTERVAL_OPTIONS.find(i => i.value === intervalMinutes)?.label}.`
                                        : `You'll be reminded once at ${TIME_OPTIONS.find(t => t.value === reminderTime)?.label} daily.`}
                                </Text>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Save Button */}
            <View className="px-6 pb-8">
                <TouchableOpacity
                    onPress={handleSave}
                    className="rounded-lg bg-blue-500 py-4"
                >
                    <Text className="text-center text-lg font-semibold text-white">
                        Save Settings
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
