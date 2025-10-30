import { isTimeInPeriods } from '@/lib/opening-hours-utils';
import type {
  OpeningHours as OpeningHoursMap,
  DayHours,
  OpeningHoursPeriod as OpeningPeriod,
} from '@/types/opening-hours';

export function findTodayKey(
  hours: OpeningHoursMap,
  currentDayName: string
): string {
  const key = Object.keys(hours).find(
    k => k.toLowerCase() === currentDayName.toLowerCase()
  );
  return key || 'monday';
}

export function getTodayHours(
  hours: OpeningHoursMap,
  currentDayName: string
): DayHours | undefined {
  const key = findTodayKey(hours, currentDayName);
  return hours[key];
}

export function computeIsCurrentlyOpen(
  todayHours: DayHours | undefined,
  currentTime: string
): boolean {
  if (!todayHours || !todayHours.isOpen) return false;
  return isTimeInPeriods(currentTime, todayHours.periods);
}

export function computeIsOpeningSoon(
  todayHours: DayHours | undefined,
  currentTime: string,
  windowMinutes: number = 60
): boolean {
  if (!todayHours || !todayHours.isOpen) return false;

  const [curH, curM] = currentTime.split(':').map(Number);
  const currentMinutes = curH * 60 + curM;
  const latest = currentMinutes + windowMinutes;

  return todayHours.periods.some(period => {
    const [openHour, openMinute] = period.open.split(':').map(Number);
    const openMinutes = openHour * 60 + openMinute;
    return openMinutes > currentMinutes && openMinutes <= latest;
  });
}

export function getMinutesUntilOpening(
  todayHours: DayHours | undefined,
  currentTime: string
): number {
  if (!todayHours || !todayHours.isOpen) return 0;

  const [curH, curM] = currentTime.split(':').map(Number);
  const currentMinutes = curH * 60 + curM;

  const nextOpening = todayHours.periods
    .filter(period => {
      const [openHour, openMinute] = period.open.split(':').map(Number);
      const openMinutes = openHour * 60 + openMinute;
      return openMinutes > currentMinutes;
    })
    .sort((a, b) => {
      const [aH, aM] = a.open.split(':').map(Number);
      const [bH, bM] = b.open.split(':').map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    })[0];

  if (!nextOpening) return 0;
  const [h, m] = nextOpening.open.split(':').map(Number);
  return h * 60 + m - currentMinutes;
}

export function getCurrentPeriodInfo(
  todayHours: DayHours | undefined,
  currentTime: string
) {
  if (!todayHours || !todayHours.isOpen)
    return {
      currentPeriod: undefined as OpeningPeriod | undefined,
      nextOpeningPeriod: undefined as OpeningPeriod | undefined,
    };

  const [curH, curM] = currentTime.split(':').map(Number);
  const currentMinutes = curH * 60 + curM;

  const currentPeriod = todayHours.periods.find(period => {
    const [openHour, openMinute] = period.open.split(':').map(Number);
    const [closeHour, closeMinute] = period.close.split(':').map(Number);
    const openMinutes = openHour * 60 + openMinute;
    const closeMinutes = closeHour * 60 + closeMinute;
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  });

  const nextOpeningPeriod = todayHours.periods
    .filter(period => {
      const [openHour, openMinute] = period.open.split(':').map(Number);
      const openMinutes = openHour * 60 + openMinute;
      return openMinutes > currentMinutes;
    })
    .sort((a, b) => {
      const [aH, aM] = a.open.split(':').map(Number);
      const [bH, bM] = b.open.split(':').map(Number);
      return aH * 60 + aM - (bH * 60 + bM);
    })[0];

  return { currentPeriod, nextOpeningPeriod };
}

// Find a currently active closing window (startDate <= now <= endDate)
export function findActiveClosing<
  T extends {
    isActive: boolean;
    startDate?: string;
    endDate?: string;
  },
>(closings: T[], now: Date): T | undefined {
  return closings
    .filter(closing => closing.isActive)
    .find(closing => {
      if (closing.startDate && closing.endDate) {
        const startDate = new Date(closing.startDate);
        const endDate = new Date(closing.endDate);
        return now >= startDate && now <= endDate;
      }
      return false;
    });
}

export function getActiveMessages<
  T extends {
    isActive: boolean;
    startDate: string;
    endDate?: string | null;
    priority?: number;
  },
>(messages: T[], now: Date): T[] {
  return messages
    .filter(msg => msg.isActive)
    .filter(msg => {
      const start = new Date(msg.startDate);
      const end = msg.endDate ? new Date(msg.endDate) : null;
      return now >= start && (!end || now <= end);
    })
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));
}

export function getUpcomingClosings<
  T extends {
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    date?: string | null;
    id?: string;
  },
>(closings: T[], now: Date, limit: number = 3): T[] {
  return closings
    .filter(c => c.isActive)
    .filter(c => {
      if (c.startDate && c.endDate) {
        const start = new Date(c.startDate);
        return start > now;
      } else if (c.date) {
        const single = new Date(c.date);
        return single > now;
      }
      return false;
    })
    .sort((a, b) => {
      const aDate = a.startDate ? new Date(a.startDate) : new Date(a.date!);
      const bDate = b.startDate ? new Date(b.startDate) : new Date(b.date!);
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, limit);
}

export function formatTimeForLocale(time: string, locale: string): string {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  const isHour12 = locale === 'en';
  const resolvedLocale =
    locale === 'en' ? 'en-US' : locale === 'fr' ? 'fr-FR' : undefined;
  return date.toLocaleTimeString(resolvedLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: isHour12,
  });
}
