import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import CreateHabitModal from "../components/CreateHabitModal";
import { Habit } from "../../App";

interface ManageHabitsScreenProps {
    habits: Habit[];
    onAddHabit: (habit: { name: string; icon: string }) => void;
    onDeleteHabit: (id: number) => void;
    onEditHabit: (habit: Habit) => void;
    onBack: () => void;
    isDark?: boolean;
}

export default function ManageHabitsScreen({ habits, onAddHabit, onDeleteHabit, onEditHabit, onBack, isDark = true }: ManageHabitsScreenProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);

    const addTemplateHabit = (name: string, icon: string) => {
        Alert.alert(
            "Add Habit",
            `Do you want to add "${name}" to your daily habits?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Add",
                    onPress: () => {
                        onAddHabit({ name, icon });
                    },
                },
            ]
        );
    };

    const handleDeleteHabit = (habit: Habit) => {
        Alert.alert(
            "Delete Habit",
            `Are you sure you want to delete "${habit.name}"?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        onDeleteHabit(habit.id);
                    },
                },
            ]
        );
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6 pb-4 flex-row items-center gap-4">
                    <TouchableOpacity onPress={onBack}>
                        <Text className={`text-2xl ${isDark ? 'text-white' : 'text-slate-900'}`}>←</Text>
                    </TouchableOpacity>
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Manage Habits</Text>
                </View>

                {/* Create Your Own */}
                <View className="mx-6 mb-6">
                    <TouchableOpacity
                        className="rounded-lg bg-blue-500 py-4"
                        onPress={() => setShowCreateModal(true)}
                    >
                        <Text className="text-center text-lg font-semibold text-white">
                            + Create Your Own Habit
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Current Habits Section */}
                {habits.length > 0 && (
                    <View className="mx-6 mb-6">
                        <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Your Habits ({habits.length})
                        </Text>
                        <View className="gap-2">
                            {habits.map((habit) => (
                                <View
                                    key={habit.id}
                                    className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                                >
                                    <View className={`h-10 w-10 items-center justify-center rounded-lg ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                                        <Text className="text-xl">{habit.icon}</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {habit.name}
                                        </Text>
                                        {habit.notification?.enabled && (
                                            <Text className="text-xs text-blue-400">
                                                🔔 Reminder set
                                            </Text>
                                        )}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => onEditHabit(habit)}
                                        className="h-8 w-8 items-center justify-center rounded-full bg-blue-500/20"
                                    >
                                        <Text className="text-blue-400">⚙️</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDeleteHabit(habit)}
                                        className="h-8 w-8 items-center justify-center rounded-full bg-red-500/20"
                                    >
                                        <Text className="text-red-400">✕</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Templates Section */}
                <View className="mx-6 mb-6">
                    <Text className={`mb-4 text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Quick Add Templates
                    </Text>
                    <Text className={`mb-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Tap any template to add it to your daily habits
                    </Text>

                    {/* Template Habits */}
                    <View className="gap-3">
                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Reading", "📖")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-amber-500/20">
                                <Text className="text-2xl">📖</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Reading</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Develop a daily reading habit
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Meditation", "🧘")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                                <Text className="text-2xl">🧘</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Meditation</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Improve calm and reduce stress
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Exercise", "💪")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-red-500/20">
                                <Text className="text-2xl">💪</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Exercise</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Stay fit and healthy
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Drink Water", "💧")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                                <Text className="text-2xl">💧</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Drink Water</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Stay hydrated throughout the day
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Sleep Early", "😴")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                                <Text className="text-2xl">😴</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Sleep Early</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Get better rest and recovery
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("No Social Media", "📵")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-pink-500/20">
                                <Text className="text-2xl">📵</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>No Social Media</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Digital detox for focus
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Journaling", "📝")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                                <Text className="text-2xl">📝</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Journaling</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Reflect and write daily
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className={`flex-row items-center gap-3 rounded-lg px-4 py-3 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                            onPress={() => addTemplateHabit("Healthy Eating", "🥗")}
                        >
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-lime-500/20">
                                <Text className="text-2xl">🥗</Text>
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>Healthy Eating</Text>
                                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Eat nutritious meals
                                </Text>
                            </View>
                            <Text className="text-xl text-blue-400">+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Bottom spacing */}
                <View className="h-6" />
            </ScrollView>

            {/* Create Habit Modal */}
            <CreateHabitModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateHabit={onAddHabit}
                isDark={isDark}
            />
        </View>
    );
}
