import { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { ExpenseRecord, ExpenseRecordFormData, Department, Organization, Employee } from '../types';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Modal, Select, Table } from '../components';
import ExpenseForm from '../components/ExpenseForm';
import { mockExpenseRecords, mockDepartments, mockOrganizations, mockEmployees } from '../data/mockData';

const statusConfig = {
  pending: { label: '待审核', variant: 'warning' as const },
  approved: { label: '已通过', variant: 'success' as const },
  rejected: { label: '已驳回', variant: 'danger' as const },
};

const expenseTypeConfig = {
  income: { label: '收入', color: 'text-success-600 bg-success-50' },
  expense: { label: '支出', color: 'text-error-600 bg-error-50' },
};

const categoryConfig: Record<string, string> = {
  salary: '工资收入',
  bonus: '奖金',
  reimbursement: '报销',
  other_income: '其他收入',
  office_supplies: '办公用品',
  travel: '差旅费',
  entertainment: '招待费',
  equipment: '设备采购',
  utilities: '水电费',
  rent: '房租',
  other_expense: '其他支出',
};

const paymentMethodConfig: Record<string, string> = {
  cash: '现金',
  bank: '银行转账',
  card: '银行卡',
  other: '其他',
};

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(mockExpenseRecords);
  const [departments] = useState<Department[]>(mockDepartments);
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [employees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseRecord | null>(null);
  const [viewingExpense, setViewingExpense] = useState<ExpenseRecord | null>(null);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesSearch = !searchTerm.trim() ||
        expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm);

      const matchesStatus = !statusFilter || expense.status === statusFilter;
      const matchesType = !typeFilter || expense.expenseType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [expenses, searchTerm, statusFilter, typeFilter]);

  const activeDepartments = departments.filter((d) => d.status === 'active');

  const getDepartmentName = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (!dept) return '-';
    const org = organizations.find((o) => o.id === dept.organizationId);
    return `${org?.name || ''} - ${dept.name}`;
  };

  const handleSubmit = (data: ExpenseRecordFormData) => {
    const now = new Date().toISOString();
    
    if (editingExpense) {
      setExpenses((prev) =>
        prev.map((exp) =>
          exp.id === editingExpense.id
            ? {
                ...exp,
                ...data,
                amount: parseFloat(data.amount),
                updatedAt: now,
              }
            : exp
        )
      );
    } else {
      const newExpense: ExpenseRecord = {
        id: `EXP${Date.now()}`,
        ...data,
        amount: parseFloat(data.amount),
        createdAt: now,
        updatedAt: now,
      };
      setExpenses((prev) => [newExpense, ...prev]);
    }
    
    closeForm();
  };

  const handleEdit = (expense: ExpenseRecord) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleView = (expense: ExpenseRecord) => {
    setViewingExpense(expense);
    setShowDetail(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该经费记录吗？')) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    }
  };

  const handleStatusChange = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === id ? { ...exp, status, updatedAt: new Date().toISOString() } : exp
      )
    );
  };

  const openAddForm = () => {
    setEditingExpense(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setViewingExpense(null);
  };

  const employeeOptions = employees.map((emp) => ({ id: emp.id, name: emp.name }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">经费收支管理</h1>
          <p className="text-gray-500 mt-1">管理全县机关事业单位经费收支记录</p>
        </div>
        <Button onClick={openAddForm} leftIcon={<Plus className="w-5 h-5" />}>
          新增记录
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索员工姓名、金额或描述..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">筛选条件：</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className="text-sm text-gray-500">类型：</span>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="min-w-[100px]"
              >
                <option value="">全部</option>
                <option value="income">收入</option>
                <option value="expense">支出</option>
              </Select>
            </div>
            <div className="flex items-center gap-2 min-w-[140px]">
              <span className="text-sm text-gray-500">状态：</span>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[100px]"
              >
                <option value="">全部</option>
                <option value="pending">待审核</option>
                <option value="approved">已通过</option>
                <option value="rejected">已驳回</option>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('');
                setTypeFilter('');
                setSearchTerm('');
              }}
            >
              重置筛选
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>经费收支列表</CardTitle>
        </CardHeader>
        <CardBody>
          <Table>
            <thead>
              <tr>
                <th>类型</th>
                <th>类别</th>
                <th>金额</th>
                <th>员工</th>
                <th>部门</th>
                <th>日期</th>
                <th>支付方式</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${expenseTypeConfig[expense.expenseType].color}`}>
                      {expenseTypeConfig[expense.expenseType].label}
                    </span>
                  </td>
                  <td>{categoryConfig[expense.category] || expense.category}</td>
                  <td className={expense.expenseType === 'income' ? 'text-success-600' : 'text-error-600'}>
                    {expense.expenseType === 'income' ? '+' : '-'}{expense.amount.toLocaleString()}
                  </td>
                  <td>{expense.employeeName}</td>
                  <td>{getDepartmentName(expense.departmentId)}</td>
                  <td>{new Date(expense.date).toLocaleDateString('zh-CN')}</td>
                  <td>{paymentMethodConfig[expense.paymentMethod]}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                        expense.status === 'approved' ? 'bg-success-100 text-success-700' :
                        'bg-error-100 text-error-700'
                      }`}>
                        {statusConfig[expense.status].label}
                      </span>
                      {expense.status !== 'approved' && (
                        <Select
                          size="sm"
                          value={expense.status}
                          onChange={(e) => handleStatusChange(expense.id, e.target.value as 'pending' | 'approved' | 'rejected')}
                          className="min-w-[80px]"
                        >
                          <option value="pending">待审核</option>
                          <option value="approved">通过</option>
                          <option value="rejected">驳回</option>
                        </Select>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-4 h-4" />}
                        onClick={() => handleView(expense)}
                      >
                        查看
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Edit2 className="w-4 h-4" />}
                        onClick={() => handleEdit(expense)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        onClick={() => handleDelete(expense.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingExpense ? '编辑经费记录' : '经费收支录入'}
        size="lg"
      >
        <ExpenseForm
          departments={activeDepartments}
          employees={employeeOptions}
          initialData={editingExpense ? {
            ...editingExpense,
            amount: editingExpense.amount.toString(),
          } : undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <Modal
        isOpen={showDetail}
        onClose={closeDetail}
        title="经费记录详情"
        size="md"
      >
        {viewingExpense && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${expenseTypeConfig[viewingExpense.expenseType].color}`}>
                  {expenseTypeConfig[viewingExpense.expenseType].label}
                </span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">
                  {categoryConfig[viewingExpense.category] || viewingExpense.category}
                </h3>
              </div>
              <span className={`text-2xl font-bold ${viewingExpense.expenseType === 'income' ? 'text-success-600' : 'text-error-600'}`}>
                {viewingExpense.expenseType === 'income' ? '+' : '-'}{viewingExpense.amount.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">员工</p>
                <p className="font-medium text-gray-800">{viewingExpense.employeeName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">部门</p>
                <p className="font-medium text-gray-800">{getDepartmentName(viewingExpense.departmentId)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">日期</p>
                <p className="font-medium text-gray-800">
                  {new Date(viewingExpense.date).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">支付方式</p>
                <p className="font-medium text-gray-800">{paymentMethodConfig[viewingExpense.paymentMethod]}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">状态</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  viewingExpense.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                  viewingExpense.status === 'approved' ? 'bg-success-100 text-success-700' :
                  'bg-error-100 text-error-700'
                }`}>
                  {statusConfig[viewingExpense.status].label}
                </span>
              </div>
              {viewingExpense.description && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm text-gray-500">备注说明</p>
                  <p className="font-medium text-gray-800">{viewingExpense.description}</p>
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
