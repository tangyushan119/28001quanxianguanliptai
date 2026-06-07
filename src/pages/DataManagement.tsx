import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, X, Check } from 'lucide-react';
import { DataItem } from '@/types';
import { Button, Input, Select, Card, CardHeader, CardTitle, CardBody, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell, Modal, Badge } from '@/components';

const mockData: DataItem[] = [
  { id: '1', name: '城镇人口', value: 856234, category: '人口数据', createdAt: '2024-01-15' },
  { id: '2', name: '农村人口', value: 430309, category: '人口数据', createdAt: '2024-01-15' },
  { id: '3', name: 'GDP增长率', value: 8.7, category: '经济数据', createdAt: '2024-01-10' },
  { id: '4', name: '财政收入', value: 285600, category: '经济数据', createdAt: '2024-01-08' },
  { id: '5', name: '工业产值', value: 156800, category: '产业数据', createdAt: '2024-01-05' },
  { id: '6', name: '农业产值', value: 68500, category: '产业数据', createdAt: '2024-01-05' },
  { id: '7', name: '服务业产值', value: 61200, category: '产业数据', createdAt: '2024-01-05' },
  { id: '8', name: '就业人数', value: 723568, category: '就业数据', createdAt: '2024-01-12' },
];

export default function DataManagement() {
  const [data, setData] = useState<DataItem[]>(mockData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [newItem, setNewItem] = useState({ name: '', value: '', category: '' });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [fieldErrors, setFieldErrors] = useState({ name: false, value: false, category: false });

  const categories = [...new Set(data.map((item) => item.category))];

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const validateForm = (): boolean => {
    const errors: string[] = [];
    const newFieldErrors = { name: false, value: false, category: false };

    if (!newItem.name.trim()) {
      errors.push('数据名称');
      newFieldErrors.name = true;
    }
    if (!newItem.value.trim()) {
      errors.push('数值');
      newFieldErrors.value = true;
    } else if (isNaN(parseFloat(newItem.value))) {
      errors.push('数值格式不正确');
      newFieldErrors.value = true;
    }
    if (!newItem.category) {
      errors.push('分类');
      newFieldErrors.category = true;
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

    const item: DataItem = {
      id: Date.now().toString(),
      name: newItem.name,
      value: parseFloat(newItem.value),
      category: newItem.category,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setData([...data, item]);
    setNewItem({ name: '', value: '', category: '' });
    setFieldErrors({ name: false, value: false, category: false });
    setShowAddModal(false);
  };

  const handleUpdate = () => {
    if (!validateForm()) return;

    setData(data.map((item) =>
      item.id === editingItem!.id
        ? { ...item, name: newItem.name, value: parseFloat(newItem.value), category: newItem.category }
        : item
    ));
    setEditingItem(null);
    setNewItem({ name: '', value: '', category: '' });
    setFieldErrors({ name: false, value: false, category: false });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条数据吗？')) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  const openEditModal = (item: DataItem) => {
    setEditingItem(item);
    setNewItem({ name: item.name, value: item.value.toString(), category: item.category });
    setFieldErrors({ name: false, value: false, category: false });
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  const handleInputChange = (field: 'name' | 'value' | 'category', value: string) => {
    setNewItem({ ...newItem, [field]: value });
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: false });
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">数据管理</h1>
          <p className="text-gray-500 mt-1">管理全县各类数据信息</p>
        </div>
        <Button
          onClick={() => {
            setEditingItem(null);
            setNewItem({ name: '', value: '', category: '' });
            setFieldErrors({ name: false, value: false, category: false });
            setShowAddModal(true);
          }}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          新增数据
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索数据名称或分类..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">全部分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>数据名称</TableHeaderCell>
                <TableHeaderCell>数值</TableHeaderCell>
                <TableHeaderCell>分类</TableHeaderCell>
                <TableHeaderCell>创建日期</TableHeaderCell>
                <TableHeaderCell align="center">操作</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody striped hoverable>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                  <TableCell>{item.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge>{item.category}</Badge>
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
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredData.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>暂无匹配的数据</p>
            </div>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
          setNewItem({ name: '', value: '', category: '' });
          setFieldErrors({ name: false, value: false, category: false });
        }}
        title={editingItem ? '编辑数据' : '新增数据'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              数据名称
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={newItem.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="请输入数据名称"
              status={fieldErrors.name ? 'error' : 'default'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              数值
              <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={newItem.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="请输入数值"
              status={fieldErrors.value ? 'error' : 'default'}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              分类
              <span className="text-red-500">*</span>
            </label>
            <Select
              value={newItem.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              status={fieldErrors.category ? 'error' : 'default'}
            >
              <option value="">请选择分类</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
              <option value="其他">其他</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              setShowAddModal(false);
              setEditingItem(null);
              setNewItem({ name: '', value: '', category: '' });
              setFieldErrors({ name: false, value: false, category: false });
            }}
          >
            取消
          </Button>
          <Button onClick={editingItem ? handleUpdate : handleAdd} leftIcon={<Check className="w-4 h-4" />}>
            {editingItem ? '保存修改' : '新增'}
          </Button>
        </div>
      </Modal>

      <Modal isOpen={showErrorModal} onClose={handleCloseModal} title="提示" type="error">
        <div>
          <p className="text-gray-600 mb-4">请填写以下必填项</p>
          {errorFields && errorFields.length > 0 && (
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
          <Button onClick={handleCloseModal} className="w-full mt-4">
            知道了
          </Button>
        </div>
      </Modal>
    </div>
  );
}