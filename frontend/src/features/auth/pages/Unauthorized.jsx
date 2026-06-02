import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0d0e12] relative overflow-hidden font-sans">
      {/* Background visual accents */}
      <div className="absolute top-[20%] left-[-10%] w-[55%] h-[55%] rounded-full bg-rose-600/5 blur-[130px]" />
      
      <div className="w-full max-w-md mx-4 z-10 text-center animate-fade-in">
        {/* Glowing Shield Icon */}
        <div className="inline-flex items-center justify-center p-4 bg-rose-600/10 rounded-3xl border border-rose-500/20 mb-6 shadow-xl shadow-rose-500/10">
          <ShieldAlert className="w-12 h-12 text-rose-500" />
        </div>

        {/* Title & Description */}
        <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl bg-gradient-to-r from-white via-gray-200 to-rose-450 bg-clip-text text-transparent">
          403 Access Denied
        </h1>
        
        <h2 className="text-md font-bold text-gray-400 mt-4 px-4 leading-relaxed">
          Restricted Resource Parameters
        </h2>
        
        <p className="text-xs text-gray-500 mt-2 px-6 leading-relaxed">
          Your assigned security role credentials do not possess the authorization permissions required to access this endpoint view.
        </p>

        {/* Info Box */}
        <div className="glass-card mt-6 p-4 bg-[#15171e]/70 border-gray-800 rounded-2xl flex items-center space-x-3 text-left">
          <div className="p-2 bg-gray-850 rounded-lg text-gray-500 border border-gray-800 flex-shrink-0">
            <Lock size={15} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Auto Direct Action</p>
            <p className="text-xs text-gray-300 font-semibold mt-1">Redirecting to login portal in <span className="text-rose-450 font-mono font-black">{countdown}s</span></p>
          </div>
        </div>

        {/* Actions Button Row */}
        <div className="mt-8 flex flex-col space-y-2.5">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-[#15171e] hover:bg-[#1a1d26] text-gray-300 hover:text-white py-3 rounded-xl text-xs font-bold transition-all border border-gray-800 cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <ArrowLeft size={14} />
            <span>Go Back Previous Page</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-lg shadow-rose-500/10"
          >
            Authenticate Different Role
          </button>
        </div>

        <div className="mt-12 text-[10px] text-gray-600">
          SECURE IP AUDIT LOGGED • DEVGUARD SECURITY SHIELD
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
