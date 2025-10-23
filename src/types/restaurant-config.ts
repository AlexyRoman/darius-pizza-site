// Restaurant configuration types

export type RestaurantConfigType =
  | 'closings'
  | 'messages'
  | 'starred-pizzas'
  | 'contact';

export interface ScheduledClosing {
  id: string;
  title: string;
  description: string;
  date: string | null;
  startDate: string;
  endDate: string;
  isRecurring: boolean;
  isActive: boolean;
}

export interface EmergencyClosing {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  priority: number;
}

export interface ClosingsConfig {
  scheduledClosings: ScheduledClosing[];
  emergencyClosings: EmergencyClosing[];
  lastUpdated: string;
}

export interface SpecialMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  isActive: boolean;
  startDate: string;
  endDate: string | null;
  priority: number;
}

export interface MessagesConfig {
  specialMessages: SpecialMessage[];
  lastUpdated: string;
}

export interface StarredPizza {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isStarred: boolean;
  starReason: string;
}

export interface StarredPizzasConfig {
  starredPizzas: StarredPizza[];
  lastUpdated: string;
  month: string;
}

export interface ContactInfo {
  phone: {
    display: string;
    tel: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    fullAddress: string;
    description: string;
  };
  maps: {
    appleMaps: string;
    googleMaps: string;
  };
  social: {
    email: string;
    website: string;
  };
}

export interface ContactConfig {
  contact: ContactInfo;
}

export interface DayHours {
  day: string;
  periods: { open: string; close: string }[];
  isOpen: boolean;
}

export interface HoursConfig {
  openingHours: {
    monday: DayHours;
    tuesday: DayHours;
    wednesday: DayHours;
    thursday: DayHours;
    friday: DayHours;
    saturday: DayHours;
    sunday: DayHours;
  };
  timezone: string;
  lastUpdated: string;
}

// Union type for all restaurant config types
export type RestaurantConfigData =
  | ClosingsConfig
  | MessagesConfig
  | StarredPizzasConfig
  | ContactConfig
  | HoursConfig;

// Type mapping for each config type
export interface RestaurantConfigMap {
  closings: ClosingsConfig;
  messages: MessagesConfig;
  'starred-pizzas': StarredPizzasConfig;
  contact: ContactConfig;
  hours: HoursConfig;
}
