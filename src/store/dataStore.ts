import { Organization, Department, Employee, Equipment, Supplies, DutyRecord, FieldRecord } from '../types';
import { mockOrganizations, mockDepartments, mockEmployees, mockEquipments, mockSupplies, mockDutyRecords, mockFieldRecords } from '../data/mockData';

type DataStore = {
  organizations: Organization[];
  departments: Department[];
  employees: Employee[];
  equipments: Equipment[];
  supplies: Supplies[];
  dutyRecords: DutyRecord[];
  fieldRecords: FieldRecord[];
};

let store: DataStore = {
  organizations: [...mockOrganizations],
  departments: [...mockDepartments],
  employees: [...mockEmployees],
  equipments: [...mockEquipments],
  supplies: [...mockSupplies],
  dutyRecords: [...mockDutyRecords],
  fieldRecords: [...mockFieldRecords],
};

const listeners = new Set<Listener>();

export const subscribe = (listener: Listener): () => void => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const getOrganizations = (): Organization[] => store.organizations;

export const getDepartments = (): Department[] => store.departments;

export const getEmployees = (): Employee[] => store.employees;

export const getEquipments = (): Equipment[] => store.equipments;

export const getSupplies = (): Supplies[] => store.supplies;

export const addOrganization = (org: Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Organization => {
  const now = new Date().toISOString().split('T')[0];
  const newOrg: Organization = {
    ...org,
    id: Date.now().toString(),
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
  store.organizations = [...store.organizations, newOrg];
  notify();
  return newOrg;
};

export const updateOrganization = (id: string, updates: Partial<Organization>): void => {
  store.organizations = store.organizations.map((org) =>
    org.id === id ? { ...org, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : org
  );
  notify();
};

export const addDepartment = (dept: Omit<Department, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Department => {
  const now = new Date().toISOString().split('T')[0];
  const newDept: Department = {
    ...dept,
    id: Date.now().toString(),
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
  store.departments = [...store.departments, newDept];
  notify();
  return newDept;
};

export const updateDepartment = (id: string, updates: Partial<Department>): void => {
  store.departments = store.departments.map((dept) =>
    dept.id === id ? { ...dept, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : dept
  );
  notify();
};

export const updateDepartmentStatus = (id: string, status: 'active' | 'archived'): void => {
  store.departments = store.departments.map((dept) =>
    dept.id === id ? { ...dept, status, updatedAt: new Date().toISOString().split('T')[0] } : dept
  );
  notify();
};

export const updateOrganizationStatus = (id: string, status: 'active' | 'archived'): void => {
  store.organizations = store.organizations.map((org) =>
    org.id === id ? { ...org, status, updatedAt: new Date().toISOString().split('T')[0] } : org
  );
  notify();
};

export const addEmployee = (emp: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Employee => {
  const now = new Date().toISOString().split('T')[0];
  const newEmp: Employee = {
    ...emp,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  store.employees = [...store.employees, newEmp];
  notify();
  return newEmp;
};

export const updateEmployee = (id: string, updates: Partial<Employee>): void => {
  store.employees = store.employees.map((emp) =>
    emp.id === id ? { ...emp, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : emp
  );
  notify();
};

export const addEquipment = (eq: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Equipment => {
  const now = new Date().toISOString().split('T')[0];
  const newEq: Equipment = {
    ...eq,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  store.equipments = [...store.equipments, newEq];
  notify();
  return newEq;
};

export const updateEquipment = (id: string, updates: Partial<Equipment>): void => {
  store.equipments = store.equipments.map((eq) =>
    eq.id === id ? { ...eq, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : eq
  );
  notify();
};

export const deleteEquipment = (id: string): void => {
  store.equipments = store.equipments.filter((eq) => eq.id !== id);
  notify();
};

export const addSupplies = (sp: Omit<Supplies, 'id' | 'createdAt' | 'updatedAt'>): Supplies => {
  const now = new Date().toISOString().split('T')[0];
  const newSp: Supplies = {
    ...sp,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  store.supplies = [...store.supplies, newSp];
  notify();
  return newSp;
};

export const updateSupplies = (id: string, updates: Partial<Supplies>): void => {
  store.supplies = store.supplies.map((sp) =>
    sp.id === id ? { ...sp, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : sp
  );
  notify();
};

export const deleteSupplies = (id: string): void => {
  store.supplies = store.supplies.filter((sp) => sp.id !== id);
  notify();
};

export const checkOrgCodeExists = (code: string, excludeId?: string): boolean => {
  return store.organizations.some((org) => org.code === code && org.id !== excludeId);
};

export const checkDeptCodeExists = (code: string, excludeId?: string): boolean => {
  return store.departments.some((dept) => dept.code === code && dept.id !== excludeId);
};

export const getDutyRecords = (): DutyRecord[] => store.dutyRecords;

export const getFieldRecords = (): FieldRecord[] => store.fieldRecords;

export const addDutyRecord = (record: Omit<DutyRecord, 'id' | 'createdAt' | 'updatedAt'>): DutyRecord => {
  const now = new Date().toISOString().split('T')[0];
  const newRecord: DutyRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  store.dutyRecords = [...store.dutyRecords, newRecord];
  notify();
  return newRecord;
};

export const updateDutyRecord = (id: string, updates: Partial<DutyRecord>): void => {
  store.dutyRecords = store.dutyRecords.map((record) =>
    record.id === id ? { ...record, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : record
  );
  notify();
};

export const deleteDutyRecord = (id: string): void => {
  store.dutyRecords = store.dutyRecords.filter((record) => record.id !== id);
  notify();
};

export const addFieldRecord = (record: Omit<FieldRecord, 'id' | 'createdAt' | 'updatedAt'>): FieldRecord => {
  const now = new Date().toISOString().split('T')[0];
  const newRecord: FieldRecord = {
    ...record,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
  };
  store.fieldRecords = [...store.fieldRecords, newRecord];
  notify();
  return newRecord;
};

export const updateFieldRecord = (id: string, updates: Partial<FieldRecord>): void => {
  store.fieldRecords = store.fieldRecords.map((record) =>
    record.id === id ? { ...record, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : record
  );
  notify();
};

export const deleteFieldRecord = (id: string): void => {
  store.fieldRecords = store.fieldRecords.filter((record) => record.id !== id);
  notify();
};