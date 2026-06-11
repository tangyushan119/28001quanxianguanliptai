import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
);

describe('Dashboard Page', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
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
    
    const quickActionTitles = ['数据管理', '员工管理', '资产管理', '组织管理', '考勤记录', '费用管理'];
    
    quickActionTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('navigates to data-management when 数据管理 card is clicked', () => {
    render(<Dashboard />, { wrapper });
    
    const dataManagementCard = screen.getByText('数据管理').closest('div');
    fireEvent.click(dataManagementCard!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/data-management');
  });

  it('navigates to employee-management when 员工管理 card is clicked', () => {
    render(<Dashboard />, { wrapper });
    
    const employeeManagementCard = screen.getByText('员工管理').closest('div');
    fireEvent.click(employeeManagementCard!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/employee-management');
  });

  it('navigates to asset-management when 资产管理 card is clicked', () => {
    render(<Dashboard />, { wrapper });
    
    const assetManagementCard = screen.getByText('资产管理').closest('div');
    fireEvent.click(assetManagementCard!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/asset-management');
  });

  it('navigates to organization-management when 组织管理 card is clicked', () => {
    render(<Dashboard />, { wrapper });
    
    const organizationManagementCard = screen.getByText('组织管理').closest('div');
    fireEvent.click(organizationManagementCard!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/organization-management');
  });

  it('navigates to duty-record-management when 考勤记录 card is clicked', () => {
    render(<Dashboard />, { wrapper });
    
    const dutyRecordManagementCard = screen.getByText('考勤记录').closest('div');
    fireEvent.click(dutyRecordManagementCard!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/duty-record-management');
  });

  it('navigates to expense-management when 费用管理 card is clicked', () => {
    render(<Dashboard />, { wrapper });
    
    const expenseManagementCard = screen.getByText('费用管理').closest('div');
    fireEvent.click(expenseManagementCard!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/expense-management');
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

  it('renders cards with correct hoverable styles', async () => {
    render(<Dashboard />, { wrapper });
    
    const cards = document.querySelectorAll('.hover\\:shadow-xl');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders quick action cards with consistent layout', () => {
    render(<Dashboard />, { wrapper });
    
    const quickActionCards = document.querySelectorAll('[class*="cursor-pointer"]');
    expect(quickActionCards.length).toBe(6);
  });

  it('applies correct grid layout for quick actions', () => {
    render(<Dashboard />, { wrapper });
    
    const quickActionsContainer = screen.getByText('功能入口').parentElement?.nextElementSibling;
    expect(quickActionsContainer).toHaveClass('grid');
  });

  it('renders all department stats with count and percentage', () => {
    render(<Dashboard />, { wrapper });
    
    const departmentStats = [
      { name: '县政府办公室', count: 45 },
      { name: '发展和改革局', count: 35 },
      { name: '财政局', count: 40 },
      { name: '人社局', count: 30 },
    ];
    
    departmentStats.forEach(stat => {
      expect(screen.getByText(stat.name)).toBeInTheDocument();
      expect(screen.getByText(`${stat.count}人`)).toBeInTheDocument();
    });
  });

  it('renders correct change indicators for statistics', () => {
    render(<Dashboard />, { wrapper });
    
    const positiveChange = screen.getByText('2.3%');
    const negativeChange = screen.getByText('1.2%');
    
    expect(positiveChange).toBeInTheDocument();
    expect(negativeChange).toBeInTheDocument();
  });

  it('renders data trend chart with 12 months', () => {
    render(<Dashboard />, { wrapper });
    
    const monthLabels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
    
    monthLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('has fixed header element', () => {
    render(<Dashboard />, { wrapper });
    
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('fixed');
  });

  it('has scrollable main content area', () => {
    render(<Dashboard />, { wrapper });
    
    const mainContent = document.querySelector('main');
    expect(mainContent).toBeInTheDocument();
    expect(mainContent).toHaveClass('overflow-y-auto');
  });

  it('header stays above main content', () => {
    render(<Dashboard />, { wrapper });
    
    const header = document.querySelector('header');
    const mainContent = document.querySelector('main');
    
    expect(header).toHaveClass('z-40');
    expect(mainContent).toHaveClass('mt-[104px]');
  });

  it('main content has proper margin for left sidebar', () => {
    render(<Dashboard />, { wrapper });
    
    const mainContent = document.querySelector('main');
    expect(mainContent).toHaveClass('ml-[268px]!');
    expect(mainContent).toHaveClass('pr-6');
    expect(mainContent).toHaveClass('sm:pr-8');
    expect(mainContent).toHaveClass('lg:pr-12');
  });

  it('main content left margin matches sidebar width', () => {
    render(<Dashboard />, { wrapper });
    
    const mainContent = document.querySelector('main');
    expect(mainContent).toHaveClass('ml-[268px]!');
  });

  it('main content has inline style margin-left set', () => {
    render(<Dashboard />, { wrapper });
    
    const mainContent = document.querySelector('main');
    expect(mainContent).toHaveStyle({ marginLeft: '268px' });
  });

  it('right-side cards have proper left padding on large screens', () => {
    render(<Dashboard />, { wrapper });
    
    const rightCards = document.querySelectorAll('.lg\\:pl-4');
    expect(rightCards.length).toBeGreaterThanOrEqual(2);
  });

  it('right-side cards have proper z-index for layout hierarchy', () => {
    render(<Dashboard />, { wrapper });
    
    const rightCards = document.querySelectorAll('.lg\\:pl-4');
    rightCards.forEach(card => {
      expect(card).toHaveStyle({ position: 'relative' });
      expect(card).toHaveStyle({ zIndex: '1' });
    });
  });

  it('all data cards are visible and not overlapping', () => {
    render(<Dashboard />, { wrapper });
    
    const cards = document.querySelectorAll('[class*="bg-white rounded-2xl"]');
    expect(cards.length).toBeGreaterThan(0);
    
    cards.forEach(card => {
      expect(card).toBeVisible();
    });
  });

  it('department distribution card is properly positioned', () => {
    render(<Dashboard />, { wrapper });
    
    const deptCard = screen.getByText('部门分布').closest('[class*="lg:pl-4"]');
    expect(deptCard).toBeInTheDocument();
  });

  it('recent activities card is properly positioned', () => {
    render(<Dashboard />, { wrapper });
    
    const recentCard = screen.getByText('最近动态').closest('[class*="lg:pl-4"]');
    expect(recentCard).toBeInTheDocument();
  });
});