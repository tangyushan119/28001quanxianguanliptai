import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DataManagement from '../pages/DataManagement';

describe('DataManagement Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data table correctly', () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('数据管理')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新增数据' })).toBeInTheDocument();
    expect(screen.getByText('城镇人口')).toBeInTheDocument();
    expect(screen.getByText('农村人口')).toBeInTheDocument();
  });

  it('opens add modal when "新增数据" button is clicked', () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增数据' });
    fireEvent.click(addButton);

    expect(screen.getAllByText('新增数据').length).toBe(2);
  });

  it('shows error modal when form is submitted empty', async () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增数据' });
    fireEvent.click(addButton);

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('请填写以下必填项')).toBeInTheDocument();
    expect(within(dialog).getByText('数据名称')).toBeInTheDocument();
    expect(within(dialog).getByText('数值')).toBeInTheDocument();
    expect(within(dialog).getByText('分类')).toBeInTheDocument();
  });

  it('shows error modal when only name is empty', async () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增数据' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入数值'), { target: { value: '100' } });
    fireEvent.change(screen.getByDisplayValue('请选择分类'), { target: { value: '人口数据' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('数据名称')).toBeInTheDocument();
    expect(within(dialog).queryByText('数值')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('分类')).not.toBeInTheDocument();
  });

  it('shows error modal when only value is empty', async () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增数据' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入数据名称'), { target: { value: '测试数据' } });
    fireEvent.change(screen.getByDisplayValue('请选择分类'), { target: { value: '人口数据' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('数值')).toBeInTheDocument();
    expect(within(dialog).queryByText('数据名称')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('分类')).not.toBeInTheDocument();
  });

  it('shows error modal when only category is empty', async () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增数据' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入数据名称'), { target: { value: '测试数据' } });
    fireEvent.change(screen.getByPlaceholderText('请输入数值'), { target: { value: '100' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: '提示' })).toBeInTheDocument();
    });

    const dialog = screen.getByRole('dialog', { name: '提示' });
    expect(within(dialog).getByText('分类')).toBeInTheDocument();
    expect(within(dialog).queryByText('数据名称')).not.toBeInTheDocument();
    expect(within(dialog).queryByText('数值')).not.toBeInTheDocument();
  });

  it('closes error modal when "知道了" button is clicked', async () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    const addButton = screen.getByRole('button', { name: '新增数据' });
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

  it('adds new data when form is valid', async () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    expect(screen.queryByText('测试新增数据')).not.toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: '新增数据' });
    fireEvent.click(addButton);

    fireEvent.change(screen.getByPlaceholderText('请输入数据名称'), { target: { value: '测试新增数据' } });
    fireEvent.change(screen.getByPlaceholderText('请输入数值'), { target: { value: '500' } });
    fireEvent.change(screen.getByDisplayValue('请选择分类'), { target: { value: '人口数据' } });

    const submitButton = screen.getByRole('button', { name: '新增' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('测试新增数据')).toBeInTheDocument();
    });
  });

  it('filters data by search term', () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('城镇人口')).toBeInTheDocument();
    expect(screen.getByText('农村人口')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('搜索数据名称或分类...');
    fireEvent.change(searchInput, { target: { value: '城镇' } });

    expect(screen.getByText('城镇人口')).toBeInTheDocument();
    expect(screen.queryByText('农村人口')).not.toBeInTheDocument();
  });

  it('filters data by category', () => {
    render(
      <MemoryRouter>
        <DataManagement />
      </MemoryRouter>
    );

    expect(screen.getByText('城镇人口')).toBeInTheDocument();
    expect(screen.getByText('GDP增长率')).toBeInTheDocument();

    const categorySelect = screen.getByRole('combobox');
    fireEvent.change(categorySelect, { target: { value: '人口数据' } });

    expect(screen.getByText('城镇人口')).toBeInTheDocument();
    expect(screen.queryByText('GDP增长率')).not.toBeInTheDocument();
  });
});
