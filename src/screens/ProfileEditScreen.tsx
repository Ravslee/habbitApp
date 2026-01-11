import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { UserProfile } from "../../App";

interface ProfileEditScreenProps {
    userProfile: UserProfile;
    onSave: (updates: Partial<UserProfile>) => void;
    onBack: () => void;
    isDark: boolean;
}

export default function ProfileEditScreen({
    userProfile,
    onSave,
    onBack,
    isDark,
}: ProfileEditScreenProps) {
    const [name, setName] = useState(userProfile.name);
    const [dob, setDob] = useState(userProfile.dob);

    const isValidDate = (dateString: string) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return regex.test(dateString);
    };

    const hasChanges = name !== userProfile.name || dob !== userProfile.dob;
    const isValid = name.trim().length > 0 && isValidDate(dob);
    const canSave = hasChanges && isValid;

    const handleSave = () => {
        if (canSave) {
            onSave({ name: name.trim(), dob });
            onBack();
        }
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View className="flex-row items-center px-6 pt-6 pb-4">
                        <TouchableOpacity
                            onPress={onBack}
                            className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                        >
                            <Text className={`text-xl ${isDark ? 'text-white' : 'text-slate-700'}`}>←</Text>
                        </TouchableOpacity>
                        <Text className={`ml-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            Edit Profile
                        </Text>
                    </View>

                    {/* Avatar Section */}
                    <View className="items-center py-6">
                        <View className="h-24 w-24 items-center justify-center rounded-full border-3 border-purple-400 bg-purple-500/20">
                            <Text className="text-4xl">👤</Text>
                        </View>
                        <TouchableOpacity className="mt-3">
                            <Text className="text-purple-500 font-semibold">Change Photo</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Form Fields */}
                    <View className="px-6">
                        {/* Name Field */}
                        <View className="mb-5">
                            <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Name
                            </Text>
                            <TextInput
                                className={`rounded-xl border px-4 py-4 text-base ${isDark
                                    ? 'border-slate-600 bg-slate-800 text-white'
                                    : 'border-gray-200 bg-white text-slate-700'
                                    }`}
                                placeholder="Enter your name"
                                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                            {name.trim().length === 0 && (
                                <Text className="mt-1 text-xs text-red-500">Name is required</Text>
                            )}
                        </View>

                        {/* Date of Birth Field */}
                        <View className="mb-5">
                            <Text className={`mb-2 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                Date of Birth
                            </Text>
                            <TextInput
                                className={`rounded-xl border px-4 py-4 text-base ${isDark
                                    ? 'border-slate-600 bg-slate-800 text-white'
                                    : 'border-gray-200 bg-white text-slate-700'
                                    }`}
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                                value={dob}
                                onChangeText={(text) => {
                                    // Auto-format with slashes
                                    let formatted = text.replace(/\D/g, '');
                                    if (formatted.length > 2) {
                                        formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
                                    }
                                    if (formatted.length > 5) {
                                        formatted = formatted.slice(0, 5) + '/' + formatted.slice(5, 9);
                                    }
                                    setDob(formatted);
                                }}
                                keyboardType="numeric"
                                maxLength={10}
                            />
                            <Text className={`mt-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Format: DD/MM/YYYY
                            </Text>
                        </View>
                    </View>

                    {/* Spacer */}
                    <View className="flex-1" />

                    {/* Save Button */}
                    <View className="px-6 pb-8">
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={!canSave}
                            className={`rounded-xl py-4 ${canSave
                                ? 'bg-purple-500'
                                : isDark ? 'bg-slate-700' : 'bg-gray-200'
                                }`}
                        >
                            <Text
                                className={`text-center text-lg font-semibold ${canSave
                                    ? 'text-white'
                                    : isDark ? 'text-gray-500' : 'text-gray-400'
                                    }`}
                            >
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
