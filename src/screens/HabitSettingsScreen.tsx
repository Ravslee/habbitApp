import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

export default function HabitSettingsScreen({
    habit,
    onSave,
    onBack,
    isDark = false,
}: HabitSettingsScreenProps) {
    const [enabled, setEnabled] = useState(habit.notification?.enabled ?? false);
    const [reminderTime, setReminderTime] = useState(habit.notification?.reminderTime ?? "09:00");
    const [recurring, setRecurring] = useState(habit.notification?.recurring ?? false);
    const [intervalMinutes, setIntervalMinutes] = useState(habit.notification?.intervalMinutes ?? 60);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Convert "HH:MM" string to Date object for the picker
    const getTimeAsDate = useCallback(() => {
        const [hours, minutes] = reminderTime.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }, [reminderTime]);

    // Format Date to "HH:MM" string
    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Format for display (12-hour format with AM/PM)
    const formatTimeDisplay = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const handleTimeChange = useCallback((event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }
        if (selectedDate) {
            setReminderTime(formatTime(selectedDate));
        }
    }, []);

    const handleIntervalSelect = useCallback((value: number) => {
        setIntervalMinutes(value);
    }, []);

    const handleSave = useCallback(() => {
        onSave({
            enabled,
            reminderTime,
            recurring,
            intervalMinutes,
        });
    }, [enabled, reminderTime, recurring, intervalMinutes, onSave]);

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6 pb-4 flex-row items-center">
                    <TouchableOpacity onPress={onBack} style={{ marginRight: 16 }}>
                        <Text className={`text-2xl ${isDark ? 'text-white' : 'text-slate-700'}`}>←</Text>
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Habit Settings</Text>
                    </View>
                </View>

                {/* Habit Info */}
                <View
                    className={`mx-6 mb-6 flex-row items-center rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                    style={{ elevation: isDark ? 0 : 2 }}
                >
                    <View
                        className={`h-14 w-14 items-center justify-center rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}
                        style={{ marginRight: 16 }}
                    >
                        <Text className="text-3xl">{habit.icon}</Text>
                    </View>
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>{habit.name}</Text>
                </View>

                {/* Notification Settings */}
                <View className="mx-6">
                    <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>Notifications</Text>

                    {/* Enable Notifications */}
                    <View
                        className={`mb-4 flex-row items-center justify-between rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                        style={{ elevation: isDark ? 0 : 2 }}
                    >
                        <View className="flex-1">
                            <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Enable Reminders</Text>
                            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Get notified about this habit</Text>
                        </View>
                        <Switch
                            value={enabled}
                            onValueChange={setEnabled}
                            trackColor={{ false: isDark ? "#475569" : "#d1d5db", true: "#8b5cf6" }}
                            thumbColor={enabled ? "#a78bfa" : isDark ? "#94a3b8" : "#9ca3af"}
                        />
                    </View>

                    {enabled && (
                        <>
                            {/* Time Picker */}
                            <View className="mb-4">
                                <Text className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Reminder Time</Text>
                                <TouchableOpacity
                                    onPress={() => setShowTimePicker(true)}
                                    className={`rounded-xl px-6 py-5 flex-row items-center justify-between ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                                    style={{ elevation: isDark ? 0 : 2 }}
                                    activeOpacity={0.7}
                                >
                                    <View className="flex-row items-center">
                                        <Text style={{ fontSize: 24, marginRight: 12 }}>⏰</Text>
                                        <View>
                                            <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                                {formatTimeDisplay(reminderTime)}
                                            </Text>
                                            <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Tap to change
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className={`text-xl ${isDark ? 'text-purple-400' : 'text-purple-500'}`}>✏️</Text>
                                </TouchableOpacity>

                                {/* Time Picker Modal */}
                                {showTimePicker && (
                                    <View className={`mt-4 rounded-xl overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                                        <DateTimePicker
                                            value={getTimeAsDate()}
                                            mode="time"
                                            is24Hour={false}
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            onChange={handleTimeChange}
                                            themeVariant={isDark ? 'dark' : 'light'}
                                        />
                                        {Platform.OS === 'ios' && (
                                            <TouchableOpacity
                                                onPress={() => setShowTimePicker(false)}
                                                className="bg-purple-500 py-3 mx-4 mb-4 rounded-lg"
                                                activeOpacity={0.7}
                                            >
                                                <Text className="text-white text-center font-semibold">Done</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Recurring Toggle */}
                            <View
                                className={`mb-4 flex-row items-center justify-between rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800' : 'bg-white'}`}
                                style={{ elevation: isDark ? 0 : 2 }}
                            >
                                <View className="flex-1">
                                    <Text className={`font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Recurring Reminders</Text>
                                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Remind multiple times per day</Text>
                                </View>
                                <Switch
                                    value={recurring}
                                    onValueChange={setRecurring}
                                    trackColor={{ false: isDark ? "#475569" : "#d1d5db", true: "#8b5cf6" }}
                                    thumbColor={recurring ? "#a78bfa" : isDark ? "#94a3b8" : "#9ca3af"}
                                />
                            </View>

                            {/* Interval Selection - Using simple layout to avoid freeze */}
                            {recurring && (
                                <View className="mb-4">
                                    <Text className={`mb-3 font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>Reminder Interval</Text>
                                    <View className="flex-row flex-wrap">
                                        {INTERVAL_OPTIONS.map((option, index) => (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => handleIntervalSelect(option.value)}
                                                activeOpacity={0.7}
                                                style={{
                                                    backgroundColor: intervalMinutes === option.value
                                                        ? '#8b5cf6'
                                                        : isDark ? '#1e293b' : '#ffffff',
                                                    paddingHorizontal: 16,
                                                    paddingVertical: 12,
                                                    borderRadius: 8,
                                                    marginRight: 8,
                                                    marginBottom: 8,
                                                    elevation: intervalMinutes === option.value ? 0 : (isDark ? 0 : 2),
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        fontWeight: '500',
                                                        color: intervalMinutes === option.value
                                                            ? '#ffffff'
                                                            : isDark ? '#d1d5db' : '#374151',
                                                    }}
                                                >
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Summary */}
                            <View
                                className={`mb-6 rounded-lg px-4 py-4 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`}
                            >
                                <Text className={`mb-2 text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Summary</Text>
                                <Text className={isDark ? 'text-white' : 'text-slate-700'}>
                                    {recurring
                                        ? `You'll be reminded starting at ${formatTimeDisplay(reminderTime)}, then every ${INTERVAL_OPTIONS.find(i => i.value === intervalMinutes)?.label}.`
                                        : `You'll be reminded once at ${formatTimeDisplay(reminderTime)} daily.`}
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
                    className="rounded-lg bg-purple-500 py-4"
                    activeOpacity={0.7}
                >
                    <Text className="text-center text-lg font-semibold text-white">
                        Save Settings
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
