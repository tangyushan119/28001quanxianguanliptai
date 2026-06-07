import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmployeeManagement from '../pages/EmployeeManagement';
import { AuthProvider } from '../contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('EmployeeManagement Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'admin:1234567890');
  });

  it('renders employee management page correctly', () => {
    render(<EmployeeManagement />, { wrapper });

    expect(screen.getByText('人员信息档案管理')).toBeInTheDocument();
    expect(screen.getByText('管理全县机关事业单位人员信息')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新增人员' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('搜索姓名、员工编号、电话、邮箱或职位...')).toBeInTheDocument();
  });

  it('displays employee list with mock data', () => {
    render(<EmployeeManagement />, { wrapper });

    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('李四')).toBeInTheDocument();
    expect(screen.getByText('王五')).toBeInTheDocument();
    expect(screen.getByText('赵六')).toBeInTheDocument();
  });

  it('filters employees by search term', async () => {
    render(<EmployeeManagement />, { wrapper });

    const searchInput = screen.getByPlaceholderText('搜索姓名、员工编号、电话、邮箱或职位...');
    
    fireEvent.change(searchInput, { target: { value: '张三' } });

    await waitFor(() => {
      expect(screen.getByText('张三')).toBeInTheDocument();
      expect(screen.queryByText('李四')).not.toBeInTheDocument();
    });
  });

  it('shows employee form modal when add button is clicked', async () => {
    render(<EmployeeManagement />, { wrapper });

    const addButton = screen.getByRole('button', { name: '新增人员' });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByText('人员信息录入').length).toBeGreaterThan(0);
  });

  it('shows validation errors when form is submitted empty', async () => {
    render(<EmployeeManagement />, { wrapper });

    const addButton = screen.getByRole('button', { name: '新增人员' });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: '提交' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('请输入姓名')).toBeInTheDocument();
      expect(screen.getByText('请输入员工编号')).toBeInTheDocument();
    });
  });

  it('closes form modal when cancel button is clicked', async () => {
    render(<EmployeeManagement />, { wrapper });

    const addButton = screen.getByRole('button', { name: '新增人员' });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const cancelButton = screen.getByRole('button', { name: '取消' });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('shows employee detail modal when view button is clicked', async () => {
    render(<EmployeeManagement />, { wrapper });

    const viewButtons = screen.getAllByRole('button', { name: '查看' });
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('人员详情')).toBeInTheDocument();
    expect(within(dialog).getByText('张三')).toBeInTheDocument();
  });

  it('shows edit form when edit button is clicked', async () => {
    render(<EmployeeManagement />, { wrapper });

    const editButtons = screen.getAllByRole('button', { name: '编辑' });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByText('编辑人员信息').length).toBeGreaterThan(0);
  });

  it('deletes employee when delete button is clicked', async () => {
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => true);

    render(<EmployeeManagement />, { wrapper });

    expect(screen.getByText('张三')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: '删除' });
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('张三')).not.toBeInTheDocument();
    });

    window.confirm = originalConfirm;
  });

  it('does not delete employee when cancel is clicked in confirm dialog', async () => {
    const originalConfirm = window.confirm;
    window.confirm = jest.fn(() => false);

    render(<EmployeeManagement />, { wrapper });

    expect(screen.getByText('张三')).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: '删除' });
    fireEvent.click(deleteButtons[0]);

    expect(screen.getByText('张三')).toBeInTheDocument();

    window.confirm = originalConfirm;
  });
});