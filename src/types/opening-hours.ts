/**
 * Opening Hours Types
 *
 * Types for opening hours configuration and utilities
 */

export interface OpeningHoursPeriod {
  open: string;
  close: string;
}

export interface DayHours {
  day: string;
  periods: OpeningHoursPeriod[];
  isOpen: boolean;
}

export interface OpeningHours {
  [key: string]: DayHours;
}

export interface NextOpeningTime {
  day: string;
  time: string;
  isToday: boolean;
}
