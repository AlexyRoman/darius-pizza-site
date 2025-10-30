/**
 * Restaurant Config Translation Types
 *
 * Types for restaurant configuration translation system
 */

export interface ClosingTranslation {
  id: string;
  title: string;
  description: string;
}

export interface ClosingsTranslations {
  scheduledClosings: ClosingTranslation[];
  emergencyClosings: ClosingTranslation[];
}

export interface MessageTranslation {
  id: string;
  title: string;
  message: string;
}

export interface MessagesTranslations {
  specialMessages: MessageTranslation[];
}

export interface StarredPizzaTranslation {
  id: string;
  title: string;
  description: string;
  starReason: string;
  category?: string;
}

export interface StarredPizzasTranslations {
  starredPizzas: StarredPizzaTranslation[];
  month: string;
}

export interface ContactTranslations {
  contact: {
    address: {
      state?: string;
      fullAddress?: string;
      description?: string;
    };
  };
}

export type TranslationData =
  | ClosingsTranslations
  | MessagesTranslations
  | StarredPizzasTranslations
  | ContactTranslations;
