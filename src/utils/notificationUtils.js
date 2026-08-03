import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { parseFlexibleTimeToMinutes } from './reminderUtils';
import notifee, {
    AndroidCategory,
    AndroidImportance,
    AndroidNotificationSetting,
    AuthorizationStatus,
    RepeatFrequency,
    TriggerType,
} from '@notifee/react-native';

const BACKEND_URL = 'https://mediassist-rho.vercel.app';
const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EAS_PROJECT_ID =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId ||
    '8732d1e8-b720-41ba-bd0c-03a2d089235e';
const ALARM_CHANNEL_ID = 'alarm_vibrate_only_v4';

async function configureNotificationChannelAsync() {
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
}

async function configureAlarmChannelAsync() {
    await notifee.createChannel({
        id: ALARM_CHANNEL_ID,
        name: 'Alarm Vibrate',
        importance: AndroidImportance.HIGH,
        vibration: true,
        vibrationPattern: [1000, 500, 1000, 500],
        lights: true,
        sound: 'default',
    });
}

async function ensureAlarmPermissionsAsync() {
    await configureAlarmChannelAsync();

    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        return false;
    }

    if (Platform.OS === 'android') {
        const alarmSettings = await notifee.getNotificationSettings();
        if (alarmSettings.android?.alarm === AndroidNotificationSetting.DISABLED) {
            await notifee.openAlarmPermissionSettings();
            return false;
        }
    }

    return true;
}

function buildAlarmNotification({ medicineName, dosage, time, instructions, notificationId }) {
    return {
        id: notificationId,
        title: 'Medication Reminder 💊',
        body: `It's time to take ${medicineName} (${dosage}).`,
        data: {
            type: 'medication-reminder',
            medicineName,
            dosage,
            time,
            instructions,
            notificationId,
        },
        android: {
            channelId: ALARM_CHANNEL_ID,
            category: AndroidCategory.ALARM,
            importance: AndroidImportance.HIGH,
            autoCancel: false,
            ongoing: true,
            sound: 'default',
            vibrationPattern: [1000, 500, 1000, 500],
            pressAction: {
                id: 'default',
            },
            fullScreenAction: {
                id: 'default',
            },
            lightUpScreen: true,
        },
    };
}

export async function ensureNotificationPermissionsAsync() {
    await configureNotificationChannelAsync();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') {
        return true;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

export async function getNotificationPermissionStatusAsync() {
    await configureNotificationChannelAsync();
    const { status } = await Notifications.getPermissionsAsync();
    return status;
}

// Configure how notifications should be handled when the app is in the foreground
    Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
        const data = notification?.request?.content?.data || {};
        const isAlarm = data.type === 'medication-reminder' || data.type === 'test-alarm';

        return {
            shouldShowBanner: true,
            shouldShowList: true,
            shouldPlaySound: !isAlarm,
            shouldSetBadge: false,
        };
    },
});

/**
 * Registers the device for push notifications (even if only using local ones, 
 * this ensures permissions are granted).
 */
export async function registerForPushNotificationsAsync() {
    let token;

    const allowed = await ensureNotificationPermissionsAsync();
    if (!allowed) {
        console.warn('Notification permission not granted!');
        return null;
    }

    try {
        // Try with configured EAS Project ID first
        if (EAS_PROJECT_ID) {
            try {
                const tokenObj = await Notifications.getExpoPushTokenAsync({ projectId: EAS_PROJECT_ID });
                token = tokenObj?.data;
            } catch (easErr) {
                console.warn('getExpoPushTokenAsync with EAS_PROJECT_ID failed, trying default...', easErr?.message);
            }
        }

        // Fallback: Try without projectId parameter (works in standard Expo Go)
        if (!token) {
            try {
                const tokenObj = await Notifications.getExpoPushTokenAsync();
                token = tokenObj?.data;
            } catch (defaultErr) {
                console.warn('getExpoPushTokenAsync default failed:', defaultErr?.message);
            }
        }
    } catch (e) {
        console.error('Error getting Expo push token:', e);
    }

    // Fallback for native builds where FCM FirebaseApp is not initialized
    if (!token) {
        const deviceModel = (Device.modelName || Device.deviceName || 'Device').replace(/[^a-zA-Z0-9]/g, '_');
        token = `ExponentPushToken[Fallback_${deviceModel}_${Date.now().toString(36)}]`;
        console.log('Using generated fallback push token:', token);
    }

    return token;
}

export async function sendTestNotificationAsync() {
    const allowed = await ensureNotificationPermissionsAsync();
    if (!allowed) {
        return false;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'MediAssist Test',
            body: 'Simple notification ka test successful hai.',
            sound: 'default',
            channelId: 'default',
            data: { type: 'test-notification' },
            vibrate: false,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 1,
            channelId: 'default',
        },
    });

    return true;
}

export async function sendTestAlarmNotificationAsync() {
    await configureAlarmChannelAsync();

    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
        return false;
    }

    const notificationId = `test-alarm-${Date.now()}`;
    await notifee.displayNotification(
        buildAlarmNotification({
            medicineName: 'Test Medicine',
            dosage: '1 Tablet',
            time: 'Now',
            instructions: 'Test Alarm Flow',
            notificationId,
        }),
    );

    return true;
}

export async function sendExpoPushNotificationAsync({
    to,
    title,
    body,
    data = {},
    sound = 'default',
    channelId = 'default',
}) {
    if (!to) return false;

    const response = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([{
            to,
            title,
            body,
            sound,
            channelId,
            priority: 'high',
            data,
        }]),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        throw new Error(`Expo push request failed with status ${response.status}: ${JSON.stringify(payload)}`);
    }

    return payload;
}

export async function sendAppointmentConfirmationNotificationAsync(doctorName, date, time) {
    const allowed = await ensureNotificationPermissionsAsync();
    if (!allowed) {
        return false;
    }

    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Appointment Confirmed',
            body: `Your appointment with ${doctorName} on ${date} at ${time} is confirmed.`,
            sound: 'default',
            channelId: 'default',
            data: {
                type: 'appointment-confirmed',
                doctorName,
                date,
                time,
            },
        },
        trigger: null,
    });

    return true;
}

export async function registerAndSyncPushTokenForUser(firebaseId) {
    if (!firebaseId) {
        return null;
    }

    try {
        const token = await registerForPushNotificationsAsync();
        if (!token) {
            return null;
        }

        await fetch(`${BACKEND_URL}/api/user/${firebaseId}/push-token`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ expoPushToken: token }),
        });

        return token;
    } catch (error) {
        console.error('Failed to sync push token with backend:', error);
        return null;
    }
}

export async function syncPatientMedicationNotifications(patientId) {
    if (!patientId) {
        return { skipped: true };
    }

    const response = await fetch(`${BACKEND_URL}/api/prescriptions/patient/${patientId}`);
    const data = await response.json().catch(() => []);

    if (!response.ok || !Array.isArray(data)) {
        return { skipped: true };
    }

    const medications = [];
    data.forEach((prescription) => {
        if (Array.isArray(prescription.medications)) {
            medications.push(...prescription.medications);
        }
    });

    await syncNotificationsWithMedications(medications);
    return { scheduled: medications.length };
}

/**
 * Schedules a recurring daily notification for a specific time.
 * @param {string} medicineName 
 * @param {string} dosage 
 * @param {string} timeStr - format "HH:mm"
 * @param {string} instructions
 * @returns {Promise<string>} invitationId
 */
export async function scheduleMedicationReminder(medicineName, dosage, timeStr, instructions = 'As Directed') {
    const totalMinutes = parseFlexibleTimeToMinutes(timeStr);
    const finalHours = totalMinutes === null ? new Date().getHours() : Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes === null ? (new Date().getMinutes() + 1) % 60 : totalMinutes % 60;
    const allowed = await ensureAlarmPermissionsAsync();
    if (!allowed) {
        return null;
    }

    const nextRun = new Date();
    nextRun.setHours(finalHours, finalMinutes, 0, 0);
    if (nextRun.getTime() <= Date.now()) {
        nextRun.setDate(nextRun.getDate() + 1);
    }

    const notificationId = `medication-reminder-${medicineName}-${dosage}-${timeStr}-${instructions}`.replace(/[^a-zA-Z0-9-_]/g, '-');
    return await notifee.createTriggerNotification(
        buildAlarmNotification({
            medicineName,
            dosage,
            time: timeStr,
            instructions,
            notificationId,
        }),
        {
            type: TriggerType.TIMESTAMP,
            timestamp: nextRun.getTime(),
            repeatFrequency: RepeatFrequency.DAILY,
            alarmManager: {
                allowWhileIdle: true,
            },
        }
    );
}

/**
 * Cancels all scheduled notifications.
 */
export async function cancelAllScheduledNotifications() {
    try {
        const triggerIds = await notifee.getTriggerNotificationIds();
        if (Array.isArray(triggerIds) && triggerIds.length > 0) {
            await notifee.cancelTriggerNotifications(triggerIds);
        }
    } catch (e) {
        console.log('Cancel trigger notifications fallback:', e?.message);
    }
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
                await scheduleMedicationReminder(med.name || 'Medicine', med.dosage || '', time, med.instructions || 'As Directed');
            }
        }
    }
}
