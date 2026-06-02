import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronUp, 
  LayoutDashboard, 
  Users, 
  FileText, 
  UserCheck, 
  CalendarDays, 
  Bot, 
  LogOut,
  Sparkles
} from 'lucide-react';
import './index.css';

import DashboardView from './DashboardView';
import EmployeesView from './EmployeesView';
import ResumeView from './ResumeView';
import CandidatesView from './CandidatesView';
import LeaveManagementView from './LeaveManagementView';
import HRAssistantView from './HRAssistantView';

export default function HRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [currentUser, setCurrentUser] = useState({ username: 'HR Manager', role: 'HR_Manager' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'H';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].slice(0, 2).toUpperCase();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'employees': return <EmployeesView />;
      case 'resume': return <ResumeView />;
      case 'candidates': return <CandidatesView />;
      case 'leave': return <LeaveManagementView />;
      case 'assistant': return <HRAssistantView />;
      default: return <DashboardView />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'resume', label: 'Resume Screener', icon: FileText, badge: 'AI' },
    { id: 'candidates', label: 'Candidates', icon: UserCheck },
    { id: 'leave', label: 'Leave Management', icon: CalendarDays },
    { id: 'assistant', label: 'HR Assistant', icon: Bot, badge: 'AI' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0d0e12] text-gray-200 font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="app-sidebar w-64 border-r border-gray-800/80 flex flex-col justify-between z-20 shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="pt-6 pb-6 px-6 border-b border-gray-800/30 flex items-center space-x-3">
            <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow shadow-blue-500/5">
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h1 className="font-extrabold text-white text-md tracking-wider leading-tight">DEVGuard HR</h1>
              <p className="text-[10px] text-gray-500 font-medium tracking-wide">ENTERPRISE PORTAL</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="px-4 py-6">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 mb-4">
              Main Menu
            </p>
            
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'app-nav-active bg-blue-600 text-white font-semibold pl-4'
                        : 'text-gray-400 hover:bg-[#1a1d26]/80 hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/10' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-gray-800/80 flex items-center justify-between bg-[#11131a]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-md border border-indigo-500/20">
              {getInitials(currentUser?.username)}
            </div>
            <div className="min-w-0 max-w-[120px]">
              <h4 className="text-xs font-bold text-white truncate leading-tight">{currentUser?.username}</h4>
              <span className="inline-block bg-indigo-500/10 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full mt-1 font-semibold border border-indigo-500/20">
                HR Manager
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowLogoutPopup(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800/50 cursor-pointer transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main flex-1 flex flex-col overflow-y-auto custom-scrollbar border-l border-gray-900/80">
        <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      {showLogoutPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#15171e] border border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl text-gray-200 text-center relative mx-4 animate-scale-up">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-2xl bg-red-950/40 border border-red-900/30 mb-4 shadow shadow-red-500/5">
              <LogOut className="h-6 w-6 text-red-500" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
            <p className="text-sm text-gray-400 mb-6 px-4">
              Are you sure you want to sign out of DEVGuard HR? You will be redirected to the login screen.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="flex-1 bg-[#0d0e12] hover:bg-[#1a1d26] text-gray-400 hover:text-white py-3 rounded-xl text-sm font-semibold transition-colors border border-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  localStorage.clear(); 
                  sessionStorage.clear();
                  setShowLogoutPopup(false);
                  navigate('/login');
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer shadow-lg shadow-red-500/10"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}