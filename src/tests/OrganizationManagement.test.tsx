import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OrganizationManagement from '../pages/OrganizationManagement';

describe('OrganizationManagement Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders organization management page correctly', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('单位部门管理')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新增单位' })).toBeInTheDocument();
    expect(screen.getByText('单位管理')).toBeInTheDocument();
    expect(screen.getByText('部门管理')).toBeInTheDocument();
    expect(screen.getByText('县政府办公室')).toBeInTheDocument();
    expect(screen.getByText('发展和改革局')).toBeInTheDocument();
  });

  it('switches between organization and department tabs', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('县政府办公室')).toBeInTheDocument();
    expect(screen.queryByText('综合科')).not.toBeInTheDocument();

    const deptTab = screen.getByRole('button', { name: '部门管理' });
    fireEvent.click(deptTab);

    expect(screen.getByText('综合科')).toBeInTheDocument();
    const searchInput = screen.getByPlaceholderText('搜索部门名称或编码...');
    expect(searchInput).toBeInTheDocument();
  });

  it('opens add organization modal when "新增单位" button is clicked', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    expect(screen.getByRole('dialog', { name: '新增单位' })).toBeInTheDocument();
  });

  it('opens add department modal when "新增部门" button is clicked', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const deptTab = screen.getByRole('button', { name: '部门管理' });
    fireEvent.click(deptTab);

    const addButton = screen.getByRole('button', { name: '新增部门' });
    fireEvent.click(addButton);

    expect(screen.getByRole('dialog', { name: '新增部门' })).toBeInTheDocument();
  });

  it('shows error modal when adding organization with empty name', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'TEST' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('名称')).toBeInTheDocument();
  });

  it('shows error modal when adding organization with empty code', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '测试单位' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('编码')).toBeInTheDocument();
  });

  it('shows error modal when adding department without organization', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const deptTab = screen.getByRole('button', { name: '部门管理' });
    fireEvent.click(deptTab);

    const addButton = screen.getByRole('button', { name: '新增部门' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入部门名称'), { target: { value: '测试部门' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'BM001' } });
    
    const orgSelect = screen.getByRole('combobox');
    fireEvent.change(orgSelect, { target: { value: '' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('所属单位')).toBeInTheDocument();
  });

  it('adds new organization when form is valid', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    expect(screen.queryByText('测试新增单位')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '测试新增单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'TEST001' } });
    fireEvent.change(screen.getByPlaceholderText('请输入地址'), { target: { value: '测试地址' } });
    fireEvent.change(screen.getByPlaceholderText('请输入联系电话'), { target: { value: '123456789' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('测试新增单位')).toBeInTheDocument();
    });
  });

  it('adds new department when form is valid', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const deptTab = screen.getByRole('button', { name: '部门管理' });
    fireEvent.click(deptTab);

    expect(screen.queryByText('测试新增部门')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: '新增部门' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入部门名称'), { target: { value: '测试新增部门' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'BM001' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('测试新增部门')).toBeInTheDocument();
    });
  });

  it('opens edit modal when edit button is clicked', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const editButtons = screen.getAllByRole('button', { name: '' });
    const firstEditButton = editButtons[0];
    fireEvent.click(firstEditButton);

    expect(screen.getByRole('dialog', { name: '编辑单位' })).toBeInTheDocument();
  });

  it('filters organizations by search term', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('县政府办公室')).toBeInTheDocument();
    expect(screen.getByText('发展和改革局')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('搜索单位名称或编码...');
    fireEvent.change(searchInput, { target: { value: '财政' } });

    expect(screen.getByText('财政局')).toBeInTheDocument();
    expect(screen.queryByText('县政府办公室')).not.toBeInTheDocument();
  });

  it('filters departments by search term', () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const deptTab = screen.getByRole('button', { name: '部门管理' });
    fireEvent.click(deptTab);

    expect(screen.getByText('综合科')).toBeInTheDocument();
    expect(screen.getByText('文秘科')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('搜索部门名称或编码...');
    fireEvent.change(searchInput, { target: { value: '规划' } });

    expect(screen.getByText('规划科')).toBeInTheDocument();
    expect(screen.queryByText('综合科')).not.toBeInTheDocument();
  });

  it('closes error modal when "知道了" button is clicked', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const confirmButton = screen.getByRole('button', { name: '知道了' });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '提示' })).not.toBeInTheDocument();
    });
  });

  it('shows error when organization code is too short', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '测试单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'AB' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('编码格式不正确')).toBeInTheDocument();
  });

  it('shows error when organization code contains lowercase', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '测试单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'Abc' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('编码格式不正确')).toBeInTheDocument();
  });

  it('shows error when organization code already exists', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '重复单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'XZFB' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('该单位编码已存在')).toBeInTheDocument();
  });

  it('shows error when department code already exists in same organization', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const deptTab = screen.getByRole('button', { name: '部门管理' });
    fireEvent.click(deptTab);

    const addButton = screen.getByRole('button', { name: '新增部门' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入部门名称'), { target: { value: '重复部门' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'ZH' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('同一单位下该部门编码已存在')).toBeInTheDocument();
  });

  it('shows error when phone number format is invalid', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '测试单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'TEST' } });
    fireEvent.change(screen.getByPlaceholderText('请输入联系电话（固定电话如010-12345678或手机号）'), { target: { value: '123456' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('电话号码格式不正确')).toBeInTheDocument();
  });

  it('accepts valid phone number formats', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    expect(screen.queryByText('有效电话单位')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '有效电话单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'TEST' } });
    fireEvent.change(screen.getByPlaceholderText('请输入联系电话（固定电话如010-12345678或手机号）'), { target: { value: '13812345678' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('有效电话单位')).toBeInTheDocument();
    });
  });

  it('accepts valid fixed phone number format', async () => {
    render(
      <MemoryRouter>
        <OrganizationManagement />
      </MemoryRouter>
    );

    expect(screen.queryByText('固定电话单位')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: '新增单位' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入单位名称'), { target: { value: '固定电话单位' } });
    fireEvent.change(screen.getByPlaceholderText('请输入编码'), { target: { value: 'TEST' } });
    fireEvent.change(screen.getByPlaceholderText('请输入联系电话（固定电话如010-12345678或手机号）'), { target: { value: '010-12345678' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('固定电话单位')).toBeInTheDocument();
    });
  });
});