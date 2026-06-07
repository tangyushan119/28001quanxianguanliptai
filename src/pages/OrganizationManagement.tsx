import { useState } from 'react';
import { Search, Plus, Edit, Archive, X, Check, Building2, Users, RefreshCw } from 'lucide-react';
import { Organization, Department } from '@/types';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardBody, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, Modal, Badge } from '@/components';

const mockOrganizations: Organization[] = [
  { id: '1', name: '县政府办公室', code: 'XZFB', address: '县政府大楼1层', phone: '0123-4567890', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '发展和改革局', code: 'FGJ', address: '行政服务中心3层', phone: '0123-4567891', status: 'active', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '3', name: '财政局', code: 'CZJ', address: '财政大厦5层', phone: '0123-4567892', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '4', name: '人力资源和社会保障局', code: 'RSJ', address: '人社局大楼', phone: '0123-4567893', status: 'archived', createdAt: '2024-01-04', updatedAt: '2024-06-01' },
];

const mockDepartments: Department[] = [
  { id: '1', name: '综合科', code: 'ZH', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '文秘科', code: 'WM', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '信息科', code: 'XX', organizationId: '1', status: 'active', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '4', name: '规划科', code: 'GH', organizationId: '2', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '5', name: '投资科', code: 'TZ', organizationId: '2', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '6', name: '预算科', code: 'YS', organizationId: '3', status: 'active', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
  { id: '7', name: '国库科', code: 'GK', organizationId: '3', status: 'archived', createdAt: '2024-01-04', updatedAt: '2024-05-15' },
];

type ActiveTab = 'organization' | 'department';

type FormType = 'add' | 'edit';

interface FormData {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  organizationId?: string;
}

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('organization');
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState<FormType>('add');
  const [editingItem, setEditingItem] = useState<Organization | Department | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', code: '', address: '', phone: '', organizationId: '' });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState({ name: false, code: false, organizationId: false });

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDepartments = departments.filter((dept) => {
    const orgName = organizations.find((o) => o.id === dept.organizationId)?.name || '';
    return (
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orgName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const activeOrgs = organizations.filter((o) => o.status === 'active');

  const validateForm = (): boolean => {
    const errors: string[] = [];
    const newFieldErrors = { name: false, code: false, phone: false, organizationId: false };

    if (!formData.name.trim()) {
      errors.push('名称不能为空');
      newFieldErrors.name = true;
    }

    if (!formData.code.trim()) {
      errors.push('编码不能为空');
      newFieldErrors.code = true;
    } else {
      const codeRegex = activeTab === 'organization' ? /^[A-Z]{3,6}$/ : /^[A-Z]{2,4}$/;
      if (!codeRegex.test(formData.code)) {
        const minLen = activeTab === 'organization' ? 3 : 2;
        const maxLen = activeTab === 'organization' ? 6 : 4;
        errors.push(`编码格式不正确，应为${minLen}-${maxLen}位大写字母`);
        newFieldErrors.code = true;
      } else {
        if (activeTab === 'organization') {
          const isDuplicate = organizations.some((org) => 
            org.code === formData.code && org.id !== editingItem?.id
          );
          if (isDuplicate) {
            errors.push('该单位编码已存在');
            newFieldErrors.code = true;
          }
        } else {
          const isDuplicate = departments.some((dept) => 
            dept.code === formData.code && dept.organizationId === formData.organizationId && dept.id !== editingItem?.id
          );
          if (isDuplicate) {
            errors.push('同一单位下该部门编码已存在');
            newFieldErrors.code = true;
          }
        }
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phone = formData.phone.trim();
      const phoneRegex = /^(0\d{2,3}-\d{7,8})|(1[3-9]\d{9})$/;
      if (!phoneRegex.test(phone)) {
        errors.push('电话号码格式不正确，应为固定电话(如010-12345678)或手机号(11位)');
        newFieldErrors.phone = true;
      }
    }

    if (activeTab === 'department' && !formData.organizationId) {
      errors.push('所属单位不能为空');
      newFieldErrors.organizationId = true;
    }

    setFieldErrors(newFieldErrors);

    if (errors.length > 0) {
      setErrorFields(errors);
      setShowErrorModal(true);
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString().split('T')[0];

    if (activeTab === 'organization') {
      const org: Organization = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        address: formData.address,
        phone: formData.phone,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };
      setOrganizations([...organizations, org]);
    } else {
      const dept: Department = {
        id: Date.now().toString(),
        name: formData.name,
        code: formData.code,
        organizationId: formData.organizationId!,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      };
      setDepartments([...departments, dept]);
    }

    resetForm();
  };

  const handleUpdate = () => {
    if (!validateForm()) return;
    const now = new Date().toISOString().split('T')[0];

    if (activeTab === 'organization' && editingItem) {
      setOrganizations(organizations.map((org) =>
        org.id === editingItem.id
          ? { ...org, ...formData, updatedAt: now }
          : org
      ));
    } else if (activeTab === 'department' && editingItem) {
      setDepartments(departments.map((dept) =>
        dept.id === editingItem.id
          ? { ...dept, ...formData, updatedAt: now }
          : dept
      ));
    }

    resetForm();
  };

  const handleArchive = (id: string) => {
    if (confirm('确定要归档此项吗？归档后将不再显示在列表中。')) {
      if (activeTab === 'organization') {
        setOrganizations(organizations.map((org) =>
          org.id === id ? { ...org, status: 'archived', updatedAt: new Date().toISOString().split('T')[0] } : org
        ));
      } else {
        setDepartments(departments.map((dept) =>
          dept.id === id ? { ...dept, status: 'archived', updatedAt: new Date().toISOString().split('T')[0] } : dept
        ));
      }
    }
  };

  const openEditModal = (item: Organization | Department) => {
    setEditingItem(item);
    setFormType('edit');
    if (activeTab === 'organization') {
      const org = item as Organization;
      setFormData({ name: org.name, code: org.code, address: org.address || '', phone: org.phone || '' });
    } else {
      const dept = item as Department;
      setFormData({ name: dept.name, code: dept.code, organizationId: dept.organizationId });
    }
    setFieldErrors({ name: false, code: false, phone: false, organizationId: false });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormType('add');
    setFormData({ name: '', code: '', address: '', phone: '', organizationId: activeOrgs[0]?.id });
    setFieldErrors({ name: false, code: false, phone: false, organizationId: false });
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: '', code: '', address: '', phone: '', organizationId: activeOrgs[0]?.id });
    setFieldErrors({ name: false, code: false, phone: false, organizationId: false });
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    const fieldErrorKey = field as keyof typeof fieldErrors;
    if (fieldErrors[fieldErrorKey]) {
      setFieldErrors({ ...fieldErrors, [fieldErrorKey]: false });
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  const getOrgName = (orgId: string) => {
    return organizations.find((o) => o.id === orgId)?.name || '未知单位';
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">单位部门管理</h1>
          <p className="text-gray-500 mt-1">管理全县单位和部门信息</p>
        </div>
        <Button onClick={openAddModal} leftIcon={<Plus className="w-5 h-5" />}>
          {activeTab === 'organization' ? '新增单位' : '新增部门'}
        </Button>
      </div>

      <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-6">
        <button
          onClick={() => { setActiveTab('organization'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'organization'
              ? 'bg-white shadow-sm text-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Building2 className="w-5 h-5" />
          单位管理
        </button>
        <button
          onClick={() => { setActiveTab('department'); setSearchTerm(''); }}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'department'
              ? 'bg-white shadow-sm text-primary-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Users className="w-5 h-5" />
          部门管理
        </button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={`搜索${activeTab === 'organization' ? '单位' : '部门'}名称或编码...`}
          className="pl-10"
        />
      </div>

      <Card className="shadow-sm">
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>{activeTab === 'organization' ? '单位名称' : '部门名称'}</TableHeaderCell>
                <TableHeaderCell>编码</TableHeaderCell>
                {activeTab === 'organization' && <TableHeaderCell>地址</TableHeaderCell>}
                {activeTab === 'department' && <TableHeaderCell>所属单位</TableHeaderCell>}
                <TableHeaderCell>状态</TableHeaderCell>
                <TableHeaderCell>创建日期</TableHeaderCell>
                <TableHeaderCell align="center">操作</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody striped hoverable>
              {(activeTab === 'organization' ? filteredOrganizations : filteredDepartments).map((item) => {
                const orgItem = item as Organization;
                const deptItem = item as Department;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-gray-900">
                      {item.name}
                    </TableCell>
                    <TableCell>{item.code}</TableCell>
                    {activeTab === 'organization' && <TableCell>{orgItem.address || '-'}</TableCell>}
                    {activeTab === 'department' && <TableCell>{getOrgName(deptItem.organizationId)}</TableCell>}
                    <TableCell>
                      <Badge variant={item.status === 'active' ? 'success' : 'secondary'}>
                        {item.status === 'active' ? '正常' : '已归档'}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.createdAt}</TableCell>
                    <TableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(item)}
                          className="p-2"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {item.status === 'active' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleArchive(item.id)}
                            className="p-2"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}
                        {item.status === 'archived' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm('确定要恢复此项吗？')) {
                                if (activeTab === 'organization') {
                                  setOrganizations(organizations.map((org) =>
                                    org.id === item.id ? { ...org, status: 'active' } : org
                                  ));
                                } else {
                                  setDepartments(departments.map((dept) =>
                                    dept.id === item.id ? { ...dept, status: 'active' } : dept
                                  ));
                                }
                              }
                            }}
                            className="p-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {(activeTab === 'organization' ? filteredOrganizations : filteredDepartments).length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>暂无匹配的{activeTab === 'organization' ? '单位' : '部门'}数据</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title={editingItem ? `编辑${activeTab === 'organization' ? '单位' : '部门'}` : `新增${activeTab === 'organization' ? '单位' : '部门'}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              {activeTab === 'organization' ? '单位' : '部门'}名称
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={`请输入${activeTab === 'organization' ? '单位' : '部门'}名称`}
              status={fieldErrors.name ? 'error' : 'default'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              编码
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.code}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="请输入编码"
              status={fieldErrors.code ? 'error' : 'default'}
            />
          </div>
          {activeTab === 'organization' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
                <Input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="请输入地址"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <Input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="请输入联系电话（固定电话如010-12345678或手机号）"
                  status={fieldErrors.phone ? 'error' : 'default'}
                />
              </div>
            </>
          )}
          {activeTab === 'department' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                所属单位
                <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.organizationId || ''}
                onChange={(e) => handleInputChange('organizationId', e.target.value)}
                status={fieldErrors.organizationId ? 'error' : 'default'}
              >
                <option value="">请选择所属单位</option>
                {activeOrgs.map((org) => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </Select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={resetForm}>
            取消
          </Button>
          <Button onClick={editingItem ? handleUpdate : handleAdd} leftIcon={<Check className="w-4 h-4" />}>
            {editingItem ? '保存修改' : '新增'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showErrorModal} onClose={handleCloseErrorModal} title="提示" type="error">
        <div>
          <p className="text-gray-600 mb-4">请填写以下必填项</p>
          {errorFields.length > 0 && (
            <div className="bg-error-50 rounded-lg p-4">
              <p className="text-sm font-medium text-error-700 mb-2">未填写的项目:</p>
              <ul className="space-y-2">
                {errorFields.map((field, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-error-600">
                    <span className="w-1.5 h-1.5 bg-error-500 rounded-full" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={handleCloseErrorModal} className="w-full mt-4">
            知道了
          </Button>
        </div>
      </Modal>
    </div>
  );
}