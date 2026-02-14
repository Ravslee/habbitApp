import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CreateHabitModal from "../components/CreateHabitModal";
import { Habit } from "../../App";

interface ManageHabitsScreenProps {
    habits: Habit[];
    onAddHabit: (habit: {
        name: string;
        icon: string;
        frequency: string;
        motivation: string;
        reminderTime: string;
        reminderEnabled: boolean;
        recurring: boolean;
        interval?: number;
    }) => void;
    onUpdateHabit: (id: number, updates: Partial<Habit> & {
        frequency?: string;
        motivation?: string;
        reminderTime?: string;
        reminderEnabled?: boolean;
        recurring?: boolean;
        interval?: number;
    }) => void;
    onDeleteHabit: (id: number) => void;
    onEditHabit: (habit: Habit) => void;
    onBack: () => void;
    isDark?: boolean;
}

export default function ManageHabitsScreen({ habits, onAddHabit, onUpdateHabit, onDeleteHabit, onEditHabit, onBack, isDark = true }: ManageHabitsScreenProps) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
    const [isPredefinedEdit, setIsPredefinedEdit] = useState(false);
    // const [focusedHabitName, setFocusedHabitName] = useState<string | null>(null);

    const templates = [
        { name: "Reading", icon: "book-open-variant", desc: "Develop a daily reading habit", color: "#fff", bg: "bg-primary/20" },
        { name: "Meditation", icon: "meditation", desc: "Improve calm and reduce stress", color: "#fff", bg: "bg-primary/20" },
        { name: "Exercise", icon: "dumbbell", desc: "Stay fit and healthy", color: "#fff", bg: "bg-primary/20" },
        { name: "Drink Water", icon: "water", desc: "Stay hydrated throughout the day", color: "#fff", bg: "bg-primary/20" },
        { name: "Sleep Early", icon: "bed", desc: "Get better rest and recovery", color: "#fff", bg: "bg-primary/20" },
        { name: "No Social Media", icon: "cellphone-off", desc: "Digital detox for focus", color: "#fff", bg: "bg-primary/20" },
        { name: "Journaling", icon: "notebook-edit", desc: "Reflect and write daily", color: "#fff", bg: "bg-primary/20" },
        { name: "Healthy Eating", icon: "food-apple", desc: "Eat nutritious meals", color: "#fff", bg: "bg-primary/20" },
    ];

    const openCreateModal = (habit?: Habit, isPredefined: boolean = false) => {
        setSelectedHabit(habit);
        setIsPredefinedEdit(isPredefined);
        setShowCreateModal(true);
    };

    const handleCreateOrUpdate = (habitData: any) => {
        if (selectedHabit && selectedHabit.id !== 0) {
            onUpdateHabit(selectedHabit.id, habitData);
        } else {
            onAddHabit(habitData);
        }
        setShowCreateModal(false);
        setSelectedHabit(undefined);
    };

    const addTemplateHabit = (name: string, icon: string) => {
        // Now opens the modal to let user configure reminders immediately
        // We pass it as a "new" habit but with preset name/icon
        // But wait, the prompt "do not let user edit name and icon" implies we treat it as editing a predefined template?
        // Actually, if it's NOT added, we are "creating" it from a template.
        // If it IS added, we are "editing" it.

        // Flow for adding new template habit:
        // Open modal, pre-fill Name/Icon, Lock Name/Icon, let user set reminders, then Add.
        // We can simulate this by passing initial data but no ID (so it's an add).

        // But the requirement says "on click of predefined habits... let him other things on create habbit screen... configure reminders on existing habbits also".
        // So this applies to BOTH adding and editing.

        // Logic check:
        // If I click "Reading" (not added): Open Modal, Name="Reading" (Locked), Icon="book" (Locked), User sets time -> Save -> onAddHabit.
        // If I click "Reading" (added): Open Modal, Name="Reading" (Locked), Icon="book" (Locked), User updates time -> Save -> onUpdateHabit.

        // So I need a way to pass "Locked" state to modal. `isPredefined` prop does this.

        // For adding:
        setSelectedHabit(undefined); // No ID, so it's a new habit
        // We need to pass the initial values. The Modal needs `initialValues` prop maybe?
        // Or I can just pass a dummy Habit object with id=0 or similar to signal "use these values".
        // Let's refine `openCreateModal` to take `initialData`.
    };

    const handleDeleteHabitAlert = (habit: Habit) => {
        Alert.alert(
            "Delete Habit",
            `Are you sure you want to delete "${habit.name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => onDeleteHabit(habit.id) },
            ]
        );
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Header */}
                <View className="px-6 pt-6 pb-2 flex-row items-center">
                    <TouchableOpacity onPress={onBack}>
                        <Icon name="chevron-left" size={28} color={isDark ? "#FFF" : "#374151"} />
                    </TouchableOpacity>
                    <Text className={`text-xl font-bold flex-1 text-center mr-7 ${isDark ? 'text-white' : 'text-gray-900'}`}>Manage Habits</Text>
                </View>

                {/* Create Your Own */}
                <View className="mx-6 mt-6 mb-8">
                    <TouchableOpacity
                        className="rounded-2xl bg-primary py-4 shadow-lg shadow-primary/20"
                        onPress={() => openCreateModal(undefined, false)}
                    >
                        <Text className="text-center text-lg font-bold text-white">
                            + Create Your Own Habit
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* My Habits Section */}
                {habits.length > 0 && (
                    <View className="mx-6 mt-6 mb-2">
                        <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3 ml-1">
                            MY HABITS
                        </Text>
                        <View className="flex-row flex-wrap justify-between">
                            {habits.map((habit) => {
                                const isTemplate = templates.some(t => t.name === habit.name);
                                const template = templates.find(t => t.name === habit.name);

                                return (
                                    <TouchableOpacity
                                        key={habit.id}
                                        style={{ width: '48%', aspectRatio: 1 }}
                                        className={`border rounded-3xl p-4 mb-4 justify-between ${isDark ? 'bg-[#1e1e20] border-[#22c55e]' : 'bg-white border-green-500 shadow-sm'}`}
                                        onPress={() => openCreateModal(habit, isTemplate)}
                                        activeOpacity={0.7}
                                    >
                                        <View className="flex-row justify-end">
                                            <TouchableOpacity onPress={() => handleDeleteHabitAlert(habit)}>
                                                <View className={`h-8 w-8 items-center justify-center rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                    <Icon name="trash-can-outline" size={18} color="#ef4444" />
                                                </View>
                                            </TouchableOpacity>
                                        </View>

                                        <View className="items-center justify-center flex-1">
                                            <View className={`h-12 w-12 items-center justify-center rounded-full mb-2 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                                                <Icon
                                                    name={habit.icon}
                                                    size={24}
                                                    color="#22c55e"
                                                />
                                            </View>
                                            <Text
                                                numberOfLines={1}
                                                className={`text-base text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                                            >
                                                {habit.name}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* All Habits (Templates) Section */}
                <View className="mx-6 mt-4 mb-8">
                    <Text className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-3 ml-1">
                        ALL HABITS
                    </Text>

                    <View className="flex-row flex-wrap justify-between">
                        {templates.filter(t => !habits.some(h => h.name === t.name)).map((template) => (
                            <TouchableOpacity
                                key={template.name}
                                style={{ width: '48%', aspectRatio: 1 }}
                                className={`border rounded-3xl p-4 mb-4 justify-between ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200 shadow-sm'}`}
                                onPress={() => {
                                    const tempHabit = {
                                        id: 0,
                                        name: template.name,
                                        icon: template.icon,
                                        completed: false,
                                    } as Habit;
                                    openCreateModal(tempHabit, true);
                                }}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row justify-end">
                                    <View className={`h-8 w-8 items-center justify-center rounded-full ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-100'}`}>
                                        <Icon name="plus" size={18} color={isDark ? '#FFF' : '#334155'} />
                                    </View>
                                </View>

                                <View className="items-center justify-center flex-1">
                                    <View className={`h-12 w-12 items-center justify-center rounded-full ${template.bg} mb-2`}>
                                        <Icon
                                            name={template.icon}
                                            size={24}
                                            color={template.color}
                                        />
                                    </View>
                                    <Text
                                        numberOfLines={1}
                                        className={`text-base text-center font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        {template.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Bottom spacing */}
                <View className="h-6" />
            </ScrollView>

            {/* Create Habit Modal */}
            <CreateHabitModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreateHabit={handleCreateOrUpdate}
                isDark={isDark}
                initialHabit={selectedHabit}
                isPredefined={isPredefinedEdit}
            />
        </View>
    );
}
