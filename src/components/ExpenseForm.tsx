import { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardBody } from './Card';
import type { ExpenseRecordFormData, Department } from '../types';

interface ExpenseFormProps {
  departments: Department[];
  employees: { id: string; name: string }[];
  initialData?: ExpenseRecordFormData;
  onSubmit: (data: ExpenseRecordFormData) => void;
  onCancel?: () => void;
  title?: string;
}

const expenseTypeOptions = [
  { value: 'income', label: '收入' },
  { value: 'expense', label: '支出' },
];

const incomeCategoryOptions = [
  { value: 'salary', label: '工资收入' },
  { value: 'bonus', label: '奖金' },
  { value: 'reimbursement', label: '报销' },
  { value: 'other_income', label: '其他收入' },
];

const expenseCategoryOptions = [
  { value: 'office_supplies', label: '办公用品' },
  { value: 'travel', label: '差旅费' },
  { value: 'entertainment', label: '招待费' },
  { value: 'equipment', label: '设备采购' },
  { value: 'utilities', label: '水电费' },
  { value: 'rent', label: '房租' },
  { value: 'other_expense', label: '其他支出' },
];

const paymentMethodOptions = [
  { value: 'cash', label: '现金' },
  { value: 'bank', label: '银行转账' },
  { value: 'card', label: '银行卡' },
  { value: 'other', label: '其他' },
];

const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已驳回' },
];

export default function ExpenseForm({
  departments,
  employees,
  initialData,
  onSubmit,
  onCancel,
  title = initialData ? '编辑经费记录' : '经费收支录入',
}: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseRecordFormData>({
    employeeId: '',
    employeeName: '',
    departmentId: '',
    expenseType: 'expense',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'bank',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find((emp) => emp.id === formData.employeeId);
      if (employee) {
        setFormData((prev) => ({ ...prev, employeeName: employee.name }));
      }
    }
  }, [formData.employeeId, employees]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId) {
      newErrors.employeeId = '请选择员工';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = '请选择部门';
    }
    if (!formData.category) {
      newErrors.category = '请选择类别';
    }
    if (!formData.amount.trim()) {
      newErrors.amount = '请输入金额';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = '请输入有效的金额';
    }
    if (!formData.date) {
      newErrors.date = '请选择日期';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const currentCategoryOptions = formData.expenseType === 'income'
    ? incomeCategoryOptions
    : expenseCategoryOptions;

  return (
    <div className="space-y-0">
      <div className="pb-4 mb-5 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 leading-tight">{title}</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              收支类型 <span className="text-error-500">*</span>
            </label>
            <Select
              value={formData.expenseType}
              onChange={(e) => {
                handleChange('expenseType', (e.target as HTMLSelectElement).value);
                setFormData((prev) => ({ ...prev, category: '' }));
              }}
              className="h-11"
            >
              {expenseTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              类别 <span className="text-error-500">*</span>
            </label>
            <Select
              value={formData.category}
              onChange={(e) => handleChange('category', (e.target as HTMLSelectElement).value)}
              status={errors.category ? 'error' : 'default'}
              className="h-11"
            >
              <option value="">请选择类别</option>
              {currentCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              金额 <span className="text-error-500">*</span>
            </label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="请输入金额"
              status={errors.amount ? 'error' : 'default'}
              errorMessage={errors.amount}
              className="h-11"
            />
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              日期 <span className="text-error-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              status={errors.date ? 'error' : 'default'}
              errorMessage={errors.date}
              className="h-11"
            />
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              员工 <span className="text-error-500">*</span>
            </label>
            <Select
              value={formData.employeeId}
              onChange={(e) => handleChange('employeeId', (e.target as HTMLSelectElement).value)}
              status={errors.employeeId ? 'error' : 'default'}
              className="h-11"
            >
              <option value="">请选择员工</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              部门 <span className="text-error-500">*</span>
            </label>
            <Select
              value={formData.departmentId}
              onChange={(e) => handleChange('departmentId', (e.target as HTMLSelectElement).value)}
              status={errors.departmentId ? 'error' : 'default'}
              className="h-11"
            >
              <option value="">请选择部门</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              支付方式
            </label>
            <Select
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', (e.target as HTMLSelectElement).value)}
              className="h-11"
            >
              {paymentMethodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              状态
            </label>
            <Select
              value={formData.status}
              onChange={(e) => handleChange('status', (e.target as HTMLSelectElement).value)}
              className="h-11"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2.5 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 tracking-wide">
              备注说明
            </label>
            <Input
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="请输入备注说明"
              className="h-11"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} className="h-11 px-6">
              取消
            </Button>
          )}
          <Button type="submit" className="h-11 px-6">
            {initialData ? '保存修改' : '提交'}
          </Button>
        </div>
      </form>
    </div>
  );
}
