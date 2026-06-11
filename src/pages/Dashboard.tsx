import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Users, Building2, Activity, ArrowUpRight, ArrowDownRight,
  FolderOpen, Users2, FileText, Settings, Database, BarChart3,
  Calendar, ClipboardList, AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from '@/components';

const statCards = [
  {
    title: '总人口',
    value: 1286543,
    unit: '人',
    change: 2.3,
    icon: Users,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'GDP总量',
    value: 286.5,
    unit: '亿元',
    change: 8.7,
    icon: TrendingUp,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: '企业数量',
    value: 8654,
    unit: '家',
    change: -1.2,
    icon: Building2,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: '活跃度',
    value: 96.8,
    unit: '%',
    change: 3.5,
    icon: Activity,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
  },
];

const quickActions = [
  {
    id: '1',
    title: '数据管理',
    description: '管理平台数据',
    icon: Database,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    route: '/data-management',
  },
  {
    id: '2',
    title: '员工管理',
    description: '管理员工信息',
    icon: Users2,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    route: '/employee-management',
  },
  {
    id: '3',
    title: '资产管理',
    description: '管理资产设备',
    icon: FolderOpen,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    route: '/asset-management',
  },
  {
    id: '4',
    title: '组织管理',
    description: '管理组织结构',
    icon: Building2,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    route: '/organization-management',
  },
  {
    id: '5',
    title: '考勤记录',
    description: '管理值班记录',
    icon: Calendar,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
    route: '/duty-record-management',
  },
  {
    id: '6',
    title: '费用管理',
    description: '管理费用报销',
    icon: FileText,
    color: 'bg-cyan-500',
    bgColor: 'bg-cyan-50',
    route: '/expense-management',
  },
];

const recentActivities = [
  { id: '1', type: '创建', content: '新增员工记录: 李四', time: '2小时前', status: 'success' },
  { id: '2', type: '更新', content: '更新资产信息: 打印机 EQ003', time: '5小时前', status: 'warning' },
  { id: '3', type: '审批', content: '审批费用报销: 张三 500元', time: '1天前', status: 'success' },
  { id: '4', type: '创建', content: '新增值班记录: 王五', time: '1天前', status: 'info' },
  { id: '5', type: '删除', content: '删除部门: 国库科', time: '2天前', status: 'danger' },
];

const departmentStats = [
  { name: '县政府办公室', count: 45, percentage: 30 },
  { name: '发展和改革局', count: 35, percentage: 23 },
  { name: '财政局', count: 40, percentage: 27 },
  { name: '人社局', count: 30, percentage: 20 },
];

const HEADER_HEIGHT = 104;

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 1) {
      e.preventDefault();
    }
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (contentRef.current) {
      const container = contentRef.current;
      const isAtTop = container.scrollTop === 0;
      const isAtBottom = container.scrollTop >= container.scrollHeight - container.clientHeight;
      
      if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [handleWheel, handleTouchMove]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-50';
      case 'warning': return 'text-yellow-500 bg-yellow-50';
      case 'danger': return 'text-red-500 bg-red-50';
      default: return 'text-blue-500 bg-blue-50';
    }
  };

  const handleActionClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="fixed top-0 left-64 right-0 h-[104px] bg-white shadow-sm border-b border-gray-100 z-40 px-6 sm:px-8 lg:px-12">
        <div className="h-full flex flex-col justify-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            数据仪表盘
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base text-gray-500">
            <span>
              {currentTime.toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long' 
              })}
            </span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
            <span>{currentTime.toLocaleTimeString('zh-CN')}</span>
            {user && (
              <>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0" />
                <span>当前用户: {user.username} ({user.role === 'admin' ? '管理员' : '普通用户'})</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main 
        ref={contentRef}
        className="flex-1 overflow-y-auto mt-[104px] px-6 sm:px-8 lg:px-12 pb-8"
        style={{
          overscrollBehaviorY: 'contain',
        }}
      >
        <div className="max-w-[1920px] mx-auto">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
              功能入口
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card 
                    key={action.id} 
                    hoverable 
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group min-h-[140px] sm:min-h-[150px] flex flex-col justify-center"
                    onClick={() => handleActionClick(action.route)}
                  >
                    <CardBody className="flex flex-col items-center text-center p-4 sm:p-5 lg:p-6 h-full">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${action.bgColor} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${action.color.replace('bg-', 'text-')}`} />
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1 sm:mb-1.5 text-sm sm:text-base">
                        {action.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500">{action.description}</p>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {statCards.map((card) => {
              const Icon = card.icon;
              const isPositive = card.change >= 0;
              return (
                <Card key={card.title} hoverable className="shadow-sm min-h-[160px]">
                  <CardBody className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span>{Math.abs(card.change)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                        {card.value.toLocaleString()}
                        <span className="text-sm sm:text-base font-normal text-gray-500 ml-1">{card.unit}</span>
                      </div>
                      <p className="text-sm text-gray-500">{card.title}</p>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="lg:col-span-2 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle>数据趋势</CardTitle>
                  <CardSubtitle>近12个月数据变化</CardSubtitle>
                </div>
              </CardHeader>
              <CardBody>
                <div className="h-52 sm:h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-4">
                  {[45, 68, 42, 75, 55, 80, 65, 90, 72, 85, 68, 95].map((height, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-gradient-to-t from-primary-500 to-accent-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-accent-500" 
                        style={{ height: `${height}%`, minHeight: '20px' }} 
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">{index + 1}月</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>部门分布</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 sm:space-y-4">
                  {departmentStats.map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="text-sm font-medium text-gray-800">{item.count}人</span>
                      </div>
                      <div className="h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-400 to-accent-400 rounded-full transition-all duration-500" 
                          style={{ width: `${item.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>分类占比</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { name: '农业', percentage: 35, color: 'bg-green-500' },
                    { name: '工业', percentage: 40, color: 'bg-blue-500' },
                    { name: '服务业', percentage: 25, color: 'bg-purple-500' },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-gray-600">{item.name}</span>
                        <span className="text-sm font-medium text-gray-800">{item.percentage}%</span>
                      </div>
                      <div className="h-2.5 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500`} 
                          style={{ width: `${item.percentage}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>最近动态</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-3 sm:space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 ${getStatusColor(activity.status)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {activity.type === '创建' && <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {activity.type === '更新' && <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {activity.type === '审批' && <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {activity.type === '删除' && <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 truncate">{activity.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}