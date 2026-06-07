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
