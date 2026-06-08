import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import DutyRecordManagement from '../pages/DutyRecordManagement';
import { 
  addDutyRecord, 
  addFieldRecord, 
  checkDutyRecordExists, 
  checkFieldRecordExists,
  getDutyRecords,
  getFieldRecords,
  getDepartments,
  getEmployees
} from '../store/dataStore';
import { DutyRecord, FieldRecord, Department, Employee } from '../types';

jest.mock('../store/dataStore');

const mockDutyRecords: DutyRecord[] = [];
const mockFieldRecords: FieldRecord[] = [];
const mockDepartments: Department[] = [
  { id: '1', name: '综合科', code: 'ZH', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
];
const mockEmployees: Employee[] = [
  { id: 'EMP001', name: '张三', employeeId: 'EMP001', gender: 'male', birthDate: '1990-01-15', phone: '13800138001', email: 'zhangsan@example.com', departmentId: '1', position: '科长', employmentType: 'full-time', hireDate: '2020-03-15', status: 'active', createdAt: '2020-03-15', updatedAt: '2020-03-15' },
];

describe('DutyRecordManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getDutyRecords as jest.Mock).mockReturnValue(mockDutyRecords);
    (getFieldRecords as jest.Mock).mockReturnValue(mockFieldRecords);
    (getDepartments as jest.Mock).mockReturnValue(mockDepartments);
    (getEmployees as jest.Mock).mockReturnValue(mockEmployees);
  });

  describe('Duty Record Uniqueness Check', () => {
    it('should prevent duplicate duty record submission with same employee, date and dutyType', async () => {
      (checkDutyRecordExists as jest.Mock).mockReturnValue(true);
      
      render(
        <MemoryRouter>
          <DutyRecordManagement />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('新增值班记录'));
      
      await waitFor(() => {
        const selects = screen.getAllByRole('combobox');
        const inputs = screen.getAllByRole('textbox');
        const dateInputs = screen.getAllByRole('textbox', { type: 'date' });
        
        fireEvent.change(selects[0], { target: { value: 'EMP001' } });
        fireEvent.change(dateInputs[0], { target: { value: '2024-01-15' } });
        fireEvent.change(selects[1], { target: { value: 'morning' } });
        fireEvent.change(inputs[0], { target: { value: '值班室' } });
        fireEvent.change(inputs[1], { target: { value: '测试值班' } });
        
        const submitButton = screen.getByRole('button', { name: /提交/ });
        fireEvent.click(submitButton);

        expect(screen.getByText(/已有值班记录/)).toBeInTheDocument();
        expect(addDutyRecord).not.toHaveBeenCalled();
      });
    });

    it('should allow duty record submission when no duplicate exists', async () => {
      (checkDutyRecordExists as jest.Mock).mockReturnValue(false);
      (addDutyRecord as jest.Mock).mockReturnValue({
        id: '1',
        employeeId: 'EMP001',
        employeeName: '张三',
        departmentId: '1',
        dutyDate: '2024-01-15',
        dutyType: 'morning',
        startTime: '08:00',
        endTime: '12:00',
        location: '值班室',
        dutyContent: '测试值班',
        status: 'pending',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      });

      render(
        <MemoryRouter>
          <DutyRecordManagement />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('新增值班记录'));
      
      await waitFor(() => {
        const selects = screen.getAllByRole('combobox');
        const inputs = screen.getAllByRole('textbox');
        const dateInputs = screen.getAllByRole('textbox', { type: 'date' });
        
        fireEvent.change(selects[0], { target: { value: 'EMP001' } });
        fireEvent.change(dateInputs[0], { target: { value: '2024-01-15' } });
        fireEvent.change(selects[1], { target: { value: 'morning' } });
        fireEvent.change(inputs[0], { target: { value: '值班室' } });
        fireEvent.change(inputs[1], { target: { value: '测试值班' } });
        
        const submitButton = screen.getByRole('button', { name: /提交/ });
        fireEvent.click(submitButton);

        expect(addDutyRecord).toHaveBeenCalled();
      });
    });
  });

  describe('Field Record Uniqueness Check', () => {
    it('should prevent duplicate field record submission with overlapping time', async () => {
      (checkFieldRecordExists as jest.Mock).mockReturnValue(true);
      
      render(
        <MemoryRouter>
          <DutyRecordManagement />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('外勤信息'));
      fireEvent.click(screen.getByText('新增外勤记录'));
      
      await waitFor(() => {
        const selects = screen.getAllByRole('combobox');
        const inputs = screen.getAllByRole('textbox');
        const dateInputs = screen.getAllByRole('textbox', { type: 'date' });
        
        fireEvent.change(selects[0], { target: { value: 'EMP001' } });
        fireEvent.change(dateInputs[0], { target: { value: '2024-01-15' } });
        fireEvent.change(inputs[0], { target: { value: '测试地点' } });
        fireEvent.change(inputs[1], { target: { value: '测试外勤' } });
        
        const submitButton = screen.getByRole('button', { name: /提交/ });
        fireEvent.click(submitButton);

        expect(screen.getByText(/已有外勤记录/)).toBeInTheDocument();
        expect(addFieldRecord).not.toHaveBeenCalled();
      });
    });

    it('should allow field record submission when no time overlap exists', async () => {
      (checkFieldRecordExists as jest.Mock).mockReturnValue(false);
      (addFieldRecord as jest.Mock).mockReturnValue({
        id: '1',
        employeeId: 'EMP001',
        employeeName: '张三',
        departmentId: '1',
        fieldDate: '2024-01-15',
        startTime: '09:00',
        endTime: '12:00',
        destination: '测试地点',
        purpose: '测试外勤',
        transportation: 'car',
        status: 'pending',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      });

      render(
        <MemoryRouter>
          <DutyRecordManagement />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByText('外勤信息'));
      fireEvent.click(screen.getByText('新增外勤记录'));
      
      await waitFor(() => {
        const selects = screen.getAllByRole('combobox');
        const inputs = screen.getAllByRole('textbox');
        const dateInputs = screen.getAllByRole('textbox', { type: 'date' });
        
        fireEvent.change(selects[0], { target: { value: 'EMP001' } });
        fireEvent.change(dateInputs[0], { target: { value: '2024-01-15' } });
        fireEvent.change(inputs[0], { target: { value: '测试地点' } });
        fireEvent.change(inputs[1], { target: { value: '测试外勤' } });
        
        const submitButton = screen.getByRole('button', { name: /提交/ });
        fireEvent.click(submitButton);

        expect(addFieldRecord).toHaveBeenCalled();
      });
    });
  });
});