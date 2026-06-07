import { useState, useEffect } from 'react';
import { TrendingUp, Users, Building2, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

export default function Dashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">数据仪表盘</h1>
        <div className="flex items-center gap-4 text-gray-500">
          <span>{currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
          <span className="w-1 h-1 bg-gray-400 rounded-full" />
          <span>{currentTime.toLocaleTimeString('zh-CN')}</span>
          {user && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span>当前用户: {user.username} ({user.role === 'admin' ? '管理员' : '普通用户'})</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;
          return (
            <div key={card.title} className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{Math.abs(card.change)}%</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {card.value.toLocaleString()}
                <span className="text-base font-normal text-gray-500 ml-1">{card.unit}</span>
              </div>
              <p className="text-gray-500 text-sm">{card.title}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">数据趋势</h2>
          <div className="h-64 flex items-end justify-between gap-4 px-4">
            {[45, 68, 42, 75, 55, 80, 65, 90, 72, 85, 68, 95].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-primary-500 to-accent-400 rounded-t-lg transition-all hover:from-primary-600 hover:to-accent-500" style={{ height: `${height}%` }} />
                <span className="text-xs text-gray-500">{index + 1}月</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">分类占比</h2>
          <div className="space-y-4">
            {[
              { name: '农业', percentage: 35, color: 'bg-green-500' },
              { name: '工业', percentage: 40, color: 'bg-blue-500' },
              { name: '服务业', percentage: 25, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-800">{item.percentage}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-500`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
