const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_LOOKUP = {
  sun: 0,
  sunday: 0,
  mon: 1,
  monday: 1,
  tue: 2,
  tues: 2,
  tuesday: 2,
  wed: 3,
  wednesday: 3,
  thu: 4,
  thur: 4,
  thurs: 4,
  thursday: 4,
  fri: 5,
  friday: 5,
  sat: 6,
  saturday: 6,
};

const normalizeDayToken = (token) => {
  if (token === undefined || token === null) return null;
  if (typeof token === "number" && token >= 0 && token <= 6) return token;

  const normalized = String(token).trim().toLowerCase();
  if (!normalized) return null;
  if (DAY_LOOKUP[normalized] !== undefined) return DAY_LOOKUP[normalized];

  const short = normalized.slice(0, 3);
  if (DAY_LOOKUP[short] !== undefined) return DAY_LOOKUP[short];

  return null;
};

const parseDayRange = (rangeText) => {
  const [startToken, endToken] = String(rangeText)
    .split("-")
    .map((item) => item.trim())
    .filter(Boolean);

  const startIndex = normalizeDayToken(startToken);
  const endIndex = normalizeDayToken(endToken);

  if (startIndex === null || endIndex === null) {
    return [];
  }

  const days = [];
  let current = startIndex;

  while (true) {
    days.push(current);
    if (current === endIndex) break;
    current = (current + 1) % 7;
    if (days.length > 7) break;
  }

  return days;
};

const parseWorkingDays = (value) => {
  if (!value) return [];

  const pieces = Array.isArray(value)
    ? value
    : String(value)
        .split(/[,/|]+/)
        .map((item) => item.trim())
        .filter(Boolean);

  const result = new Set();

  pieces.forEach((piece) => {
    if (piece.includes("-")) {
      parseDayRange(piece).forEach((day) => result.add(day));
      return;
    }

    const day = normalizeDayToken(piece);
    if (day !== null) result.add(day);
  });

  return Array.from(result);
};

const formatWorkingDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) return "Any day";
  return days.map((day) => DAY_LABELS[day]).join(", ");
};

const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;

  const clean = String(timeStr).trim().toUpperCase();
  const match = clean.match(/^(\d{1,2})(?::(\d{2}))?\s*([AP]M)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2] || "0");
  const modifier = match[3];

  if (Number.isNaN(hours) || Number.isNaN(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  if (modifier) {
    if (hours < 1 || hours > 12) return null;
    if (modifier === "AM") {
      hours = hours === 12 ? 0 : hours;
    } else {
      hours = hours === 12 ? 12 : hours + 12;
    }
  }

  if (!modifier && (hours < 0 || hours > 23)) return null;

  return hours * 60 + minutes;
};

const minutesToTimeLabel = (minutes) => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  let hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return `${hours}:${String(mins).padStart(2, "0")} ${ampm}`;
};

const generateTimeSlots = (startTime, endTime, intervalMinutes = 30) => {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
    return [];
  }

  const slots = [];
  for (let current = startMinutes; current + intervalMinutes <= endMinutes; current += intervalMinutes) {
    slots.push(minutesToTimeLabel(current));
  }

  return slots;
};

const isDateAllowed = (dateString, allowedDays) => {
  if (!Array.isArray(allowedDays) || allowedDays.length === 0) return true;
  const date = new Date(`${dateString}T12:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  return allowedDays.includes(date.getDay());
};

const isTimeAllowed = (timeStr, startTime, endTime, intervalMinutes = 30) => {
  if (!startTime || !endTime) return true;
  const selectedMinutes = parseTimeToMinutes(timeStr);
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (selectedMinutes === null || startMinutes === null || endMinutes === null) return false;

  return selectedMinutes >= startMinutes && selectedMinutes + intervalMinutes <= endMinutes;
};

const parseLegacyAvailabilityLabel = (availabilityLabel) => {
  if (!availabilityLabel || typeof availabilityLabel !== "string") return {};

  const [daysPart, hoursPart] = availabilityLabel.split("|").map((item) => item.trim());
  const workingDays = parseWorkingDays(daysPart);

  let workingHoursStart;
  let workingHoursEnd;

  if (hoursPart) {
    const [start, end] = hoursPart.split("-").map((item) => item.trim());
    workingHoursStart = start || undefined;
    workingHoursEnd = end || undefined;
  }

  return { workingDays, workingHoursStart, workingHoursEnd };
};

const buildAvailabilityLabel = (workingDays, workingHoursStart, workingHoursEnd) => {
  if ((!Array.isArray(workingDays) || workingDays.length === 0) && !workingHoursStart && !workingHoursEnd) {
    return "";
  }

  const daysLabel = formatWorkingDays(workingDays);
  const hoursLabel =
    workingHoursStart && workingHoursEnd
      ? `${workingHoursStart} - ${workingHoursEnd}`
      : "Flexible hours";

  return `${daysLabel} | ${hoursLabel}`;
};

module.exports = {
  DAY_LABELS,
  parseWorkingDays,
  formatWorkingDays,
  parseTimeToMinutes,
  minutesToTimeLabel,
  generateTimeSlots,
  isDateAllowed,
  isTimeAllowed,
  parseLegacyAvailabilityLabel,
  buildAvailabilityLabel,
};
