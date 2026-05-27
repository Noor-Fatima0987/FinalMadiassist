import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications should be handled when the app is in the foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

/**
 * Registers the device for push notifications (even if only using local ones, 
 * this ensures permissions are granted).
 */
export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 1000, 500, 1000, 500, 1000, 500, 1000],
            lightColor: '#FF231F7C',
            sound: true,
            enableVibrate: true,
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
        }
        try {
            token = (await Notifications.getExpoPushTokenAsync({ projectId: 'dummy-project-id' })).data;
            // console.log(token);
        } catch (e) {
            // Harmless error: We only need local notifications, so we can ignore remote push token setup errors.
            // console.log('Error getting expo push token', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

/**
 * Schedules a recurring daily notification for a specific time.
 * @param {string} medicineName 
 * @param {string} dosage 
 * @param {string} timeStr - format "HH:mm"
 * @returns {Promise<string>} invitationId
 */
export async function scheduleMedicationReminder(medicineName, dosage, timeStr) {
    const cleanTime = (timeStr || "00:00").replace(/[^0-9:]/g, "");
    const [hoursStr, minutesStr] = cleanTime.split(':');
    const hours = parseInt(hoursStr || "0", 10);
    const minutes = parseInt(minutesStr || "0", 10);

    // If parsing fails completely, fallback to current time + 1 min to prevent silent daemon crash
    const finalHours = isNaN(hours) ? new Date().getHours() : hours;
    const finalMinutes = isNaN(minutes) ? (new Date().getMinutes() + 1) % 60 : minutes;

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Medication Reminder 💊",
            body: `It's time to take ${medicineName} (${dosage}).`,
            data: { medicineName, dosage, time: timeStr },
            sound: true,
        },
        trigger: {
            hour: finalHours,
            minute: finalMinutes,
            repeats: true,
        },
    });

    return id;
}

/**
 * Cancels all scheduled notifications.
 */
export async function cancelAllScheduledNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Syncs the entire current medications list with scheduled notifications.
 * It clears all and reshcedules to ensure consistency.
 * @param {Array} medications 
 */
export async function syncNotificationsWithMedications(medications) {
    await cancelAllScheduledNotifications();

    if (!Array.isArray(medications)) return;

    for (const med of medications) {
        const isActive = med.active !== false; // Default to true if undefined
        if (isActive) {
            // Safely iterate over times if it's an array, or string, or skip
            let timesArray = [];
            if (Array.isArray(med.times)) {
                timesArray = med.times;
            } else if (typeof med.times === 'string') {
                timesArray = med.times.split(',').map(t => t.trim());
            }

            for (const time of timesArray) {
                await scheduleMedicationReminder(med.name || 'Medicine', med.dosage || '', time);
            }
        }
    }
}
