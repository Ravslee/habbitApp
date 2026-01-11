import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, UserProfile, HabitHistory } from '../../App';

const STORAGE_KEY = 'HABBIT_APP_DATA';

// Unified data model for all app data
export interface AppData {
    userProfile: UserProfile | null;
    habits: Habit[];
    habitHistory: HabitHistory;
    theme: 'light' | 'dark' | 'system';
    version: number; // For future migrations
    lastActiveDate?: string; // Track the last date the app was used (YYYY-MM-DD)
}

// Default empty state
export const DEFAULT_APP_DATA: AppData = {
    userProfile: null,
    habits: [],
    habitHistory: {},
    theme: 'dark',
    version: 1,
    lastActiveDate: undefined,
};

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
}

// Save all app data
export async function saveAppData(data: AppData): Promise<void> {
    try {
        // Always update lastActiveDate when saving
        const dataWithDate = {
            ...data,
            lastActiveDate: getTodayDate(),
        };
        const jsonValue = JSON.stringify(dataWithDate);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (error) {
        console.error('Error saving app data:', error);
    }
}

// Load all app data
export async function loadAppData(): Promise<AppData> {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
            const data = JSON.parse(jsonValue) as AppData;
            const today = getTodayDate();

            // Check if it's a new day - reset habit completed status
            let habits = data.habits || [];
            if (data.lastActiveDate && data.lastActiveDate !== today) {
                // It's a new day! Reset all habits to uncompleted
                habits = habits.map(habit => ({
                    ...habit,
                    completed: false,
                }));
            }

            // Handle migrations if needed based on version
            return {
                ...DEFAULT_APP_DATA,
                ...data,
                habits,
                lastActiveDate: today,
            };
        }
        return { ...DEFAULT_APP_DATA, lastActiveDate: getTodayDate() };
    } catch (error) {
        console.error('Error loading app data:', error);
        return DEFAULT_APP_DATA;
    }
}

// Clear all app data (for logout/reset)
export async function clearAppData(): Promise<void> {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing app data:', error);
    }
}
