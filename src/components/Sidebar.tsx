import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Database, LogOut, Globe, Building2, Users, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: '数据仪表盘' },
  { path: '/data-management', icon: Database, label: '数据管理' },
  { path: '/organization-management', icon: Building2, label: '单位部门管理' },
  { path: '/employee-management', icon: Users, label: '人员档案管理' },
  { path: '/asset-management', icon: Package, label: '资产管理' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-primary-900 to-primary-800 text-white flex flex-col">
      <div className="p-6 border-b border-primary-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">数据管理平台</h1>
            <p className="text-primary-300 text-xs">全域综合治理</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                      : 'text-primary-200 hover:bg-primary-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-primary-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-primary-200 hover:bg-primary-700/50 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">退出登录</span>
        </button>
      </div>
    </aside>
  );
}
