
/**
 * Gets all reminders for today sorted by time.
 */
export const getTodaySchedule = (medications) => {
    const schedule = [];
    if (!Array.isArray(medications)) return schedule;
    
    medications.forEach((med) => {
        // Ensure times is an array, fallback to splitting if it's a string, or empty array
        let timesArray = [];
        if (Array.isArray(med.times)) {
            timesArray = med.times;
        } else if (typeof med.times === 'string') {
            timesArray = med.times.split(',').map(t => t.trim());
        }

        timesArray.forEach((time) => {
            schedule.push({
                time,
                medicineName: med.name,
                dosage: med.dosage,
                instructions: med.instructions,
                duration: med.duration,
            });
        });
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
        const timeStr = (item.time || "00:00").replace(/[^0-9:]/g, "");
        const [hoursStr, minutesStr] = timeStr.split(":");
        const hours = parseInt(hoursStr || "0", 10);
        const minutes = parseInt(minutesStr || "0", 10);
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
    const cleanTime = (timeStr || "00:00").replace(/[^0-9:]/g, "");
    const [hoursStr, minutesStr] = cleanTime.split(":");
    const hours = parseInt(hoursStr || "0", 10);
    const minutes = parseInt(minutesStr || "0", 10);

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
    try {
        const [time, modifier] = (timeStr || "").split(" ");
        let [hours, minutes] = (time || "00:00").split(":");

        if (hours === "12") {
            hours = "00";
        }

        if (modifier === "PM" || modifier === "pm") {
            hours = parseInt(hours, 10) + 12;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes || "00"}`;
    } catch {
        return "00:00";
    }
};

/**
 * Converts "21:30" to "09:30 PM" gracefully handling bad data
 */
export const formatTo12Hour = (time24) => {
    try {
        const cleanTime = (time24 || "00:00").replace(/[^0-9:]/g, "");
        const [hoursStr, minutesStr] = cleanTime.split(":");
        const hours = parseInt(hoursStr || "0", 10);
        const minutes = parseInt(minutesStr || "0", 10);
        
        if (isNaN(hours) || isNaN(minutes)) return time24; // fallback to original

        const ampm = hours >= 12 ? "PM" : "AM";
        const hours12 = hours % 12 || 12;
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours12}:${minutesFormatted} ${ampm}`;
    } catch {
        return time24; // fallback if anything fails
    }
};

/**
 * Formats minutes into human readable string.
 */
export const formatTimeRemaining = (minutes) => {
    if (isNaN(minutes) || minutes < 0) return "0 minutes";
    if (minutes < 60) {
        return `${minutes} mins`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

/**
 * Gets the timeline schedule with past, next, and future flags
 */
export const getTimelineSchedule = (medications) => {
    const schedule = getTodaySchedule(medications);
    const now = new Date();
    const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

    let nextFound = false;

    return schedule.map((item) => {
        const timeStr = (item.time || "00:00").replace(/[^0-9:]/g, "");
        const [hoursStr, minutesStr] = timeStr.split(":");
        const hours = parseInt(hoursStr || "0", 10);
        const minutes = parseInt(minutesStr || "0", 10);
        const itemTotalMinutes = hours * 60 + minutes;

        let status = 'future';
        if (itemTotalMinutes <= currentTotalMinutes) {
            status = 'past';
        } else if (!nextFound) {
            status = 'next';
            nextFound = true;
        }

        return { ...item, status };
    });
};
