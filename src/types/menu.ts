/**
 * Menu-related Type Definitions
 */

export type MenuItem = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  badges?: string[];
  price: number;
  discount?: number; // percentage 0-100
  image?: string;
  allergens?: string[]; // e.g., ["Gluten","Milk","Nuts"] always in EN keys
};
