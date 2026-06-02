import { useState } from 'react';
import { 
  UploadCloud, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Award,
  ChevronRight,
  Eye
} from 'lucide-react';

const ResumeView = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  const [parseStatus, setParseStatus] = useState('');
  const [activeReport, setActiveReport] = useState(null);
  const [mockFileName, setMockFileName] = useState('');

  // Sample Mock Candidates database
  const [reports, setReports] = useState([
    {
      id: 'r1',
      candidateName: 'Aditi Sen',
      appliedRole: 'Senior React Developer',
      matchScore: 94,
      experience: '5.5 Years',
      skillsFound: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux Toolkit', 'Next.js', 'Jest/RTL'],
      skillsMissing: ['GraphQL', 'Docker'],
      strengths: 'Strong hands-on experience in React 18 & 19 ecosystems, clean folder architectures, and responsive design systems. Exceptional portfolio exhibiting complex state management patterns.',
      gaps: 'Minimal cloud deployment exposure (AWS/GCP) and containerization knowledge.',
      verdict: 'Highly recommended for technical interviews. Strong alignment with frontend design requirements.',
      date: 'Today'
    },
    {
      id: 'r2',
      candidateName: 'Kunal Verma',
      appliedRole: 'Backend Node Engineer',
      matchScore: 88,
      experience: '4 Years',
      skillsFound: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'JWT Auth', 'REST APIs'],
      skillsMissing: ['TypeScript', 'Kubernetes'],
      strengths: 'Excellent understanding of RESTful architectural styles, database indexing, and token-based session managers. Strong clean code hygiene.',
      gaps: 'No commercial experience with statically-typed languages like TypeScript or Go.',
      verdict: 'Recommended for backend coding challenges. Strong database operations skill.',
      date: 'Yesterday'
    },
    {
      id: 'r3',
      candidateName: 'Rohan Deshmukh',
      appliedRole: 'UI/UX Designer',
      matchScore: 65,
      experience: '2 Years',
      skillsFound: ['Figma', 'Prototyping', 'User Research', 'Wireframes'],
      skillsMissing: ['Design Systems', 'HTML/CSS Coding'],
      strengths: 'Good aesthetic intuition and wireframing speed. Good understanding of user personas.',
      gaps: 'Lacks experience in maintaining reusable component design systems and has no front-end code understanding.',
      verdict: 'Hold. Consider for junior-level roles or explore technical coding interest.',
      date: '3 days ago'
    }
  ]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateParsing = (fileName) => {
    setIsParsing(true);
    setParseProgress(0);
    setParseStatus('Initializing AI Screener engine...');

    const statuses = [
      'Reading resume file binary details...',
      'Extracting candidate identity & metadata...',
      'Mapping technical skills matrix against job profile...',
      'Generating Match Assessment score and recommendations...',
      'Finalizing analysis report...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setParseProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          
          // Generate a mock report
          const newReport = {
            id: 'r' + Date.now(),
            candidateName: fileName.replace(/\.[^/.]+$/, "").split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            appliedRole: 'Senior React Developer',
            matchScore: Math.floor(Math.random() * 25) + 72, // Score between 72 and 96
            experience: '3.5 Years',
            skillsFound: ['React.js', 'JavaScript', 'CSS Grid', 'Tailwind CSS', 'Git/GitHub'],
            skillsMissing: ['Next.js', 'Unit Testing'],
            strengths: 'Solid comprehension of JavaScript, DOM manipulation, and responsive landing pages. Demonstrates clean coding layouts.',
            gaps: 'Lacks familiarity with modern meta-frameworks like Next.js or automated unit testing practices.',
            verdict: 'Recommended for initial screening call. Competent in layout assembly.',
            date: 'Just Now'
          };

          setReports(prevReports => [newReport, ...prevReports]);
          setActiveReport(newReport);
          setIsParsing(false);
          setMockFileName('');
          return 100;
        }

        if (prev % 20 === 0 && currentStep < statuses.length) {
          setParseStatus(statuses[currentStep]);
          currentStep++;
        }

        return prev + 5;
      });
    }, 100);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setMockFileName(files[0].name);
      simulateParsing(files[0].name);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setMockFileName(files[0].name);
      simulateParsing(files[0].name);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-400 stroke-emerald-500';
    if (score >= 75) return 'text-blue-400 stroke-blue-500';
    return 'text-amber-400 stroke-amber-500';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
          <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest">Cognitive Screening</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight mt-1">AI Resume Screener</h2>
        <p className="text-xs text-gray-500 mt-1">Upload resumes to automatically run semantic analysis matching capabilities.</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Upload Zone & Evaluated List */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Upload Card */}
          <div className="bg-[#15171e]/40 border border-gray-800/80 rounded-2xl p-6 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">Submit Candidate Resume</h3>
            
            {isParsing ? (
              // Parsing State
              <div className="flex flex-col items-center justify-center py-10 border border-dashed border-gray-800 rounded-xl bg-[#0d0e12]/60">
                <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                <h4 className="text-sm font-bold text-white">AI Engine Parsing Resume</h4>
                <p className="text-xs text-gray-400 mt-1 font-medium">{parseStatus}</p>
                
                {/* Progress Bar */}
                <div className="w-64 bg-gray-850 h-1.5 rounded-full mt-5 overflow-hidden border border-gray-800">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-100"
                    style={{ width: `${parseProgress}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-gray-500 mt-2 font-semibold">{parseProgress}% COMPLETE</span>
              </div>
            ) : (
              // Active Dropzone
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center py-10 border border-dashed rounded-xl transition-all duration-200 cursor-pointer ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'border-gray-800 bg-[#0d0e12]/30 hover:border-gray-700 hover:bg-[#0d0e12]/50'
                }`}
              >
                <input
                  type="file"
                  id="resume-input"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <label htmlFor="resume-input" className="flex flex-col items-center cursor-pointer">
                  <div className="p-4 bg-gray-800/30 rounded-2xl border border-gray-800 mb-3 group-hover:scale-105 transition-transform">
                    <UploadCloud className="w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors" />
                  </div>
                  <h4 className="text-xs font-bold text-gray-200">Drag & Drop file here, or <span className="text-blue-500 hover:underline">browse files</span></h4>
                  <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Supports PDF, DOCX (Max 10MB)</p>
                </label>
              </div>
            )}
          </div>

          {/* Screener Database List */}
          <div className="bg-[#15171e]/30 border border-gray-800/80 rounded-2xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">Evaluated Resumes</h3>
            
            <div className="space-y-3">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => setActiveReport(report)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                    activeReport?.id === report.id
                      ? 'bg-blue-600/10 border-blue-500/50 shadow'
                      : 'bg-[#15171e]/50 border-gray-800/80 hover:bg-[#1a1d26]/40 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-850 rounded-lg border border-gray-800">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{report.candidateName}</h4>
                      <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{report.appliedRole} • {report.experience}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className={`text-xs font-bold font-mono ${getScoreColor(report.matchScore).split(' ')[0]}`}>
                        {report.matchScore}% Match
                      </span>
                      <span className="text-[9px] text-gray-500 mt-0.5 block font-semibold">{report.date}</span>
                    </div>
                    <ChevronRight size={14} className="text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* AI Report Card */}
        <div className="lg:col-span-2">
          {activeReport ? (
            <div className="bg-[#15171e]/40 border border-gray-850 rounded-2xl p-6 shadow-xl space-y-5 animate-scale-up">
              
              {/* Report Header */}
              <div className="text-center pb-4 border-b border-gray-850">
                <div className="relative inline-flex items-center justify-center mb-3">
                  {/* Circle SVG matching ring */}
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="34" className="stroke-gray-800" strokeWidth="6" fill="transparent" />
                    <circle 
                      cx="40" 
                      cy="40" 
                      r="34" 
                      className={getScoreColor(activeReport.matchScore).split(' ')[1]} 
                      strokeWidth="6" 
                      fill="transparent" 
                      strokeDasharray="213.6"
                      strokeDashoffset={213.6 - (213.6 * activeReport.matchScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className={`absolute text-lg font-black font-mono ${getScoreColor(activeReport.matchScore).split(' ')[0]}`}>
                    {activeReport.matchScore}%
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{activeReport.candidateName}</h3>
                <p className="text-[10px] text-gray-500 mt-0.5 font-bold uppercase tracking-wider">{activeReport.appliedRole}</p>
              </div>

              {/* Strengths & Verdict */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">AI Evaluation Verdict</span>
                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3 text-emerald-400 font-medium leading-relaxed">
                    {activeReport.verdict}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Core Fit Strengths</span>
                  <p className="text-gray-300 leading-relaxed font-medium">{activeReport.strengths}</p>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Gaps Identified</span>
                  <p className="text-gray-400 leading-relaxed font-medium">{activeReport.gaps}</p>
                </div>
              </div>

              {/* Skills Matrix breakdown */}
              <div className="border-t border-gray-850 pt-4 space-y-3.5 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Technical Skills Found</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeReport.skillsFound.map((skill, index) => (
                      <span key={index} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center">
                        <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Skills Gap / Missing</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeReport.skillsMissing.map((skill, index) => (
                      <span key={index} className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center">
                        <span className="w-1 h-1 rounded-full bg-rose-500 mr-1.5" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="h-full bg-[#15171e]/20 border border-gray-800/80 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center py-20 text-gray-500">
              <Award className="w-10 h-10 text-gray-600 mb-3" />
              <h4 className="text-xs font-bold text-gray-400">No Assessment Report Selected</h4>
              <p className="text-[10px] text-gray-500 mt-1 max-w-[200px] leading-relaxed">Select an evaluated resume or upload a new candidate file to render reports.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ResumeView;
