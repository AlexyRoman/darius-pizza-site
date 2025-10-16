# React Best Practices Rules

REACT BEST PRACTICES RULE: Follow React best practices to write clean, performant, and maintainable components. Prioritize custom hooks over useEffect, embrace composition patterns, and always consider the user experience.

## useEffect Alternatives & Custom Hooks

### 🚫 "You Might Not Need useEffect"

#### Common useEffect Anti-patterns

**❌ Don't Do This:**

```typescript
// Synchronizing state with props
function UserProfile({ user }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setUserData(user);
  }, [user]);

  return <div>{userData?.name}</div>;
}
```

**✅ Do This Instead:**

```typescript
// Derive state from props
function UserProfile({ user }) {
  return <div>{user?.name}</div>;
}
```

**❌ Don't Do This:**

```typescript
// Fetching data in useEffect
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return <div>{users.map(user => <User key={user.id} user={user} />)}</div>;
}
```

**✅ Do This Instead:**

```typescript
// Use custom hook for data fetching
function UserList() {
  const { users, loading } = useUsers();

  return <div>{users.map(user => <User key={user.id} user={user} />)}</div>;
}

// Custom hook
function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}
```

### 🎯 Custom Hooks Best Practices

#### Hook Naming & Structure

```typescript
// ✅ Good: Clear, descriptive name
function useUserProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}

// ✅ Good: Return object with descriptive properties
function useForm<T>(initialValues: T) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (onSubmit: (values: T) => void) => {
    // Validation logic here
    onSubmit(values);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    isValid: Object.keys(errors).length === 0,
  };
}
```

#### Hook Composition

```typescript
// ✅ Good: Compose hooks for complex logic
function useUserDashboard(userId: string) {
  const { user, loading: userLoading } = useUserProfile(userId);
  const { posts, loading: postsLoading } = useUserPosts(userId);
  const { settings } = useUserSettings(userId);

  return {
    user,
    posts,
    settings,
    loading: userLoading || postsLoading,
    // Derived state
    hasPosts: posts.length > 0,
    isComplete: user && posts.length > 0 && settings,
  };
}
```

### 🔄 State Management Patterns

#### Local State First

```typescript
// ✅ Good: Start with local state
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

#### Lift State When Needed

```typescript
// ✅ Good: Lift state to share between components
function Parent() {
  const [theme, setTheme] = useState('light');

  return (
    <div>
      <ThemeToggle theme={theme} onThemeChange={setTheme} />
      <Content theme={theme} />
    </div>
  );
}
```

#### Context for Global State

```typescript
// ✅ Good: Use Context for truly global state
const AuthContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const user = await loginUser(credentials);
    setUser(user);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 🎨 Component Composition Patterns

#### Render Props Pattern

```typescript
// ✅ Good: Flexible component composition
function DataFetcher<T>({
  url,
  children
}: {
  url: string;
  children: (data: T | null, loading: boolean, error: string | null) => React.ReactNode;
}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return <>{children(data, loading, error)}</>;
}

// Usage
<DataFetcher url="/api/users">
  {(users, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserList users={users} />;
  }}
</DataFetcher>
```

#### Compound Components

```typescript
// ✅ Good: Compound component pattern
const Form = ({ children, onSubmit }: { children: React.ReactNode; onSubmit: (data: any) => void }) => {
  return <form onSubmit={onSubmit}>{children}</form>;
};

Form.Field = ({ name, label, ...props }: { name: string; label: string; [key: string]: any }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} {...props} />
    </div>
  );
};

Form.Submit = ({ children }: { children: React.ReactNode }) => {
  return <button type="submit">{children}</button>;
};

// Usage
<Form onSubmit={handleSubmit}>
  <Form.Field name="email" label="Email" type="email" required />
  <Form.Field name="password" label="Password" type="password" required />
  <Form.Submit>Login</Form.Submit>
</Form>
```

### ⚡ Performance Optimization

#### Memoization Patterns

```typescript
// ✅ Good: Memoize expensive calculations
function ExpensiveComponent({ items }: { items: Item[] }) {
  const processedItems = useMemo(() => {
    return items
      .filter(item => item.active)
      .map(item => ({ ...item, processed: true }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  return <div>{processedItems.map(item => <Item key={item.id} item={item} />)}</div>;
}

// ✅ Good: Memoize callback functions
function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}

// ✅ Good: Memoize components
const ExpensiveChild = React.memo(({ data, onAction }: { data: any; onAction: () => void }) => {
  return <div onClick={onAction}>{data.name}</div>;
});
```

#### Lazy Loading

```typescript
// ✅ Good: Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 🧪 Testing Custom Hooks

#### Hook Testing Pattern

```typescript
// ✅ Good: Test custom hooks
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should reset counter', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(0);
  });
});
```

### 📋 useEffect Guidelines

#### When to Use useEffect

- **Data fetching**: When you need to fetch data on mount or when dependencies change
- **Subscriptions**: When you need to subscribe to external data sources
- **DOM manipulation**: When you need to interact with the DOM directly
- **Cleanup**: When you need to clean up resources

#### When NOT to Use useEffect

- **State synchronization**: Use derived state instead
- **Event handlers**: Use event handlers directly
- **Computed values**: Use useMemo instead
- **Side effects in render**: Move to useEffect or event handlers

#### useEffect Best Practices

```typescript
// ✅ Good: Proper dependency array
useEffect(() => {
  const subscription = subscribeToData(id);
  return () => subscription.unsubscribe();
}, [id]); // Include all dependencies

// ✅ Good: Separate effects by concern
useEffect(() => {
  // Handle data fetching
  fetchData(id);
}, [id]);

useEffect(() => {
  // Handle analytics
  trackPageView(id);
}, [id]);

// ✅ Good: Cleanup function
useEffect(() => {
  const timer = setTimeout(() => {
    setData(newData);
  }, 1000);

  return () => clearTimeout(timer);
}, [newData]);
```

This comprehensive guide ensures your React code follows modern best practices and avoids common pitfalls.
