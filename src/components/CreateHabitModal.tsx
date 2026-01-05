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
                <View className="rounded-t-3xl bg-slate-800 px-6 pb-8 pt-6">
                    {/* Header */}
                    <View className="mb-6 flex-row items-center justify-between">
                        <Text className="text-xl font-bold text-white">
                            Create New Habit
                        </Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Text className="text-2xl text-gray-400">✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Habit Name Input */}
                    <View className="mb-6">
                        <Text className="mb-2 text-sm font-medium text-gray-400">
                            Habit Name
                        </Text>
                        <TextInput
                            className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 text-white"
                            placeholder="Enter habit name..."
                            placeholderTextColor="#9ca3af"
                            value={habitName}
                            onChangeText={setHabitName}
                        />
                    </View>

                    {/* Icon Selection */}
                    <View className="mb-6">
                        <Text className="mb-3 text-sm font-medium text-gray-400">
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
                                                ? "bg-blue-500"
                                                : "bg-slate-700"
                                            }`}
                                    >
                                        <Text className="text-2xl">{emoji}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Preview */}
                    <View className="mb-6 rounded-lg bg-slate-700 p-4">
                        <Text className="mb-2 text-xs text-gray-400">Preview</Text>
                        <View className="flex-row items-center gap-3">
                            <View className="h-12 w-12 items-center justify-center rounded-lg bg-slate-600">
                                <Text className="text-2xl">{selectedIcon}</Text>
                            </View>
                            <Text className="text-base font-medium text-white">
                                {habitName || "Your habit name"}
                            </Text>
                        </View>
                    </View>

                    {/* Create Button */}
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={!habitName.trim()}
                        className={`rounded-lg py-4 ${habitName.trim() ? "bg-blue-500" : "bg-slate-600"
                            }`}
                    >
                        <Text
                            className={`text-center text-base font-semibold ${habitName.trim() ? "text-white" : "text-gray-400"
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
