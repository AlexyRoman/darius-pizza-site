import hoursConfig from '@/config/site/restaurant/hours.json';

interface OpeningHours {
  [key: string]: {
    day: string;
    periods: { open: string; close: string }[];
    isOpen: boolean;
  };
}

const hours = hoursConfig.openingHours as OpeningHours;

const dayOrder = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

// Helper function to check if current time is within any period
function isTimeInPeriods(
  currentTime: string,
  periods: { open: string; close: string }[]
): boolean {
  return periods.some(
    period => currentTime >= period.open && currentTime <= period.close
  );
}

// Helper function to get next opening time from periods
function getNextOpeningFromPeriods(
  currentTime: string,
  periods: { open: string; close: string }[]
): string | null {
  // Find the next period that opens after current time
  const sortedPeriods = periods.sort((a, b) => a.open.localeCompare(b.open));

  for (const period of sortedPeriods) {
    if (currentTime < period.open) {
      return period.open;
    }
  }

  return null; // No more openings today
}

export function getNextOpeningTime(
  now: Date
): { day: string; time: string; isToday: boolean } | null {
  const currentDayName = now
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

  // Check if there's an opening today after current time
  const todayHours = hours[currentDayName];
  if (todayHours && todayHours.isOpen) {
    const nextOpeningToday = getNextOpeningFromPeriods(
      currentTime,
      todayHours.periods
    );
    if (nextOpeningToday) {
      return {
        day: currentDayName,
        time: nextOpeningToday,
        isToday: true,
      };
    }
  }

  // Look for next opening day
  const currentDayIndex = dayOrder.indexOf(currentDayName);

  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (currentDayIndex + i) % 7;
    const nextDayName = dayOrder[nextDayIndex];
    const nextDayHours = hours[nextDayName];

    if (
      nextDayHours &&
      nextDayHours.isOpen &&
      nextDayHours.periods.length > 0
    ) {
      // Get the first opening time of the day
      const firstOpening = nextDayHours.periods.sort((a, b) =>
        a.open.localeCompare(b.open)
      )[0];
      return {
        day: nextDayName,
        time: firstOpening.open,
        isToday: false,
      };
    }
  }

  return null;
}

export function formatNextOpeningTime(
  now: Date,
  t: (key: string, params?: Record<string, string | number | Date>) => string
): string {
  const nextOpening = getNextOpeningTime(now);

  if (!nextOpening) {
    return t('badge.closed');
  }

  if (nextOpening.isToday) {
    return t('badge.closedOpenToday', { time: nextOpening.time });
  } else {
    return t('badge.closedOpenTomorrow', { time: nextOpening.time });
  }
}

// Export helper functions for use in components
export { isTimeInPeriods, getNextOpeningFromPeriods };
