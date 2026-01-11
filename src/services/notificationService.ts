import notifee, {
    TriggerType,
    RepeatFrequency,
    AndroidImportance,
    TimestampTrigger,
} from '@notifee/react-native';
import { NotificationSettings, Habit } from '../../App';
import { Alert } from 'react-native';

// Create a notification channel for Android (required for Android 8+)
async function createNotificationChannel() {
    const channelId = await notifee.createChannel({
        id: 'habit-reminders',
        name: 'Habit Reminders',
        description: 'Daily reminders for your habits',
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibration: true,
    });
    console.log('Created notification channel:', channelId);
    return channelId;
}

// Initialize notification service
export async function initializeNotifications() {
    try {
        await createNotificationChannel();
        // Request permissions
        const settings = await notifee.requestPermission();
        console.log('Notification permission status:', settings.authorizationStatus);
        return settings;
    } catch (error) {
        console.error('Error initializing notifications:', error);
    }
}

// Display an immediate test notification
export async function showTestNotification(habitName: string) {
    try {
        await notifee.displayNotification({
            title: `🔔 Test: ${habitName}`,
            body: `This is a test notification. If you see this, notifications are working!`,
            android: {
                channelId: 'habit-reminders',
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
            },
        });
        console.log('Test notification displayed');
    } catch (error) {
        console.error('Error showing test notification:', error);
        Alert.alert('Notification Error', String(error));
    }
}

// Schedule a notification for a habit
export async function scheduleHabitNotification(habit: Habit, settings: NotificationSettings) {
    try {
        // Cancel any existing notifications for this habit first
        await cancelHabitNotification(habit.id);

        if (!settings.enabled) {
            console.log('Notifications disabled for', habit.name);
            return;
        }

        // Parse the reminder time
        const [hours, minutes] = settings.reminderTime.split(':').map(Number);

        // Calculate the next trigger time
        const now = new Date();
        const triggerDate = new Date();
        triggerDate.setHours(hours, minutes, 0, 0);

        // If the time has already passed today, schedule for tomorrow
        if (triggerDate <= now) {
            triggerDate.setDate(triggerDate.getDate() + 1);
            console.log('Time already passed, scheduling for tomorrow');
        }

        console.log('Scheduling notification for:', triggerDate.toLocaleString());

        // Create the trigger
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: triggerDate.getTime(),
            repeatFrequency: RepeatFrequency.DAILY,
        };

        // Schedule the notification
        await notifee.createTriggerNotification(
            {
                id: `habit-${habit.id}`,
                title: `⏰ Time for: ${habit.name}`,
                body: `Don't forget to complete your "${habit.name}" habit today! ${habit.icon}`,
                android: {
                    channelId: 'habit-reminders',
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    sound: 'default',
                },
            },
            trigger,
        );

        console.log(`✅ Scheduled notification for ${habit.name} at ${settings.reminderTime}`);

        // Show an immediate test notification to confirm notifications work
        await notifee.displayNotification({
            title: `✅ Reminder Set: ${habit.name}`,
            body: `You'll be reminded daily at ${formatTime12Hour(settings.reminderTime)}`,
            android: {
                channelId: 'habit-reminders',
                importance: AndroidImportance.DEFAULT,
                pressAction: {
                    id: 'default',
                },
            },
        });

        // If recurring, schedule additional notifications at intervals
        if (settings.recurring && settings.intervalMinutes) {
            await scheduleRecurringNotifications(habit, settings, triggerDate);
        }
    } catch (error) {
        console.error('Error scheduling notification:', error);
        Alert.alert('Scheduling Error', String(error));
    }
}

// Helper to format time for display
function formatTime12Hour(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

// Schedule recurring notifications throughout the day
async function scheduleRecurringNotifications(
    habit: Habit,
    settings: NotificationSettings,
    startTime: Date
) {
    const intervalMs = settings.intervalMinutes * 60 * 1000;
    const endOfDay = new Date(startTime);
    endOfDay.setHours(22, 0, 0, 0); // Stop reminders at 10 PM

    let nextTime = new Date(startTime.getTime() + intervalMs);
    let index = 1;

    while (nextTime < endOfDay && index < 10) {
        const trigger: TimestampTrigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: nextTime.getTime(),
            repeatFrequency: RepeatFrequency.DAILY,
        };

        await notifee.createTriggerNotification(
            {
                id: `habit-${habit.id}-recurring-${index}`,
                title: `🔔 Reminder: ${habit.name}`,
                body: `Quick reminder to check on your "${habit.name}" habit! ${habit.icon}`,
                android: {
                    channelId: 'habit-reminders',
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                },
                ios: {
                    sound: 'default',
                },
            },
            trigger,
        );

        nextTime = new Date(nextTime.getTime() + intervalMs);
        index++;
    }

    console.log(`Scheduled ${index - 1} recurring notifications for ${habit.name}`);
}

// Cancel all notifications for a habit
export async function cancelHabitNotification(habitId: number) {
    try {
        await notifee.cancelNotification(`habit-${habitId}`);
        for (let i = 1; i < 10; i++) {
            await notifee.cancelNotification(`habit-${habitId}-recurring-${i}`);
        }
        console.log('Cancelled notifications for habit', habitId);
    } catch (error) {
        console.error('Error cancelling notification:', error);
    }
}

// Cancel all habit notifications
export async function cancelAllNotifications() {
    await notifee.cancelAllNotifications();
}

// Get pending notifications (for debugging)
export async function getPendingNotifications() {
    const notifications = await notifee.getTriggerNotifications();
    console.log('Pending notifications:', notifications.length);
    notifications.forEach(n => {
        const trigger = n.trigger as TimestampTrigger;
        if (trigger.timestamp) {
            console.log(`- ${n.notification.title} at ${new Date(trigger.timestamp).toLocaleString()}`);
        }
    });
    return notifications;
}

// Check if notifications are enabled
export async function checkNotificationPermissions() {
    const settings = await notifee.getNotificationSettings();
    console.log('Notification settings:', settings);
    return settings;
}
