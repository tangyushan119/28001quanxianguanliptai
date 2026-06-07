import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import EmployeeForm from '../components/EmployeeForm';
import type { Department } from '../types';

const mockDepartments: Department[] = [
  { id: '1', name: '综合科', code: 'ZH', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '文秘科', code: 'WM', organizationId: '1', parentId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '规划科', code: 'GH', organizationId: '2', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
];

const mockOnSubmit = jest.fn();

describe('EmployeeForm Select Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selects department correctly and syncs value to form', async () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const departmentSelect = selects[1];

    expect((departmentSelect as HTMLSelectElement).value).toBe('');

    fireEvent.change(departmentSelect, { target: { value: '1' } });

    await waitFor(() => {
      expect((departmentSelect as HTMLSelectElement).value).toBe('1');
    });
  });

  it('selects different department options correctly', async () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const departmentSelect = selects[1];

    fireEvent.change(departmentSelect, { target: { value: '2' } });
    expect((departmentSelect as HTMLSelectElement).value).toBe('2');

    fireEvent.change(departmentSelect, { target: { value: '3' } });
    expect((departmentSelect as HTMLSelectElement).value).toBe('3');

    fireEvent.change(departmentSelect, { target: { value: '1' } });
    expect((departmentSelect as HTMLSelectElement).value).toBe('1');
  });

  it('selects gender correctly and syncs value to form', async () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const genderSelect = selects[0];

    expect((genderSelect as HTMLSelectElement).value).toBe('male');

    fireEvent.change(genderSelect, { target: { value: 'female' } });

    await waitFor(() => {
      expect((genderSelect as HTMLSelectElement).value).toBe('female');
    });
  });

  it('selects employment type correctly and syncs value to form', async () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const employmentTypeSelect = selects[2];

    expect((employmentTypeSelect as HTMLSelectElement).value).toBe('full-time');

    fireEvent.change(employmentTypeSelect, { target: { value: 'part-time' } });
    expect((employmentTypeSelect as HTMLSelectElement).value).toBe('part-time');

    fireEvent.change(employmentTypeSelect, { target: { value: 'contract' } });
    expect((employmentTypeSelect as HTMLSelectElement).value).toBe('contract');
  });

  it('selects status correctly and syncs value to form', async () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const statusSelect = selects[3];

    expect((statusSelect as HTMLSelectElement).value).toBe('active');

    fireEvent.change(statusSelect, { target: { value: 'on-leave' } });
    expect((statusSelect as HTMLSelectElement).value).toBe('on-leave');

    fireEvent.change(statusSelect, { target: { value: 'resigned' } });
    expect((statusSelect as HTMLSelectElement).value).toBe('resigned');
  });

  it('maintains selected value after selection', async () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const departmentSelect = selects[1];

    fireEvent.change(departmentSelect, { target: { value: '1' } });
    
    const updatedSelects = screen.getAllByRole('combobox');
    expect((updatedSelects[1] as HTMLSelectElement).value).toBe('1');
  });

  it('shows all department options in dropdown', () => {
    render(<EmployeeForm departments={mockDepartments} onSubmit={mockOnSubmit} />);

    const selects = screen.getAllByRole('combobox');
    const departmentSelect = selects[1];
    
    const options = within(departmentSelect).getAllByRole('option');
    expect(options).toHaveLength(4);
    expect(options[0].textContent).toBe('请选择部门');
    expect(options[1].textContent).toBe('综合科');
    expect(options[2].textContent).toBe('文秘科');
    expect(options[3].textContent).toBe('规划科');
  });
});