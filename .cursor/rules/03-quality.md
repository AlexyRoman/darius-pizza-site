# Code Quality Rules

CODE QUALITY RULE: All code you write must be clean, modular, and well-commented. It must strictly follow the project's existing style, including all TypeScript, ESLint, and Prettier configurations. For any new feature or business logic you add, you must also create or update corresponding tests (unit or E2E) to verify its correctness.

## Quality Standards

### Code Style

- Follow existing TypeScript configurations
- Use consistent naming conventions
- Maintain proper indentation and formatting
- Include meaningful comments for complex logic

### Testing Requirements

- Unit tests for all business logic
- Integration tests for API endpoints
- E2E tests for user workflows
- Test coverage for new features

### Documentation

- Document complex functions and components
- Include usage examples where appropriate
- Update README files when adding new features
- Maintain API documentation

## File Modularity & Complexity Rules

### File Size Limits

- **Maximum file length**: 150 lines per file
- **Component files**: Keep React components under 100 lines
- **Utility files**: Keep utility functions under 150 lines
- **Test files**: Keep test files under 200 lines

### Modularity Principles

#### Component Architecture

- **Single Responsibility**: Each component should do one thing well
- **Composition over Inheritance**: Use composition patterns
- **Props Interface**: Define clear, typed prop interfaces
- **Default Props**: Provide sensible defaults for optional props

#### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Modal/
│   ├── features/        # Feature-specific components
│   │   ├── auth/
│   │   └── dashboard/
│   └── layout/          # Layout components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
└── types/               # TypeScript type definitions
```

#### Reusable UI/UX Components

- **Atomic Design**: Build from atoms → molecules → organisms
- **Consistent API**: Similar props across similar components
- **Accessibility First**: All components must be accessible
- **Theme Integration**: Use design system tokens

### Complexity Management

#### Function Complexity

- **Maximum function length**: 20 lines
- **Maximum parameters**: 3 parameters (use objects for more)
- **Cyclomatic complexity**: Keep under 5
- **Nesting depth**: Maximum 3 levels

#### Component Complexity

- **Single purpose**: One clear responsibility
- **State management**: Use custom hooks for complex state
- **Side effects**: Minimize useEffect usage
- **Performance**: Memoize expensive calculations

#### Code Splitting

- **Route-based**: Split by page/route
- **Component-based**: Lazy load heavy components
- **Feature-based**: Split by feature modules

### React Best Practices

#### Custom Hooks

- **Extract reusable logic**: Move complex state to custom hooks
- **Naming convention**: Use `use` prefix (e.g., `useAuth`, `useForm`)
- **Single responsibility**: One hook = one concern
- **Return clear interface**: Return objects with descriptive properties

#### useEffect Guidelines

- **Avoid unnecessary effects**: Only use when truly needed
- **Dependency arrays**: Always include all dependencies
- **Cleanup functions**: Return cleanup for subscriptions/timeouts
- **Effect separation**: Split complex effects into multiple simple ones

#### State Management

- **Local state first**: Use useState for component-specific state
- **Lift state up**: Share state between components when needed
- **Context sparingly**: Use Context for truly global state
- **External state**: Use libraries (Zustand, Redux) for complex state

### Performance Guidelines

#### Rendering Optimization

- **React.memo**: Memoize components that re-render frequently
- **useMemo**: Memoize expensive calculations
- **useCallback**: Memoize function references
- **Avoid inline objects**: Prevent unnecessary re-renders

#### Bundle Optimization

- **Tree shaking**: Use ES6 imports
- **Code splitting**: Lazy load routes and components
- **Bundle analysis**: Monitor bundle size regularly
- **Dependency optimization**: Remove unused dependencies

### Code Organization

#### Import Order

```typescript
// 1. React and Next.js imports
import React from 'react';
import { useRouter } from 'next/router';

// 2. Third-party libraries
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// 3. Internal utilities and types
import { formatDate } from '@/utils/date';
import type { User } from '@/types';

// 4. Components and hooks
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
```

#### Export Patterns

```typescript
// Named exports for utilities
export { formatDate, parseDate } from './date';

// Default exports for components
export default UserProfile;

// Barrel exports for components
export { Button } from './Button';
export { Input } from './Input';
```

### Error Handling

#### Component Error Boundaries

- **Graceful degradation**: Handle errors without crashing
- **User-friendly messages**: Show helpful error messages
- **Error reporting**: Log errors for debugging
- **Recovery mechanisms**: Provide retry options

#### Async Operations

- **Loading states**: Show loading indicators
- **Error states**: Handle and display errors
- **Success states**: Confirm successful operations
- **Optimistic updates**: Update UI immediately when possible
