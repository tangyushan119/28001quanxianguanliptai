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
