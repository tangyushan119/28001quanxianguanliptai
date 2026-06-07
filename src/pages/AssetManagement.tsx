import { useState, useMemo } from 'react';
import { Search, Plus, X, Wrench, Package, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { Equipment, Supplies, Department, Organization, EquipmentFormData, SuppliesFormData } from '../types';
import { Button, Input, Card, CardHeader, CardTitle, CardBody, Modal, Select, Badge } from '../components';
import AssetForm, { AssetType } from '../components/AssetForm';
import Table, { TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../components/Table';

const mockOrganizations: Organization[] = [
  { id: '1', name: '县政府办公室', code: 'XZFB', address: '县政府大楼1层', phone: '0123-4567890', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '发展和改革局', code: 'FGJ', address: '行政服务中心3层', phone: '0123-4567891', status: 'active', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '3', name: '财政局', code: 'CZJ', address: '财政大厦5层', phone: '0123-4567892', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
];

const mockDepartments: Department[] = [
  { id: '1', name: '综合科', code: 'ZH', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '文秘科', code: 'WM', organizationId: '1', parentId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '规划科', code: 'GH', organizationId: '2', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '4', name: '预算科', code: 'YS', organizationId: '3', status: 'active', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
];

const mockEquipments: Equipment[] = [
  { id: '1', name: '台式电脑', code: 'EQ001', type: 'computer', model: 'ThinkPad M900', manufacturer: '联想', purchaseDate: '2023-05-15', price: 5800, location: '县政府大楼301室', departmentId: '1', responsiblePerson: '张三', status: 'in-use', warrantyEndDate: '2025-05-15', description: '办公用台式机', createdAt: '2023-05-15', updatedAt: '2023-05-15' },
  { id: '2', name: '笔记本电脑', code: 'EQ002', type: 'computer', model: 'MacBook Pro 14', manufacturer: '苹果', purchaseDate: '2023-08-20', price: 12500, location: '县政府大楼302室', departmentId: '2', responsiblePerson: '李四', status: 'in-use', warrantyEndDate: '2025-08-20', createdAt: '2023-08-20', updatedAt: '2023-08-20' },
  { id: '3', name: '打印机', code: 'EQ003', type: 'office', model: 'HP LaserJet Pro', manufacturer: '惠普', purchaseDate: '2022-11-10', price: 2300, location: '行政服务中心305室', departmentId: '3', responsiblePerson: '王五', status: 'maintenance', createdAt: '2022-11-10', updatedAt: '2024-01-10' },
  { id: '4', name: '投影仪', code: 'EQ004', type: 'office', model: 'EPSON CB-X06', manufacturer: '爱普生', purchaseDate: '2023-03-05', price: 3800, location: '财政大厦会议室', departmentId: '4', responsiblePerson: '赵六', status: 'idle', createdAt: '2023-03-05', updatedAt: '2023-03-05' },
];

const mockSupplies: Supplies[] = [
  { id: '1', name: 'A4打印纸', code: 'SP001', category: 'stationery', unit: '箱', quantity: 50, unitPrice: 85, totalPrice: 4250, location: '仓库A区', departmentId: '1', supplier: '得力文具', purchaseDate: '2024-01-05', status: 'in-stock', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
  { id: '2', name: '签字笔', code: 'SP002', category: 'stationery', unit: '盒', quantity: 200, unitPrice: 15, totalPrice: 3000, location: '仓库A区', departmentId: '2', supplier: '晨光文具', purchaseDate: '2024-02-10', status: 'in-stock', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
  { id: '3', name: '办公椅', code: 'SP003', category: 'furniture', unit: '把', quantity: 20, unitPrice: 350, totalPrice: 7000, location: '仓库B区', departmentId: '3', purchaseDate: '2023-12-15', status: 'in-use', createdAt: '2023-12-15', updatedAt: '2023-12-15' },
  { id: '4', name: '消毒液', code: 'SP004', category: 'cleaning', unit: '瓶', quantity: 10, unitPrice: 25, totalPrice: 250, location: '仓库C区', departmentId: '4', purchaseDate: '2024-03-01', expirationDate: '2025-03-01', status: 'low-stock', createdAt: '2024-03-01', updatedAt: '2024-03-01' },
];

const equipmentStatusConfig = {
  'in-use': { label: '使用中', variant: 'success' as const },
  idle: { label: '闲置', variant: 'secondary' as const },
  maintenance: { label: '维修中', variant: 'warning' as const },
  scrapped: { label: '已报废', variant: 'error' as const },
};

const suppliesStatusConfig = {
  'in-stock': { label: '库存充足', variant: 'success' as const },
  'in-use': { label: '使用中', variant: 'primary' as const },
  'low-stock': { label: '库存不足', variant: 'warning' as const },
  depleted: { label: '已耗尽', variant: 'error' as const },
};

const equipmentTypeConfig = {
  computer: '计算机设备',
  network: '网络设备',
  office: '办公设备',
  vehicle: '交通工具',
  other: '其他',
};

const suppliesCategoryConfig = {
  stationery: '办公用品',
  electronics: '电子设备',
  furniture: '家具',
  cleaning: '清洁用品',
  other: '其他',
};

export default function AssetManagement() {
  const [activeTab, setActiveTab] = useState<AssetType>('equipment');
  const [equipments, setEquipments] = useState<Equipment[]>(mockEquipments);
  const [supplies, setSupplies] = useState<Supplies[]>(mockSupplies);
  const [departments] = useState<Department[]>(mockDepartments);
  const [organizations] = useState<Organization[]>(mockOrganizations);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Equipment | Supplies | null>(null);
  const [viewingAsset, setViewingAsset] = useState<Equipment | Supplies | null>(null);

  const activeDepartments = departments.filter((d) => d.status === 'active');

  const getDepartmentName = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    if (!dept) return '-';
    const org = organizations.find((o) => o.id === dept.organizationId);
    return `${org?.name || ''} - ${dept.name}`;
  };

  const filteredEquipments = useMemo(() => {
    return equipments.filter((eq) => {
      const matchesSearch = !searchTerm.trim() ||
        eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        eq.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || eq.status === statusFilter;
      const matchesDepartment = !departmentFilter || eq.departmentId === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [equipments, searchTerm, statusFilter, departmentFilter]);

  const filteredSupplies = useMemo(() => {
    return supplies.filter((sp) => {
      const matchesSearch = !searchTerm.trim() ||
        sp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sp.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || sp.status === statusFilter;
      const matchesDepartment = !departmentFilter || sp.departmentId === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [supplies, searchTerm, statusFilter, departmentFilter]);

  const handleEquipmentSubmit = (data: EquipmentFormData) => {
    const now = new Date().toISOString().split('T')[0];

    if (editingAsset && (editingAsset as Equipment).type) {
      setEquipments(
        equipments.map((eq) =>
          eq.id === editingAsset.id
            ? {
                ...eq,
                ...data,
                price: parseFloat(data.price),
                updatedAt: now,
              }
            : eq
        )
      );
    } else {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        ...data,
        price: parseFloat(data.price),
        createdAt: now,
        updatedAt: now,
      };
      setEquipments([...equipments, newEquipment]);
    }

    closeForm();
  };

  const handleSuppliesSubmit = (data: SuppliesFormData) => {
    const now = new Date().toISOString().split('T')[0];
    const quantity = parseInt(data.quantity);
    const unitPrice = parseFloat(data.unitPrice);

    if (editingAsset && !(editingAsset as Equipment).type) {
      setSupplies(
        supplies.map((sp) =>
          sp.id === editingAsset.id
            ? {
                ...sp,
                ...data,
                quantity,
                unitPrice,
                totalPrice: quantity * unitPrice,
                updatedAt: now,
              }
            : sp
        )
      );
    } else {
      const newSupplies: Supplies = {
        id: Date.now().toString(),
        ...data,
        quantity,
        unitPrice,
        totalPrice: quantity * unitPrice,
        createdAt: now,
        updatedAt: now,
      };
      setSupplies([...supplies, newSupplies]);
    }

    closeForm();
  };

  const handleSubmit = (data: EquipmentFormData | SuppliesFormData) => {
    if (activeTab === 'equipment') {
      handleEquipmentSubmit(data as EquipmentFormData);
    } else {
      handleSuppliesSubmit(data as SuppliesFormData);
    }
  };

  const handleEdit = (asset: Equipment | Supplies) => {
    setEditingAsset(asset);
    setShowForm(true);
  };

  const handleView = (asset: Equipment | Supplies) => {
    setViewingAsset(asset);
    setShowDetail(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该资产信息吗？')) {
      if (activeTab === 'equipment') {
        setEquipments(equipments.filter((eq) => eq.id !== id));
      } else {
        setSupplies(supplies.filter((sp) => sp.id !== id));
      }
    }
  };

  const openAddForm = () => {
    setEditingAsset(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAsset(null);
  };

  const closeDetail = () => {
    setShowDetail(false);
    setViewingAsset(null);
  };

  const statusOptions = activeTab === 'equipment'
    ? Object.entries(equipmentStatusConfig).map(([value, { label }]) => ({ value, label }))
    : Object.entries(suppliesStatusConfig).map(([value, { label }]) => ({ value, label }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">资产信息管理</h1>
          <p className="text-gray-500 mt-1">管理全县机关事业单位装备和办公物资信息</p>
        </div>
        <Button onClick={openAddForm} leftIcon={<Plus className="w-5 h-5" />}>
          {activeTab === 'equipment' ? '新增装备' : '新增物资'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTab('equipment');
            setSearchTerm('');
            setStatusFilter('');
            setDepartmentFilter('');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'equipment'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Wrench className="w-5 h-5" />
          装备管理
        </button>
        <button
          onClick={() => {
            setActiveTab('supplies');
            setSearchTerm('');
            setStatusFilter('');
            setDepartmentFilter('');
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'supplies'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Package className="w-5 h-5" />
          办公物资管理
        </button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`搜索${activeTab === 'equipment' ? '装备名称、编号、型号或负责人' : '物资名称、编号'}...`}
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
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
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

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === 'equipment' ? '装备列表' : '办公物资列表'}</CardTitle>
        </CardHeader>
        <CardBody padding="none">
          <Table>
            <TableHead>
              <TableRow>
                {activeTab === 'equipment' ? (
                  <>
                    <TableHeaderCell>装备名称</TableHeaderCell>
                    <TableHeaderCell>编号</TableHeaderCell>
                    <TableHeaderCell>类型</TableHeaderCell>
                    <TableHeaderCell>型号</TableHeaderCell>
                    <TableHeaderCell>所属部门</TableHeaderCell>
                    <TableHeaderCell>存放位置</TableHeaderCell>
                    <TableHeaderCell>负责人</TableHeaderCell>
                    <TableHeaderCell>采购价格</TableHeaderCell>
                    <TableHeaderCell>状态</TableHeaderCell>
                    <TableHeaderCell>操作</TableHeaderCell>
                  </>
                ) : (
                  <>
                    <TableHeaderCell>物资名称</TableHeaderCell>
                    <TableHeaderCell>编号</TableHeaderCell>
                    <TableHeaderCell>类别</TableHeaderCell>
                    <TableHeaderCell>单位</TableHeaderCell>
                    <TableHeaderCell>数量</TableHeaderCell>
                    <TableHeaderCell>单价</TableHeaderCell>
                    <TableHeaderCell>所属部门</TableHeaderCell>
                    <TableHeaderCell>存放位置</TableHeaderCell>
                    <TableHeaderCell>状态</TableHeaderCell>
                    <TableHeaderCell>操作</TableHeaderCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody striped hoverable>
              {(activeTab === 'equipment' ? filteredEquipments : filteredSupplies).map((asset) => (
                <TableRow key={asset.id} hoverable>
                  {activeTab === 'equipment' ? (
                    <>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.code}</TableCell>
                      <TableCell>{equipmentTypeConfig[(asset as Equipment).type]}</TableCell>
                      <TableCell>{(asset as Equipment).model}</TableCell>
                      <TableCell>{getDepartmentName(asset.departmentId)}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>{(asset as Equipment).responsiblePerson}</TableCell>
                      <TableCell>¥{(asset as Equipment).price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={equipmentStatusConfig[(asset as Equipment).status].variant}
                        >
                          {equipmentStatusConfig[(asset as Equipment).status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(asset)}
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          查看
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(asset)}
                          leftIcon={<Edit2 className="w-4 h-4" />}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(asset.id)}
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          className="text-error-500 hover:text-error-600"
                        >
                          删除
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{asset.name}</TableCell>
                      <TableCell>{asset.code}</TableCell>
                      <TableCell>{suppliesCategoryConfig[(asset as Supplies).category]}</TableCell>
                      <TableCell>{(asset as Supplies).unit}</TableCell>
                      <TableCell>{(asset as Supplies).quantity}</TableCell>
                      <TableCell>¥{(asset as Supplies).unitPrice.toFixed(2)}</TableCell>
                      <TableCell>{getDepartmentName(asset.departmentId)}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={suppliesStatusConfig[(asset as Supplies).status].variant}
                        >
                          {suppliesStatusConfig[(asset as Supplies).status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(asset)}
                          leftIcon={<Eye className="w-4 h-4" />}
                        >
                          查看
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(asset)}
                          leftIcon={<Edit2 className="w-4 h-4" />}
                        >
                          编辑
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(asset.id)}
                          leftIcon={<Trash2 className="w-4 h-4" />}
                          className="text-error-500 hover:text-error-600"
                        >
                          删除
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {(activeTab === 'equipment' ? filteredEquipments : filteredSupplies).length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <X className="w-12 h-12 mb-4 opacity-50" />
              <p>暂无数据</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editingAsset ? `${activeTab === 'equipment' ? '编辑装备' : '编辑物资'}信息` : `${activeTab === 'equipment' ? '装备' : '办公物资'}信息录入`}
        size="lg"
      >
        <AssetForm
          assetType={activeTab}
          departments={activeDepartments}
          initialData={editingAsset ? (activeTab === 'equipment'
            ? {
                ...editingAsset,
                price: (editingAsset as Equipment).price.toString(),
              }
            : {
                ...editingAsset,
                quantity: (editingAsset as Supplies).quantity.toString(),
                unitPrice: (editingAsset as Supplies).unitPrice.toString(),
                totalPrice: (editingAsset as Supplies).totalPrice.toString(),
              }) : undefined}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <Modal
        isOpen={showDetail}
        onClose={closeDetail}
        title={`${activeTab === 'equipment' ? '装备' : '物资'}详情`}
        size="md"
      >
        {viewingAsset && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                {activeTab === 'equipment' ? (
                  <Wrench className="w-8 h-8 text-white" />
                ) : (
                  <Package className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{viewingAsset.name}</h3>
                <p className="text-gray-500 text-sm">{viewingAsset.code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {activeTab === 'equipment' ? (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">装备类型</p>
                    <p className="font-medium text-gray-800">
                      {equipmentTypeConfig[(viewingAsset as Equipment).type]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">型号</p>
                    <p className="font-medium text-gray-800">{(viewingAsset as Equipment).model}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">生产厂商</p>
                    <p className="font-medium text-gray-800">
                      {(viewingAsset as Equipment).manufacturer}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">采购价格</p>
                    <p className="font-medium text-gray-800">
                      ¥{(viewingAsset as Equipment).price.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">负责人</p>
                    <p className="font-medium text-gray-800">
                      {(viewingAsset as Equipment).responsiblePerson}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">保修截止日期</p>
                    <p className="font-medium text-gray-800">
                      {(viewingAsset as Equipment).warrantyEndDate || '-'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">物资类别</p>
                    <p className="font-medium text-gray-800">
                      {suppliesCategoryConfig[(viewingAsset as Supplies).category]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">单位</p>
                    <p className="font-medium text-gray-800">{(viewingAsset as Supplies).unit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">数量</p>
                    <p className="font-medium text-gray-800">{(viewingAsset as Supplies).quantity}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">单价</p>
                    <p className="font-medium text-gray-800">
                      ¥{(viewingAsset as Supplies).unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">总金额</p>
                    <p className="font-medium text-gray-800">
                      ¥{(viewingAsset as Supplies).totalPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">供应商</p>
                    <p className="font-medium text-gray-800">
                      {(viewingAsset as Supplies).supplier || '-'}
                    </p>
                  </div>
                </>
              )}
              <div className="space-y-1">
                <p className="text-sm text-gray-500">所属部门</p>
                <p className="font-medium text-gray-800">
                  {getDepartmentName(viewingAsset.departmentId)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">存放位置</p>
                <p className="font-medium text-gray-800">{viewingAsset.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">采购日期</p>
                <p className="font-medium text-gray-800">
                  {new Date(viewingAsset.purchaseDate).toLocaleDateString('zh-CN')}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">状态</p>
                <Badge
                  variant={
                    activeTab === 'equipment'
                      ? equipmentStatusConfig[(viewingAsset as Equipment).status].variant
                      : suppliesStatusConfig[(viewingAsset as Supplies).status].variant
                  }
                >
                  {activeTab === 'equipment'
                    ? equipmentStatusConfig[(viewingAsset as Equipment).status].label
                    : suppliesStatusConfig[(viewingAsset as Supplies).status].label}
                </Badge>
              </div>
              {viewingAsset.description && (
                <div className="col-span-2 space-y-1">
                  <p className="text-sm text-gray-500">备注说明</p>
                  <p className="font-medium text-gray-800">{viewingAsset.description}</p>
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