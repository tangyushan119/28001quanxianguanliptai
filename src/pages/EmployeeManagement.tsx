import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, X, User, Filter } from 'lucide-react';
import { Employee, Department, Organization, EmployeeFormData } from '../types';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Modal, Select } from '../components';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeList from '../components/EmployeeList';
import { getOrganizations, getDepartments, getEmployees, addEmployee, updateEmployee, subscribe } from '../store/dataStore';

const statusConfig = {
  active: { label: '在职', variant: 'success' as const },
  'on-leave': { label: '休假', variant: 'warning' as const },
  resigned: { label: '离职', variant: 'secondary' as const },
};

const employmentTypeConfig = {
  'full-time': '全职',
  'part-time': '兼职',
  'contract': '合同工',
};

const genderConfig = {
  male: '男',
  female: '女',
};

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState<Employee[]>(getEmployees());
  const [departments, setDepartments] = useState<Department[]>(getDepartments());
  const [organizations] = useState<Organization[]>(getOrganizations());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setDepartments(getDepartments());
    });
    return unsubscribe;
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch = !searchTerm.trim() ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.phone.includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || emp.status === statusFilter;
      const matchesDepartment = !departmentFilter || emp.departmentId === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchTerm, statusFilter, departmentFilter]);

  const activeDepartments = departments.filter((d) => d.status === 'active');

  const getDepartmentName = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (!dept) return '-';
    const org = organizations.find((o) => o.id === dept.organizationId);
    return `${org?.name || ''} - ${dept.name}`;
  };

  const handleSubmit = (data: EmployeeFormData) => {
    if (editingEmployee) {
      updateEmployee(editingEmployee.id, data);
    } else {
      addEmployee(data);
    }
    
    closeForm();
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleView = (employee: Employee) => {
    setViewingEmployee(employee);
    setShowDetail(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该员工信息吗？')) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const openAddForm = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setViewingEmployee(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">人员信息档案管理</h1>
          <p className="text-gray-500 mt-1">管理全县机关事业单位人员信息</p>
        </div>
        <Button onClick={openAddForm} leftIcon={<Plus className="w-5 h-5" />}>
          新增人员
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索姓名、员工编号、电话、邮箱或职位..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">筛选条件：</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className="text-sm text-gray-500">状态：</span>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[100px]"
              >
                <option value="">全部</option>
                <option value="active">在职</option>
                <option value="on-leave">休假</option>
                <option value="resigned">离职</option>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[180px]">
              <span className="text-sm text-gray-500">部门：</span>
              <Select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="min-w-[140px]"
              >
                <option value="">全部</option>
                {activeDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {getDepartmentName(dept.id)}
                  </option>
                ))}
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('');
                setDepartmentFilter('');
                setSearchTerm('');
              }}
            >
              重置筛选
            </Button>
          </div>
        </div>
      </div>

      <EmployeeList
        employees={filteredEmployees}
        departments={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingEmployee ? '编辑人员信息' : '人员信息录入'}
        size="lg"
      >
        <EmployeeForm
          departments={activeDepartments}
          initialData={editingEmployee || undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          title={editingEmployee ? '编辑人员信息' : '人员信息录入'}
        />
      </Modal>

      <Modal
        isOpen={showDetail}
        onClose={closeDetail}
        title="人员详情"
        size="md"
      >
        {viewingEmployee && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{viewingEmployee.name}</h3>
                <p className="text-gray-500 text-sm">{viewingEmployee.employeeId}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">性别</p>
                <p className="font-medium text-gray-800">{genderConfig[viewingEmployee.gender]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">出生日期</p>
                <p className="font-medium text-gray-800">
                  {new Date(viewingEmployee.birthDate).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">手机号码</p>
                <p className="font-medium text-gray-800">{viewingEmployee.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">邮箱地址</p>
                <p className="font-medium text-gray-800">{viewingEmployee.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">所属部门</p>
                <p className="font-medium text-gray-800">{getDepartmentName(viewingEmployee.departmentId)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">职位</p>
                <p className="font-medium text-gray-800">{viewingEmployee.position}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">用工类型</p>
                <p className="font-medium text-gray-800">{employmentTypeConfig[viewingEmployee.employmentType]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">入职日期</p>
                <p className="font-medium text-gray-800">
                  {new Date(viewingEmployee.hireDate).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">状态</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    viewingEmployee.status === 'active'
                      ? 'bg-success-100 text-success-700'
                      : viewingEmployee.status === 'on-leave'
                      ? 'bg-warning-100 text-warning-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {statusConfig[viewingEmployee.status].label}
                </span>
              </div>
              {viewingEmployee.address && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm text-gray-500">住址</p>
                  <p className="font-medium text-gray-800">{viewingEmployee.address}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="outline" onClick={closeDetail}>
                关闭
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}