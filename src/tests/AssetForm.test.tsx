import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import AssetForm from '../components/AssetForm';
import type { Department } from '../types';

const mockDepartments: Department[] = [
  { id: '1', name: '综合科', code: 'ZH', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '文秘科', code: 'WM', organizationId: '1', parentId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];

const mockOnSubmit = jest.fn();

describe('AssetForm - Equipment Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders equipment form correctly', () => {
    render(<AssetForm assetType="equipment" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('装备信息录入')).toBeInTheDocument();
    expect(screen.getByText('名称')).toBeInTheDocument();
    expect(screen.getByText('编号')).toBeInTheDocument();
    expect(screen.getByText('装备类型')).toBeInTheDocument();
    expect(screen.getByText('型号')).toBeInTheDocument();
    expect(screen.getByText('生产厂商')).toBeInTheDocument();
    expect(screen.getByText('采购价格')).toBeInTheDocument();
    expect(screen.getByText('存放位置')).toBeInTheDocument();
    expect(screen.getByText('所属部门')).toBeInTheDocument();
    expect(screen.getByText('负责人')).toBeInTheDocument();
    expect(screen.getByText('采购日期')).toBeInTheDocument();
    expect(screen.getByText('状态')).toBeInTheDocument();
  });

  it('selects equipment type correctly', async () => {
    render(<AssetForm assetType="equipment" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const typeSelect = selects[0];

    expect((typeSelect as HTMLSelectElement).value).toBe('');

    fireEvent.change(typeSelect, { target: { value: 'computer' } });

    await waitFor(() => {
      expect((typeSelect as HTMLSelectElement).value).toBe('computer');
    });
  });

  it('selects equipment status correctly', async () => {
    render(<AssetForm assetType="equipment" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const statusSelect = selects[2];

    expect((statusSelect as HTMLSelectElement).value).toBe('in-use');

    fireEvent.change(statusSelect, { target: { value: 'idle' } });
    expect((statusSelect as HTMLSelectElement).value).toBe('idle');

    fireEvent.change(statusSelect, { target: { value: 'maintenance' } });
    expect((statusSelect as HTMLSelectElement).value).toBe('maintenance');
  });

  it('validates required fields for equipment', async () => {
    render(<AssetForm assetType="equipment" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('提交');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('请输入名称')).toBeInTheDocument();
      expect(screen.getByText('请输入编号')).toBeInTheDocument();
      expect(screen.getByText('请选择装备类型')).toBeInTheDocument();
      expect(screen.getByText('请输入型号')).toBeInTheDocument();
      expect(screen.getByText('请输入生产厂商')).toBeInTheDocument();
      expect(screen.getByText('请输入采购价格')).toBeInTheDocument();
      expect(screen.getByText('请输入存放位置')).toBeInTheDocument();
      expect(screen.getByText('请选择所属部门')).toBeInTheDocument();
      expect(screen.getByText('请输入负责人')).toBeInTheDocument();
      expect(screen.getByText('请选择采购日期')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid equipment form', async () => {
    render(<AssetForm assetType="equipment" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const inputs = screen.getAllByRole('textbox');
    const selects = screen.getAllByRole('combobox');

    fireEvent.change(inputs[0], { target: { value: '测试设备' } });
    fireEvent.change(inputs[1], { target: { value: 'EQ001' } });
    fireEvent.change(inputs[2], { target: { value: 'Test Model' } });
    fireEvent.change(inputs[3], { target: { value: 'Test Manufacturer' } });
    fireEvent.change(inputs[4], { target: { value: '1000' } });
    fireEvent.change(inputs[5], { target: { value: '测试位置' } });
    fireEvent.change(inputs[6], { target: { value: '测试人员' } });

    fireEvent.change(selects[0], { target: { value: 'computer' } });
    fireEvent.change(selects[1], { target: { value: '1' } });

    const dateInputs = screen.getAllByRole('textbox', { type: 'date' });
    fireEvent.change(dateInputs[0], { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});

describe('AssetForm - Supplies Mode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders supplies form correctly', () => {
    render(<AssetForm assetType="supplies" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('办公物资信息录入')).toBeInTheDocument();
    expect(screen.getByText('名称')).toBeInTheDocument();
    expect(screen.getByText('编号')).toBeInTheDocument();
    expect(screen.getByText('物资类别')).toBeInTheDocument();
    expect(screen.getByText('单位')).toBeInTheDocument();
    expect(screen.getByText('数量')).toBeInTheDocument();
    expect(screen.getByText('单价')).toBeInTheDocument();
    expect(screen.getByText('存放位置')).toBeInTheDocument();
    expect(screen.getByText('所属部门')).toBeInTheDocument();
    expect(screen.getByText('采购日期')).toBeInTheDocument();
    expect(screen.getByText('状态')).toBeInTheDocument();
  });

  it('selects supplies category correctly', async () => {
    render(<AssetForm assetType="supplies" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[0];

    expect((categorySelect as HTMLSelectElement).value).toBe('');

    fireEvent.change(categorySelect, { target: { value: 'stationery' } });
    expect((categorySelect as HTMLSelectElement).value).toBe('stationery');

    fireEvent.change(categorySelect, { target: { value: 'furniture' } });
    expect((categorySelect as HTMLSelectElement).value).toBe('furniture');
  });

  it('selects supplies status correctly', async () => {
    render(<AssetForm assetType="supplies" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const statusSelect = selects[2];

    expect((statusSelect as HTMLSelectElement).value).toBe('in-stock');

    fireEvent.change(statusSelect, { target: { value: 'in-use' } });
    expect((statusSelect as HTMLSelectElement).value).toBe('in-use');

    fireEvent.change(statusSelect, { target: { value: 'low-stock' } });
    expect((statusSelect as HTMLSelectElement).value).toBe('low-stock');
  });

  it('validates required fields for supplies', async () => {
    render(<AssetForm assetType="supplies" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('提交');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('请输入名称')).toBeInTheDocument();
      expect(screen.getByText('请输入编号')).toBeInTheDocument();
      expect(screen.getByText('请选择物资类别')).toBeInTheDocument();
      expect(screen.getByText('请输入单位')).toBeInTheDocument();
      expect(screen.getByText('请输入数量')).toBeInTheDocument();
      expect(screen.getByText('请输入单价')).toBeInTheDocument();
      expect(screen.getByText('请输入存放位置')).toBeInTheDocument();
      expect(screen.getByText('请选择所属部门')).toBeInTheDocument();
      expect(screen.getByText('请选择采购日期')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits valid supplies form', async () => {
    render(<AssetForm assetType="supplies" departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const inputs = screen.getAllByRole('textbox');
    const selects = screen.getAllByRole('combobox');

    fireEvent.change(inputs[0], { target: { value: '测试物资' } });
    fireEvent.change(inputs[1], { target: { value: 'SP001' } });
    fireEvent.change(inputs[2], { target: { value: '件' } });
    fireEvent.change(inputs[3], { target: { value: '100' } });
    fireEvent.change(inputs[4], { target: { value: '10' } });
    fireEvent.change(inputs[5], { target: { value: '仓库A区' } });

    fireEvent.change(selects[0], { target: { value: 'stationery' } });
    fireEvent.change(selects[1], { target: { value: '1' } });

    const dateInputs = screen.getAllByRole('textbox', { type: 'date' });
    fireEvent.change(dateInputs[0], { target: { value: '2024-01-01' } });

    fireEvent.click(screen.getByText('提交'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});

describe('AssetForm with Initial Data', () => {
  it('loads initial equipment data correctly', () => {
    const initialData = {
      name: 'Existing Equipment',
      code: 'EQ001',
      type: 'computer',
      model: 'Model X',
      manufacturer: 'Manufacturer Inc',
      purchaseDate: '2023-01-01',
      price: '5000',
      location: 'Office',
      departmentId: '1',
      responsiblePerson: 'John',
      status: 'in-use' as const,
    };

    render(<AssetForm assetType="equipment" departments={mockDepartments} initialData={initialData} onSubmit={mockOnSubmit} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].value).toBe('Existing Equipment');
    expect(inputs[1].value).toBe('EQ001');
    expect(inputs[4].value).toBe('5000');
    expect(inputs[6].value).toBe('John');
  });

  it('loads initial supplies data correctly', () => {
    const initialData = {
      name: 'Existing Supplies',
      code: 'SP001',
      category: 'stationery',
      unit: 'box',
      quantity: '50',
      unitPrice: '20',
      totalPrice: '1000',
      location: 'Warehouse',
      departmentId: '1',
      purchaseDate: '2023-01-01',
      status: 'in-stock' as const,
    };

    render(<AssetForm assetType="supplies" departments={mockDepartments} initialData={initialData} onSubmit={mockOnSubmit} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs[0].value).toBe('Existing Supplies');
    expect(inputs[1].value).toBe('SP001');
    expect(inputs[3].value).toBe('50');
    expect(inputs[4].value).toBe('20');
  });

  it('shows "保存修改" button when editing', () => {
    const initialData = {
      name: 'Existing Equipment',
      code: 'EQ001',
      type: 'computer',
      model: 'Model X',
      manufacturer: 'Manufacturer Inc',
      purchaseDate: '2023-01-01',
      price: '5000',
      location: 'Office',
      departmentId: '1',
      responsiblePerson: 'John',
      status: 'in-use' as const,
    };

    render(<AssetForm assetType="equipment" departments={mockDepartments} initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('保存修改')).toBeInTheDocument();
  });
});