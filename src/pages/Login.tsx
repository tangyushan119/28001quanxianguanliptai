import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Modal } from '@/components';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalFields, setModalFields] = useState<string[]>([]);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: string[] = [];
    setUsernameError(false);
    setPasswordError(false);

    if (!username.trim()) {
      errors.push('用户名');
      setUsernameError(true);
    }
    if (!password) {
      errors.push('密码');
      setPasswordError(true);
    }

    if (errors.length > 0) {
      setModalFields(errors);
      setModalIsOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await login({ username, password });
    setLoading(false);

    if (!result.success) {
      setModalFields(['用户名或密码错误']);
      setModalIsOpen(true);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (field: 'username' | 'password', value: string) => {
    if (field === 'username') {
      setUsername(value);
      if (usernameError && value.trim()) {
        setUsernameError(false);
      }
    } else {
      setPassword(value);
      if (passwordError && value) {
        setPasswordError(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>
      
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">全域综合数据管理平台</h1>
            <p className="text-white/60">县城全县数据治理中心</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-1">
                用户名
                <span className="text-red-400">*</span>
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="请输入用户名"
                leftIcon={<User className={`w-5 h-5 ${usernameError ? 'text-red-400' : 'text-white/40'}`} />}
                status={usernameError ? 'error' : 'default'}
                className="bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-accent-500 focus:ring-accent-500/20"
              />
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2 flex items-center gap-1">
                密码
                <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${passwordError ? 'text-red-400' : 'text-white/40'} pointer-events-none`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="请输入密码"
                  className={`w-full pl-12 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 transition-all ${
                    passwordError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-white/20 focus:border-accent-500 focus:ring-accent-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full"
            >
              <LogIn className="w-5 h-5" />
              登 录
            </Button>
          </form>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span>测试账号:</span>
              <span className="text-white/60">admin/admin123</span>
              <span>或</span>
              <span className="text-white/60">user/user123</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={modalIsOpen} onClose={handleCloseModal} title="提示" type={modalFields.includes('用户名或密码错误') ? 'error' : 'warning'}>
        <div>
          <p className="text-gray-600 mb-4">
            {modalFields.includes('用户名或密码错误') ? '用户名或密码错误，请重新输入' : '请填写以下必填项'}
          </p>
          {!modalFields.includes('用户名或密码错误') && modalFields.length > 0 && (
            <div className="bg-error-50 rounded-lg p-4">
              <p className="text-sm font-medium text-error-700 mb-2">未填写的项目:</p>
              <ul className="space-y-2">
                {modalFields.map((field, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-error-600">
                    <span className="w-1.5 h-1.5 bg-error-500 rounded-full" />
                    {field}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={handleCloseModal} className="w-full mt-4">
            知道了
          </Button>
        </div>
      </Modal>
    </div>
  );
}