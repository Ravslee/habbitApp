import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
    PermissionsAndroid,
} from "react-native";
import { launchImageLibrary, launchCamera, ImagePickerResponse } from "react-native-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    const [profileImage, setProfileImage] = useState<string | undefined>(userProfile.profileImage);

    const insets = useSafeAreaInsets();

    const isValidDate = (dateString: string) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return regex.test(dateString);
    };

    const hasChanges = name !== userProfile.name || dob !== userProfile.dob || profileImage !== userProfile.profileImage;
    const isValid = name.trim().length > 0 && isValidDate(dob);
    const canSave = hasChanges && isValid;

    const handleImageResponse = (response: ImagePickerResponse) => {
        if (response.didCancel) return;
        if (response.errorCode) {
            Alert.alert('Error', response.errorMessage || 'Failed to pick image');
            return;
        }
        if (response.assets && response.assets[0]?.uri) {
            setProfileImage(response.assets[0].uri);
        }
    };

    const requestCameraPermission = async (): Promise<boolean> => {
        if (Platform.OS !== 'android') return true;

        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'This app needs access to your camera to take profile photos.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const requestGalleryPermission = async (): Promise<boolean> => {
        if (Platform.OS !== 'android') return true;

        try {
            // Android 13+ uses READ_MEDIA_IMAGES, older versions use READ_EXTERNAL_STORAGE
            const permission = Platform.Version >= 33
                ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

            const granted = await PermissionsAndroid.request(permission, {
                title: 'Gallery Permission',
                message: 'This app needs access to your photos to select a profile picture.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const handleTakePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
            return;
        }
        launchCamera(
            { mediaType: 'photo', quality: 0.8, maxWidth: 500, maxHeight: 500 },
            handleImageResponse
        );
    };

    const handleChooseFromGallery = async () => {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) {
            Alert.alert('Permission Denied', 'Gallery permission is required to select photos.');
            return;
        }
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.8, maxWidth: 500, maxHeight: 500 },
            handleImageResponse
        );
    };

    const handleChangePhoto = () => {
        Alert.alert(
            'Change Photo',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: handleTakePhoto },
                { text: 'Choose from Gallery', onPress: handleChooseFromGallery },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    const handleSave = () => {
        if (canSave) {
            onSave({ name: name.trim(), dob, profileImage });
            onBack();
        }
    };

    return (
        <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}
            style={{ paddingTop: Math.max(insets.top, 0) }}
        >
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
                    <View className="flex-row items-center px-6 pt-0 pb-0">
                        <TouchableOpacity
                            onPress={onBack}
                            className={`h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-[#1e1e20]' : 'bg-white shadow-sm'}`}
                        >
                            <Icon name="chevron-left" size={24} color={isDark ? '#FFF' : '#334155'} />
                        </TouchableOpacity>
                        <Text className={`ml-4 text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Edit Profile
                        </Text>
                    </View>

                    {/* Avatar Section */}
                    <View className="items-center py-6">
                        <View className="h-24 w-24 items-center justify-center rounded-full border-3 border-primary bg-primary/20 overflow-hidden">
                            {profileImage ? (
                                <Image
                                    source={{ uri: profileImage }}
                                    className="h-full w-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <Icon name="account" size={48} color={isDark ? '#FFF' : '#334155'} />
                            )}
                        </View>
                        <TouchableOpacity className="mt-3" onPress={handleChangePhoto}>
                            <Text className="text-primary font-semibold">Change Photo</Text>
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
                    <View className="px-6 mb-6" style={{ paddingBottom: Math.max(insets.bottom, 32) }}>
                        <TouchableOpacity
                            onPress={handleSave}
                            disabled={!canSave}
                            className={`rounded-xl py-4 ${canSave
                                ? 'bg-[#8b56fc]'
                                : isDark ? 'bg-[#1e1e20]' : 'bg-gray-200'
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
