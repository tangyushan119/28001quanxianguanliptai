import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Clock, MapPin, Calendar, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { DutyRecord, DutyRecordFormData, FieldRecord, FieldRecordFormData, Department, Employee } from '../types';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Modal, Select } from '../components';
import { getDutyRecords, getFieldRecords, getDepartments, getEmployees, addDutyRecord, updateDutyRecord, deleteDutyRecord, addFieldRecord, updateFieldRecord, deleteFieldRecord, checkDutyRecordExists, checkFieldRecordExists } from '../store/dataStore';

const dutyTypeConfig = {
  morning: { label: '早班', color: 'bg-blue-100 text-blue-700' },
  afternoon: { label: '中班', color: 'bg-green-100 text-green-700' },
  evening: { label: '晚班', color: 'bg-orange-100 text-orange-700' },
  night: { label: '夜班', color: 'bg-purple-100 text-purple-700' },
};

const statusConfig = {
  completed: { label: '已完成', color: 'bg-success-100 text-success-700', icon: CheckCircle },
  pending: { label: '待执行', color: 'bg-warning-100 text-warning-700', icon: AlertCircle },
  cancelled: { label: '已取消', color: 'bg-error-100 text-error-700', icon: XCircle },
};

const transportationConfig = {
  walk: '步行',
  bus: '公交',
  car: '自驾',
  train: '火车',
  plane: '飞机',
  other: '其他',
};

export default function DutyRecordManagement() {
  const [activeTab, setActiveTab] = useState<'duty' | 'field'>('duty');
  const [dutyRecords, setDutyRecords] = useState<DutyRecord[]>(getDutyRecords());
  const [fieldRecords, setFieldRecords] = useState<FieldRecord[]>(getFieldRecords());
  const [departments] = useState<Department[]>(getDepartments());
  const [employees] = useState<Employee[]>(getEmployees());
  const [searchTerm, setSearchTerm] = useState('');
  const [showDutyForm, setShowDutyForm] = useState(false);
  const [showFieldForm, setShowFieldForm] = useState(false);
  const [editingDutyRecord, setEditingDutyRecord] = useState<DutyRecord | null>(null);
  const [editingFieldRecord, setEditingFieldRecord] = useState<FieldRecord | null>(null);

  const filteredDutyRecords = useMemo(() => {
    return dutyRecords.filter((record) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        record.employeeName.toLowerCase().includes(term) ||
        record.location.toLowerCase().includes(term) ||
        record.dutyContent.toLowerCase().includes(term)
      );
    });
  }, [dutyRecords, searchTerm]);

  const filteredFieldRecords = useMemo(() => {
    return fieldRecords.filter((record) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        record.employeeName.toLowerCase().includes(term) ||
        record.destination.toLowerCase().includes(term) ||
        record.purpose.toLowerCase().includes(term)
      );
    });
  }, [fieldRecords, searchTerm]);

  const getDepartmentName = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.name || '-';
  };

  const [dutyError, setDutyError] = useState('');
  const [fieldError, setFieldError] = useState('');

  const handleDutySubmit = (data: DutyRecordFormData) => {
    setDutyError('');
    
    const exists = checkDutyRecordExists(
      data.employeeId,
      data.dutyDate,
      data.dutyType,
      editingDutyRecord?.id
    );
    
    if (exists) {
      setDutyError(`该人员在${data.dutyDate}的${dutyTypeConfig[data.dutyType].label}已有值班记录，无法重复提交`);
      return;
    }
    
    if (editingDutyRecord) {
      updateDutyRecord(editingDutyRecord.id, data);
      setDutyRecords(dutyRecords.map((r) => (r.id === editingDutyRecord.id ? { ...r, ...data } : r)));
    } else {
      const newRecord = addDutyRecord(data);
      setDutyRecords([...dutyRecords, newRecord]);
    }
    closeDutyForm();
  };

  const handleFieldSubmit = (data: FieldRecordFormData) => {
    setFieldError('');
    
    const recordData = {
      ...data,
      expenses: data.expenses ? parseFloat(data.expenses) : undefined,
    };
    
    const exists = checkFieldRecordExists(
      data.employeeId,
      data.fieldDate,
      data.startTime,
      data.endTime,
      editingFieldRecord?.id
    );
    
    if (exists) {
      setFieldError(`该人员在${data.fieldDate}的${data.startTime}-${data.endTime}时间段已有外勤记录，无法重复提交`);
      return;
    }
    
    if (editingFieldRecord) {
      updateFieldRecord(editingFieldRecord.id, recordData);
      setFieldRecords(fieldRecords.map((r) => (r.id === editingFieldRecord.id ? { ...r, ...recordData } : r)));
    } else {
      const newRecord = addFieldRecord(recordData);
      setFieldRecords([...fieldRecords, newRecord]);
    }
    closeFieldForm();
  };

  const handleDutyDelete = (id: string) => {
    if (confirm('确定要删除该值班记录吗？')) {
      deleteDutyRecord(id);
      setDutyRecords(dutyRecords.filter((r) => r.id !== id));
    }
  };

  const handleFieldDelete = (id: string) => {
    if (confirm('确定要删除该外勤记录吗？')) {
      deleteFieldRecord(id);
      setFieldRecords(fieldRecords.filter((r) => r.id !== id));
    }
  };

  const openDutyForm = (record?: DutyRecord) => {
    if (record) {
      setEditingDutyRecord(record);
    } else {
      setEditingDutyRecord(null);
    }
    setShowDutyForm(true);
  };

  const openFieldForm = (record?: FieldRecord) => {
    if (record) {
      setEditingFieldRecord(record);
    } else {
      setEditingFieldRecord(null);
    }
    setShowFieldForm(true);
  };

  const closeDutyForm = () => {
    setShowDutyForm(false);
    setEditingDutyRecord(null);
  };

  const closeFieldForm = () => {
    setShowFieldForm(false);
    setEditingFieldRecord(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">勤务记录管理</h1>
          <p className="text-gray-500 mt-1">管理日常值班和外勤信息</p>
        </div>
        <Button onClick={activeTab === 'duty' ? () => openDutyForm() : () => openFieldForm()} leftIcon={<Plus className="w-5 h-5" />}>
          {activeTab === 'duty' ? '新增值班记录' : '新增外勤记录'}
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('duty')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'duty'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              日常值班
            </span>
          </button>
          <button
            onClick={() => setActiveTab('field')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'field'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              外勤信息
            </span>
          </button>
        </div>
      </div>

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`搜索${activeTab === 'duty' ? '值班人员、地点、内容' : '外勤人员、目的地、事由'}...`}
          className="pl-10"
        />
      </div>

      {activeTab === 'duty' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-500" />
              值班记录列表
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">值班人员</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">部门</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">日期</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">班次</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">时间</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">地点</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">内容</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDutyRecords.map((record) => (
                    <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{getDepartmentName(record.departmentId)}</td>
                      <td className="py-3 px-4 text-gray-700">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {record.dutyDate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dutyTypeConfig[record.dutyType].color}`}>
                          {dutyTypeConfig[record.dutyType].label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">
                        {record.startTime} - {record.endTime}
                      </td>
                      <td className="py-3 px-4 text-gray-700">{record.location}</td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs truncate" title={record.dutyContent}>
                        {record.dutyContent}
                      </td>
                      <td className="py-3 px-4">
                        {(() => {
                          const StatusIcon = statusConfig[record.status].icon;
                          return (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[record.status].color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig[record.status].label}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openDutyForm(record)}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDutyDelete(record.id)}
                            className="text-error-600 hover:text-error-800 text-sm font-medium"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDutyRecords.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无值班记录</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              外勤记录列表
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">外勤人员</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">部门</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">日期</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">时间</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">目的地</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">事由</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">交通方式</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">费用</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFieldRecords.map((record) => {
                    const StatusIcon = statusConfig[record.status].icon;
                    return (
                      <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">{record.employeeId}</div>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{getDepartmentName(record.departmentId)}</td>
                        <td className="py-3 px-4 text-gray-700">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {record.fieldDate}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {record.startTime} - {record.endTime}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{record.destination}</td>
                        <td className="py-3 px-4 text-gray-700 max-w-xs truncate" title={record.purpose}>
                          {record.purpose}
                        </td>
                        <td className="py-3 px-4 text-gray-700">{transportationConfig[record.transportation]}</td>
                        <td className="py-3 px-4 text-gray-700">
                          {record.expenses ? `¥${record.expenses.toFixed(2)}` : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[record.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[record.status].label}
                          </span>
                        </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openFieldForm(record)}
                            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleFieldDelete(record.id)}
                            className="text-error-600 hover:text-error-800 text-sm font-medium"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
              {filteredFieldRecords.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无外勤记录</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      <Modal
        isOpen={showDutyForm}
        onClose={closeDutyForm}
        title={editingDutyRecord ? '编辑值班记录' : '值班记录录入'}
        size="lg"
      >
        <div>
          {dutyError && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-600 text-sm">{dutyError}</p>
            </div>
          )}
          <DutyRecordForm
            employees={employees}
            departments={departments}
            initialData={editingDutyRecord || undefined}
            onSubmit={handleDutySubmit}
            onCancel={closeDutyForm}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showFieldForm}
        onClose={closeFieldForm}
        title={editingFieldRecord ? '编辑外勤记录' : '外勤信息录入'}
        size="lg"
      >
        <div>
          {fieldError && (
            <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
              <p className="text-error-600 text-sm">{fieldError}</p>
            </div>
          )}
          <FieldRecordForm
            employees={employees}
            departments={departments}
            initialData={editingFieldRecord || undefined}
            onSubmit={handleFieldSubmit}
            onCancel={closeFieldForm}
          />
        </div>
      </Modal>
    </div>
  );
}

interface DutyRecordFormProps {
  employees: Employee[];
  departments: Department[];
  initialData?: DutyRecord;
  onSubmit: (data: DutyRecordFormData) => void;
  onCancel?: () => void;
}

function DutyRecordForm({
  employees,
  departments,
  initialData,
  onSubmit,
  onCancel,
}: DutyRecordFormProps) {
  const [formData, setFormData] = useState<DutyRecordFormData>({
    employeeId: '',
    employeeName: '',
    departmentId: '',
    dutyDate: new Date().toISOString().split('T')[0],
    dutyType: 'morning',
    startTime: '08:00',
    endTime: '12:00',
    location: '',
    dutyContent: '',
    remarks: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      });
    }
  }, [initialData]);

  const handleEmployeeChange = (value: string) => {
    const employee = employees.find((e) => e.id === value);
    setFormData((prev) => ({
      ...prev,
      employeeId: value,
      employeeName: employee?.name || '',
      departmentId: employee?.departmentId || '',
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = '请选择值班人员';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = '请选择部门';
    }
    if (!formData.dutyDate) {
      newErrors.dutyDate = '请选择值班日期';
    }
    if (!formData.location.trim()) {
      newErrors.location = '请输入值班地点';
    }
    if (!formData.dutyContent.trim()) {
      newErrors.dutyContent = '请输入值班内容';
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

  const handleChange = (field: keyof DutyRecordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            值班人员 <span className="text-error-500">*</span>
          </label>
          <Select
            value={formData.employeeId}
            onChange={(e) => handleEmployeeChange((e.target as HTMLSelectElement).value)}
            status={errors.employeeId ? 'error' : 'default'}
          >
            <option value="">请选择人员</option>
            {employees.filter((e) => e.status === 'active').map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            所属部门 <span className="text-error-500">*</span>
          </label>
          <Select
            value={formData.departmentId}
            onChange={(e) => handleChange('departmentId', (e.target as HTMLSelectElement).value)}
            status={errors.departmentId ? 'error' : 'default'}
            disabled
          >
            <option value="">请选择部门</option>
            {departments.filter((d) => d.status === 'active').map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            值班日期 <span className="text-error-500">*</span>
          </label>
          <Input
            type="date"
            value={formData.dutyDate}
            onChange={(e) => handleChange('dutyDate', e.target.value)}
            status={errors.dutyDate ? 'error' : 'default'}
            errorMessage={errors.dutyDate}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">班次</label>
          <Select
            value={formData.dutyType}
            onChange={(e) => handleChange('dutyType', (e.target as HTMLSelectElement).value)}
          >
            <option value="morning">早班 (08:00-12:00)</option>
            <option value="afternoon">中班 (14:00-18:00)</option>
            <option value="evening">晚班 (18:00-22:00)</option>
            <option value="night">夜班 (22:00-08:00)</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">开始时间</label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">结束时间</label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            值班地点 <span className="text-error-500">*</span>
          </label>
          <Input
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="请输入值班地点"
            status={errors.location ? 'error' : 'default'}
            errorMessage={errors.location}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">状态</label>
          <Select
            value={formData.status}
            onChange={(e) => handleChange('status', (e.target as HTMLSelectElement).value)}
          >
            <option value="pending">待执行</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            值班内容 <span className="text-error-500">*</span>
          </label>
          <textarea
            value={formData.dutyContent}
            onChange={(e) => handleChange('dutyContent', e.target.value)}
            placeholder="请输入值班内容"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.dutyContent ? 'border-error-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.dutyContent && (
            <p className="text-error-500 text-sm mt-1">{errors.dutyContent}</p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">备注</label>
          <textarea
            value={formData.remarks || ''}
            onChange={(e) => handleChange('remarks', e.target.value)}
            placeholder="请输入备注信息（可选）"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={2}
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
  );
}

interface FieldRecordFormProps {
  employees: Employee[];
  departments: Department[];
  initialData?: FieldRecord;
  onSubmit: (data: FieldRecordFormData) => void;
  onCancel?: () => void;
}

function FieldRecordForm({
  employees,
  departments,
  initialData,
  onSubmit,
  onCancel,
}: FieldRecordFormProps) {
  const [formData, setFormData] = useState<FieldRecordFormData>({
    employeeId: '',
    employeeName: '',
    departmentId: '',
    fieldDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    destination: '',
    purpose: '',
    transportation: 'car',
    expenses: '',
    status: 'pending',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        expenses: initialData.expenses?.toString() || '',
      });
    }
  }, [initialData]);

  const handleEmployeeChange = (value: string) => {
    const employee = employees.find((e) => e.id === value);
    setFormData((prev) => ({
      ...prev,
      employeeId: value,
      employeeName: employee?.name || '',
      departmentId: employee?.departmentId || '',
    }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.employeeId) {
      newErrors.employeeId = '请选择外勤人员';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = '请选择部门';
    }
    if (!formData.fieldDate) {
      newErrors.fieldDate = '请选择外勤日期';
    }
    if (!formData.destination.trim()) {
      newErrors.destination = '请输入目的地';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = '请输入外勤事由';
    }
    if (formData.expenses && isNaN(parseFloat(formData.expenses))) {
      newErrors.expenses = '请输入有效的费用金额';
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

  const handleChange = (field: keyof FieldRecordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            外勤人员 <span className="text-error-500">*</span>
          </label>
          <Select
            value={formData.employeeId}
            onChange={(e) => handleEmployeeChange((e.target as HTMLSelectElement).value)}
            status={errors.employeeId ? 'error' : 'default'}
          >
            <option value="">请选择人员</option>
            {employees.filter((e) => e.status === 'active').map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.employeeId})
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            所属部门 <span className="text-error-500">*</span>
          </label>
          <Select
            value={formData.departmentId}
            onChange={(e) => handleChange('departmentId', (e.target as HTMLSelectElement).value)}
            status={errors.departmentId ? 'error' : 'default'}
            disabled
          >
            <option value="">请选择部门</option>
            {departments.filter((d) => d.status === 'active').map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            外勤日期 <span className="text-error-500">*</span>
          </label>
          <Input
            type="date"
            value={formData.fieldDate}
            onChange={(e) => handleChange('fieldDate', e.target.value)}
            status={errors.fieldDate ? 'error' : 'default'}
            errorMessage={errors.fieldDate}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">交通方式</label>
          <Select
            value={formData.transportation}
            onChange={(e) => handleChange('transportation', (e.target as HTMLSelectElement).value)}
          >
            <option value="walk">步行</option>
            <option value="bus">公交</option>
            <option value="car">自驾</option>
            <option value="train">火车</option>
            <option value="plane">飞机</option>
            <option value="other">其他</option>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">开始时间</label>
          <Input
            type="time"
            value={formData.startTime}
            onChange={(e) => handleChange('startTime', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">结束时间</label>
          <Input
            type="time"
            value={formData.endTime}
            onChange={(e) => handleChange('endTime', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            目的地 <span className="text-error-500">*</span>
          </label>
          <Input
            value={formData.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            placeholder="请输入目的地"
            status={errors.destination ? 'error' : 'default'}
            errorMessage={errors.destination}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">外勤费用</label>
          <Input
            type="number"
            value={formData.expenses}
            onChange={(e) => handleChange('expenses', e.target.value)}
            placeholder="请输入外勤费用"
            status={errors.expenses ? 'error' : 'default'}
            errorMessage={errors.expenses}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">状态</label>
          <Select
            value={formData.status}
            onChange={(e) => handleChange('status', (e.target as HTMLSelectElement).value)}
          >
            <option value="pending">待执行</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            外勤事由 <span className="text-error-500">*</span>
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            placeholder="请输入外勤事由"
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${errors.purpose ? 'border-error-500' : 'border-gray-300'}`}
            rows={3}
          />
          {errors.purpose && (
            <p className="text-error-500 text-sm mt-1">{errors.purpose}</p>
          )}
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
  );
}