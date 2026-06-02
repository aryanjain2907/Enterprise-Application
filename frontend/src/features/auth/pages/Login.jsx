import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, Lock, User, Shield, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('Employee');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        const response = await axios.post('http://localhost:3000/api/auth/register', {
          username,
          email,
          password,
          role: selectedRole
        });
        setSuccess(response.data.message || 'Registration successful! Please login.');
        setIsRegister(false);
        setUsername('');
      } else {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email,
          password,
          role: selectedRole
        });

        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'Admin') {
          navigate('/admin/dashboard', { state: { user } });
        } else if (user.role === 'HR_Manager') {
          navigate('/hr/dashboard', { state: { user } });
        } else {
          navigate('/employee/dashboard', { state: { user } });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 'Employee', label: 'Employee' },
    { id: 'HR_Manager', label: 'HR Manager' },
    { id: 'Admin', label: 'Admin' }
  ];

  return (
    <div className="login-page min-h-screen w-full flex items-center justify-center px-4 py-10 relative overflow-hidden font-sans">
      <div className="absolute top-[-15%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-600/12 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 animate-fade-in">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-blue-600/10 rounded-2xl border border-blue-500/25 mb-4 shadow-lg shadow-blue-500/10">
            <Shield className="w-10 h-10 text-blue-500" strokeWidth={1.75} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            DEVGuard HR
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            Secure Role-Based Enterprise Portal
          </p>
        </div>

        {/* Auth card */}
        <div className="glass-card bg-[#15171e]/90 backdrop-blur-xl border-gray-800 rounded-2xl shadow-2xl shadow-black/50 p-6 sm:p-8 ring-1 ring-white/[0.06]">
          <div className="flex bg-[#0d0e12] p-1 rounded-xl border border-gray-800 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                !isRegister ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                isRegister ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <h2 className="text-lg font-bold text-white mb-6 text-center">
            {isRegister ? 'Create Your Account' : 'Access Your Portal'}
          </h2>

          <div className="mb-6">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3 text-center">
              Portal access role
            </label>
            <div className="flex bg-[#0d0e12] p-1 rounded-xl border border-gray-800 gap-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex-1 py-2 px-1 text-[11px] sm:text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedRole === role.id
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.12)]'
                      : 'text-gray-500 hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-950/50 border border-red-900/50 rounded-xl p-3.5 text-red-400 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 flex items-start gap-3 bg-emerald-950/50 border border-emerald-900/50 rounded-xl p-3.5 text-emerald-400 text-sm">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div className="input-with-icon">
                  <User aria-hidden />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Your username"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="input-with-icon">
                <Mail aria-hidden />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="input-with-icon">
                <Lock aria-hidden />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all duration-150 mt-1 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In to Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[11px] text-gray-600">
          &copy; {new Date().getFullYear()} DEVGuard Systems Inc. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
