import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

interface TermsScreenProps {
    onBack: () => void;
    isDark: boolean;
}

export default function TermsScreen({ onBack, isDark }: TermsScreenProps) {
    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: "By downloading, installing, or using the Habik app, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the app."
        },
        {
            title: "2. Description of Service",
            content: "Habik is a habit tracking application designed to help users build and maintain positive habits. The app allows you to create habits, track your progress, and view statistics about your habit completion."
        },
        {
            title: "3. User Data and Privacy",
            content: "All your habit data is stored locally on your device. We do not collect, store, or share your personal information or habit data on any external servers. Your data remains private and under your control."
        },
        {
            title: "4. User Responsibilities",
            content: "You are responsible for maintaining the confidentiality of your device and any data stored within the app. You agree to use the app only for lawful purposes and in accordance with these terms."
        },
        {
            title: "5. Intellectual Property",
            content: "The Habik app, including its design, graphics, and content, is protected by intellectual property laws. You may not copy, modify, distribute, or reverse engineer any part of the app without prior written consent."
        },
        {
            title: "6. Disclaimer of Warranties",
            content: "The app is provided 'as is' without warranties of any kind. We do not guarantee that the app will be error-free, uninterrupted, or meet your specific requirements. Use of the app is at your own risk."
        },
        {
            title: "7. Limitation of Liability",
            content: "To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app."
        },
        {
            title: "8. Modifications",
            content: "We reserve the right to modify these Terms and Conditions at any time. Continued use of the app after any changes constitutes acceptance of the new terms."
        },
        {
            title: "9. Termination",
            content: "We reserve the right to terminate or suspend access to the app at any time without notice for conduct that violates these terms or is harmful to other users."
        },
        {
            title: "10. Contact",
            content: "If you have any questions about these Terms and Conditions, please contact us at studio.lighty@gmail.com"
        }
    ];

    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View className="flex-row items-center px-6 pt-6 pb-4">
                <TouchableOpacity
                    onPress={onBack}
                    className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                >
                    <Text className={`text-xl ${isDark ? 'text-white' : 'text-slate-700'}`}>←</Text>
                </TouchableOpacity>
                <Text className={`ml-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    Terms and Conditions
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-6"
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Last Updated */}
                <Text className={`mb-6 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Last Updated: January 2026
                </Text>

                {/* Intro */}
                <Text className={`mb-6 text-base leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Welcome to Habik. Please read these Terms and Conditions carefully before using our app.
                </Text>

                {/* Sections */}
                {sections.map((section, index) => (
                    <View key={index} className="mb-5">
                        <Text className={`mb-2 text-base font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                            {section.title}
                        </Text>
                        <Text className={`text-sm leading-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {section.content}
                        </Text>
                    </View>
                ))}

                {/* Footer */}
                <View className={`mt-6 rounded-lg p-4 ${isDark ? 'bg-slate-800' : 'bg-purple-50'}`}>
                    <Text className={`text-center text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        By using Habik, you acknowledge that you have read and understood these Terms and Conditions.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
