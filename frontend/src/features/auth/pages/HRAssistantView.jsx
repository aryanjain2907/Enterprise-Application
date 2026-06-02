import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  CornerDownLeft,
  ArrowRight
} from 'lucide-react';

const HRAssistantView = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: 'Hello! I am your DEVGuard AI HR Assistant. I can help you draft interview questions, review company leave rules, write candidate emails, or search employee criteria. How can I help you today?',
      time: 'Online'
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Predefined AI responses for quick interaction
  const responses = {
    interview: 'Here are 3 recommended interview questions for a Senior React Developer:\n\n1. **React 19 Server Components**: How do Server Components differ from Client Components in data fetching strategies?\n2. **Custom Hooks & Performance**: How would you optimize a custom hook that suffers from recurrent re-render cycles?\n3. **State Management**: When would you opt for React Context vs. a zustand/Redux solution in high-frequency trading dashboards?',
    policy: 'Under the current DEVGuard policy, employees receive:\n\n- **Paid Time Off**: 15 days annually, accrued monthly.\n- **Sick Leave**: 10 days for medical emergencies (requires doctor notes for >3 consecutive days).\n- **Casual Leave**: 6 days for personal matters.\n\nAll leave requests are pending approval from managers or admins.',
    roles: 'DEVGuard employs 3 specific roles:\n\n1. **Admin**: Possesses full control over directory, security policies, and leaves approvals.\n2. **HR Manager**: Manages candidates recruitment Kanban, screens resumes using AI, and coordinates leaves.\n3. **Employee**: Accesses personal leave balances, submits request forms, and queries the policy assistant.'
  };

  const handleSend = (textToSend) => {
    const text = textToSend.trim();
    if (!text) return;

    // 1. Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    // 2. Decide response
    let responseText = '';
    const query = text.toLowerCase();
    if (query.includes('interview') || query.includes('question')) {
      responseText = responses.interview;
    } else if (query.includes('policy') || query.includes('leave') || query.includes('time off')) {
      responseText = responses.policy;
    } else if (query.includes('role') || query.includes('access') || query.includes('permission')) {
      responseText = responses.roles;
    } else {
      responseText = `I have logged your question regarding: "${text}". DEVGuard Cognitive models suggest consulting the Admin manual, or asking for role-based clarifications. Let me know if you would like me to draft an email template or write code instead!`;
    }

    // 3. Simulate streaming response after thinking delay
    setTimeout(() => {
      setIsThinking(false);
      
      const newBotMsgId = Date.now() + 1;
      const botMsgPlaceholder = {
        id: newBotMsgId,
        sender: 'assistant',
        text: '',
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsgPlaceholder]);

      // Characters streaming interval
      let index = 0;
      const interval = setInterval(() => {
        setMessages(prev => prev.map(m => {
          if (m.id === newBotMsgId) {
            return { ...m, text: responseText.slice(0, index + 1) };
          }
          return m;
        }));
        index++;
        if (index >= responseText.length) {
          clearInterval(interval);
        }
      }, 15);

    }, 1500);
  };

  const quickPrompts = [
    { label: 'Suggest React Questions', value: 'Draft interview questions for a Senior React candidate' },
    { label: 'Summarize Leave Policies', value: 'What is the company leave policy summary?' },
    { label: 'Explain System Roles', value: 'Explain what permissions Admin, HR, and Employee roles have.' }
  ];

  return (
    <div className="glass-card h-[calc(100vh-8rem)] flex flex-col bg-[#15171e]/50 border-gray-800/80 rounded-2xl overflow-hidden shadow-xl animate-fade-in">

      {/* Bot Chat Header */}
      <div className="p-4 bg-[#11131a]/60 border-b border-gray-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow shadow-blue-500/5">
            <Bot className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center space-x-1.5">
              <span>DEVGuard AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            </h3>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Cognitive Engine Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Thread list */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-[#0c0d11]/20">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div 
              key={m.id} 
              className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'} space-x-3 max-w-full`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-1 flex-shrink-0">
                  <Bot size={16} />
                </div>
              )}

              <div className={`min-w-0 max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed whitespace-pre-line ${
                isUser
                  ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                  : 'bg-[#15171e]/75 border border-gray-850/80 text-gray-200 rounded-tl-none font-medium'
              }`}>
                {m.text}
                <span className={`block text-[9px] mt-2 font-mono ${isUser ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                  {m.time}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-gray-800 border border-gray-750 flex items-center justify-center text-gray-300 mt-1 flex-shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          );
        })}

        {/* Thinking Indicator */}
        {isThinking && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mt-1">
              <Bot size={16} />
            </div>
            <div className="bg-[#15171e]/75 border border-gray-850/80 rounded-2xl rounded-tl-none p-4 flex items-center space-x-1.5 py-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-5 py-3.5 bg-[#0c0d11]/10 border-t border-gray-800/80">
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.value)}
              className="text-[10px] font-bold text-gray-400 hover:text-white bg-[#15171e]/60 border border-gray-800 hover:border-gray-700 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 flex items-center space-x-1"
            >
              <span>{p.label}</span>
              <ArrowRight size={10} className="text-gray-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Message Inputs form */}
      <div className="p-4 bg-[#11131a]/60 border-t border-gray-800/80">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex items-center space-x-2 bg-[#0d0e12] border border-gray-800 focus-within:border-blue-500 rounded-xl px-3 py-2 transition-colors"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or policy query here..."
            className="flex-1 bg-transparent border-none text-xs text-white placeholder-gray-600 focus:outline-none py-1.5"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg cursor-pointer transition-colors shadow shadow-blue-500/10 active:scale-95"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default HRAssistantView;
