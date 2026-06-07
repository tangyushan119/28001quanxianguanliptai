import Button from './Button';
import Table, {
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from './Table';
import Badge from './Badge';
import { Edit2, Trash2, Eye } from 'lucide-react';
import type { Employee, Department } from '../types';

interface EmployeeListProps {
  employees: Employee[];
  departments: Department[];
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
  onView: (employee: Employee) => void;
}

const statusConfig = {
  active: { label: '在职', variant: 'success' as const },
  'on-leave': { label: '休假', variant: 'warning' as const },
  resigned: { label: '离职', variant: 'secondary' as const },
};

const employmentTypeConfig = {
  'full-time': '全职',
  'part-time': '兼职',
  'contract': '合同工',
};

const genderConfig = {
  male: '男',
  female: '女',
};

export default function EmployeeList({
  employees,
  departments,
  onEdit,
  onDelete,
  onView,
}: EmployeeListProps) {
  const getDepartmentName = (id: string) => {
    const dept = departments.find((d) => d.id === id);
    return dept?.name || '-';
  };

  if (employees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <div className="text-gray-400 text-lg">暂无人员信息</div>
        <div className="text-gray-400 text-sm mt-2">请点击上方按钮添加人员</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>员工编号</TableHeaderCell>
            <TableHeaderCell>姓名</TableHeaderCell>
            <TableHeaderCell>性别</TableHeaderCell>
            <TableHeaderCell>部门</TableHeaderCell>
            <TableHeaderCell>职位</TableHeaderCell>
            <TableHeaderCell>用工类型</TableHeaderCell>
            <TableHeaderCell>入职日期</TableHeaderCell>
            <TableHeaderCell>状态</TableHeaderCell>
            <TableHeaderCell align="center">操作</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody striped hoverable>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell nowrap>{employee.employeeId}</TableCell>
              <TableCell nowrap>{employee.name}</TableCell>
              <TableCell nowrap>{genderConfig[employee.gender]}</TableCell>
              <TableCell nowrap>{getDepartmentName(employee.departmentId)}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell nowrap>{employmentTypeConfig[employee.employmentType]}</TableCell>
              <TableCell nowrap>
                {new Date(employee.hireDate).toLocaleDateString('zh-CN')}
              </TableCell>
              <TableCell nowrap>
                <Badge variant={statusConfig[employee.status].variant}>
                  {statusConfig[employee.status].label}
                </Badge>
              </TableCell>
              <TableCell align="center" nowrap>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Eye className="w-3 h-3" />}
                    onClick={() => onView(employee)}
                  >
                    查看
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit2 className="w-3 h-3" />}
                    onClick={() => onEdit(employee)}
                  >
                    编辑
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="w-3 h-3" />}
                    onClick={() => onDelete(employee.id)}
                  >
                    删除
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}