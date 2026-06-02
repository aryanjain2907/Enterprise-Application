import { useState } from 'react';
import { 
  Calendar, 
  Send, 
  History, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const EmployeeLeaveManagementView = () => {
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState('Casual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // Initial Mock Balance Limits
  const [balances, setBalances] = useState([
    { label: 'Paid Time Off', used: 3, total: 15, color: 'from-blue-600 to-cyan-500' },
    { label: 'Sick Leave', used: 3, total: 10, color: 'from-emerald-500 to-teal-500' },
    { label: 'Casual Leave', used: 2, total: 6, color: 'from-purple-500 to-indigo-500' }
  ]);

  // Initial Mock History for Employee
  const [requests, setRequests] = useState([
    {
      id: 'h1',
      type: 'Casual Leave',
      dates: 'May 20, 2026 - May 22, 2026',
      days: 3,
      reason: 'Personal family matters and travel.',
      status: 'Approved',
      submitted: '2 weeks ago'
    },
    {
      id: 'h2',
      type: 'Sick Leave',
      dates: 'May 10, 2026 - May 10, 2026',
      days: 1,
      reason: 'Suffering from high fever and severe flu.',
      status: 'Approved',
      submitted: '3 weeks ago'
    },
    {
      id: 'h3',
      type: 'Paid Time Off',
      dates: 'Apr 02, 2026 - Apr 03, 2026',
      days: 2,
      reason: 'Extended weekend personal trip.',
      status: 'Rejected',
      submitted: '2 months ago'
    }
  ]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diff = e.getTime() - s.getTime();
    if (diff < 0) return 0;
    return Math.ceil(diff / (1000 * 3600 * 24)) + 1;
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    const calculatedDays = calculateDays(startDate, endDate);

    if (calculatedDays <= 0) {
      setErrorMsg('End Date must be equal to or after Start Date.');
      setIsSubmitting(false);
      return;
    }

    // Check balances
    const targetBalance = balances.find(b => b.label === leaveType);
    if (targetBalance && (targetBalance.total - targetBalance.used) < calculatedDays) {
      setErrorMsg(`Insufficient leave balance. You only have ${targetBalance.total - targetBalance.used} days left for ${leaveType}.`);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      // Create request history item
      const newReq = {
        id: 'h' + Date.now(),
        type: leaveType,
        dates: `${new Date(startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} - ${new Date(endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`,
        days: calculatedDays,
        reason: reason,
        status: 'Pending',
        submitted: 'Just Now'
      };

      setRequests([newReq, ...requests]);
      setSuccessMsg('Your leave request has been submitted to management for approval!');
      
      // Reset inputs
      setStartDate('');
      setEndDate('');
      setReason('');
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">Leave Management Console</h2>
        <p className="text-sm text-gray-400 mt-1">Check remaining balances, apply for leaves, and track approval status.</p>
      </div>

      {/* Leave Balances Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {balances.map((bal, i) => (
          <div key={i} className="glass-card glass-card-lift bg-[#15171e]/40 border border-gray-800/80 rounded-2xl p-5 shadow relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${bal.color}`} />
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{bal.label}</h4>
            <div className="flex items-baseline space-x-1.5 mt-3">
              <span className="text-3xl font-black text-white font-mono">{bal.total - bal.used}</span>
              <span className="text-xs text-gray-500 font-semibold">/ {bal.total} Days Left</span>
            </div>
            {/* Progress ring/bar indicator */}
            <div className="w-full bg-gray-850 h-1 rounded-full mt-4 overflow-hidden border border-gray-800">
              <div 
                className="bg-blue-500 h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${((bal.total - bal.used) / bal.total) * 100}%`,
                  backgroundImage: bal.label.includes('Paid') 
                    ? 'linear-gradient(to right, #3b82f6, #06b6d4)' 
                    : bal.label.includes('Sick') 
                    ? 'linear-gradient(to right, #10b981, #14b8a6)' 
                    : 'linear-gradient(to right, #a855f7, #6366f1)'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Form vs History */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Form Container */}
        <div className="lg:col-span-2 bg-[#15171e]/40 border border-gray-800/80 rounded-2xl p-6 shadow-xl h-fit">
          <h3 className="text-sm font-bold text-white mb-4">Request Time Off</h3>

          {errorMsg && (
            <div className="mb-4 flex items-center space-x-2 bg-rose-950/40 border border-rose-900/50 rounded-xl p-3 text-rose-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center space-x-2 bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 text-emerald-400 text-xs">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleRequestSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">Leave Category</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:text-white cursor-pointer"
              >
                <option value="Paid Time Off">Paid Time Off (Vacation)</option>
                <option value="Sick Leave">Sick Leave (Medical)</option>
                <option value="Casual Leave">Casual Leave (Personal)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-gray-300 font-semibold mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">Reason for Leave</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Brief reason for your manager..."
                required
                rows="4"
                className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-white placeholder-gray-650 focus:outline-none focus:border-blue-500 resize-none font-medium leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 mt-4"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={13} />
                  <span>Submit Time Off Request</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* History Container */}
        <div className="lg:col-span-3 bg-[#15171e]/30 border border-gray-800/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Leave Status History</h3>
              <History size={14} className="text-gray-500" />
            </div>

            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {requests.map((req) => (
                <div key={req.id} className="p-3.5 bg-[#15171e]/60 border border-gray-850/80 rounded-xl hover:bg-[#1a1d26]/30 transition-colors flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xs font-bold text-white">{req.type}</span>
                      <span className="text-[10px] text-gray-500 font-medium font-mono">{req.days} Days ({req.dates})</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">&ldquo;{req.reason}&rdquo;</p>
                    <span className="text-[9px] text-gray-550 block font-mono">Submitted: {req.submitted}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    req.status === 'Approved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : req.status === 'Rejected'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default EmployeeLeaveManagementView;
