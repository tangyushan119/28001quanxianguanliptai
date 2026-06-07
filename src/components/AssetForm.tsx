import { useState, useEffect } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Card, { CardHeader, CardTitle, CardBody } from './Card';
import type { EquipmentFormData, SuppliesFormData, Department } from '../types';

export type AssetType = 'equipment' | 'supplies';

interface AssetFormProps {
  assetType: AssetType;
  departments: Department[];
  initialData?: EquipmentFormData | SuppliesFormData;
  onSubmit: (data: EquipmentFormData | SuppliesFormData) => void;
  onCancel?: () => void;
  title?: string;
}

const equipmentStatusOptions = [
  { value: 'in-use', label: '使用中' },
  { value: 'idle', label: '闲置' },
  { value: 'maintenance', label: '维修中' },
  { value: 'scrapped', label: '已报废' },
];

const suppliesStatusOptions = [
  { value: 'in-stock', label: '库存充足' },
  { value: 'in-use', label: '使用中' },
  { value: 'low-stock', label: '库存不足' },
  { value: 'depleted', label: '已耗尽' },
];

const suppliesCategoryOptions = [
  { value: 'stationery', label: '办公用品' },
  { value: 'electronics', label: '电子设备' },
  { value: 'furniture', label: '家具' },
  { value: 'cleaning', label: '清洁用品' },
  { value: 'other', label: '其他' },
];

const equipmentTypeOptions = [
  { value: 'computer', label: '计算机设备' },
  { value: 'network', label: '网络设备' },
  { value: 'office', label: '办公设备' },
  { value: 'vehicle', label: '交通工具' },
  { value: 'other', label: '其他' },
];

export default function AssetForm({
  assetType,
  departments,
  initialData,
  onSubmit,
  onCancel,
  title = assetType === 'equipment' ? '装备信息录入' : '办公物资信息录入',
}: AssetFormProps) {
  const [formData, setFormData] = useState<EquipmentFormData | SuppliesFormData>(
    assetType === 'equipment'
      ? {
          name: '',
          code: '',
          type: '',
          model: '',
          manufacturer: '',
          purchaseDate: '',
          price: '',
          location: '',
          departmentId: '',
          responsiblePerson: '',
          status: 'in-use',
        }
      : {
          name: '',
          code: '',
          category: '',
          unit: '',
          quantity: '',
          unitPrice: '',
          totalPrice: '',
          location: '',
          departmentId: '',
          purchaseDate: '',
          status: 'in-stock',
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入名称';
    }
    if (!formData.code.trim()) {
      newErrors.code = '请输入编号';
    }
    if (!formData.location.trim()) {
      newErrors.location = '请输入存放位置';
    }
    if (!formData.departmentId) {
      newErrors.departmentId = '请选择所属部门';
    }
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = '请选择采购日期';
    }

    if (assetType === 'equipment') {
      const eqData = formData as EquipmentFormData;
      if (!eqData.type.trim()) {
        newErrors.type = '请选择装备类型';
      }
      if (!eqData.model.trim()) {
        newErrors.model = '请输入型号';
      }
      if (!eqData.manufacturer.trim()) {
        newErrors.manufacturer = '请输入生产厂商';
      }
      if (!eqData.price.trim()) {
        newErrors.price = '请输入采购价格';
      } else if (isNaN(parseFloat(eqData.price)) || parseFloat(eqData.price) <= 0) {
        newErrors.price = '请输入有效的价格';
      }
      if (!eqData.responsiblePerson.trim()) {
        newErrors.responsiblePerson = '请输入负责人';
      }
    } else {
      const supData = formData as SuppliesFormData;
      if (!supData.category) {
        newErrors.category = '请选择物资类别';
      }
      if (!supData.unit.trim()) {
        newErrors.unit = '请输入单位';
      }
      if (!supData.quantity.trim()) {
        newErrors.quantity = '请输入数量';
      } else if (isNaN(parseInt(supData.quantity)) || parseInt(supData.quantity) <= 0) {
        newErrors.quantity = '请输入有效的数量';
      }
      if (!supData.unitPrice.trim()) {
        newErrors.unitPrice = '请输入单价';
      } else if (isNaN(parseFloat(supData.unitPrice)) || parseFloat(supData.unitPrice) <= 0) {
        newErrors.unitPrice = '请输入有效的单价';
      }
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
                名称 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="请输入名称"
                status={errors.name ? 'error' : 'default'}
                errorMessage={errors.name}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                编号 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                placeholder="请输入编号"
                status={errors.code ? 'error' : 'default'}
                errorMessage={errors.code}
              />
            </div>

            {assetType === 'equipment' ? (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    装备类型 <span className="text-error-500">*</span>
                  </label>
                  <Select
                    value={(formData as EquipmentFormData).type}
                    onChange={(e) => handleChange('type', (e.target as HTMLSelectElement).value)}
                    status={errors.type ? 'error' : 'default'}
                  >
                    <option value="">请选择类型</option>
                    {equipmentTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    型号 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    value={(formData as EquipmentFormData).model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    placeholder="请输入型号"
                    status={errors.model ? 'error' : 'default'}
                    errorMessage={errors.model}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    生产厂商 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    value={(formData as EquipmentFormData).manufacturer}
                    onChange={(e) => handleChange('manufacturer', e.target.value)}
                    placeholder="请输入生产厂商"
                    status={errors.manufacturer ? 'error' : 'default'}
                    errorMessage={errors.manufacturer}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    采购价格 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={(formData as EquipmentFormData).price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="请输入采购价格"
                    status={errors.price ? 'error' : 'default'}
                    errorMessage={errors.price}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    负责人 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    value={(formData as EquipmentFormData).responsiblePerson}
                    onChange={(e) => handleChange('responsiblePerson', e.target.value)}
                    placeholder="请输入负责人"
                    status={errors.responsiblePerson ? 'error' : 'default'}
                    errorMessage={errors.responsiblePerson}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    保修截止日期
                  </label>
                  <Input
                    type="date"
                    value={(formData as EquipmentFormData).warrantyEndDate || ''}
                    onChange={(e) => handleChange('warrantyEndDate', e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    物资类别 <span className="text-error-500">*</span>
                  </label>
                  <Select
                    value={(formData as SuppliesFormData).category}
                    onChange={(e) => handleChange('category', (e.target as HTMLSelectElement).value)}
                    status={errors.category ? 'error' : 'default'}
                  >
                    <option value="">请选择类别</option>
                    {suppliesCategoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    单位 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    value={(formData as SuppliesFormData).unit}
                    onChange={(e) => handleChange('unit', e.target.value)}
                    placeholder="请输入单位（如：件、个、箱）"
                    status={errors.unit ? 'error' : 'default'}
                    errorMessage={errors.unit}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    数量 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={(formData as SuppliesFormData).quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    placeholder="请输入数量"
                    status={errors.quantity ? 'error' : 'default'}
                    errorMessage={errors.quantity}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    单价 <span className="text-error-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={(formData as SuppliesFormData).unitPrice}
                    onChange={(e) => handleChange('unitPrice', e.target.value)}
                    placeholder="请输入单价"
                    status={errors.unitPrice ? 'error' : 'default'}
                    errorMessage={errors.unitPrice}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    供应商
                  </label>
                  <Input
                    value={(formData as SuppliesFormData).supplier || ''}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    placeholder="请输入供应商"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    有效期
                  </label>
                  <Input
                    type="date"
                    value={(formData as SuppliesFormData).expirationDate || ''}
                    onChange={(e) => handleChange('expirationDate', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                存放位置 <span className="text-error-500">*</span>
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="请输入存放位置"
                status={errors.location ? 'error' : 'default'}
                errorMessage={errors.location}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                所属部门 <span className="text-error-500">*</span>
              </label>
              <Select
                value={formData.departmentId}
                onChange={(e) => handleChange('departmentId', (e.target as HTMLSelectElement).value)}
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
                采购日期 <span className="text-error-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange('purchaseDate', e.target.value)}
                status={errors.purchaseDate ? 'error' : 'default'}
                errorMessage={errors.purchaseDate}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                状态
              </label>
              <Select
                value={formData.status}
                onChange={(e) => handleChange('status', (e.target as HTMLSelectElement).value)}
              >
                {(assetType === 'equipment' ? equipmentStatusOptions : suppliesStatusOptions).map(
                  (opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  )
                )}
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                备注说明
              </label>
              <Input
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="请输入备注说明"
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