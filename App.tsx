
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Wallet, 
  Menu, 
  X, 
  ChevronRight, 
  History, 
  Settings, 
  LayoutDashboard, 
  MessageSquare,
  Globe,
  Loader2,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Atom,
  Sparkles,
  ZapOff
} from 'lucide-react';
import { generateStreamDeAIResponse } from './geminiService';
import { Message } from './types';
import { BlockchainDashboard } from './components/BlockchainDashboard';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [isQuantumMode, setIsQuantumMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const connectWallet = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setWalletAddress(`0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`);
      setIsConnecting(false);
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!walletAddress) {
      alert("Please connect your wallet to authorize AI inference.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      status: 'confirmed'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      status: 'pending',
      isQuantum: isQuantumMode,
      txHash: `0x${Math.random().toString(16).substring(2, 20)}...`
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      let fullResponse = '';
      await generateStreamDeAIResponse(input, isQuantumMode, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: fullResponse } 
            : msg
        ));
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, status: 'confirmed' as const } 
          : msg
      ));
    } catch (error) {
      console.error(error);
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: "Error: Quantum state decoherence. Transaction reverted.", status: 'failed' as const } 
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className={`flex h-screen w-full bg-[#030712] text-slate-100 overflow-hidden font-sans transition-all duration-1000 ${isQuantumMode ? 'shadow-[inset_0_0_100px_rgba(34,211,238,0.1)]' : ''}`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass border-r border-white/10 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 ${isQuantumMode ? 'bg-cyan-500 shadow-cyan-500/50 rotate-90' : 'polygon-gradient shadow-purple-500/50'}`}>
                {isQuantumMode ? <Atom className="text-white w-6 h-6 animate-spin-slow" /> : <Zap className="text-white w-6 h-6 fill-current" />}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">PolyGPT-5</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
                  {isQuantumMode ? 'Quantum Engine Active' : 'Neural Mode'}
                </p>
              </div>
            </div>

            <button 
              onClick={connectWallet}
              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all font-semibold ${walletAddress ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'polygon-gradient hover:opacity-90 shadow-lg shadow-purple-900/20'}`}
            >
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
              {walletAddress ? walletAddress : "Connect Wallet"}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <NavItem 
              icon={<MessageSquare className="w-4 h-4" />} 
              label="DeAI Inference" 
              active={activeTab === 'chat'} 
              onClick={() => setActiveTab('chat')} 
            />
            <NavItem 
              icon={<LayoutDashboard className="w-4 h-4" />} 
              label="Network Explorer" 
              active={activeTab === 'dashboard'} 
              onClick={() => setActiveTab('dashboard')} 
            />
            
            <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantum Core</div>
            <div className="px-3">
              <button 
                onClick={() => setIsQuantumMode(!isQuantumMode)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${isQuantumMode ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-900 border-white/10 text-slate-500 hover:border-white/20'}`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${isQuantumMode ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-bold uppercase tracking-wide">Quantum Mode</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${isQuantumMode ? 'bg-cyan-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${isQuantumMode ? 'left-5' : 'left-1'}`}></div>
                </div>
              </button>
            </div>

            <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Resources</div>
            <NavItem icon={<Globe className="w-4 h-4" />} label="Node Map" active={false} />
            <NavItem icon={<Settings className="w-4 h-4" />} label="Settings" active={false} />
          </nav>

          <div className="p-6">
            <div className={`p-4 rounded-xl transition-all duration-500 border ${isQuantumMode ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-purple-500/5 border-purple-500/10'}`}>
              <div className={`flex items-center gap-2 mb-2 ${isQuantumMode ? 'text-cyan-400' : 'text-purple-400'}`}>
                {isQuantumMode ? <Atom className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {isQuantumMode ? 'Quantum Verification' : 'Standard Verification'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {isQuantumMode 
                  ? "Every response is computed using 128 neural qubits with 99.9% coherence. Proof of Probability (PoP) consensus enabled."
                  : "Every response is verified across 4,000+ active validator nodes on the Polygon Layer-2 network."}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-16 flex items-center justify-between px-6 glass border-b border-white/5 z-10">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden text-slate-400">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-500 ${isQuantumMode ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
              <div className={`w-2 h-2 rounded-full animate-pulse ${isQuantumMode ? 'bg-cyan-500 shadow-[0_0_10px_#22d3ee]' : 'bg-emerald-500'}`}></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {isQuantumMode ? 'Quantum Sync: Active' : 'Polygon Network: Online'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {isQuantumMode ? 'Q-Inference Engine v5.0-Q' : 'GPT-5 Engine v2.5.1'}
            </span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <div className="max-w-4xl mx-auto w-full">
            {activeTab === 'chat' ? (
              <div className="space-y-8 pb-32">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-2xl transition-all duration-700 ${isQuantumMode ? 'bg-cyan-500 shadow-cyan-500/50 scale-110' : 'polygon-gradient shadow-purple-500/50'}`}>
                      {isQuantumMode ? <Atom className="text-white w-10 h-10 animate-spin-slow" /> : <Zap className="text-white w-10 h-10" />}
                    </div>
                    <h2 className={`text-3xl font-bold mb-4 transition-colors ${isQuantumMode ? 'text-cyan-400' : ''}`}>
                      {isQuantumMode ? 'Quantum-Enhanced PolyGPT-5' : 'Welcome to PolyGPT-5'}
                    </h2>
                    <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                      {isQuantumMode 
                        ? 'Вы вошли в режим квантового превосходства. ИИ использует вероятностные алгоритмы мышления для анализа сложнейших запросов.'
                        : 'The world\'s first GPT-5 class AI integrated with the speed and security of the Polygon blockchain ecosystem.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 w-full max-w-2xl">
                      <FeatureBox title={isQuantumMode ? "Q-Stability" : "Verifiable"} desc={isQuantumMode ? "Coherence at 99.9%" : "Proof of Inference on chain"} color={isQuantumMode ? 'cyan' : 'purple'} />
                      <FeatureBox title={isQuantumMode ? "Entanglement" : "Decentralized"} desc={isQuantumMode ? "Cross-node quantum linking" : "4000+ Distributed nodes"} color={isQuantumMode ? 'cyan' : 'purple'} />
                      <FeatureBox title={isQuantumMode ? "Collapse" : "Fast"} desc={isQuantumMode ? "Probability wave optimization" : "Sub-second transitions"} color={isQuantumMode ? 'cyan' : 'purple'} />
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'assistant' && (
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${msg.isQuantum ? 'bg-cyan-500' : 'polygon-gradient'}`}>
                          {msg.isQuantum ? <Atom className="w-4 h-4 text-white" /> : <Zap className="w-4 h-4 text-white" />}
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${msg.role === 'user' ? 'bg-purple-600 text-white shadow-lg' : 'glass'} ${msg.isQuantum && msg.role === 'assistant' ? 'border-l-4 border-cyan-400 bg-cyan-950/20' : ''}`}>
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.isQuantum && msg.status === 'pending' ? 'animate-pulse text-cyan-200' : ''}`}>
                            {msg.content || (msg.status === 'pending' && <Loader2 className="w-4 h-4 animate-spin opacity-50" />)}
                          </p>
                        </div>
                        
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-3 px-2">
                            <div className="flex items-center gap-1">
                              {msg.status === 'confirmed' ? (
                                <CheckCircle2 className={`w-3 h-3 ${msg.isQuantum ? 'text-cyan-400' : 'text-emerald-400'}`} />
                              ) : (
                                <Loader2 className="w-3 h-3 text-slate-500 animate-spin" />
                              )}
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.status === 'confirmed' ? (msg.isQuantum ? 'text-cyan-400' : 'text-emerald-400') : 'text-slate-500'}`}>
                                {msg.status === 'confirmed' ? (msg.isQuantum ? 'State Collapsed' : 'Tx Confirmed') : 'Computing...'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 mono">HASH: {msg.txHash}</span>
                          </div>
                        )}
                      </div>

                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center border border-white/10">
                          <Wallet className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            ) : (
              <BlockchainDashboard />
            )}
          </div>
        </div>

        {/* Input Bar */}
        {activeTab === 'chat' && (
          <div className="absolute bottom-0 left-0 right-0 p-6 glass border-t border-white/5">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={walletAddress ? (isQuantumMode ? "Enter quantum prompt..." : "Type your prompt...") : "Connect wallet to start..."}
                  disabled={!walletAddress || isTyping}
                  className={`w-full bg-slate-900/50 border rounded-2xl py-4 px-6 pr-14 focus:outline-none transition-all disabled:opacity-50 ${isQuantumMode ? 'border-cyan-500/30 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] text-cyan-50 placeholder:text-cyan-900' : 'border-white/10 focus:border-purple-500/50'}`}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || !walletAddress || isTyping}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:grayscale ${isQuantumMode ? 'bg-cyan-500' : 'polygon-gradient'}`}
                >
                  {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : (isQuantumMode ? <Atom className="w-5 h-5 text-white" /> : <Send className="w-5 h-5 text-white" />)}
                </button>
              </div>
            </div>
            <div className="max-w-4xl mx-auto mt-2 flex justify-center items-center gap-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Inference Cost: <span className={`${isQuantumMode ? 'text-cyan-400' : 'text-purple-400'} font-bold`}>{isQuantumMode ? '0.005 Q-MATIC' : '0.0002 MATIC'}</span></p>
              {isQuantumMode && <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping"></div>}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-sm shadow-purple-900/10' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto" />}
  </button>
);

const FeatureBox = ({ title, desc, color }: { title: string, desc: string, color?: 'purple' | 'cyan' }) => (
  <div className={`glass p-4 rounded-xl border border-white/5 text-left transition-all hover:scale-105 ${color === 'cyan' ? 'hover:border-cyan-500/30' : 'hover:border-purple-500/30'}`}>
    <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}`}>{title}</h4>
    <p className="text-xs text-slate-400 leading-tight">{desc}</p>
  </div>
);

export default App;
