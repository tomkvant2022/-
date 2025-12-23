
import React, { useState, useEffect } from 'react';
import { Activity, Database, Shield, Zap, Cpu, Atom, Waves } from 'lucide-react';
import { Block, NetworkStats } from '../types';

export const BlockchainDashboard: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<NetworkStats>({
    tps: 45.2,
    activeNodes: 12408,
    totalInferences: 1450283,
    gasPrice: 28.5,
    qubitCoherence: 99.98,
    entanglementFlux: 4.2
  });

  useEffect(() => {
    const initialBlocks: Block[] = Array.from({ length: 5 }).map((_, i) => ({
      height: 6540320 - i,
      hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      timestamp: Date.now() - (i * 2000),
      transactions: Math.floor(Math.random() * 50) + 10,
      validator: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    }));
    setBlocks(initialBlocks);

    const interval = setInterval(() => {
      setBlocks(prev => {
        const newBlock: Block = {
          height: prev[0].height + 1,
          hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
          timestamp: Date.now(),
          transactions: Math.floor(Math.random() * 50) + 10,
          validator: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
        };
        return [newBlock, ...prev.slice(0, 4)];
      });

      setStats(prev => ({
        ...prev,
        tps: Number((40 + Math.random() * 10).toFixed(1)),
        gasPrice: Number((25 + Math.random() * 10).toFixed(1)),
        qubitCoherence: Number((99.90 + Math.random() * 0.09).toFixed(2)),
        entanglementFlux: Number((4.1 + Math.random() * 0.5).toFixed(1))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Zap className="w-4 h-4 text-yellow-400" />} label="Network TPS" value={stats.tps} unit="" />
        <StatCard icon={<Cpu className="w-4 h-4 text-purple-400" />} label="Active Nodes" value={stats.activeNodes.toLocaleString()} unit="" />
        <StatCard icon={<Atom className="w-4 h-4 text-cyan-400" />} label="Qubit Coherence" value={stats.qubitCoherence} unit="%" />
        <StatCard icon={<Waves className="w-4 h-4 text-pink-400" />} label="Entanglement Flux" value={stats.entanglementFlux} unit="T/s" />
      </div>

      <div className="glass rounded-xl p-4 overflow-hidden border-t-2 border-cyan-500/30">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Live Ledger (Quantum-Enhanced Polygon)
        </h3>
        <div className="space-y-3">
          {blocks.map(block => (
            <div key={block.height} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                  #{block.height % 1000}
                </div>
                <div>
                  <div className="text-sm font-semibold mono text-slate-200">0x{block.hash.substring(0, 16)}...</div>
                  <div className="text-[10px] text-slate-500 italic">State: Superposition Confirmed</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium text-cyan-300">{block.transactions} q-txns</div>
                <div className="text-[10px] text-slate-500">Validated</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit: string }) => (
  <div className="glass p-4 rounded-xl border-l-4 border-l-purple-500 transition-all hover:scale-[1.02]">
    <div className="flex items-center gap-2 mb-1 text-slate-400">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-xl font-bold mono">
      {value}<span className="text-xs ml-1 text-slate-500">{unit}</span>
    </div>
  </div>
);
