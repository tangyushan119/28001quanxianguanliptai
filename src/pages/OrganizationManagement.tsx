import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, Edit, Archive, X, Check, Building2, Users, RefreshCw, ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { Organization, Department } from '@/types';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardBody, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, Modal, Badge } from '@/components';
import {
  getOrganizations,
  getDepartments,
  addOrganization,
  updateOrganization,
  addDepartment,
  updateDepartment,
  updateOrganizationStatus,
  updateDepartmentStatus,
  checkOrgCodeExists,
  checkDeptCodeExists,
  subscribe,
} from '../store/dataStore';

type ActiveTab = 'organization' | 'department';

type FormType = 'add' | 'edit';

interface FormData {
  name: string;
  code: string;
  address?: string;
  phone?: string;
  organizationId?: string;
  parentId?: string;
}

export default function OrganizationManagement() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('organization');
  const [organizations, setOrganizations] = useState<Organization[]>(getOrganizations());
  const [departments, setDepartments] = useState<Department[]>(getDepartments());
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState<FormType>('add');
  const [editingItem, setEditingItem] = useState<Organization | Department | null>(null);
  const [formData, setFormData] = useState<FormData>({ name: '', code: '', address: '', phone: '', organizationId: '', parentId: '' });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState({ name: false, code: false, phone: false, organizationId: false, parentId: false });
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setOrganizations(getOrganizations());
      setDepartments(getDepartments());
    });
    return unsubscribe;
  }, []);

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

  const departmentTree = useMemo(() => {
    const tree: Department[] = [];
    const deptMap = new Map<string, Department>();

    filteredDepartments.forEach((dept) => {
      deptMap.set(dept.id, { ...dept, children: [] as Department[] });
    });

    deptMap.forEach((dept) => {
      if (dept.parentId && deptMap.has(dept.parentId)) {
        const parent = deptMap.get(dept.parentId)!;
        if (!parent.children) parent.children = [];
        parent.children.push(dept);
      } else {
        tree.push(dept);
      }
    });

    return tree;
  }, [filteredDepartments]);

  const toggleExpand = (deptId: string) => {
    setExpandedDepts((prev) => {
      const next = new Set(prev);
      if (next.has(deptId)) {
        next.delete(deptId);
      } else {
        next.add(deptId);
      }
      return next;
    });
  };

  const isExpanded = (deptId: string) => expandedDepts.has(deptId);

  const hasChildren = (dept: Department) => {
    return (dept as Department & { children?: Department[] }).children?.length > 0;
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    const newFieldErrors = { name: false, code: false, phone: false, organizationId: false, parentId: false };

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
          const isDuplicate = checkOrgCodeExists(formData.code, editingItem?.id);
          if (isDuplicate) {
            errors.push('该单位编码已存在，请使用其他编码');
            newFieldErrors.code = true;
          }
        } else {
          const isDuplicate = checkDeptCodeExists(formData.code, editingItem?.id);
          if (isDuplicate) {
            errors.push('该部门编码已存在，请使用其他编码');
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

    if (activeTab === 'department' && formData.parentId) {
      const parentDept = departments.find((d) => d.id === formData.parentId);
      if (!parentDept || parentDept.organizationId !== formData.organizationId) {
        errors.push('上级部门必须属于同一单位');
        newFieldErrors.parentId = true;
      }
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

    if (activeTab === 'organization') {
      addOrganization({
        name: formData.name,
        code: formData.code,
        address: formData.address,
        phone: formData.phone,
      });
    } else {
      addDepartment({
        name: formData.name,
        code: formData.code,
        organizationId: formData.organizationId!,
        parentId: formData.parentId || undefined,
      });
    }

    resetForm();
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    if (activeTab === 'organization' && editingItem) {
      updateOrganization(editingItem.id, {
        name: formData.name,
        code: formData.code,
        address: formData.address,
        phone: formData.phone,
      });
    } else if (activeTab === 'department' && editingItem) {
      updateDepartment(editingItem.id, {
        name: formData.name,
        code: formData.code,
        organizationId: formData.organizationId!,
        parentId: formData.parentId || undefined,
      });
    }

    resetForm();
  };

  const handleArchive = (id: string) => {
    if (confirm('确定要归档此项吗？归档后将不再显示在列表中。')) {
      if (activeTab === 'organization') {
        updateOrganizationStatus(id, 'archived');
      } else {
        updateDepartmentStatus(id, 'archived');
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
      setFormData({ name: dept.name, code: dept.code, organizationId: dept.organizationId, parentId: dept.parentId });
    }
    setFieldErrors({ name: false, code: false, phone: false, organizationId: false, parentId: false });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormType('add');
    setFormData({ name: '', code: '', address: '', phone: '', organizationId: activeOrgs[0]?.id, parentId: '' });
    setFieldErrors({ name: false, code: false, phone: false, organizationId: false, parentId: false });
    setShowModal(true);
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: '', code: '', address: '', phone: '', organizationId: activeOrgs[0]?.id, parentId: '' });
    setFieldErrors({ name: false, code: false, phone: false, organizationId: false, parentId: false });
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

  const getParentDeptName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || '-';
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
          onClick={() => {
            setActiveTab('organization');
            setSearchTerm('');
          }}
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
          onClick={() => {
            setActiveTab('department');
            setSearchTerm('');
          }}
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
                {activeTab === 'department' && <TableHeaderCell>上级部门</TableHeaderCell>}
                <TableHeaderCell>状态</TableHeaderCell>
                <TableHeaderCell>创建日期</TableHeaderCell>
                <TableHeaderCell align="center">操作</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody striped hoverable>
              {activeTab === 'organization' ? (
                filteredOrganizations.map((item) => {
                  const orgItem = item as Organization;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary-600" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{orgItem.address || '-'}</TableCell>
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
                                  updateOrganizationStatus(item.id, 'active');
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
                })
              ) : (
                departmentTree.map((dept) => {
                  const renderDeptRow = (department: Department, level: number) => {
                    const children = (department as Department & { children?: Department[] }).children || [];
                    const hasKids = children.length > 0;
                    const expanded = isExpanded(department.id);

                    return (
                      <>
                        <TableRow key={department.id}>
                          <TableCell className="font-medium text-gray-900">
                            <div className="flex items-center gap-2">
                              {hasKids && (
                                <button
                                  onClick={() => toggleExpand(department.id)}
                                  className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                                >
                                  {expanded ? (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              )}
                              {!hasKids && <span className="w-5" />}
                              {hasKids ? (
                                expanded ? (
                                  <FolderOpen className="w-4 h-4 text-yellow-600" />
                                ) : (
                                  <Folder className="w-4 h-4 text-yellow-600" />
                                )
                              ) : (
                                <File className="w-4 h-4 text-gray-400" />
                              )}
                              <span style={{ paddingLeft: `${level * 16}px` }}>
                                {department.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{department.code}</TableCell>
                          <TableCell>{getOrgName(department.organizationId)}</TableCell>
                          <TableCell>{department.parentId ? getParentDeptName(department.parentId) : '-'}</TableCell>
                          <TableCell>
                            <Badge variant={department.status === 'active' ? 'success' : 'secondary'}>
                              {department.status === 'active' ? '正常' : '已归档'}
                            </Badge>
                          </TableCell>
                          <TableCell>{department.createdAt}</TableCell>
                          <TableCell align="center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => openEditModal(department)}
                                className="p-2"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {department.status === 'active' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleArchive(department.id)}
                                  className="p-2"
                                >
                                  <Archive className="w-4 h-4" />
                                </Button>
                              )}
                              {department.status === 'archived' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm('确定要恢复此项吗？')) {
                                      updateDepartmentStatus(department.id, 'active');
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
                        {hasKids && expanded && children.map((child) => renderDeptRow(child, level + 1))}
                      </>
                    );
                  };

                  return renderDeptRow(dept, 0);
                })
              )}
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
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  所属单位
                  <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.organizationId || ''}
                  onChange={(e) => {
                    handleInputChange('organizationId', e.target.value);
                    setFormData({ ...formData, organizationId: e.target.value, parentId: '' });
                  }}
                  status={fieldErrors.organizationId ? 'error' : 'default'}
                >
                  <option value="">请选择所属单位</option>
                  {activeOrgs.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上级部门</label>
                <Select
                  value={formData.parentId || ''}
                  onChange={(e) => handleInputChange('parentId', e.target.value)}
                  status={fieldErrors.parentId ? 'error' : 'default'}
                >
                  <option value="">无（作为一级部门）</option>
                  {formData.organizationId &&
                    departments
                      .filter(
                        (d) =>
                          d.organizationId === formData.organizationId &&
                          d.status === 'active' &&
                          d.id !== editingItem?.id
                      )
                      .map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                </Select>
              </div>
            </>
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
          <p className="text-gray-600 mb-4">请修正以下问题：</p>
          {errorFields.length > 0 && (
            <div className="bg-error-50 rounded-lg p-4">
              <p className="text-sm font-medium text-error-700 mb-2">错误信息:</p>
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