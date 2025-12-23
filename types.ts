
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  txHash?: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  isQuantum?: boolean;
}

export interface Block {
  height: number;
  hash: string;
  timestamp: number;
  transactions: number;
  validator: string;
}

export interface NetworkStats {
  tps: number;
  activeNodes: number;
  totalInferences: number;
  gasPrice: number;
  qubitCoherence: number;
  entanglementFlux: number;
}
