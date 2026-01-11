import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Platform,
} from "react-native";

interface OnboardingScreenProps {
    onComplete: (profile: { name: string; dob: string }) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [step, setStep] = useState(1);

    const handleContinue = () => {
        if (step === 1 && name.trim()) {
            setStep(2);
        } else if (step === 2 && dob.trim()) {
            onComplete({ name: name.trim(), dob: dob.trim() });
        }
    };

    const isValidDate = (dateString: string) => {
        // Simple validation for DD/MM/YYYY format
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return regex.test(dateString);
    };

    const canContinue = step === 1 ? name.trim().length > 0 : isValidDate(dob);

    return (
        <View className="flex-1 bg-slate-900">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Progress Indicator */}
                <View className="px-6 pt-12">
                    <View className="flex-row gap-2">
                        <View className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-slate-700'}`} />
                        <View className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-slate-700'}`} />
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6 pt-12">
                    {step === 1 ? (
                        <>
                            {/* Step 1: Name */}
                            <Text className="text-3xl font-bold text-white">
                                Welcome to{"\n"}Habbit! 👋
                            </Text>
                            <Text className="mt-4 text-base text-gray-400">
                                Let's start by getting to know you better.
                            </Text>

                            <View className="mt-8">
                                <Text className="mb-2 text-sm font-medium text-gray-400">
                                    What should we call you?
                                </Text>
                                <TextInput
                                    className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-4 text-lg text-white"
                                    placeholder="Enter your name"
                                    placeholderTextColor="#6b7280"
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                    autoCapitalize="words"
                                />
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Step 2: Date of Birth */}
                            <Text className="text-3xl font-bold text-white">
                                Hi, {name}! 🎉
                            </Text>
                            <Text className="mt-4 text-base text-gray-400">
                                When were you born? This helps us personalize your experience.
                            </Text>

                            <View className="mt-8">
                                <Text className="mb-2 text-sm font-medium text-gray-400">
                                    Date of Birth
                                </Text>
                                <TextInput
                                    className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-4 text-lg text-white"
                                    placeholder="DD/MM/YYYY"
                                    placeholderTextColor="#6b7280"
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
                                    autoFocus
                                />
                                <Text className="mt-2 text-xs text-gray-500">
                                    Format: DD/MM/YYYY
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                {/* Bottom Button */}
                <View className="px-6 pb-8">
                    {step === 2 && (
                        <TouchableOpacity
                            onPress={() => setStep(1)}
                            className="mb-3"
                        >
                            <Text className="text-center text-purple-400">← Go back</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleContinue}
                        disabled={!canContinue}
                        className={`rounded-xl py-4 ${canContinue ? 'bg-purple-500' : 'bg-slate-700'
                            }`}
                    >
                        <Text
                            className={`text-center text-lg font-semibold ${canContinue ? 'text-white' : 'text-gray-500'
                                }`}
                        >
                            {step === 1 ? 'Continue' : 'Get Started'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
