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
}

// Default empty state
export const DEFAULT_APP_DATA: AppData = {
    userProfile: null,
    habits: [],
    habitHistory: {},
    theme: 'dark',
    version: 1,
};

// Save all app data
export async function saveAppData(data: AppData): Promise<void> {
    try {
        const jsonValue = JSON.stringify(data);
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
            // Handle migrations if needed based on version
            return {
                ...DEFAULT_APP_DATA,
                ...data,
            };
        }
        return DEFAULT_APP_DATA;
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
