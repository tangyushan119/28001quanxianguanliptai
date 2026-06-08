export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface DataItem {
  id: string;
  name: string;
  value: number;
  category: string;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  organizationId: string;
  parentId?: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  gender: 'male' | 'female';
  birthDate: string;
  phone: string;
  email: string;
  address?: string;
  departmentId: string;
  position: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  hireDate: string;
  status: 'active' | 'on-leave' | 'resigned';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  employeeId: string;
  gender: 'male' | 'female';
  birthDate: string;
  phone: string;
  email: string;
  address?: string;
  departmentId: string;
  position: string;
  employmentType: 'full-time' | 'part-time' | 'contract';
  hireDate: string;
  status: 'active' | 'on-leave' | 'resigned';
}

export interface Equipment {
  id: string;
  name: string;
  code: string;
  type: string;
  model: string;
  manufacturer: string;
  brandSeries?: string;
  assetNumber?: string;
  purchaseDate: string;
  price: number;
  usefulLife?: number;
  location: string;
  departmentId: string;
  responsiblePerson: string;
  status: 'in-use' | 'idle' | 'maintenance' | 'scrapped';
  warrantyEndDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Supplies {
  id: string;
  name: string;
  code: string;
  category: string;
  brandSeries?: string;
  assetNumber?: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  location: string;
  departmentId: string;
  supplier?: string;
  purchaseDate: string;
  expirationDate?: string;
  shelfLife?: number;
  status: 'in-stock' | 'in-use' | 'low-stock' | 'depleted';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentFormData {
  name: string;
  code: string;
  type: string;
  model: string;
  manufacturer: string;
  brandSeries?: string;
  assetNumber?: string;
  purchaseDate: string;
  price: string;
  usefulLife?: string;
  location: string;
  departmentId: string;
  responsiblePerson: string;
  status: 'in-use' | 'idle' | 'maintenance' | 'scrapped';
  warrantyEndDate?: string;
  description?: string;
}

export interface SuppliesFormData {
  name: string;
  code: string;
  category: string;
  brandSeries?: string;
  assetNumber?: string;
  unit: string;
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  location: string;
  departmentId: string;
  supplier?: string;
  purchaseDate: string;
  expirationDate?: string;
  shelfLife?: string;
  status: 'in-stock' | 'in-use' | 'low-stock' | 'depleted';
  description?: string;
}

export interface DutyRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  dutyDate: string;
  dutyType: 'morning' | 'afternoon' | 'evening' | 'night';
  startTime: string;
  endTime: string;
  location: string;
  dutyContent: string;
  remarks?: string;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface DutyRecordFormData {
  employeeId: string;
  employeeName: string;
  departmentId: string;
  dutyDate: string;
  dutyType: 'morning' | 'afternoon' | 'evening' | 'night';
  startTime: string;
  endTime: string;
  location: string;
  dutyContent: string;
  remarks?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface FieldRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  fieldDate: string;
  startTime: string;
  endTime: string;
  destination: string;
  purpose: string;
  transportation: 'walk' | 'bus' | 'car' | 'train' | 'plane' | 'other';
  expenses?: number;
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface FieldRecordFormData {
  employeeId: string;
  employeeName: string;
  departmentId: string;
  fieldDate: string;
  startTime: string;
  endTime: string;
  destination: string;
  purpose: string;
  transportation: 'walk' | 'bus' | 'car' | 'train' | 'plane' | 'other';
  expenses?: string;
  status: 'completed' | 'pending' | 'cancelled';
}
