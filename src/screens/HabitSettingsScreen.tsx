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
        <View className="flex-1 bg-slate-900">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6 pb-4 flex-row items-center gap-4">
                    <TouchableOpacity onPress={onBack}>
                        <Text className="text-2xl text-white">←</Text>
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-white">Habit Settings</Text>
                    </View>
                </View>

                {/* Habit Info */}
                <View className="mx-6 mb-6 flex-row items-center gap-4 rounded-lg bg-slate-800 px-4 py-4">
                    <View className="h-14 w-14 items-center justify-center rounded-lg bg-slate-700">
                        <Text className="text-3xl">{habit.icon}</Text>
                    </View>
                    <Text className="text-xl font-bold text-white">{habit.name}</Text>
                </View>

                {/* Notification Settings */}
                <View className="mx-6">
                    <Text className="mb-4 text-lg font-bold text-white">Notifications</Text>

                    {/* Enable Notifications */}
                    <View className="mb-4 flex-row items-center justify-between rounded-lg bg-slate-800 px-4 py-4">
                        <View className="flex-1">
                            <Text className="font-semibold text-white">Enable Reminders</Text>
                            <Text className="text-sm text-gray-400">Get notified about this habit</Text>
                        </View>
                        <Switch
                            value={enabled}
                            onValueChange={setEnabled}
                            trackColor={{ false: "#475569", true: "#3b82f6" }}
                            thumbColor={enabled ? "#ffffff" : "#94a3b8"}
                        />
                    </View>

                    {enabled && (
                        <>
                            {/* Reminder Time */}
                            <View className="mb-4">
                                <Text className="mb-3 font-semibold text-white">Reminder Time</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {TIME_OPTIONS.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            onPress={() => setReminderTime(option.value)}
                                            className={`rounded-lg px-4 py-2 ${reminderTime === option.value
                                                    ? "bg-blue-500"
                                                    : "bg-slate-800"
                                                }`}
                                        >
                                            <Text
                                                className={`font-medium ${reminderTime === option.value
                                                        ? "text-white"
                                                        : "text-gray-300"
                                                    }`}
                                            >
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Recurring Toggle */}
                            <View className="mb-4 flex-row items-center justify-between rounded-lg bg-slate-800 px-4 py-4">
                                <View className="flex-1">
                                    <Text className="font-semibold text-white">Recurring Reminders</Text>
                                    <Text className="text-sm text-gray-400">Remind multiple times per day</Text>
                                </View>
                                <Switch
                                    value={recurring}
                                    onValueChange={setRecurring}
                                    trackColor={{ false: "#475569", true: "#3b82f6" }}
                                    thumbColor={recurring ? "#ffffff" : "#94a3b8"}
                                />
                            </View>

                            {/* Interval Selection */}
                            {recurring && (
                                <View className="mb-4">
                                    <Text className="mb-3 font-semibold text-white">Reminder Interval</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {INTERVAL_OPTIONS.map((option) => (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => setIntervalMinutes(option.value)}
                                                className={`rounded-lg px-4 py-3 ${intervalMinutes === option.value
                                                        ? "bg-blue-500"
                                                        : "bg-slate-800"
                                                    }`}
                                            >
                                                <Text
                                                    className={`font-medium ${intervalMinutes === option.value
                                                            ? "text-white"
                                                            : "text-gray-300"
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
                            <View className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-4">
                                <Text className="mb-2 text-sm font-semibold text-gray-400">Summary</Text>
                                <Text className="text-white">
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
