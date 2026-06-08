import { Organization, Department, Employee, Equipment, Supplies, DutyRecord, FieldRecord, ExpenseRecord } from '../types';

export const mockOrganizations: Organization[] = [
  { id: '1', name: '县政府办公室', code: 'XZFB', address: '县政府大楼1层', phone: '0123-4567890', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '发展和改革局', code: 'FGJ', address: '行政服务中心3层', phone: '0123-4567891', status: 'active', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '3', name: '财政局', code: 'CZJ', address: '财政大厦5层', phone: '0123-4567892', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '4', name: '人力资源和社会保障局', code: 'RSJ', address: '人社局大楼', phone: '0123-4567893', status: 'archived', createdAt: '2024-01-04', updatedAt: '2024-06-01' },
];

export const mockDepartments: Department[] = [
  { id: '1', name: '综合科', code: 'ZH', organizationId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '文秘科', code: 'WM', organizationId: '1', parentId: '1', status: 'active', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '机要室', code: 'JY', organizationId: '1', parentId: '2', status: 'active', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '4', name: '信息科', code: 'XX', organizationId: '1', parentId: '1', status: 'active', createdAt: '2024-01-02', updatedAt: '2024-01-02' },
  { id: '5', name: '规划科', code: 'GH', organizationId: '2', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '6', name: '项目审批股', code: 'XM', organizationId: '2', parentId: '5', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '7', name: '投资科', code: 'TZ', organizationId: '2', status: 'active', createdAt: '2024-01-03', updatedAt: '2024-01-03' },
  { id: '8', name: '预算科', code: 'YS', organizationId: '3', status: 'active', createdAt: '2024-01-04', updatedAt: '2024-01-04' },
  { id: '9', name: '国库科', code: 'GK', organizationId: '3', parentId: '8', status: 'archived', createdAt: '2024-01-04', updatedAt: '2024-05-15' },
  { id: '10', name: '绩效评价股', code: 'JX', organizationId: '3', parentId: '8', status: 'active', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
];

export const mockEmployees: Employee[] = [
  { id: '1', name: '张三', employeeId: 'EMP001', gender: 'male', birthDate: '1990-01-15', phone: '13800138001', email: 'zhangsan@example.com', address: '北京市朝阳区', departmentId: '1', position: '科长', employmentType: 'full-time', hireDate: '2020-03-15', status: 'active', createdAt: '2020-03-15', updatedAt: '2020-03-15' },
  { id: '2', name: '李四', employeeId: 'EMP002', gender: 'female', birthDate: '1992-05-20', phone: '13900139002', email: 'lisi@example.com', address: '北京市海淀区', departmentId: '2', position: '科员', employmentType: 'full-time', hireDate: '2021-06-01', status: 'active', createdAt: '2021-06-01', updatedAt: '2021-06-01' },
  { id: '3', name: '王五', employeeId: 'EMP003', gender: 'male', birthDate: '1988-11-08', phone: '13700137003', email: 'wangwu@example.com', departmentId: '5', position: '副科长', employmentType: 'full-time', hireDate: '2019-09-10', status: 'on-leave', createdAt: '2019-09-10', updatedAt: '2024-01-15' },
  { id: '4', name: '赵六', employeeId: 'EMP004', gender: 'female', birthDate: '1995-03-25', phone: '13600136004', email: 'zhaoliu@example.com', departmentId: '8', position: '会计', employmentType: 'contract', hireDate: '2022-01-10', status: 'active', createdAt: '2022-01-10', updatedAt: '2022-01-10' },
];

export const mockEquipments: Equipment[] = [
  { id: '1', name: '台式电脑', code: 'EQ001', type: 'computer', model: 'ThinkPad M900', manufacturer: '联想', brandSeries: 'ThinkPad M系列', assetNumber: 'AST-2023-001', purchaseDate: '2023-05-15', price: 5800, usefulLife: 5, location: '县政府大楼301室', departmentId: '1', responsiblePerson: '张三', status: 'in-use', warrantyEndDate: '2025-05-15', description: '办公用台式机', createdAt: '2023-05-15', updatedAt: '2023-05-15' },
  { id: '2', name: '笔记本电脑', code: 'EQ002', type: 'computer', model: 'MacBook Pro 14', manufacturer: '苹果', brandSeries: 'MacBook Pro', assetNumber: 'AST-2023-002', purchaseDate: '2023-08-20', price: 12500, usefulLife: 4, location: '县政府大楼302室', departmentId: '2', responsiblePerson: '李四', status: 'in-use', warrantyEndDate: '2025-08-20', createdAt: '2023-08-20', updatedAt: '2023-08-20' },
  { id: '3', name: '打印机', code: 'EQ003', type: 'office', model: 'HP LaserJet Pro', manufacturer: '惠普', brandSeries: 'LaserJet Pro', assetNumber: 'AST-2022-001', purchaseDate: '2022-11-10', price: 2300, usefulLife: 3, location: '行政服务中心305室', departmentId: '5', responsiblePerson: '王五', status: 'maintenance', createdAt: '2022-11-10', updatedAt: '2024-01-10' },
  { id: '4', name: '投影仪', code: 'EQ004', type: 'office', model: 'EPSON CB-X06', manufacturer: '爱普生', brandSeries: 'CB系列', assetNumber: 'AST-2023-003', purchaseDate: '2023-03-05', price: 3800, usefulLife: 5, location: '财政大厦会议室', departmentId: '8', responsiblePerson: '赵六', status: 'idle', createdAt: '2023-03-05', updatedAt: '2023-03-05' },
];

export const mockSupplies: Supplies[] = [
  { id: '1', name: 'A4打印纸', code: 'SP001', category: 'stationery', brandSeries: '得力70g', assetNumber: 'AST-SP-001', unit: '箱', quantity: 50, unitPrice: 85, totalPrice: 4250, location: '仓库A区', departmentId: '1', supplier: '得力文具', purchaseDate: '2024-01-05', shelfLife: 24, status: 'in-stock', createdAt: '2024-01-05', updatedAt: '2024-01-05' },
  { id: '2', name: '签字笔', code: 'SP002', category: 'stationery', brandSeries: '晨光Q7', assetNumber: 'AST-SP-002', unit: '盒', quantity: 200, unitPrice: 15, totalPrice: 3000, location: '仓库A区', departmentId: '2', supplier: '晨光文具', purchaseDate: '2024-02-10', shelfLife: 36, status: 'in-stock', createdAt: '2024-02-10', updatedAt: '2024-02-10' },
  { id: '3', name: '办公椅', code: 'SP003', category: 'furniture', brandSeries: '人体工学系列', assetNumber: 'AST-SP-003', unit: '把', quantity: 20, unitPrice: 350, totalPrice: 7000, location: '仓库B区', departmentId: '5', purchaseDate: '2023-12-15', status: 'in-use', createdAt: '2023-12-15', updatedAt: '2023-12-15' },
  { id: '4', name: '消毒液', code: 'SP004', category: 'cleaning', brandSeries: '84消毒液', assetNumber: 'AST-SP-004', unit: '瓶', quantity: 10, unitPrice: 25, totalPrice: 250, location: '仓库C区', departmentId: '8', purchaseDate: '2024-03-01', expirationDate: '2025-03-01', shelfLife: 12, status: 'low-stock', createdAt: '2024-03-01', updatedAt: '2024-03-01' },
];

export const mockDutyRecords: DutyRecord[] = [
  { id: '1', employeeId: 'EMP001', employeeName: '张三', departmentId: '1', dutyDate: '2024-01-15', dutyType: 'morning', startTime: '08:00', endTime: '12:00', location: '县政府大楼值班室', dutyContent: '日常值班，处理来电来访', remarks: '无特殊事项', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '2', employeeId: 'EMP002', employeeName: '李四', departmentId: '2', dutyDate: '2024-01-15', dutyType: 'afternoon', startTime: '14:00', endTime: '18:00', location: '行政服务中心值班室', dutyContent: '窗口值班，协助群众办理业务', status: 'completed', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '3', employeeId: 'EMP003', employeeName: '王五', departmentId: '5', dutyDate: '2024-01-16', dutyType: 'evening', startTime: '18:00', endTime: '22:00', location: '发展和改革局值班室', dutyContent: '夜间值班，处理紧急事务', remarks: '接到上级通知', status: 'completed', createdAt: '2024-01-16', updatedAt: '2024-01-16' },
  { id: '4', employeeId: 'EMP004', employeeName: '赵六', departmentId: '8', dutyDate: '2024-01-17', dutyType: 'night', startTime: '22:00', endTime: '08:00', location: '财政大厦值班室', dutyContent: '夜班值班，保障财务系统安全', status: 'pending', createdAt: '2024-01-17', updatedAt: '2024-01-17' },
];

export const mockFieldRecords: FieldRecord[] = [
  { id: '1', employeeId: 'EMP001', employeeName: '张三', departmentId: '1', fieldDate: '2024-01-10', startTime: '09:00', endTime: '12:30', destination: '市政务服务中心', purpose: '参加政务信息化培训', transportation: 'car', expenses: 150, status: 'completed', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: '2', employeeId: 'EMP002', employeeName: '李四', departmentId: '2', fieldDate: '2024-01-12', startTime: '08:30', endTime: '17:00', destination: '工业园区', purpose: '调研企业复工情况', transportation: 'bus', expenses: 35, status: 'completed', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
  { id: '3', employeeId: 'EMP003', employeeName: '王五', departmentId: '5', fieldDate: '2024-01-18', startTime: '07:00', endTime: '18:00', destination: '邻县发改委', purpose: '学习考察项目审批经验', transportation: 'car', expenses: 320, status: 'pending', createdAt: '2024-01-18', updatedAt: '2024-01-18' },
  { id: '4', employeeId: 'EMP004', employeeName: '赵六', departmentId: '8', fieldDate: '2024-01-20', startTime: '09:00', endTime: '16:00', destination: '乡镇财政所', purpose: '检查财务报表', transportation: 'car', status: 'pending', createdAt: '2024-01-20', updatedAt: '2024-01-20' },
];

export const mockExpenseRecords: ExpenseRecord[] = [
  { id: '1', employeeId: 'EMP001', employeeName: '张三', departmentId: '1', expenseType: 'expense', category: 'office_supplies', amount: 500, date: '2024-01-10', description: '购买办公文具', paymentMethod: 'card', status: 'approved', createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: '2', employeeId: 'EMP002', employeeName: '李四', departmentId: '2', expenseType: 'expense', category: 'travel', amount: 350, date: '2024-01-12', description: '差旅费报销', paymentMethod: 'bank', status: 'approved', createdAt: '2024-01-12', updatedAt: '2024-01-12' },
  { id: '3', employeeId: 'EMP003', employeeName: '王五', departmentId: '5', expenseType: 'income', category: 'salary', amount: 8000, date: '2024-01-15', description: '1月份工资', paymentMethod: 'bank', status: 'approved', createdAt: '2024-01-15', updatedAt: '2024-01-15' },
  { id: '4', employeeId: 'EMP004', employeeName: '赵六', departmentId: '8', expenseType: 'expense', category: 'equipment', amount: 2800, date: '2024-01-18', description: '购买打印机', paymentMethod: 'bank', status: 'pending', createdAt: '2024-01-18', updatedAt: '2024-01-18' },
  { id: '5', employeeId: 'EMP001', employeeName: '张三', departmentId: '1', expenseType: 'income', category: 'bonus', amount: 2000, date: '2024-01-20', description: '年终奖金', paymentMethod: 'bank', status: 'pending', createdAt: '2024-01-20', updatedAt: '2024-01-20' },
];