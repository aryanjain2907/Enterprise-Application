import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  UserPlus, 
  Mail, 
  Calendar, 
  Trash2, 
  Eye, 
  X, 
  Building, 
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const EmployeesView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState('Admin');
  
  // Form State
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('Employee');
  const [newStatus, setNewStatus] = useState('Active');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial Mock Employees
  const [employees, setEmployees] = useState([
    {
      id: 'e1',
      username: 'Aarav Sharma',
      email: 'aarav.sharma@devguard.com',
      role: 'Admin',
      status: 'Active',
      joined: '12 Jan 2024',
      phone: '+91 98765 43210',
      dept: 'Engineering & DevOps',
      bio: 'Leading the infrastructure team. Enthusiast of clean architecture and automated CI/CD systems.'
    },
    {
      id: 'e2',
      username: 'Neha Gupta',
      email: 'neha.gupta@devguard.com',
      role: 'HR_Manager',
      status: 'Active',
      joined: '04 Mar 2024',
      phone: '+91 87654 32109',
      dept: 'People Ops',
      bio: 'Fostering talent development and onboarding operations. Always open to candidate screenings.'
    },
    {
      id: 'e3',
      username: 'Maya Patel',
      email: 'maya.patel@devguard.com',
      role: 'Employee',
      status: 'Remote',
      joined: '18 Jul 2024',
      phone: '+91 76543 21098',
      dept: 'Frontend Dev',
      bio: 'React and UI/UX developer. Passionate about glassmorphism, transitions, and micro-interactions.'
    },
    {
      id: 'e4',
      username: 'Rohan Verma',
      email: 'rohan.verma@devguard.com',
      role: 'Employee',
      status: 'On Leave',
      joined: '22 Oct 2024',
      phone: '+91 65432 10987',
      dept: 'Backend Dev',
      bio: 'Node.js & MongoDB Specialist. Keeps databases indexed, authenticated, and API layers protected.'
    }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setCurrentUserRole(u.role);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'E';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].slice(0, 2).toUpperCase();
  };

  const getAvatarColor = (role) => {
    if (role === 'Admin') return 'from-blue-600 to-indigo-600 border-blue-500/20';
    if (role === 'HR_Manager') return 'from-purple-500 to-pink-600 border-purple-500/20';
    return 'from-emerald-500 to-teal-600 border-emerald-500/20';
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsSubmitting(true);

    try {
      // 1. Try to register with backend
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole
      });

      const registeredUser = response.data.user || {};
      
      // 2. Add to local state list
      const newEmp = {
        id: registeredUser.id || 'e' + Date.now(),
        username: newUsername,
        email: newEmail,
        role: newRole,
        status: newStatus,
        joined: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        phone: '+91 99999 88888',
        dept: newRole === 'Admin' ? 'Management' : newRole === 'HR_Manager' ? 'HR Operations' : 'Engineering Development',
        bio: `Joined as ${newRole} in our growing enterprise team.`
      };

      setEmployees([newEmp, ...employees]);
      setFormSuccess('Employee registered successfully in system database!');
      
      // Reset form
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setTimeout(() => {
        setShowAddModal(false);
        setFormSuccess('');
      }, 1500);

    } catch (err) {
      // Fallback: Add to local state only (if backend offline)
      console.warn('Backend offline, saving locally only', err);
      const newEmp = {
        id: 'e' + Date.now(),
        username: newUsername,
        email: newEmail,
        role: newRole,
        status: newStatus,
        joined: new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }),
        phone: '+91 99999 88888',
        dept: newRole === 'Admin' ? 'Management' : newRole === 'HR_Manager' ? 'HR Operations' : 'Engineering Development',
        bio: `Joined as ${newRole} (Saved locally).`
      };
      
      setEmployees([newEmp, ...employees]);
      setFormSuccess('Employee created (saved locally - DB offline)');
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setTimeout(() => {
        setShowAddModal(false);
        setFormSuccess('');
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Are you sure you want to terminate this employee contract?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      if (selectedEmployee?.id === id) {
        setSelectedEmployee(null);
      }
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Employees Directory</h2>
          <p className="text-sm text-gray-400 mt-1">Manage users, adjust access controls, and view profiles.</p>
        </div>
        {currentUserRole === 'Admin' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-3 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all duration-150"
          >
            <UserPlus className="w-4 h-4" />
            <span>Onboard Employee</span>
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 bg-[#15171e]/40 p-4 rounded-2xl border-gray-800/80">
        
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Role Filter */}
        <div className="flex space-x-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0d0e12] border border-gray-800 rounded-xl py-2 px-4 text-xs text-gray-400 focus:outline-none focus:border-blue-500 focus:text-white transition-colors cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="HR_Manager">HR Manager</option>
            <option value="Employee">Employee</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d0e12] border border-gray-800 rounded-xl py-2 px-4 text-xs text-gray-400 focus:outline-none focus:border-blue-500 focus:text-white transition-colors cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Remote">Remote</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

      </div>

      {/* Directory Table */}
      <div className="glass-card bg-[#15171e]/30 border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-800 bg-[#11131a]/60 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Employee Profile</th>
                <th className="px-6 py-4">Assigned Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-xs">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 font-semibold">
                    No active profiles found matching query filter.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#1a1d26]/30 transition-colors group">
                    {/* User profile */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3.5">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(emp.role)} text-white font-bold flex items-center justify-center text-xs shadow-sm border`}>
                          {getInitials(emp.username)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-tight group-hover:text-blue-400 transition-colors">{emp.username}</h4>
                          <span className="text-[10px] text-gray-500">{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        emp.role === 'Admin' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : emp.role === 'HR_Manager'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {emp.role === 'HR_Manager' ? 'HR Manager' : emp.role}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`flex items-center text-[10px] font-semibold ${
                        emp.status === 'Active'
                          ? 'text-emerald-400'
                          : emp.status === 'Remote'
                          ? 'text-blue-400'
                          : 'text-amber-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          emp.status === 'Active'
                            ? 'bg-emerald-500'
                            : emp.status === 'Remote'
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`} />
                        {emp.status}
                      </span>
                    </td>
                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-400 font-mono">
                      {emp.joined}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer transition-colors"
                          title="View Profile"
                        >
                          <Eye size={15} />
                        </button>
                        {currentUserRole === 'Admin' && (
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-950/20 cursor-pointer transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#15171e] border border-gray-800 w-full max-w-lg p-6 rounded-2xl shadow-2xl relative mx-4 animate-scale-up">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedEmployee(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Profile Header */}
            <div className="flex items-start space-x-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarColor(selectedEmployee.role)} text-white font-extrabold flex items-center justify-center text-xl shadow border`}>
                {getInitials(selectedEmployee.username)}
              </div>
              <div className="mt-1">
                <h3 className="text-xl font-bold text-white">{selectedEmployee.username}</h3>
                <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2.5 py-0.5 rounded-full font-semibold mt-1">
                  {selectedEmployee.role === 'HR_Manager' ? 'HR Manager' : selectedEmployee.role}
                </span>
              </div>
            </div>

            {/* Profile Bio */}
            <div className="mb-6 p-4 bg-[#0d0e12] rounded-xl border border-gray-850">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Profile Summary</h4>
              <p className="text-xs text-gray-300 leading-relaxed font-medium">{selectedEmployee.bio}</p>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-800/80 pt-5">
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Department</span>
                <span className="text-gray-200 mt-1 flex items-center space-x-1.5 font-bold">
                  <Building size={14} className="text-gray-500" />
                  <span>{selectedEmployee.dept}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Joined Date</span>
                <span className="text-gray-200 mt-1 flex items-center space-x-1.5 font-mono">
                  <Calendar size={14} className="text-gray-500" />
                  <span>{selectedEmployee.joined}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Work Email</span>
                <span className="text-gray-200 mt-1 flex items-center space-x-1.5 truncate font-semibold">
                  <Mail size={14} className="text-gray-500" />
                  <span>{selectedEmployee.email}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">Phone Contact</span>
                <span className="text-gray-200 mt-1 flex items-center space-x-1.5 font-semibold">
                  <Phone size={14} className="text-gray-500" />
                  <span>{selectedEmployee.phone}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#15171e] border border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl relative mx-4 animate-scale-up">
            
            {/* Close button */}
            <button
              onClick={() => { setShowAddModal(false); setFormError(''); setFormSuccess(''); }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1.5">Register Team Member</h3>
            <p className="text-xs text-gray-400 mb-5">Create a login and assign a corporate role within DEVGuard.</p>

            {formError && (
              <div className="mb-4 flex items-center space-x-2 bg-red-950/40 border border-red-900/50 rounded-xl p-3 text-red-400 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 flex items-center space-x-2 bg-emerald-950/40 border border-emerald-900/50 rounded-xl p-3 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Username / Name</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. Aryan Jain"
                  required
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@devguard.com"
                  required
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Initial Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Corporate Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2 px-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:text-white cursor-pointer"
                  >
                    <option value="Employee">Employee</option>
                    <option value="HR_Manager">HR Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Work Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2 px-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:text-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Remote">Remote</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center space-x-2 mt-4"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Register Employee Profile</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesView;
