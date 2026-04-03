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
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
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
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } catch (e) {
            console.log('Error getting expo push token', e);
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
    const [hours, minutes] = timeStr.split(':').map(Number);

    const id = await Notifications.scheduleNotificationAsync({
        content: {
            title: "Medication Reminder 💊",
            body: `It's time to take ${medicineName} (${dosage}).`,
            data: { medicineName, dosage, time: timeStr },
            sound: 'default',
        },
        trigger: {
            hour: hours,
            minute: minutes,
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

    for (const med of medications) {
        if (med.active) {
            for (const time of med.times) {
                await scheduleMedicationReminder(med.name, med.dosage, time);
            }
        }
    }
}
