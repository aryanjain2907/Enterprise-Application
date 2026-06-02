import { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  Activity
} from 'lucide-react';

const DashboardView = () => {
  const [currentUser, setCurrentUser] = useState({ username: 'User', role: 'Employee' });
  const [hoveredMetric, setHoveredMetric] = useState(null);

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

  const stats = [
    {
      id: 'employees',
      title: 'Total Employees',
      value: '142',
      change: '+6% vs last month',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'jobs',
      title: 'Active Job Roles',
      value: '12',
      change: '2 added this week',
      trend: 'up',
      icon: Briefcase,
      color: 'from-purple-500 to-indigo-500',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'screened',
      title: 'Resumes Screened',
      value: '384',
      change: '94% AI Accuracy',
      trend: 'up',
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'leaves',
      title: 'Pending Leaves',
      value: '8',
      change: '3 urgent requests',
      trend: 'down',
      icon: Calendar,
      color: 'from-rose-500 to-orange-500',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    }
  ];

  const activities = [
    {
      id: 1,
      type: 'leave',
      user: 'Rohan Sharma',
      action: 'requested 3 days Casual Leave',
      time: '2 hours ago',
      status: 'Pending',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 2,
      type: 'ai',
      user: 'DEVGuard AI',
      action: 'screened resume of Priyansh Verma (92% Match)',
      time: '4 hours ago',
      status: 'Completed',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      id: 3,
      type: 'system',
      user: 'Admin',
      action: 'updated company leaves policy rules',
      time: 'Yesterday',
      status: 'Updated',
      statusColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    {
      id: 4,
      type: 'hiring',
      user: 'Neha Gupta',
      action: 'moved candidate Aditi Sen to Technical Interview',
      time: '1 day ago',
      status: 'Active',
      statusColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Enterprise Analytics</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mt-1">
            Welcome back, <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{currentUser.username}</span>!
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Here's what's happening across your organization today.
          </p>
        </div>
        <div className="text-xs text-gray-500 font-mono bg-[#15171e] px-4 py-2.5 rounded-xl border border-gray-800 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Local Time: {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onMouseEnter={() => setHoveredMetric(stat.id)}
              onMouseLeave={() => setHoveredMetric(null)}
              className="glass-card glass-card-lift bg-[#15171e]/60 backdrop-blur-md border-gray-800/80 hover:border-gray-700/80 rounded-2xl p-5 shadow-lg transition-all duration-300 relative group overflow-hidden"
            >
              {/* Highlight Gradient Underlay */}
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${stat.color}`} />
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-3xl font-black text-white mt-2 tracking-tight group-hover:scale-[1.02] transition-transform duration-200">{stat.value}</h3>
                </div>
                <div className={`p-3 bg-gradient-to-br ${stat.color} text-white rounded-xl shadow-md group-hover:rotate-6 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${stat.badgeColor}`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-gray-500 font-medium flex items-center space-x-0.5">
                  <TrendingUp className="w-3 h-3 text-blue-500" />
                  <span>Real-time</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Chart & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Panel */}
        <div className="glass-card lg:col-span-2 bg-[#15171e]/40 backdrop-blur-md border-gray-800/80 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Hiring & Application Trends</h3>
                <p className="text-xs text-gray-500">Comparing candidates applied vs. screened</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <span className="flex items-center text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />Applied</span>
              <span className="flex items-center text-xs text-gray-400"><span className="w-2 h-2 rounded-full bg-indigo-400 mr-1.5" />Screened</span>
            </div>
          </div>

          {/* Custom SVG Line Chart */}
          <div className="w-full h-64 relative flex items-end">
            <svg viewBox="0 0 500 200" className="w-full h-full text-gray-800" preserveAspectRatio="none">
              <defs>
                <linearGradient id="appliedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="screenedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="5,5" />

              {/* Area & Line for Applied Candidates (Blue) */}
              <path
                d="M 0 160 Q 100 80 200 130 T 400 60 L 500 120 L 500 200 L 0 200 Z"
                fill="url(#appliedGradient)"
              />
              <path
                d="M 0 160 Q 100 80 200 130 T 400 60 L 500 120"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Area & Line for Screened (Indigo) */}
              <path
                d="M 0 180 Q 100 110 200 150 T 400 90 L 500 150 L 500 200 L 0 200 Z"
                fill="url(#screenedGradient)"
              />
              <path
                d="M 0 180 Q 100 110 200 150 T 400 90 L 500 150"
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Data points markers */}
              <circle cx="200" cy="130" r="5" fill="#3b82f6" stroke="#0d0e12" strokeWidth="2" />
              <circle cx="400" cy="60" r="5" fill="#3b82f6" stroke="#0d0e12" strokeWidth="2" />
              <circle cx="200" cy="150" r="4" fill="#818cf8" stroke="#0d0e12" strokeWidth="2" />
              <circle cx="400" cy="90" r="4" fill="#818cf8" stroke="#0d0e12" strokeWidth="2" />
            </svg>
          </div>

          <div className="flex justify-between text-[11px] text-gray-500 font-semibold px-2 mt-4 uppercase tracking-wider">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="glass-card bg-[#15171e]/40 backdrop-blur-md border-gray-800/80 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-white">Recent Activities</h3>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Updates</span>
          </div>

          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-[#1a1d26]/40 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 animate-pulse" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-200">
                    <span className="text-white font-bold">{act.user}</span> {act.action}
                  </p>
                  <span className="text-[10px] text-gray-500 mt-1 block">{act.time}</span>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${act.statusColor}`}>
                  {act.status}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full mt-5 py-2.5 text-center text-xs font-bold text-blue-400 hover:text-blue-300 border border-dashed border-gray-800 hover:border-gray-700 rounded-xl transition-all cursor-pointer">
            View All Audit Logs
          </button>
        </div>

      </div>

    </div>
  );
};

export default DashboardView;
