
/**
 * Gets all reminders for today sorted by time.
 */
const normalizeTimeInput = (timeStr) => String(timeStr || "").trim().replace(/\s+/g, " ").replace(/(\d)(AM|PM)$/i, "$1 $2");

export const parseFlexibleTimeToMinutes = (timeStr) => {
    const normalized = normalizeTimeInput(timeStr);
    if (!normalized) return null;

    const match = normalized.match(/^(\d{1,2})(?::(\d{1,2}))?(?:\s*([AaPp][Mm]))?$/);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2] || "0", 10);
    const period = match[3]?.toUpperCase();

    if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes < 0 || minutes > 59) {
        return null;
    }

    if (period) {
        if (hours < 1 || hours > 12) return null;
        if (period === "AM") {
            hours = hours === 12 ? 0 : hours;
        } else {
            hours = hours === 12 ? 12 : hours + 12;
        }
    } else if (hours > 23) {
        return null;
    }

    return hours * 60 + minutes;
};

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

    return schedule.sort((a, b) => {
        const aMinutes = parseFlexibleTimeToMinutes(a.time);
        const bMinutes = parseFlexibleTimeToMinutes(b.time);

        if (aMinutes === null && bMinutes === null) return 0;
        if (aMinutes === null) return 1;
        if (bMinutes === null) return -1;
        return aMinutes - bMinutes;
    });
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
        const itemTotalMinutes = parseFlexibleTimeToMinutes(item.time);
        if (itemTotalMinutes === null) return false;
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
    const totalMinutes = parseFlexibleTimeToMinutes(timeStr);
    if (totalMinutes === null) return 0;

    const target = new Date();
    target.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);

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
        const totalMinutes = parseFlexibleTimeToMinutes(timeStr);
        if (totalMinutes === null) return "00:00";

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch {
        return "00:00";
    }
};

/**
 * Builds a local Date object for an appointment date/time pair.
 */
export const getAppointmentDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;

    try {
        const [yearStr, monthStr, dayStr] = String(dateStr).split("-");
        const [hoursStr, minutesStr] = convertTo24Hour(timeStr).split(":");

        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        if ([year, month, day, hours, minutes].some(Number.isNaN)) {
            return null;
        }

        return new Date(year, month - 1, day, hours, minutes, 0, 0);
    } catch {
        return null;
    }
};

/**
 * Returns whether doctor can start the appointment now.
 */
export const canStartAppointment = (dateStr, timeStr) => {
    const appointmentDateTime = getAppointmentDateTime(dateStr, timeStr);
    if (!appointmentDateTime) return false;
    return Date.now() >= appointmentDateTime.getTime();
};

/**
 * Returns minutes remaining until the appointment starts.
 */
export const getMinutesUntilAppointmentStart = (dateStr, timeStr) => {
    const appointmentDateTime = getAppointmentDateTime(dateStr, timeStr);
    if (!appointmentDateTime) return 0;

    const diffMs = appointmentDateTime.getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / 60000));
};

/**
 * Returns whether an appointment is still cancellable within the booking window.
 */
export const canCancelAppointment = (createdAt, windowMinutes = 15) => {
    if (!createdAt) return false;

    const createdDate = new Date(createdAt);
    if (Number.isNaN(createdDate.getTime())) return false;

    const expiry = new Date(createdDate.getTime() + windowMinutes * 60 * 1000);
    return new Date() <= expiry;
};

/**
 * Returns remaining minutes in the cancellation window.
 */
export const getCancelWindowMinutesLeft = (createdAt, windowMinutes = 15) => {
    if (!createdAt) return 0;

    const createdDate = new Date(createdAt);
    if (Number.isNaN(createdDate.getTime())) return 0;

    const expiry = new Date(createdDate.getTime() + windowMinutes * 60 * 1000);
    const diffMs = expiry.getTime() - Date.now();
    return Math.max(0, Math.ceil(diffMs / 60000));
};

/**
 * Converts "21:30" to "09:30 PM" gracefully handling bad data
 */
export const formatTo12Hour = (time24) => {
    try {
        const totalMinutes = parseFlexibleTimeToMinutes(time24);
        if (totalMinutes === null) return time24; // fallback to original

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

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
        const itemTotalMinutes = parseFlexibleTimeToMinutes(item.time);
        if (itemTotalMinutes === null) {
            return { ...item, status: 'future' };
        }

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

/**
 * Calculates precise seconds until a target HH:mm time.
 */
export const getSecondsUntil = (timeStr, isTomorrow = false) => {
    const now = new Date();
    const totalMinutes = parseFlexibleTimeToMinutes(timeStr);
    if (totalMinutes === null) return 0;

    const target = new Date();
    target.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0);

    if (isTomorrow) {
        target.setDate(target.getDate() + 1);
    }

    const diffMs = target - now;
    return Math.max(0, Math.floor(diffMs / 1000));
};

/**
 * Formats seconds remaining as HH:MM:SS.
 */
export const formatSecondsRemaining = (totalSeconds) => {
    if (isNaN(totalSeconds) || totalSeconds <= 0) return "00:00:00";
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
