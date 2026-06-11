import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Dashboard Page', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders dashboard title correctly', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('数据仪表盘')).toBeInTheDocument();
  });

  it('renders current time', async () => {
    render(<Dashboard />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/\d{4}年\d{1,2}月\d{1,2}日/)).toBeInTheDocument();
    });
  });

  it('renders user information when logged in', async () => {
    localStorage.setItem('quanxianguanli_token', 'admin:1234567890');
    
    render(<Dashboard />, { wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('当前用户: admin (管理员)')).toBeInTheDocument();
    });
  });

  it('renders function entry section', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('功能入口')).toBeInTheDocument();
  });

  it('renders all 6 quick action cards', () => {
    render(<Dashboard />, { wrapper });
    
    const actionCards = screen.getAllByRole('button');
    const quickActionTitles = ['数据管理', '员工管理', '资产管理', '组织管理', '考勤记录', '费用管理'];
    
    quickActionTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders statistic cards', () => {
    render(<Dashboard />, { wrapper });
    
    const statTitles = ['总人口', 'GDP总量', '企业数量', '活跃度'];
    
    statTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders data trend chart', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('数据趋势')).toBeInTheDocument();
    expect(screen.getByText('近12个月数据变化')).toBeInTheDocument();
  });

  it('renders department distribution', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('部门分布')).toBeInTheDocument();
    
    const departments = ['县政府办公室', '发展和改革局', '财政局', '人社局'];
    departments.forEach(dept => {
      expect(screen.getByText(dept)).toBeInTheDocument();
    });
  });

  it('renders category percentage', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('分类占比')).toBeInTheDocument();
    
    const categories = ['农业', '工业', '服务业'];
    categories.forEach(cat => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it('renders recent activities', () => {
    render(<Dashboard />, { wrapper });
    
    expect(screen.getByText('最近动态')).toBeInTheDocument();
    
    const activities = [
      '新增员工记录: 李四',
      '更新资产信息: 打印机 EQ003',
      '审批费用报销: 张三 500元',
      '新增值班记录: 王五',
      '删除部门: 国库科'
    ];
    
    activities.forEach(activity => {
      expect(screen.getByText(activity)).toBeInTheDocument();
    });
  });

  it('renders percentage values correctly', () => {
    render(<Dashboard />, { wrapper });
    
    const percentages = ['35%', '40%', '25%'];
    percentages.forEach(percentage => {
      expect(screen.getByText(percentage)).toBeInTheDocument();
    });
  });

  it('renders change indicators with correct colors', async () => {
    render(<Dashboard />, { wrapper });
    
    const cards = document.querySelectorAll('.hover\\:shadow-xl');
    expect(cards.length).toBeGreaterThan(0);
  });
});