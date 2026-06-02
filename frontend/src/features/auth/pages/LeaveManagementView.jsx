import { useState } from 'react';
import { 
  Check, 
  X, 
  Calendar, 
  Clock, 
  Inbox, 
  History, 
  AlertCircle 
} from 'lucide-react';

const LeaveManagementView = () => {
  const [activeTab, setActiveTab] = useState('pending'); // pending | history
  const [successMsg, setSuccessMsg] = useState('');

  // Leaves database
  const [leaves, setLeaves] = useState([
    {
      id: 'l1',
      employeeName: 'Rohan Verma',
      role: 'Backend Dev',
      type: 'Casual Leave',
      dates: 'Jun 12, 2026 - Jun 14, 2026',
      days: 3,
      reason: 'Attending a family wedding in Jaipur.',
      submitted: '2 hours ago',
      status: 'Pending'
    },
    {
      id: 'l2',
      employeeName: 'Maya Patel',
      role: 'Frontend Dev',
      type: 'Sick Leave',
      dates: 'Jun 05, 2026 - Jun 06, 2026',
      days: 2,
      reason: 'Undergoing wisdom tooth extraction surgery.',
      submitted: '4 hours ago',
      status: 'Pending'
    },
    {
      id: 'l3',
      employeeName: 'Neha Gupta',
      role: 'HR Manager',
      type: 'Paid Time Off',
      dates: 'Jul 01, 2026 - Jul 10, 2026',
      days: 10,
      reason: 'Annual family summer vacation trip.',
      submitted: '1 day ago',
      status: 'Pending'
    },
    {
      id: 'l4',
      employeeName: 'Aarav Sharma',
      role: 'Lead Architect',
      type: 'Casual Leave',
      dates: 'May 20, 2026 - May 22, 2026',
      days: 3,
      reason: 'Personal errands and family event.',
      submitted: '2 weeks ago',
      status: 'Approved'
    },
    {
      id: 'l5',
      employeeName: 'Kunal Verma',
      role: 'Backend Dev',
      type: 'Sick Leave',
      dates: 'May 10, 2026 - May 10, 2026',
      days: 1,
      reason: 'Severe migraine headache.',
      submitted: '3 weeks ago',
      status: 'Rejected'
    }
  ]);

  const handleAction = (id, newStatus) => {
    setLeaves(prev => prev.map(leave => {
      if (leave.id === id) {
        return { ...leave, status: newStatus };
      }
      return leave;
    }));
    
    const leaveItem = leaves.find(l => l.id === id);
    setSuccessMsg(`Leave request for ${leaveItem.employeeName} has been ${newStatus.toLowerCase()} successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getInitials = (name) => {
    if (!name) return 'E';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].slice(0, 2).toUpperCase();
  };

  // Metrics calculation
  const pendingRequests = leaves.filter(l => l.status === 'Pending');
  const pastDecisions = leaves.filter(l => l.status !== 'Pending');

  const stats = [
    { label: 'Pending Approvals', value: pendingRequests.length, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Total Approved', value: leaves.filter(l => l.status === 'Approved').length, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Total Rejected', value: leaves.filter(l => l.status === 'Rejected').length, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { label: 'Total Submitted', value: leaves.length, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Leave Approvals Console</h2>
        <p className="text-sm text-gray-400 mt-1">Review and manage company-wide leave requests and history.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card glass-card-lift bg-[#15171e]/40 border-gray-800/80 rounded-2xl p-4 shadow flex flex-col justify-between">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</span>
            <span className="text-2xl font-black text-white mt-2 font-mono">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="flex items-center space-x-2.5 bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3.5 text-emerald-400 text-xs animate-fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* View Toggles */}
      <div className="flex border-b border-gray-850">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center space-x-2 pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'pending'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          } px-4`}
        >
          <Inbox size={14} />
          <span>Pending Request Pipeline</span>
          <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-blue-500/20">
            {pendingRequests.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center space-x-2 pb-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'history'
              ? 'border-blue-500 text-white'
              : 'border-transparent text-gray-500 hover:text-gray-300'
          } px-4`}
        >
          <History size={14} />
          <span>Decision History Logs</span>
          <span className="bg-gray-800 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-700">
            {pastDecisions.length}
          </span>
        </button>
      </div>

      {/* Main Section */}
      <div className="bg-[#15171e]/30 border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        {activeTab === 'pending' ? (
          // Pending Requests Container
          <div className="divide-y divide-gray-800/80">
            {pendingRequests.length === 0 ? (
              <div className="py-16 text-center text-gray-500 font-semibold text-xs flex flex-col items-center justify-center space-y-2">
                <Inbox size={28} className="text-gray-650" />
                <span>Zero pending leave requests to evaluate. Good job!</span>
              </div>
            ) : (
              pendingRequests.map((leave) => (
                <div key={leave.id} className="p-5 hover:bg-[#1a1d26]/20 transition-colors flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  {/* Left content details */}
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-800 text-white font-bold flex items-center justify-center text-xs border border-gray-750">
                      {getInitials(leave.employeeName)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-white leading-tight">{leave.employeeName}</h4>
                        <span className="text-[9px] text-gray-550 font-bold">• {leave.role}</span>
                      </div>
                      
                      <div className="flex items-center text-[10px] text-gray-400 font-semibold space-x-2.5">
                        <span className="text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">{leave.type}</span>
                        <span className="flex items-center space-x-1 font-mono">
                          <Calendar size={12} className="text-gray-550" />
                          <span>{leave.dates} ({leave.days} Days)</span>
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-300 font-medium pt-1 max-w-xl">
                        &ldquo;{leave.reason}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div className="flex items-center md:justify-end space-x-2">
                    <div className="flex flex-col text-right mr-3 hidden md:block">
                      <span className="text-[9px] text-gray-500 font-semibold">Submitted</span>
                      <span className="text-[10px] font-bold text-gray-300 font-mono flex items-center space-x-1 mt-0.5">
                        <Clock size={11} className="text-gray-550" />
                        <span>{leave.submitted}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => handleAction(leave.id, 'Approved')}
                      className="p-2.5 bg-emerald-950/20 text-emerald-400 border border-emerald-900/30 hover:bg-emerald-600 hover:text-white rounded-xl cursor-pointer transition-colors"
                      title="Approve Request"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleAction(leave.id, 'Rejected')}
                      className="p-2.5 bg-rose-950/20 text-rose-400 border border-red-900/30 hover:bg-rose-600 hover:text-white rounded-xl cursor-pointer transition-colors"
                      title="Decline Request"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Decision History Logs Container
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-800 bg-[#11131a]/60 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Employee</th>
                  <th className="px-6 py-4">Leave Type</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-xs">
                {pastDecisions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-semibold">
                      Zero decision records logged in archive databases.
                    </td>
                  </tr>
                ) : (
                  pastDecisions.map((leave) => (
                    <tr key={leave.id} className="hover:bg-[#1a1d26]/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-850 text-white font-bold flex items-center justify-center text-[10px] border border-gray-800">
                            {getInitials(leave.employeeName)}
                          </div>
                          <div>
                            <h4 className="font-bold text-white leading-tight">{leave.employeeName}</h4>
                            <span className="text-[10px] text-gray-500">{leave.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-semibold">{leave.type}</td>
                      <td className="px-6 py-4 text-gray-400 font-mono">{leave.dates}</td>
                      <td className="px-6 py-4 text-gray-300 font-bold">{leave.days} Days</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border inline-block ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default LeaveManagementView;
