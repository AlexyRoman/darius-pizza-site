# Folder Organization: @lib vs @utils

## Overview

This project uses two distinct folders for organizing utility functions and helper modules:

- **`@lib`** - Server-side and shared utilities
- **`@utils`** - Client-side only utilities

## @lib Folder

**Purpose**: Contains server-side utilities, shared utilities, data loaders, and configuration functions that can be used in both server and client components.

**Characteristics**:
- ✅ Can be imported in Server Components (page.tsx, layout.tsx, API routes)
- ✅ Can be imported in Client Components (components with 'use client')
- ✅ No browser-specific APIs (`window`, `document`)
- ✅ No `'use client'` directive
- ✅ Pure functions, data loaders, configuration utilities

**Files in @lib**:
- `restaurant-config.ts` - Loads restaurant configuration data
- `menu-loader.ts` - Loads menu items with translations
- `server-restaurant-config.ts` - Server-side config helpers
- `metadata.ts` - Server-side metadata generation for Next.js
- `og-metadata.ts` - Open Graph metadata generation
- `env.ts` - Environment variable validation (server-safe)
- `fonts.ts` - Font configuration for Next.js
- `opening-hours-utils.ts` - Business logic for opening hours
- `date-utils.ts` - Date formatting utilities (locale-aware)
- `site-utils.ts` - Site configuration utilities
- `pacer.ts` - Rate limiting utilities
- `utils.ts` - Tailwind CSS utility (cn function)

## @utils Folder

**Purpose**: Contains client-side only utilities that require browser APIs or React client-side features.

**Characteristics**:
- ✅ Uses browser APIs (`window`, `document`, `navigator`)
- ✅ May have `'use client'` directive
- ✅ Should only be imported in Client Components
- ❌ Cannot be used in Server Components or API routes

**Files in @utils**:
- `analytics.ts` - Google Analytics integration (uses `window.gtag`)
- `cookie-utils.ts` - Cookie management (uses `document.cookie`)

## Decision Guidelines

### Use @lib when:
- The utility works on both server and client
- The utility is a pure function
- The utility loads data or configuration
- The utility generates metadata or server-side content
- The utility doesn't depend on browser APIs

### Use @utils when:
- The utility requires `window`, `document`, or other browser APIs
- The utility is React-specific client-side code
- The utility manages browser state (cookies, localStorage, etc.)
- The utility interacts with third-party client-side libraries

## Examples

### ✅ Correct: Shared utility in @lib
```typescript
// @lib/date-utils.ts
export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale);
}
```

### ✅ Correct: Client-only utility in @utils
```typescript
// @utils/cookie-utils.ts
'use client';

export function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  // ... browser API usage
}
```

### ❌ Wrong: Browser API in @lib
```typescript
// @lib/some-utils.ts (WRONG!)
export function getCookie(name: string): string | null {
  document.cookie; // ❌ Browser API in @lib
}
```

### ❌ Wrong: Shared utility in @utils
```typescript
// @utils/date-utils.ts (WRONG!)
export function formatDate(date: Date): string {
  return date.toISOString(); // ✅ This could be in @lib instead
}
```

## Migration Notes

- Removed `@utils/seo.ts` - Was unused and duplicated functionality from `@lib/metadata.ts`
- All utilities are now correctly organized according to their usage patterns

