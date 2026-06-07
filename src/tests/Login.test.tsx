import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../contexts/AuthContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders login form correctly', () => {
    render(<Login />, { wrapper });

    expect(screen.getByPlaceholderText('请输入用户名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('请输入密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登 录/i })).toBeInTheDocument();
  });

  it('shows modal with required fields when form is submitted empty', async () => {
    render(<Login />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('请填写以下必填项')).toBeInTheDocument();
    expect(within(dialog).getByText('用户名')).toBeInTheDocument();
    expect(within(dialog).getByText('密码')).toBeInTheDocument();
  });

  it('shows modal when only username is empty', async () => {
    render(<Login />, { wrapper });

    fireEvent.change(screen.getByPlaceholderText('请输入密码'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('用户名')).toBeInTheDocument();
    expect(within(dialog).queryByText('密码')).not.toBeInTheDocument();
  });

  it('shows modal when only password is empty', async () => {
    render(<Login />, { wrapper });

    fireEvent.change(screen.getByPlaceholderText('请输入用户名'), { target: { value: 'admin' } });
    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('密码')).toBeInTheDocument();
    expect(within(dialog).queryByText('用户名')).not.toBeInTheDocument();
  });

  it('closes modal when close button is clicked', async () => {
    render(<Login />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    const closeButton = dialog.querySelector('button');
    fireEvent.click(closeButton!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('closes modal when "知道了" button is clicked', async () => {
    render(<Login />, { wrapper });

    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: '知道了' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows modal with error message when credentials are invalid', async () => {
    render(<Login />, { wrapper });

    fireEvent.change(screen.getByPlaceholderText('请输入用户名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('请输入密码'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    expect(screen.getByText('用户名或密码错误，请重新输入')).toBeInTheDocument();
  });

  it('navigates to dashboard when credentials are valid', async () => {
    render(<Login />, { wrapper });

    fireEvent.change(screen.getByPlaceholderText('请输入用户名'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText('请输入密码'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByRole('button', { name: /登 录/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('toggles password visibility', () => {
    render(<Login />, { wrapper });

    const passwordInput = screen.getByPlaceholderText('请输入密码');
    const buttons = screen.getAllByRole('button');
    const toggleButton = buttons.find(btn => btn.querySelector('svg')?.getAttribute('class')?.includes('eye'));

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(toggleButton!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('removes error state when user starts typing', async () => {
    render(<Login />, { wrapper });

    const loginButton = screen.getByRole('button', { name: /登 录/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    const closeButton = dialog.querySelector('button');
    fireEvent.click(closeButton!);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    const usernameInput = screen.getByPlaceholderText('请输入用户名');
    fireEvent.change(usernameInput, { target: { value: 'test' } });

    expect(usernameInput).not.toHaveClass('border-red-500');
  });
});
