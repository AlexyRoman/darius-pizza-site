# Darius Pizza Brand Identity System

## Overview
A comprehensive brand identity management system for the Darius Pizza website, featuring a pizzeria-inspired color palette, modern typography, and seamless light/dark theme support.

## Brand Identity Structure

### 📁 Configuration Files
```
src/config/brand/
├── index.ts          # Main entry point and exports
├── colors.ts         # Color palette and theme colors
├── typography.ts     # Font families, sizes, and typography scale
├── spacing.ts        # Spacing system and layout dimensions
└── theme.ts          # Theme management and utilities
```

## 🎨 Color Palette

### Primary Colors (Pizzeria-Inspired)
- **Primary**: Warm orange-red (pizza sauce inspired) - `oklch(0.65 0.15 25)`
- **Secondary**: Rich brown (crust inspired) - `oklch(0.45 0.08 45)`
- **Accent**: Golden yellow (cheese inspired) - `oklch(0.75 0.12 85)`
- **Background**: Cream/off-white (flour inspired) - `oklch(0.98 0.01 85)`

### Semantic Colors
- **Error**: Deep red - `oklch(0.55 0.18 15)`
- **Warning**: Amber - `oklch(0.70 0.15 65)`
- **Success**: Forest green - `oklch(0.60 0.12 140)`
- **Info**: Deep blue - `oklch(0.60 0.12 240)`

### Theme Support
- **Light Theme**: Warm, inviting colors with cream background
- **Dark Theme**: Darker brown backgrounds with brighter accent colors
- **System Theme**: Automatically follows user's system preference

## 🔤 Typography

### Font Families
- **Primary**: Playfair Display (elegant serif for headings)
- **Secondary**: Inter (modern sans-serif for body text)
- **Mono**: JetBrains Mono (for code and technical content)

### Typography Scale
- Responsive font sizes following 1.25 ratio (Major Third)
- Optimized line heights for readability
- Consistent letter spacing for better legibility

## 📏 Spacing & Layout

### Spacing System
- Based on 8px grid system (0.5rem increments)
- Consistent spacing scale from 4px to 256px
- Responsive breakpoints for different screen sizes

### Layout Dimensions
- Container padding: 16px (mobile) → 32px (tablet) → 48px (desktop)
- Section spacing: 48px (mobile) → 64px (tablet) → 96px (desktop)

## 🌓 Theme Management

### Features
- **Three-mode system**: Light, Dark, System
- **Automatic system detection**: Follows user's OS preference
- **Smooth transitions**: 300ms cubic-bezier transitions
- **Persistent storage**: Remembers user's theme choice
- **Real-time switching**: Instant theme changes without page reload

### Theme Toggle
- Cycles through: Light → Dark → System → Light
- Visual indicators: Sun (light), Moon (dark), Monitor (system)
- Accessible with proper ARIA labels

## 🛠 Implementation

### CSS Variables
All brand elements are defined as CSS custom properties, making them easily accessible throughout the application:

```css
:root {
  --color-primary: oklch(0.65 0.15 25);
  --color-secondary: oklch(0.45 0.08 45);
  --color-accent: oklch(0.75 0.12 85);
  --font-primary: "Playfair Display", serif;
  --font-secondary: "Inter", sans-serif;
  /* ... and many more */
}
```

### Tailwind Integration
The brand system is fully integrated with Tailwind CSS:

```tsx
// Brand colors
className="bg-primary text-primary-foreground"
className="border-secondary hover:border-primary"

// Typography
className="font-primary text-4xl font-bold"
className="font-secondary text-base"

// Spacing
className="p-lg m-xl gap-md"
```

### Component Usage
```tsx
import { useThemeContext } from '@/contexts/ThemeContext';
import { getColor, getSpacing } from '@/config/brand';

// Theme-aware components
const { theme, toggleTheme } = useThemeContext();
const primaryColor = getColor('primary', theme);
```

## 🎯 Applied Changes

### Updated Files
1. **`src/app/globals.css`** - Complete brand system CSS variables
2. **`tailwind.config.ts`** - Integrated brand system with Tailwind
3. **`src/contexts/ThemeContext.tsx`** - Enhanced theme management
4. **`src/app/layout.tsx`** - Updated with brand fonts and metadata
5. **`src/app/[locale]/page.tsx`** - Applied pizzeria-themed design
6. **`src/components/header/ThemeToggle.tsx`** - Three-mode theme toggle

### New Features
- **Pizzeria-themed homepage** with authentic Italian pizza content
- **Enhanced theme toggle** with system preference support
- **Brand-consistent styling** across all components
- **Responsive design** optimized for all screen sizes
- **Accessibility improvements** with proper ARIA labels

## 🚀 Benefits

1. **Consistent Brand Identity**: Unified visual language across the entire site
2. **Modern Design System**: Scalable and maintainable design tokens
3. **Accessibility**: WCAG-compliant color contrasts and typography
4. **Performance**: Optimized CSS with minimal bundle size impact
5. **Developer Experience**: Easy-to-use utilities and clear documentation
6. **User Experience**: Smooth theme transitions and responsive design

## 📱 Responsive Design

The brand system includes responsive typography and spacing that adapts to different screen sizes:

- **Mobile**: Compact spacing and smaller font sizes
- **Tablet**: Medium spacing and balanced typography
- **Desktop**: Generous spacing and larger typography for better readability

## 🎨 Design Principles

1. **Authenticity**: Colors and fonts that evoke Italian pizzeria atmosphere
2. **Accessibility**: High contrast ratios and readable typography
3. **Consistency**: Unified spacing, colors, and typography throughout
4. **Modern**: Contemporary design patterns and smooth animations
5. **Responsive**: Optimized for all devices and screen sizes

This brand identity system provides a solid foundation for the Darius Pizza website, ensuring a cohesive and professional appearance that reflects the authentic Italian pizzeria experience.
