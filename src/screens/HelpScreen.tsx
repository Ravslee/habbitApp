import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface HelpScreenProps {
    onBack: () => void;
    isDark: boolean;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    icon: string;
}

export default function HelpScreen({ onBack, isDark }: HelpScreenProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const insets = useSafeAreaInsets();

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const faqs: FAQItem[] = [
        {
            id: '1',
            question: "Creating Habits",
            answer: "To create a habit, go to Profile > Manage Habits. Tap '+ Create Your Own Habit' or select a template to get started.",
            icon: 'plus-circle'
        },
        {
            id: '2',
            question: "Tracking Progress",
            answer: "On the Home screen, simply tap a habit card to mark it as complete for the day. Tap it again to undo.",
            icon: 'check-circle'
        },
        {
            id: '3',
            question: "Viewing Statistics",
            answer: "Navigate to the Statistics tab to view detailed insights. You can see your completion rates, streaks, and monthly performance for each habit.",
            icon: 'chart-bar'
        },
        {
            id: '4',
            question: "Setting Reminders",
            answer: "Go to Profile > Manage Habits and click on any habit to edit it. You can enable reminders and set a specific time.",
            icon: 'bell'
        },
        {
            id: '5',
            question: "Deleting Habits",
            answer: "In the Manage Habits screen, click the trash icon on any habit card to permanently delete it.",
            icon: 'trash-can-outline'
        },
        {
            id: '6',
            question: "Dark Mode",
            answer: "You can toggle Dark Mode on or off in the Profile screen under the 'Appearance' section.",
            icon: 'theme-light-dark'
        }
    ];

    return (
        <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
            {/* Header */}
            <View className="flex-row items-center px-6 pt-6 pb-4">
                <TouchableOpacity
                    onPress={onBack}
                    className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-[#1e1e20]' : 'bg-white shadow-sm'}`}
                >
                    <Icon name="chevron-left" size={24} color={isDark ? '#FFF' : '#334155'} />
                </TouchableOpacity>
                <Text className={`ml-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    Help & Support
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                <Text className={`mb-6 text-base ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Everything you need to know about using Habik.
                </Text>

                {faqs.map((faq) => (
                    <View
                        key={faq.id}
                        className={`mb-4 rounded-xl overflow-hidden ${isDark ? 'bg-[#1e1e20]' : 'bg-white shadow-sm'}`}
                    >
                        <TouchableOpacity
                            onPress={() => toggleExpand(faq.id)}
                            className="flex-row items-center justify-between p-4"
                            activeOpacity={0.7}
                        >
                            <View className="flex-row items-center flex-1 pr-4">
                                <View className={`h-8 w-8 items-center justify-center rounded-full mr-3 ${isDark ? 'bg-[#1e1e20]' : 'bg-primary/10'}`}>
                                    <Icon name={faq.icon} size={16} color={isDark ? '#8b56fc' : '#8b56fc'} />
                                </View>
                                <Text className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                                    {faq.question}
                                </Text>
                            </View>
                            <Icon
                                name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                                size={20}
                                color={isDark ? '#94a3b8' : '#9ca3af'}
                            />
                        </TouchableOpacity>

                        {expandedId === faq.id && (
                            <View className={`px-4 pb-4 pt-0`}>
                                <View className={`h-[1px] w-full mb-3 ${isDark ? 'bg-[#1e1e20]' : 'bg-gray-100'}`} />
                                <Text className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {faq.answer}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}

                {/* Additional Help Contact (Optional presentation) */}
                <View className={`mt-4 mb-10 rounded-xl p-6 ${isDark ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <Text className={`mb-2 text-center font-semibold ${isDark ? 'text-primary' : 'text-primary'}`}>
                        Still need help?
                    </Text>
                    <Text className={`text-center text-sm ${isDark ? 'text-primary' : 'text-primary'}`}>
                        Contact us at studio.lighty@gmail.com
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
