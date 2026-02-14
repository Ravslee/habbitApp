import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AboutScreenProps {
    onBack: () => void;
    isDark: boolean;
}

export default function AboutScreen({ onBack, isDark }: AboutScreenProps) {
    return (
        <View className={`flex-1 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <View className="flex-row items-center px-6 pt-6 pb-4">
                <TouchableOpacity
                    onPress={onBack}
                    className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}
                >
                    <Icon name="arrow-left" size={24} color={isDark ? '#FFF' : '#334155'} />
                </TouchableOpacity>
                <Text className={`ml-4 text-xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                    About Habik
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6">
                {/* Logo & Version */}
                <View className="items-center py-8">
                    <View className="h-24 w-24 items-center justify-center rounded-2xl bg-transparent mb-4 shadow-lg overflow-hidden">
                        <Image
                            source={require('../assets/logo.jpg')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                    <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                        Habik
                    </Text>
                    <Text className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Version 2.0.0
                    </Text>
                </View>

                {/* Description */}
                <View className={`mb-6 rounded-xl p-6 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <Text className={`mb-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                        Empowering Your Daily Growth
                    </Text>
                    <Text className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Habik is designed to help you build positive habits and break negative ones. We believe that small, consistent actions lead to significant changes over time.
                    </Text>
                    <View className="h-4" />
                    <Text className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        Whether you want to exercise more, read daily, or drink more water, Habik provides the tools you need to track your progress, stay motivated, and achieve your goals.
                    </Text>
                </View>

                {/* Key Values */}
                <View className={`mb-6 rounded-xl p-6 ${isDark ? 'bg-slate-800' : 'bg-white shadow-sm'}`}>
                    <Text className={`mb-4 text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-700'}`}>
                        Our Mission
                    </Text>
                    <Text className={`leading-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        To provide a simple, beautiful, and distraction-free environment for personal development. We prioritize user privacy and data security, ensuring that your journey remains yours alone.
                    </Text>
                </View>


                <View className="mt-4 mb-10 items-center">
                    <Text className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Developed by LightApps Studio
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}
