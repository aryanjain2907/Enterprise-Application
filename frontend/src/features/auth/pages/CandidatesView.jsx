import { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  ChevronRight, 
  ChevronLeft,
  X,
  Mail,
  User,
  Plus,
  Briefcase,
  Trash2
} from 'lucide-react';

const CandidatesView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Senior React Developer');

  // Columns / Stages
  const stages = [
    { id: 'applied', label: 'Applied', color: 'border-blue-500/30 text-blue-400 bg-blue-500/5' },
    { id: 'screening', label: 'Screening', color: 'border-purple-500/30 text-purple-400 bg-purple-500/5' },
    { id: 'interviewing', label: 'Interviewing', color: 'border-amber-500/30 text-amber-400 bg-amber-500/5' },
    { id: 'offered', label: 'Offered', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' }
  ];

  // Candidates database
  const [candidates, setCandidates] = useState([
    {
      id: 'c1',
      name: 'Aditi Sen',
      role: 'Senior React Developer',
      email: 'aditi.sen@example.com',
      stage: 'screening',
      score: 94,
      experience: '5.5 Years',
      date: 'Today'
    },
    {
      id: 'c2',
      name: 'Priyansh Verma',
      role: 'Senior React Developer',
      email: 'priyansh.v@example.com',
      stage: 'interviewing',
      score: 92,
      experience: '6 Years',
      date: '2 days ago'
    },
    {
      id: 'c3',
      name: 'Kunal Verma',
      role: 'Backend Node Engineer',
      email: 'kunal.verma@example.com',
      stage: 'interviewing',
      score: 88,
      experience: '4 Years',
      date: 'Yesterday'
    },
    {
      id: 'c4',
      name: 'Rohan Deshmukh',
      role: 'UI/UX Designer',
      email: 'rohan.d@example.com',
      stage: 'applied',
      score: 65,
      experience: '2 Years',
      date: '4 days ago'
    },
    {
      id: 'c5',
      name: 'Ananya Iyer',
      role: 'Backend Node Engineer',
      email: 'ananya.iyer@example.com',
      stage: 'offered',
      score: 91,
      experience: '5 Years',
      date: 'Today'
    }
  ]);

  const handleMoveStage = (candidateId, direction) => {
    const stageFlow = ['applied', 'screening', 'interviewing', 'offered'];
    setCandidates(prev => prev.map(cand => {
      if (cand.id !== candidateId) return cand;
      const currentIndex = stageFlow.indexOf(cand.stage);
      let nextIndex = currentIndex + direction;
      if (nextIndex >= 0 && nextIndex < stageFlow.length) {
        const updated = { ...cand, stage: stageFlow[nextIndex] };
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate(updated);
        }
        return updated;
      }
      return cand;
    }));
  };

  const handleDeleteCandidate = (id) => {
    if (window.confirm('Are you sure you want to remove this candidate profile?')) {
      setCandidates(prev => prev.filter(c => c.id !== id));
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
      }
    }
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    const newCand = {
      id: 'c' + Date.now(),
      name: newName,
      role: newRole,
      email: newEmail,
      stage: 'applied',
      score: Math.floor(Math.random() * 20) + 70, // 70 to 90
      experience: '3 Years',
      date: 'Just Now'
    };

    setCandidates([newCand, ...candidates]);
    setNewName('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const getInitials = (name) => {
    if (!name) return 'C';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].slice(0, 2).toUpperCase();
  };

  // Filter Logic
  const filteredCandidates = candidates.filter(cand => {
    return cand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           cand.role.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Candidates Kanban Board</h2>
          <p className="text-sm text-gray-400 mt-1">Track applicants through screening, interview rounds, and job offers.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-3 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 active:scale-[0.98] transition-all duration-150"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex bg-[#15171e]/40 p-4 rounded-2xl border border-gray-800/80">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name or role title..."
            className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stages.map((stage) => {
          const stageCandidates = filteredCandidates.filter(c => c.stage === stage.id);
          return (
            <div 
              key={stage.id} 
              className="bg-[#15171e]/30 border border-gray-800/80 rounded-2xl p-4 flex flex-col h-[520px] overflow-hidden"
            >
              {/* Stage Header */}
              <div className={`flex items-center justify-between pb-3.5 border-b border-gray-800 mb-4`}>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${stage.color}`}>
                    {stage.label}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-bold font-mono">{stageCandidates.length} Candidates</span>
              </div>

              {/* Cards List container */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
                {stageCandidates.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-650 p-4 border border-dashed border-gray-850 rounded-xl">
                    <Plus className="w-6 h-6 text-gray-700 mb-1" />
                    <span className="text-[10px] font-semibold">Drop Candidates Here</span>
                  </div>
                ) : (
                  stageCandidates.map((cand) => (
                    <div 
                      key={cand.id}
                      onClick={() => setSelectedCandidate(cand)}
                      className="bg-[#15171e]/60 border border-gray-850/80 hover:border-gray-750/80 hover:bg-[#1a1d26]/40 p-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative shadow-md shadow-black/5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 text-white font-bold flex items-center justify-center text-[10px] border border-gray-750">
                            {getInitials(cand.name)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white leading-tight group-hover:text-blue-400 transition-colors truncate max-w-[110px]">{cand.name}</h4>
                            <span className="text-[9px] text-gray-500 mt-0.5 block truncate max-w-[110px]">{cand.role}</span>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold font-mono ${
                          cand.score >= 90 ? 'text-emerald-400' : cand.score >= 75 ? 'text-blue-400' : 'text-amber-400'
                        }`}>
                          {cand.score}%
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-850/60 mt-3 pt-2 text-[9px] text-gray-500">
                        <span>Exp: {cand.experience}</span>
                        <span>{cand.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#15171e] border border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl relative mx-4 animate-scale-up">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Header details */}
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gray-800 text-white font-bold flex items-center justify-center text-sm border border-gray-750 shadow">
                {getInitials(selectedCandidate.name)}
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-white">{selectedCandidate.name}</h3>
                <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] px-2 py-0.5 rounded-full font-semibold mt-1">
                  {selectedCandidate.role}
                </span>
              </div>
            </div>

            {/* Profile specifications */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 bg-[#0d0e12] rounded-xl border border-gray-850">
                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">AI Match Rating</span>
                  <span className={`text-sm font-black font-mono mt-0.5 block ${
                    selectedCandidate.score >= 90 ? 'text-emerald-400' : selectedCandidate.score >= 75 ? 'text-blue-400' : 'text-amber-400'
                  }`}>
                    {selectedCandidate.score}% Match Suitability
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block">Total Experience</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{selectedCandidate.experience}</span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Contact Email</span>
                <span className="text-gray-300 font-semibold flex items-center space-x-1.5">
                  <Mail size={14} className="text-gray-550" />
                  <span>{selectedCandidate.email}</span>
                </span>
              </div>
              
              <div>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Current Pipeline Stage</span>
                <span className="text-gray-300 font-semibold capitalize bg-gray-800/40 px-2 py-0.5 border border-gray-800 rounded-md inline-block">
                  {selectedCandidate.stage}
                </span>
              </div>
            </div>

            {/* Action buttons (Move or Delete) */}
            <div className="border-t border-gray-850 pt-5 mt-6 flex space-x-2 text-xs">
              <button
                disabled={selectedCandidate.stage === 'applied'}
                onClick={() => handleMoveStage(selectedCandidate.id, -1)}
                className="flex-1 bg-[#0d0e12] border border-gray-800 text-gray-400 hover:text-white py-2.5 rounded-lg font-bold cursor-pointer hover:bg-[#1a1d26]/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
              >
                <ChevronLeft size={14} />
                <span>Move Back</span>
              </button>

              <button
                disabled={selectedCandidate.stage === 'offered'}
                onClick={() => handleMoveStage(selectedCandidate.id, 1)}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-bold cursor-pointer transition-colors shadow shadow-blue-500/10 flex items-center justify-center space-x-1"
              >
                <span>Advance</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => handleDeleteCandidate(selectedCandidate.id)}
                className="p-2.5 bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900 hover:text-white rounded-lg cursor-pointer transition-colors"
                title="Reject Candidate"
              >
                <Trash2 size={15} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#15171e] border border-gray-800 w-full max-w-md p-6 rounded-2xl shadow-2xl relative mx-4 animate-scale-up">
            
            {/* Close button */}
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <h3 className="text-lg font-bold text-white mb-1.5">Add Recipient Candidate</h3>
            <p className="text-xs text-gray-400 mb-5">Create a pipeline entry manually in the Applied column.</p>

            <form onSubmit={handleAddCandidate} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Maya Patel"
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
                  placeholder="candidate@gmail.com"
                  required
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2.5 px-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Target Opening</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#0d0e12] border border-gray-800 rounded-xl py-2 px-3 text-gray-300 focus:outline-none focus:border-blue-500 focus:text-white cursor-pointer"
                >
                  <option value="Senior React Developer">Senior React Developer</option>
                  <option value="Backend Node Engineer">Backend Node Engineer</option>
                  <option value="UI/UX Designer">UI/UX Designer</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-lg shadow-blue-500/10 mt-4"
              >
                Create Candidate Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesView;
