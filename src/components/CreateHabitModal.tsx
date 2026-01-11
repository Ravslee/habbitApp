import React, { useState } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Pressable,
} from "react-native";

interface CreateHabitModalProps {
    visible: boolean;
    onClose: () => void;
    onCreateHabit: (habit: { name: string; icon: string }) => void;
    isDark?: boolean;
}

const EMOJI_OPTIONS = [
    "📚", "💪", "🧘", "⚽", "🏃", "🥗", "💧", "😴",
    "📝", "🎯", "🎨", "🎵", "💻", "🏋️", "🚴", "🧠",
    "☀️", "🌙", "❤️", "✨", "🔥", "⭐", "🏆", "💡",
];

export default function CreateHabitModal({
    visible,
    onClose,
    onCreateHabit,
    isDark = true,
}: CreateHabitModalProps) {
    const [habitName, setHabitName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("📚");

    const handleCreate = () => {
        if (habitName.trim()) {
            onCreateHabit({
                name: habitName.trim(),
                icon: selectedIcon,
            });
            setHabitName("");
            setSelectedIcon("📚");
            onClose();
        }
    };

    const handleClose = () => {
        setHabitName("");
        setSelectedIcon("📚");
        onClose();
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className={`rounded-t-3xl px-6 pb-8 pt-6 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
                    {/* Header */}
                    <View className="mb-6 flex-row items-center justify-between">
                        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            Create New Habit
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Text className={`text-2xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Habit Name Input */}
                    <View className="mb-6">
                        <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Habit Name
                        </Text>
                        <TextInput
                            className={`rounded-lg border px-4 py-3 ${isDark
                                ? 'border-slate-600 bg-slate-700 text-white'
                                : 'border-gray-300 bg-gray-50 text-slate-700'
                                }`}
                            placeholder="Enter habit name..."
                            placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
                            value={habitName}
                            onChangeText={setHabitName}
                        />
                    </View>

                    {/* Icon Selection */}
                    <View className="mb-6">
                        <Text className={`mb-3 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Choose Icon
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-row"
                        >
                            <View className="flex-row flex-wrap gap-2">
                                {EMOJI_OPTIONS.map((emoji, index) => (
                                    <Pressable
                                        key={index}
                                        onPress={() => setSelectedIcon(emoji)}
                                        className={`h-12 w-12 items-center justify-center rounded-lg ${selectedIcon === emoji
                                            ? "bg-purple-500"
                                            : isDark ? "bg-slate-700" : "bg-gray-100"
                                            }`}
                                    >
                                        <Text className="text-2xl">{emoji}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Preview */}
                    <View className={`mb-6 rounded-lg p-4 ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                        <Text className={`mb-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Preview</Text>
                        <View className="flex-row items-center gap-3">
                            <View className={`h-12 w-12 items-center justify-center rounded-lg ${isDark ? 'bg-slate-600' : 'bg-white'}`}>
                                <Text className="text-2xl">{selectedIcon}</Text>
                            </View>
                            <Text className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                {habitName || "Your habit name"}
                            </Text>
                        </View>
                    </View>

                    {/* Create Button */}
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={!habitName.trim()}
                        className={`rounded-lg py-4 ${habitName.trim()
                            ? "bg-purple-500"
                            : isDark ? "bg-slate-600" : "bg-gray-300"
                            }`}
                    >
                        <Text
                            className={`text-center text-base font-semibold ${habitName.trim()
                                ? "text-white"
                                : isDark ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            Create Habit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
