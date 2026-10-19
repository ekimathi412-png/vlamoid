const NAIROBI_TIME_ZONE = "Africa/Nairobi";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s()\-]+$/;

export interface ReservationInput {
  date: string;
  time: string;
  partySize: string;
  name: string;
  email: string;
  phone: string;
}

type DateParts = {
  year: number;
  month: number;
  day: number;
};

type NairobiDateTime = DateParts & {
  hour: number;
  minute: number;
  second: number;
};

type DiningHours = {
  openingHour: number;
  lastReservationHour: number;
} | null;

function getNairobiDateTime(now: Date): NairobiDateTime {
  if (Number.isNaN(now.getTime())) {
    throw new RangeError("now must be a valid Date");
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: NAIROBI_TIME_ZONE,
    calendar: "gregory",
    numberingSystem: "latn",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)])
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function toDateString({ year, month, day }: DateParts): string {
  return [year, month, day]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) {
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    return isLeapYear ? 29 : 28;
  }

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function parseReservationDate(
  date: string
): (DateParts & { value: Date }) | null {
  if (!DATE_PATTERN.test(date)) {
    return null;
  }

  const parts: DateParts = {
    year: Number(date.slice(0, 4)),
    month: Number(date.slice(5, 7)),
    day: Number(date.slice(8, 10)),
  };

  if (
    parts.month < 1 ||
    parts.month > 12 ||
    parts.day < 1 ||
    parts.day > daysInMonth(parts.year, parts.month)
  ) {
    return null;
  }

  const value = new Date(`${date}T12:00:00.000Z`);
  if (Number.isNaN(value.getTime())) {
    return null;
  }

  return { ...parts, value };
}

function getDiningHours(dayOfWeek: number): DiningHours {
  switch (dayOfWeek) {
    case 0:
      return { openingHour: 12, lastReservationHour: 20 };
    case 1:
      return null;
    case 2:
    case 3:
    case 4:
      return { openingHour: 17, lastReservationHour: 21 };
    case 5:
    case 6:
      return { openingHour: 17, lastReservationHour: 22 };
    default:
      return null;
  }
}

function getDateDiningHours(date: string): DiningHours {
  const parsed = parseReservationDate(date);
  return parsed ? getDiningHours(parsed.value.getUTCDay()) : null;
}

function getDailyReservationTimes(date: string): string[] {
  const hours = getDateDiningHours(date);
  if (!hours) {
    return [];
  }

  const times: string[] = [];
  for (
    let minutes = hours.openingHour * 60;
    minutes <= hours.lastReservationHour * 60;
    minutes += 30
  ) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    times.push(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    );
  }
  return times;
}

function addDays(date: string, numberOfDays: number): string {
  const parsed = parseReservationDate(date);
  if (!parsed) {
    return "";
  }

  parsed.value.setUTCDate(parsed.value.getUTCDate() + numberOfDays);
  return parsed.value.toISOString().slice(0, 10);
}

/** Return the current calendar date in Nairobi/EAT, independent of browser timezone. */
export function getNairobiToday(now: Date = new Date()): string {
  return toDateString(getNairobiDateTime(now));
}

/** Return 30-minute reservation starts, excluding times that are not in the future today in EAT. */
export function getReservationTimes(
  date: string,
  now: Date = new Date()
): string[] {
  const parsed = parseReservationDate(date);
  if (!parsed) {
    return [];
  }

  const times = getDailyReservationTimes(date);
  if (times.length === 0) {
    return times;
  }

  const nairobiNow = getNairobiDateTime(now);
  const today = toDateString(nairobiNow);
  if (date !== today) {
    return times;
  }

  const currentMinutes =
    nairobiNow.hour * 60 + nairobiNow.minute + nairobiNow.second / 60;
  return times.filter(time => {
    const [hour, minute] = time.split(":").map(Number);
    return hour * 60 + minute > currentMinutes;
  });
}

/** Format a valid YYYY-MM-DD reservation date for display. */
export function formatReservationDate(date: string): string {
  const parsed = parseReservationDate(date);
  if (!parsed) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    calendar: "gregory",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed.value);
}

function isValidEmail(email: string): boolean {
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return false;
  }

  const [localPart, domain] = email.split("@");
  return (
    localPart.length <= 64 &&
    domain.length <= 253 &&
    !email.includes("..") &&
    !domain.startsWith(".") &&
    !domain.endsWith(".")
  );
}

/** Validate a static preview reservation without submitting or persisting anything. */
export function validateReservation(
  input: ReservationInput,
  now: Date = new Date()
): string | null {
  const date = input.date;
  const time = input.time;
  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const partySize = input.partySize.trim();

  if (!date.trim()) {
    return "Please choose a reservation date.";
  }
  if (!time.trim()) {
    return "Please choose a reservation time.";
  }
  if (!name) {
    return "Please enter your name.";
  }
  if (!email) {
    return "Please enter your email address.";
  }

  const parsedDate = parseReservationDate(date);
  if (!parsedDate) {
    return "Please choose a valid reservation date in YYYY-MM-DD format.";
  }

  const today = getNairobiToday(now);
  const lastBookableDate = addDays(today, 90);
  if (date < today || date > lastBookableDate) {
    return `Please choose a date between ${formatReservationDate(today)} and ${formatReservationDate(lastBookableDate)}.`;
  }

  const dayOfWeek = parsedDate.value.getUTCDay();
  if (dayOfWeek === 1) {
    return "The restaurant is closed on Mondays. Please choose another date.";
  }

  if (!/^[1-8]$/.test(partySize)) {
    return "Party size must be a whole number from 1 to 8.";
  }

  if (name.length < 2 || name.length > 100) {
    return "Please enter a name between 2 and 100 characters.";
  }

  if (!isValidEmail(email)) {
    return "Please enter a valid email address (maximum 254 characters).";
  }

  if (
    phone &&
    (!PHONE_PATTERN.test(phone) ||
      (phone.match(/\d/g) ?? []).length < 7 ||
      (phone.match(/\d/g) ?? []).length > 15)
  ) {
    return "Please enter a phone number with 7 to 15 digits; spaces, +, -, and parentheses are allowed.";
  }

  const availableTimes = getReservationTimes(date, now);
  if (!availableTimes.includes(time)) {
    const dailyTimes = getDailyReservationTimes(date);
    if (dailyTimes.includes(time) && date === today) {
      return "That reservation time has passed. Please choose a future time.";
    }
    return "Please choose an available reservation time for this date.";
  }

  return null;
}
