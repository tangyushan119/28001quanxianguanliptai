import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Filter, X, Check } from 'lucide-react';
import { DataItem } from '@/types';
import Modal from '@/components/Modal';

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
        <button
          onClick={() => {
            setEditingItem(null);
            setNewItem({ name: '', value: '', category: '' });
            setFieldErrors({ name: false, value: false, category: false });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          新增数据
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索数据名称或分类..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">全部分类</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据名称</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数值</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建日期</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.value.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{item.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <p>暂无匹配的数据</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? '编辑数据' : '新增数据'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  setNewItem({ name: '', value: '', category: '' });
                  setFieldErrors({ name: false, value: false, category: false });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  数据名称
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入数据名称"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.name
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 focus:ring-primary-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  数值
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newItem.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder="请输入数值"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.value
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 focus:ring-primary-500'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  分类
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    fieldErrors.category
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-200 focus:ring-primary-500'
                  }`}
                >
                  <option value="">请选择分类</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingItem(null);
                  setNewItem({ name: '', value: '', category: '' });
                  setFieldErrors({ name: false, value: false, category: false });
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                {editingItem ? '保存修改' : '新增'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showErrorModal}
        onClose={handleCloseModal}
        title="提示"
        message="请填写以下必填项"
        fields={errorFields}
      />
    </div>
  );
}
