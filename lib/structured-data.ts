import { siteConfig } from "@/lib/site-data";

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/**
 * siteConfig.hours uses ranges like "Monday — Friday" for multi-day spans
 * and single names like "Saturday" for one-off days. Expands either form
 * into an explicit list of day names.
 */
function parseDays(days: string): string[] {
  if (days.includes("—")) {
    const [start = "", end = ""] = days.split("—").map((s) => s.trim());
    const startIndex = DAYS_OF_WEEK.indexOf(start);
    const endIndex = DAYS_OF_WEEK.indexOf(end);
    if (startIndex !== -1 && endIndex !== -1 && startIndex <= endIndex) {
      return DAYS_OF_WEEK.slice(startIndex, endIndex + 1);
    }
  }
  return [days.trim()];
}

/** Converts a 12-hour clock string like "5:00 AM" into 24-hour "05:00". */
function to24Hour(time: string): string {
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return time.trim();

  const [, hourStr = "0", minute = "00", meridiem = ""] = match;
  let hour = parseInt(hourStr, 10);

  if (/pm/i.test(meridiem) && hour !== 12) hour += 12;
  if (/am/i.test(meridiem) && hour === 12) hour = 0;

  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function parseTimeRange(time: string): { opens: string; closes: string } {
  const [start = "", end = ""] = time.split("—").map((s) => s.trim());
  return { opens: to24Hour(start), closes: to24Hour(end) };
}

/**
 * Builds a schema.org ExerciseGym JSON-LD object from siteConfig.
 * Uses only data already present in siteConfig — no fabricated fields
 * like geo coordinates.
 */
export function getLocalBusinessJsonLd() {
  const [addressRegion, postalCode] = siteConfig.address.city
    .split(",")
    .map((part) => part.trim());

  const openingHoursSpecification = siteConfig.hours.flatMap((entry) => {
    const days = parseDays(entry.days);
    const { opens, closes } = parseTimeRange(entry.time);

    return days.map((day) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${day}`,
      opens,
      closes,
    }));
  });

  return {
    "@context": "https://schema.org",
    "@type": "ExerciseGym",
    name: siteConfig.name,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.address.line1}, ${siteConfig.address.line2}`,
      addressRegion,
      postalCode,
    },
    openingHoursSpecification,
  };
}
