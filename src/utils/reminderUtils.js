
/**
 * Gets all reminders for today sorted by time.
 */
export const getTodaySchedule = (medications) => {
    const schedule = [];
    medications.forEach((med) => {
        if (med.active) {
            med.times.forEach((time) => {
                schedule.push({
                    time,
                    medicineName: med.name,
                    dosage: med.dosage,
                    instructions: med.instructions,
                    duration: med.duration,
                });
            });
        }
    });

    return schedule.sort((a, b) => a.time.localeCompare(b.time));
};

/**
 * Finds the next upcoming reminder from current time.
 */
export const getNextReminder = (medications) => {
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    const schedule = getTodaySchedule(medications);

    // Filter for upcoming ones today
    const upcoming = schedule.filter((item) => {
        const [hours, minutes] = item.time.split(":").map(Number);
        const itemTotalMinutes = hours * 60 + minutes;
        return itemTotalMinutes > currentTotalMinutes;
    });

    if (upcoming.length > 0) {
        return upcoming[0];
    }

    // If no more today, get the first one for tomorrow (simulated as just the first item of the day)
    if (schedule.length > 0) {
        return { ...schedule[0], isTomorrow: true };
    }

    return null;
};

/**
 * Calculates minutes until a HH:mm time.
 */
export const getMinutesUntil = (timeStr, isTomorrow = false) => {
    const now = new Date();
    const [hours, minutes] = timeStr.split(":").map(Number);

    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    if (isTomorrow) {
        target.setDate(target.getDate() + 1);
    }

    const diffMs = target - now;
    return Math.max(0, Math.floor(diffMs / 60000));
};

/**
 * Converts "09:30 AM" to "09:30" (24h)
 */
export const convertTo24Hour = (timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (hours === "12") {
        hours = "00";
    }

    if (modifier === "PM") {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Converts "21:30" to "09:30 PM"
 */
export const formatTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours12}:${minutesStr} ${ampm}`;
};

/**
 * Formats minutes into human readable string.
 */
export const formatTimeRemaining = (minutes) => {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} min`;
};
