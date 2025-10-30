import { renderHook, waitFor } from '@testing-library/react';
import {
  useAllRestaurantConfigs,
  useMultipleRestaurantConfigs,
  useRestaurantConfig,
} from '../useRestaurantConfig';

jest.mock('@/lib/restaurant-config', () => ({
  loadRestaurantConfig: jest.fn(),
  loadMultipleRestaurantConfigs: jest.fn(),
}));

import {
  loadRestaurantConfig,
  loadMultipleRestaurantConfigs,
} from '@/lib/restaurant-config';

describe('useRestaurantConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads single config successfully and updates states', async () => {
    (loadRestaurantConfig as jest.Mock).mockResolvedValue({ foo: 'bar' });

    const { result } = renderHook(() => useRestaurantConfig('messages'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(loadRestaurantConfig).toHaveBeenCalledWith('messages', undefined);
    expect(result.current.data).toEqual({ foo: 'bar' });
    expect(result.current.error).toBeNull();
  });

  it('sets error when single config load fails', async () => {
    (loadRestaurantConfig as jest.Mock).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useRestaurantConfig('contact'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toBeNull();
  });

  it('handles non-Error rejection in single config load', async () => {
    (loadRestaurantConfig as jest.Mock).mockRejectedValue('string-error');

    const { result } = renderHook(() => useRestaurantConfig('messages'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
  });
});

describe('useMultipleRestaurantConfigs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads multiple configs successfully', async () => {
    (loadMultipleRestaurantConfigs as jest.Mock).mockResolvedValue({
      messages: { a: 1 },
      contact: { email: 'x@y.z' },
    });

    const { result } = renderHook(() =>
      useMultipleRestaurantConfigs(['messages', 'contact'])
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual({});

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(loadMultipleRestaurantConfigs).toHaveBeenCalledWith(
      ['messages', 'contact'],
      undefined
    );
    expect(result.current.data).toEqual({
      messages: { a: 1 },
      contact: { email: 'x@y.z' },
    });
    expect(result.current.error).toBeNull();
  });

  it('sets error when multi config load fails', async () => {
    (loadMultipleRestaurantConfigs as jest.Mock).mockRejectedValue('nope');

    const { result } = renderHook(() =>
      useMultipleRestaurantConfigs(['messages'])
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.data).toEqual({});
  });
});

describe('useAllRestaurantConfigs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('delegates to useMultipleRestaurantConfigs with all types', async () => {
    (loadMultipleRestaurantConfigs as jest.Mock).mockResolvedValue({
      closings: [],
      messages: {},
      'starred-pizzas': [],
      contact: {},
    });

    const { result } = renderHook(() => useAllRestaurantConfigs());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(loadMultipleRestaurantConfigs).toHaveBeenCalledWith(
      ['closings', 'messages', 'starred-pizzas', 'contact'],
      undefined
    );
    expect(result.current.data).toHaveProperty('messages');
    expect(result.current.error).toBeNull();
  });
});
