import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useThemeContext } from '@/contexts/ThemeContext';

function renderWithProvider(ui: React.ReactNode) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

function Consumer() {
  const { theme, effectiveTheme, setTheme, cycleTheme, isThemeLoaded } =
    useThemeContext();
  return (
    <div>
      <span data-testid='theme'>{theme}</span>
      <span data-testid='effective'>{effectiveTheme}</span>
      <span data-testid='loaded'>{isThemeLoaded ? 'yes' : 'no'}</span>
      <button onClick={() => setTheme('light')}>set-light</button>
      <button onClick={() => setTheme('dark')}>set-dark</button>
      <button onClick={() => setTheme('system')}>set-system</button>
      <button onClick={() => cycleTheme()}>cycle</button>
    </div>
  );
}

// Creates a controllable matchMedia mock that returns the same instance per query
function installMatchMediaMock(initialMatches = false) {
  const listeners = new Set<(e: Event) => void>();
  const mediaQueryList: MediaQueryList = {
    matches: initialMatches,
    media: '(prefers-color-scheme: dark)',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (_: string, cb: (e: Event) => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_: string, cb: (e: Event) => void) => {
      listeners.delete(cb);
    },
    dispatchEvent: (e: Event) => {
      listeners.forEach(cb => cb(e));
      return true;
    },
  } as unknown as MediaQueryList;

  const mock = jest.fn((query: string) => {
    if (query === '(prefers-color-scheme: dark)') return mediaQueryList;
    return mediaQueryList;
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore overriding readonly property for tests
  window.matchMedia = mock as unknown as typeof window.matchMedia;

  return {
    setMatches(value: boolean) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - mutate for test
      mediaQueryList.matches = value;
    },
    mediaQueryList,
  };
}

function setSystemPrefersDark(isDark: boolean) {
  const mm = window.matchMedia('(prefers-color-scheme: dark)');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - our jest polyfill allows overriding matches
  mm.matches = isDark;
  return mm;
}

describe('ThemeContext', () => {
  const storageKey = 'darius-pizza-theme';

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
    document.documentElement.style.removeProperty('--effective-theme');
  });

  test('renders children and exposes context after load', async () => {
    renderWithProvider(<Consumer />);
    expect(await screen.findByTestId('loaded')).toHaveTextContent('yes');
    expect(screen.getByTestId('theme').textContent).toBeDefined();
  });

  test('initial theme comes from localStorage when present', async () => {
    localStorage.setItem(storageKey, 'dark');
    renderWithProvider(<Consumer />);
    expect(await screen.findByTestId('loaded')).toHaveTextContent('yes');
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(
      document.documentElement.style.getPropertyValue('--effective-theme')
    ).toBe('dark');
  });

  test('defaults to system mode when no saved theme', async () => {
    setSystemPrefersDark(false);
    renderWithProvider(<Consumer />);
    expect(await screen.findByTestId('loaded')).toHaveTextContent('yes');
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('effective')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(
      document.documentElement.style.getPropertyValue('--effective-theme')
    ).toBe('light');
  });

  test('setTheme updates state, DOM, and persists to localStorage', async () => {
    renderWithProvider(<Consumer />);
    expect(await screen.findByTestId('loaded')).toHaveTextContent('yes');
    await act(async () => {
      screen.getByText('set-dark').click();
    });
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(localStorage.getItem(storageKey)).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(
      document.documentElement.style.getPropertyValue('--effective-theme')
    ).toBe('dark');
  });

  test('cycleTheme rotates between light -> dark -> system', async () => {
    renderWithProvider(<Consumer />);
    expect(await screen.findByTestId('loaded')).toHaveTextContent('yes');
    const cycleBtn = screen.getByText('cycle');

    // start in system
    expect(screen.getByTestId('theme')).toHaveTextContent('system');

    await act(async () => cycleBtn.click());
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
    expect(localStorage.getItem(storageKey)).toBe('light');

    await act(async () => cycleBtn.click());
    expect(screen.getByTestId('theme')).toHaveTextContent('dark');
    expect(localStorage.getItem(storageKey)).toBe('dark');

    await act(async () => cycleBtn.click());
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(localStorage.getItem(storageKey)).toBe('system');
  });

  test('reacts to system theme changes when in system mode', async () => {
    const ctl = installMatchMediaMock(false);
    renderWithProvider(<Consumer />);
    expect(await screen.findByTestId('loaded')).toHaveTextContent('yes');
    expect(screen.getByTestId('theme')).toHaveTextContent('system');
    expect(screen.getByTestId('effective')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Flip system to dark and dispatch change on the shared MQ list
    act(() => {
      ctl.setMatches(true);
      // trigger listeners attached by provider
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - our mock defines dispatchEvent
      ctl.mediaQueryList.dispatchEvent(new Event('change'));
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(
      document.documentElement.style.getPropertyValue('--effective-theme')
    ).toBe('dark');
  });
});
