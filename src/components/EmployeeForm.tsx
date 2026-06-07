import { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardBody } from './Card';
import type { EmployeeFormData, Department } from '../types';

interface EmployeeFormProps {
  departments: Department[];
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel?: () => void;
  title?: string;
}

export default function EmployeeForm({
  departments,
  initialData,
  onSubmit,
  onCancel,
  title = '人员信息录入',
}: EmployeeFormProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: '',
    employeeId: '',
    gender: 'male',
    birthDate: '',
    phone: '',
    email: '',
    address: '',
    departmentId: '',
    position: '',
    employmentType: 'full-time',
    hireDate: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = '请输入员工编号';
    }
    if (!formData.birthDate) {
      newErrors.birthDate = '请选择出生日期';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号码';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号码';
    }
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = '请选择所属部门';
    }
    if (!formData.position.trim()) {
      newErrors.position = '请输入职位';
    }
    if (!formData.hireDate) {
      newErrors.hireDate = '请选择入职日期';
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

  const handleChange = (field: keyof EmployeeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                姓名 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="请输入姓名"
                status={errors.name ? 'error' : 'default'}
                errorMessage={errors.name}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                员工编号 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.employeeId}
                onChange={(e) => handleChange('employeeId', e.target.value)}
                placeholder="请输入员工编号"
                status={errors.employeeId ? 'error' : 'default'}
                errorMessage={errors.employeeId}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                性别
              </label>
              <Select
                value={formData.gender}
                onChange={(value) => handleChange('gender', value)}
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                出生日期 <span className="text-error-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                status={errors.birthDate ? 'error' : 'default'}
                errorMessage={errors.birthDate}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                手机号码 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="请输入手机号码"
                status={errors.phone ? 'error' : 'default'}
                errorMessage={errors.phone}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                邮箱地址 <span className="text-error-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="请输入邮箱地址"
                status={errors.email ? 'error' : 'default'}
                errorMessage={errors.email}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                所属部门 <span className="text-error-500">*</span>
              </label>
              <Select
                value={formData.departmentId}
                onChange={(value) => handleChange('departmentId', value)}
                status={errors.departmentId ? 'error' : 'default'}
              >
                <option value="">请选择部门</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                职位 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.position}
                onChange={(e) => handleChange('position', e.target.value)}
                placeholder="请输入职位"
                status={errors.position ? 'error' : 'default'}
                errorMessage={errors.position}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                用工类型
              </label>
              <Select
                value={formData.employmentType}
                onChange={(value) => handleChange('employmentType', value)}
              >
                <option value="full-time">全职</option>
                <option value="part-time">兼职</option>
                <option value="contract">合同工</option>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                入职日期 <span className="text-error-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.hireDate}
                onChange={(e) => handleChange('hireDate', e.target.value)}
                status={errors.hireDate ? 'error' : 'default'}
                errorMessage={errors.hireDate}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                状态
              </label>
              <Select
                value={formData.status}
                onChange={(value) => handleChange('status', value)}
              >
                <option value="active">在职</option>
                <option value="on-leave">休假</option>
                <option value="resigned">离职</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                住址
              </label>
              <Input
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="请输入住址"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                取消
              </Button>
            )}
            <Button type="submit">
              {initialData ? '保存修改' : '提交'}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}