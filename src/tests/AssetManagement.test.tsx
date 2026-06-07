import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AssetManagement from '../pages/AssetManagement';

describe('AssetManagement Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title and description', () => {
    render(<AssetManagement />);

    expect(screen.getByText('资产信息管理')).toBeInTheDocument();
    expect(screen.getByText('管理全县机关事业单位装备和办公物资信息')).toBeInTheDocument();
  });

  it('switches between equipment and supplies tabs', async () => {
    render(<AssetManagement />);

    expect(screen.getByText('装备管理')).toHaveClass('bg-primary-500');
    expect(screen.getByText('办公物资管理')).not.toHaveClass('bg-primary-500');

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      expect(screen.getByText('办公物资管理')).toHaveClass('bg-primary-500');
      expect(screen.getByText('装备管理')).not.toHaveClass('bg-primary-500');
    });

    fireEvent.click(screen.getByText('装备管理'));

    await waitFor(() => {
      expect(screen.getByText('装备管理')).toHaveClass('bg-primary-500');
    });
  });

  it('renders equipment list with mock data', () => {
    render(<AssetManagement />);

    expect(screen.getByText('装备列表')).toBeInTheDocument();
    expect(screen.getByText('台式电脑')).toBeInTheDocument();
    expect(screen.getByText('笔记本电脑')).toBeInTheDocument();
    expect(screen.getByText('打印机')).toBeInTheDocument();
    expect(screen.getByText('投影仪')).toBeInTheDocument();
  });

  it('renders supplies list with mock data', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      expect(screen.getByText('办公物资列表')).toBeInTheDocument();
    });

    expect(screen.getByText('A4打印纸')).toBeInTheDocument();
    expect(screen.getByText('签字笔')).toBeInTheDocument();
    expect(screen.getByText('办公椅')).toBeInTheDocument();
    expect(screen.getByText('消毒液')).toBeInTheDocument();
  });

  it('searches equipment by name', async () => {
    render(<AssetManagement />);

    const searchInput = screen.getByPlaceholderText(/搜索装备名称.*编号.*型号或负责人/);
    fireEvent.change(searchInput, { target: { value: '台式电脑' } });

    await waitFor(() => {
      expect(screen.getByText('台式电脑')).toBeInTheDocument();
      expect(screen.queryByText('笔记本电脑')).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('笔记本电脑')).toBeInTheDocument();
    });
  });

  it('searches supplies by name', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/搜索物资名称.*编号/);
      fireEvent.change(searchInput, { target: { value: 'A4打印纸' } });
    });

    await waitFor(() => {
      expect(screen.getByText('A4打印纸')).toBeInTheDocument();
      expect(screen.queryByText('签字笔')).not.toBeInTheDocument();
    });
  });

  it('filters equipment by status', async () => {
    render(<AssetManagement />);

    const statusSelect = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusSelect, { target: { value: 'maintenance' } });

    await waitFor(() => {
      expect(screen.getByText('打印机')).toBeInTheDocument();
      expect(screen.queryByText('台式电脑')).not.toBeInTheDocument();
    });

    fireEvent.change(statusSelect, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('台式电脑')).toBeInTheDocument();
    });
  });

  it('filters equipment by type (category)', async () => {
    render(<AssetManagement />);

    const categorySelect = screen.getAllByRole('combobox')[1];
    fireEvent.change(categorySelect, { target: { value: 'computer' } });

    await waitFor(() => {
      expect(screen.getByText('台式电脑')).toBeInTheDocument();
      expect(screen.getByText('笔记本电脑')).toBeInTheDocument();
      expect(screen.queryByText('打印机')).not.toBeInTheDocument();
    });

    fireEvent.change(categorySelect, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('打印机')).toBeInTheDocument();
    });
  });

  it('filters supplies by status', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      const statusSelect = screen.getAllByRole('combobox')[0];
      fireEvent.change(statusSelect, { target: { value: 'low-stock' } });
    });

    await waitFor(() => {
      expect(screen.getByText('消毒液')).toBeInTheDocument();
      expect(screen.queryByText('A4打印纸')).not.toBeInTheDocument();
    });
  });

  it('filters supplies by category', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      const categorySelect = screen.getAllByRole('combobox')[1];
      fireEvent.change(categorySelect, { target: { value: 'stationery' } });
    });

    await waitFor(() => {
      expect(screen.getByText('A4打印纸')).toBeInTheDocument();
      expect(screen.getByText('签字笔')).toBeInTheDocument();
      expect(screen.queryByText('办公椅')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const categorySelect = screen.getAllByRole('combobox')[1];
      fireEvent.change(categorySelect, { target: { value: '' } });
    });

    await waitFor(() => {
      expect(screen.getByText('办公椅')).toBeInTheDocument();
    });
  });

  it('opens add equipment form modal', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('新增装备'));

    await waitFor(() => {
      expect(screen.getByText('装备信息录入')).toBeInTheDocument();
    });
  });

  it('opens add supplies form modal', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('新增物资'));
    });

    await waitFor(() => {
      expect(screen.getByText('办公物资信息录入')).toBeInTheDocument();
    });
  });

  it('opens equipment detail modal', async () => {
    render(<AssetManagement />);

    const viewButtons = screen.getAllByRole('button', { name: '查看' });
    fireEvent.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('装备详情')).toBeInTheDocument();
      expect(screen.getByText('台式电脑')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('关闭'));

    await waitFor(() => {
      expect(screen.queryByText('装备详情')).not.toBeInTheDocument();
    });
  });

  it('opens supplies detail modal', async () => {
    render(<AssetManagement />);

    fireEvent.click(screen.getByText('办公物资管理'));

    await waitFor(() => {
      const viewButtons = screen.getAllByRole('button', { name: '查看' });
      fireEvent.click(viewButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByText('物资详情')).toBeInTheDocument();
      expect(screen.getByText('A4打印纸')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('关闭'));

    await waitFor(() => {
      expect(screen.queryByText('物资详情')).not.toBeInTheDocument();
    });
  });

  it('opens edit equipment form modal', async () => {
    render(<AssetManagement />);

    const editButtons = screen.getAllByRole('button', { name: '编辑' });
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('编辑装备信息')).toBeInTheDocument();
    });
  });

  it('resets filters correctly', async () => {
    render(<AssetManagement />);

    const searchInput = screen.getByPlaceholderText(/搜索装备名称/);
    const statusSelect = screen.getAllByRole('combobox')[0];
    const departmentSelect = screen.getAllByRole('combobox')[1];

    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.change(statusSelect, { target: { value: 'in-use' } });
    fireEvent.change(departmentSelect, { target: { value: '1' } });

    fireEvent.click(screen.getByText('重置筛选'));

    await waitFor(() => {
      expect((searchInput as HTMLInputElement).value).toBe('');
      expect((statusSelect as HTMLSelectElement).value).toBe('');
      expect((departmentSelect as HTMLSelectElement).value).toBe('');
    });
  });

  it('shows empty state when no data matches', async () => {
    render(<AssetManagement />);

    const searchInput = screen.getByPlaceholderText(/搜索装备名称/);
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('暂无数据')).toBeInTheDocument();
    });
  });
});