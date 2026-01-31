# Sidebar Layout & Theming

shadcn sidebar-07 block with Darius Pizza brand palette and layout tweaks.

---

## Installation

```bash
npx shadcn@latest add sidebar-07
```

---

## Structure

### Layout Hierarchy

```
RouteGuard
  └── SidebarProvider
        ├── AppSidebar (collapsible="icon")
        └── SidebarInset
              ├── header (SidebarTrigger + Breadcrumb)
              └── {children} (dashboard pages)
```

### Key Files

| File                                                | Purpose                                          |
| --------------------------------------------------- | ------------------------------------------------ |
| `src/app/[locale]/(dashboard)/dashboard/layout.tsx` | RouteGuard, SidebarProvider, header with trigger |
| `src/components/app-sidebar.tsx`                    | Sidebar nav (Home, Settings submenu)             |
| `src/components/ui/sidebar.tsx`                     | shadcn Sidebar primitives                        |

---

## Brand Palette (globals.css)

Sidebar uses brand colors instead of default grey/white:

```css
/* Light theme */
:root {
  --sidebar: var(--color-background-secondary); /* Cream */
  --sidebar-foreground: var(--color-text-primary); /* Dark brown */
  --sidebar-primary: var(--color-secondary); /* Rich brown */
  --sidebar-primary-foreground: var(--color-background);
  --sidebar-accent: var(--color-background-tertiary);
  --sidebar-accent-foreground: var(--color-text-primary);
  --sidebar-border: var(--color-border);
  --sidebar-ring: var(--color-primary);
}

/* Dark theme */
.dark {
  --sidebar: var(--color-background-secondary); /* Dark brown */
  --sidebar-foreground: var(--color-text-primary); /* Light cream */
  --sidebar-primary: var(--color-primary); /* Orange */
  --sidebar-primary-foreground: var(--color-background);
  --sidebar-accent: var(--color-background-tertiary);
  --sidebar-accent-foreground: var(--color-text-primary);
  --sidebar-border: var(--color-border);
  --sidebar-ring: var(--color-primary);
}
```

---

## Sidebar Trigger (Toggle Button)

**Problem:** Trigger was invisible on laptop (ghost variant) and overlapped by sidebar edge.

**Solution (layout.tsx):**

- **Mobile:** Fixed circular button, primary color, `left-4 top-5 z-50`
- **Desktop (md:):**
  - `md:border md:border-sidebar-border`
  - `md:!bg-sidebar-accent/60 md:!text-sidebar-foreground`
  - `md:hover:!bg-sidebar-accent`
  - `md:pl-6` on header + `md:ml-2` on trigger wrapper to push right (avoid overlap)

---

## Sidebar Rail (Collapse Handle)

**Problem:** Rail was under sidebar edge, hard to find.

**Solution (sidebar.tsx):** Changed `group-data-[side=left]:-right-4` to `-right-6` so the rail extends further into the content area.

---

## Mobile Hook

`src/hooks/use-mobile.ts` – `useIsMobile()`:

- Uses `window.matchMedia(max-width: 767px)`
- useEffect-based; may cause brief layout shift on first paint
- Sidebar uses it for Sheet (mobile) vs desktop layout

**Note:** For better SSR/hydration, consider `useSyncExternalStore` (see shadcn sidebar-14 / useSidebarMobile pattern).

---

## Outline Variant Fix

The sidebar menu button outline variant used `hsl(var(--sidebar-border))`. Brand colors use oklch. Updated to:

```tsx
shadow-[0_0_0_1px_var(--sidebar-border)]
```

---

## Re-implementation Checklist

1. `npx shadcn add sidebar-07`
2. Add sidebar CSS variables in globals.css (map to brand palette)
3. Fix outline variant in sidebar.tsx if using oklch
4. Add header left padding (`md:pl-6`) and trigger margin (`md:ml-2`)
5. Style trigger for visibility: border, accent background, foreground text
6. Adjust rail position: `-right-6` for left sidebar
