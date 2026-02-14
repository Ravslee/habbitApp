import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Switch,
    Dimensions,
    Platform,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from "@react-native-community/datetimepicker";

interface CreateHabitModalProps {
    visible: boolean;
    onClose: () => void;
    onCreateHabit: (habit: {
        name: string;
        icon: string;
        frequency: string;
        motivation: string;
        reminderTime: string; // Format: "HH:MM" 24h
        reminderEnabled: boolean;
        recurring: boolean;
        interval?: number;
    }) => void;
    isDark?: boolean;
    initialHabit?: any;
    isPredefined?: boolean;
}

const ICON_OPTIONS = [
    // Water/Health
    "water", "meditation", "dumbbell", "book-open-variant",
    // Night/Day
    "weather-night", "weather-sunny", "silverware-fork-knife", "dots-horizontal",
    // General
    "run", "yoga", "bike", "walk",
    "leaf", "brain", "briefcase", "calendar-check"
];

const FREQUENCIES = ["Daily", "Weekly", "Monthly"];
const RECURRING_INTERVALS = [5, 10, 15, 30, 45, 60];

const { width } = Dimensions.get("window");

const IconOption = React.memo(({ iconName, isSelected, onSelect, isDark }: { iconName: string, isSelected: boolean, onSelect: (icon: string) => void, isDark: boolean }) => {
    return (
        <TouchableOpacity
            onPress={() => onSelect(iconName)}
            activeOpacity={0.7}
            style={{ width: '22%', height: '22%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}
            className={`rounded-2xl border-2 ${isSelected
                ? "bg-[#8b56fc] border-[#a78bfa]"
                : isDark ? "bg-[#1e1e20] border-[#2c2c2e]" : "bg-white border-gray-200"
                }`}
        >
            <Icon
                name={iconName}
                size={24}
                color={isSelected ? "#FFF" : isDark ? "#6b7280" : "#9ca3af"}
                style={{ textAlign: 'center' }}
            />
        </TouchableOpacity>
    );
});

export default function CreateHabitModal({ visible, onClose, onCreateHabit, isDark = true, initialHabit, isPredefined = false }: CreateHabitModalProps) {
    const [habitName, setHabitName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("star");
    const [frequency, setFrequency] = useState("Everyday");
    const [motivation, setMotivation] = useState("");

    // Time Picker State
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState(new Date()); // Internal Date object
    const [showTimePicker, setShowTimePicker] = useState(false);

    // Time Display helper
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");
    const [isAm, setIsAm] = useState(true);

    // Recurring Reminder State
    const [recurring, setRecurring] = useState(false);
    const [interval, setInterval] = useState(15);

    // Load initial state when modal opens
    useEffect(() => {
        if (visible) {
            if (initialHabit) {
                setHabitName(initialHabit.name || "");
                setSelectedIcon(initialHabit.icon || "star");
                setFrequency(initialHabit.frequency || "Everyday"); // Assuming habit object has this, if not default
                setMotivation(initialHabit.motivation || "");

                // Notification settings
                if (initialHabit.notification) {
                    setReminderEnabled(initialHabit.notification.enabled);
                    setRecurring(initialHabit.notification.recurring);
                    setInterval(initialHabit.notification.intervalMinutes || 15);

                    if (initialHabit.notification.reminderTime) {
                        const [hStr, mStr] = initialHabit.notification.reminderTime.split(':');
                        const h = parseInt(hStr);
                        const m = parseInt(mStr);
                        const date = new Date();
                        date.setHours(h, m, 0, 0);
                        setReminderTime(date);

                        // Update display values
                        const isPm = h >= 12;
                        const displayHour = h % 12 || 12;
                        setHour(displayHour.toString().padStart(2, '0'));
                        setMinute(m.toString().padStart(2, '0'));
                        setIsAm(!isPm);
                    }
                } else {
                    // Default defaults if no notification set
                    setReminderEnabled(false);
                }
            } else {
                // Reset to defaults
                setHabitName("");
                setSelectedIcon("star");
                setFrequency("Everyday");
                setMotivation("");
                setReminderEnabled(false);
                setRecurring(false);
                setInterval(15);

                const now = new Date();
                now.setHours(9, 0, 0, 0);
                setReminderTime(now);
                setHour("09");
                setMinute("00");
                setIsAm(true);
            }
        }
    }, [visible, initialHabit]);

    // Helper to format time for display (e.g., "9:00 AM")
    const formatTimeDisplay = (date: Date) => {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const handleCreate = () => {
        if (!habitName.trim()) return;

        // Format time to "HH:MM"
        const hours = reminderTime.getHours().toString().padStart(2, '0');
        const minutes = reminderTime.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        onCreateHabit({
            name: habitName.trim(),
            icon: selectedIcon,
            frequency,
            motivation,
            reminderTime: timeString,
            reminderEnabled,
            recurring,
            interval: recurring ? interval : undefined,
        });

        // Reset and close is handled by parent or effect, but usually good to reset or onClose does it.
        // onClose(); // Parent handles logic then closes
    };

    const handleClose = () => {
        // resetForm(); // Resetting is now handled by useEffect when visible becomes false or initialHabit changes
        onClose();
    };

    const resetForm = () => {
        setHabitName("");
        setSelectedIcon("star");
        setFrequency("Everyday");
        setMotivation("");
        setReminderEnabled(false);
        setRecurring(false);
        setInterval(15);
        const now = new Date();
        now.setHours(9, 0, 0, 0);
        setReminderTime(now);
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View className={`flex-1 ${isDark ? 'bg-[#0f0f11]' : 'bg-gray-50'}`}>
                {/* Header */}
                <View className="px-6 pt-6 pb-2 flex-row items-center justify-between">
                    <TouchableOpacity onPress={onClose} className="p-2 -ml-2">
                        <Icon name="close" size={28} color={isDark ? "#FFF" : "#374151"} />
                    </TouchableOpacity>
                    <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {initialHabit ? initialHabit.name : "New Habit"}
                    </Text>
                    <TouchableOpacity
                        onPress={handleCreate}
                        disabled={!habitName.trim()}
                        className={`p-2 -mr-2 ${!habitName.trim() ? "opacity-50" : "opacity-100"}`}
                    >
                        <Icon name="check" size={28} color={habitName.trim() ? "#8b56fc" : "#6b7280"} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6 mt-4" contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Habit Name Input */}
                    {!isPredefined && <View className="mb-8">
                        <Text className="text-[#8b56fc] text-xs font-bold tracking-widest uppercase mb-2">
                            HABIT NAME
                        </Text>
                        <TextInput
                            className={`text-3xl font-bold border-b pb-2 ${isDark ? 'text-white border-[#2c2c2e]' : 'text-gray-900 border-gray-200'}`}
                            placeholder="e.g., Drink Water"
                            placeholderTextColor={isDark ? "#4b5563" : "#9ca3af"}
                            value={habitName}
                            onChangeText={setHabitName}
                            editable={!initialHabit || !isPredefined} // Lock if predefined template edit
                            selectionColor="#8b56fc"
                        />
                    </View>}


                    {/* Icon Selection */}
                    {!isPredefined && <View className="mb-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-[#8b56fc] text-xs font-bold tracking-widest uppercase">
                                ICON
                            </Text>
                            <Text className="text-gray-500 text-xs">Select identity</Text>
                        </View>

                        <View className="flex-row flex-wrap justify-between gap-y-4">
                            {ICON_OPTIONS.slice(0, 16).map((iconName) => (
                                <IconOption
                                    key={iconName}
                                    iconName={iconName}
                                    isSelected={selectedIcon === iconName}
                                    onSelect={setSelectedIcon}
                                    isDark={isDark}
                                />
                            ))}
                        </View>
                    </View>}


                    {/* Reminder */}
                    <View className="mb-10">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-[#8b56fc] text-xs font-bold tracking-widest uppercase">
                                REMINDER
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <Switch
                                    value={reminderEnabled}
                                    onValueChange={setReminderEnabled}
                                    trackColor={{ false: "#374151", true: "#8b56fc" }}
                                    thumbColor="#FFF"
                                />
                            </View>
                        </View>



                        {reminderEnabled && (
                            <View>
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => setShowTimePicker(true)}
                                    className={`rounded-2xl p-6 border flex-row justify-between items-center ${isDark ? 'bg-[#1e1e20] border-[#2c2c2e]' : 'bg-white border-gray-200'}`}
                                >
                                    {/* Time Display */}
                                    <View className="flex-row items-center">
                                        <View className="items-center">
                                            <Text className={`text-5xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{hour}</Text>
                                            <Text className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">HOUR</Text>
                                        </View>
                                        <Text className="text-4xl text-[#8b56fc] mx-4 -mt-4">:</Text>
                                        <View className="items-center">
                                            <Text className={`text-5xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{minute}</Text>
                                            <Text className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">MIN</Text>
                                        </View>


                                        <View className="items-center mx-4">
                                            <Text className={`text-5xl font-light ${isDark ? 'text-white' : 'text-gray-900'}`}>{isAm ? "AM" : "PM"}</Text>
                                            <Text className="text-[10px] text-gray-500 font-bold tracking-widest mt-1">AM/PM</Text>
                                        </View>
                                    </View>

                                    {/* AM/PM Display (Non-functional, follows time) */}
                                    {/* <View className="bg-[#0f0f11] rounded-xl p-1 gap-1">
                                            <View className={`px-3 py-2 rounded-lg ${isAm ? "bg-[#8b56fc]" : "bg-transparent"}`}>
                                                <Text className={`text-xs font-bold ${isAm ? "text-white" : "text-gray-500"}`}>AM</Text>
                                            </View>
                                            <View className={`px-3 py-2 rounded-lg ${!isAm ? "bg-[#8b56fc]" : "bg-transparent"}`}>
                                                <Text className={`text-xs font-bold ${!isAm ? "text-white" : "text-gray-500"}`}>PM</Text>
                                            </View>
                                        </View> */}
                                </TouchableOpacity>

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={(() => {
                                            const d = new Date();
                                            let h = parseInt(hour, 10);
                                            if (isAm && h === 12) h = 0;
                                            if (!isAm && h !== 12) h += 12;
                                            d.setHours(h, parseInt(minute, 10), 0, 0);
                                            return d;
                                        })()}
                                        mode="time"
                                        is24Hour={false}
                                        display="spinner"
                                        onChange={(event, selectedDate) => {
                                            setShowTimePicker(Platform.OS === 'ios');
                                            if (selectedDate) {
                                                setReminderTime(selectedDate); // Fix logic to update source of truth
                                                let h = selectedDate.getHours();
                                                const m = selectedDate.getMinutes();
                                                const am = h < 12;
                                                if (h === 0) h = 12;
                                                if (h > 12) h -= 12;

                                                setHour(h.toString().padStart(2, '0'));
                                                setMinute(m.toString().padStart(2, '0'));
                                                setIsAm(am);
                                            }
                                        }}
                                        themeVariant="dark"
                                    />
                                )}
                                {Platform.OS === 'ios' && showTimePicker && (
                                    <TouchableOpacity
                                        onPress={() => setShowTimePicker(false)}
                                        className={`py-3 mt-2 rounded-lg ${isDark ? 'bg-[#2c2c2e]' : 'bg-gray-200'}`}
                                    >
                                        <Text className={`text-center font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Done</Text>
                                    </TouchableOpacity>
                                )}

                                {/* Recurring Toggle */}
                                <View className="flex-row mt-6 justify-between items-center mb-4">
                                    <Text className="text-[#8b56fc] text-xs font-bold tracking-widest uppercase">
                                        RECURRING
                                    </Text>
                                    <Switch
                                        value={recurring}
                                        onValueChange={setRecurring}
                                        trackColor={{ false: "#374151", true: "#8b56fc" }}
                                        thumbColor="#FFF"
                                    />
                                </View>

                                {/* Interval Chips */}
                                {recurring && (
                                    <View className="flex-row flex-wrap gap-2">
                                        {RECURRING_INTERVALS.map((intVal) => (
                                            <TouchableOpacity
                                                key={intVal}
                                                onPress={() => setInterval(intVal)}
                                                className={`px-4 py-2 rounded-xl border ${interval === intVal
                                                    ? "bg-[#8b56fc] border-[#8b56fc]"
                                                    : isDark ? "bg-[#1e1e20] border-[#2c2c2e]" : "bg-white border-gray-200"
                                                    }`}
                                            >
                                                <Text
                                                    className={`text-xs font-bold ${interval === intVal ? "text-white" : "text-gray-500"
                                                        }`}
                                                >
                                                    {intVal} min
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>


            </View>
        </Modal>
    );
}
