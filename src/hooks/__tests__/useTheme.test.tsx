import { renderHook } from '@testing-library/react';
import { useTheme } from '../useTheme';

jest.mock('@/contexts/ThemeContext', () => ({
  useThemeContext: jest.fn(),
}));

import { useThemeContext } from '@/contexts/ThemeContext';

describe('useTheme', () => {
  it('returns ThemeContext value', () => {
    (useThemeContext as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: jest.fn(),
    });

    const { result } = renderHook(() => useTheme());

    expect(result.current).toEqual({
      theme: 'dark',
      setTheme: expect.any(Function),
    });
  });
});
