import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with no user when no token exists', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('logs in successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const response = await act(async () => {
      return result.current.login({ username: 'admin', password: 'admin123' });
    });

    expect(response.success).toBe(true);
    expect(response.user.username).toBe('admin');
    expect(response.user.role).toBe('admin');
    expect(result.current.user?.username).toBe('admin');
  });

  it('fails to log in with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const response = await act(async () => {
      return result.current.login({ username: 'admin', password: 'wrong' });
    });

    expect(response.success).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logs out successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ username: 'admin', password: 'admin123' });
    });

    expect(result.current.user?.username).toBe('admin');

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });

  it('persists login state after page refresh', () => {
    localStorage.setItem('quanxianguanli_token', 'admin:1234567890');

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user?.username).toBe('admin');
  });
});
