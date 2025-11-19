import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Play, 
  Pause, 
  PenTool, 
  Palette, 
  Target, 
  Scale, 
  Brain, 
  LifeBuoy, 
  X, 
  ChevronDown, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- Types ---

type AgentType = 'creator' | 'critic' | 'strategist' | 'support';

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  x: number;
  y: number;
  trustScore: number;
  status: 'idle' | 'processing' | 'completed';
  currentTask?: string;
  uptime: number;
  avgResponse: number;
  successRate: number;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'success' | 'failed';
  activityLevel: 'low' | 'medium' | 'high';
}

// --- Mock Data ---

const AGENTS: Agent[] = [
  { id: 'a1', name: 'Copywriter #5', type: 'creator', x: 20, y: 20, trustScore: 91, status: 'processing', currentTask: 'Writing headlines', uptime: 99.2, avgResponse: 420, successRate: 94 },
  { id: 'a2', name: 'Designer #9', type: 'creator', x: 30, y: 50, trustScore: 88, status: 'completed', currentTask: 'Asset generation', uptime: 98.5, avgResponse: 850, successRate: 92 },
  { id: 'a3', name: 'Campaign Lead', type: 'creator', x: 15, y: 70, trustScore: 95, status: 'idle', uptime: 99.9, avgResponse: 120, successRate: 98 },
  { id: 'a4', name: 'Video Gen', type: 'creator', x: 40, y: 30, trustScore: 82, status: 'processing', currentTask: 'Rendering preview', uptime: 95.0, avgResponse: 1200, successRate: 89 },
  { id: 'a5', name: 'Social Writer', type: 'creator', x: 25, y: 85, trustScore: 90, status: 'idle', uptime: 99.1, avgResponse: 300, successRate: 95 },
  
  { id: 'a6', name: 'Critic #2', type: 'critic', x: 50, y: 20, trustScore: 94, status: 'processing', currentTask: 'Compliance check', uptime: 99.5, avgResponse: 200, successRate: 97 },
  { id: 'a7', name: 'Critic #1', type: 'critic', x: 55, y: 60, trustScore: 92, status: 'idle', uptime: 99.3, avgResponse: 250, successRate: 96 },
  { id: 'a8', name: 'Brand Guard', type: 'critic', x: 60, y: 40, trustScore: 96, status: 'completed', currentTask: 'Tone analysis', uptime: 99.8, avgResponse: 180, successRate: 99 },
  
  { id: 'a9', name: 'Strategist #1', type: 'strategist', x: 75, y: 30, trustScore: 89, status: 'processing', currentTask: 'Bid optimization', uptime: 97.5, avgResponse: 600, successRate: 91 },
  { id: 'a10', name: 'Market Analyst', type: 'strategist', x: 80, y: 70, trustScore: 93, status: 'idle', uptime: 98.9, avgResponse: 550, successRate: 94 },
  { id: 'a11', name: 'Planner', type: 'strategist', x: 70, y: 50, trustScore: 90, status: 'processing', currentTask: 'Scheduling', uptime: 98.2, avgResponse: 400, successRate: 93 },
  
  { id: 'a12', name: 'Support #1', type: 'support', x: 45, y: 10, trustScore: 99, status: 'idle', uptime: 100, avgResponse: 50, successRate: 100 },
  { id: 'a13', name: 'Logger', type: 'support', x: 85, y: 15, trustScore: 99, status: 'processing', currentTask: 'Archiving logs', uptime: 100, avgResponse: 30, successRate: 100 },
  { id: 'a14', name: 'Monitor', type: 'support', x: 90, y: 50, trustScore: 98, status: 'processing', currentTask: 'Health check', uptime: 99.9, avgResponse: 40, successRate: 100 },
  { id: 'a15', name: 'Router', type: 'support', x: 50, y: 80, trustScore: 99, status: 'idle', uptime: 100, avgResponse: 20, successRate: 100 },
];

const EDGES: Edge[] = [
  { id: 'e1', source: 'a1', target: 'a6', type: 'success', activityLevel: 'high' },
  { id: 'e2', source: 'a2', target: 'a6', type: 'success', activityLevel: 'medium' },
  { id: 'e3', source: 'a4', target: 'a8', type: 'failed', activityLevel: 'low' },
  { id: 'e4', source: 'a6', target: 'a9', type: 'success', activityLevel: 'high' },
  { id: 'e5', source: 'a8', target: 'a11', type: 'success', activityLevel: 'medium' },
  { id: 'e6', source: 'a9', target: 'a13', type: 'success', activityLevel: 'low' },
  { id: 'e7', source: 'a3', target: 'a7', type: 'success', activityLevel: 'medium' },
  { id: 'e8', source: 'a7', target: 'a10', type: 'success', activityLevel: 'high' },
  { id: 'e9', source: 'a12', target: 'a1', type: 'success', activityLevel: 'low' },
  { id: 'e10', source: 'a15', target: 'a5', type: 'success', activityLevel: 'medium' },
];

const MESSAGES = [
  { id: 'MSG-847291', from: 'Copywriter #5', to: 'Critic #2', timestamp: '2025-11-19 15:48:43 UTC', type: 'CONTENT_SUBMISSION', status: 'DELIVERED', payload: '{\n  "variants": [\n    "Eco-friendly kicks for the modern soul",\n    "Step lightly, tread boldly"\n  ],\n  "reasoning": "Generated 2 variants based on Q4 trends..."\n}' },
  { id: 'MSG-847290', from: 'Critic #2', to: 'Copywriter #5', timestamp: '2025-11-19 15:42:10 UTC', type: 'FEEDBACK_REQUEST', status: 'DELIVERED', payload: '{\n  "feedback": "Tone is too aggressive in variant B",\n  "score": 0.7\n}' },
];

// --- Components ---

const AgentIcon = ({ type }: { type: AgentType }) => {
  switch (type) {
    case 'creator': return <PenTool className="w-5 h-5" />;
    case 'critic': return <Scale className="w-5 h-5" />;
    case 'strategist': return <Brain className="w-5 h-5" />;
    case 'support': return <LifeBuoy className="w-5 h-5" />;
    default: return <Activity className="w-5 h-5" />;
  }
};

const AgentColor = (type: AgentType) => {
  switch (type) {
    case 'creator': return 'bg-blue-500 border-blue-400 text-blue-50';
    case 'critic': return 'bg-orange-500 border-orange-400 text-orange-50';
    case 'strategist': return 'bg-purple-500 border-purple-400 text-purple-50';
    case 'support': return 'bg-gray-500 border-gray-400 text-gray-50';
    default: return 'bg-slate-500';
  }
};

export default function AgentHub() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLayers, setActiveLayers] = useState<AgentType[]>(['creator', 'critic', 'strategist', 'support']);
  
  // Helper to get coordinates for lines
  const getCoords = (id: string) => {
    const agent = AGENTS.find(a => a.id === id);
    return agent ? { x: agent.x, y: agent.y } : { x: 0, y: 0 };
  };

  const toggleLayer = (layer: AgentType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0A0E1A] overflow-hidden relative">
      
      {/* --- Top Control Bar --- */}
      <div className="h-16 bg-[#131825] border-b border-[#2D3548] px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-[#0A0E1A] border-[#2D3548] h-9">
                <SelectValue placeholder="Filter Campaign" />
              </SelectTrigger>
              <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                <SelectItem value="all">All Campaigns</SelectItem>
                <SelectItem value="cm2847">CM-2847 (Fall)</SelectItem>
                <SelectItem value="cm2839">CM-2839 (Summer)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-6 w-[1px] bg-[#2D3548]" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2 uppercase tracking-wider font-medium">Layers:</span>
            {[
              { id: 'creator', label: 'Creators', color: 'bg-blue-500' },
              { id: 'critic', label: 'Critics', color: 'bg-orange-500' },
              { id: 'strategist', label: 'Strategists', color: 'bg-purple-500' },
              { id: 'support', label: 'Support', color: 'bg-gray-500' },
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id as AgentType)}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-medium transition-all border",
                  activeLayers.includes(layer.id as AgentType)
                    ? `${layer.color} bg-opacity-20 border-opacity-50 text-white border-${layer.color.split('-')[1]}-500`
                    : "bg-transparent border-[#2D3548] text-muted-foreground hover:text-white"
                )}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#0A0E1A] rounded-lg p-1 border border-[#2D3548]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", !isPaused ? "bg-emerald-500/20 text-emerald-500" : "text-muted-foreground")}
              onClick={() => setIsPaused(false)}
            >
              <Play className="w-3 h-3" fill="currentColor" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn("h-7 w-7 p-0", isPaused ? "bg-amber-500/20 text-amber-500" : "text-muted-foreground")}
              onClick={() => setIsPaused(true)}
            >
              <Pause className="w-3 h-3" fill="currentColor" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Time Scrubber (Overlaid) --- */}
      <div className="absolute top-[63px] left-0 w-full h-1 bg-[#131825] z-30 group hover:h-4 transition-all cursor-pointer">
         <div className="h-full bg-primary/50 w-3/4 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
         </div>
         <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-[#131825] text-xs px-2 py-1 rounded border border-[#2D3548] opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground pointer-events-none">
            Replay last 6 hours
         </div>
      </div>

      {/* --- Main Graph Area --- */}
      <div className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing bg-[radial-gradient(circle_at_center,#1A2032_1px,transparent_1px)] bg-[size:40px_40px] opacity-100">
        
        {/* Canvas Container (Simulated Pan/Zoom) */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          drag
          dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
          dragElastic={0.1}
        >
          <div className="relative w-full h-full max-w-[1400px] mx-auto mt-20">
            
            {/* Edges Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {EDGES.map((edge) => {
                const start = getCoords(edge.source);
                const end = getCoords(edge.target);
                const isVisible = activeLayers.includes(AGENTS.find(a => a.id === edge.source)?.type as AgentType) && 
                                  activeLayers.includes(AGENTS.find(a => a.id === edge.target)?.type as AgentType);
                
                if (!isVisible) return null;

                const isSelected = selectedEdge?.id === edge.id;

                return (
                  <g key={edge.id} onClick={() => { setSelectedEdge(edge); setSelectedAgent(null); }} className="pointer-events-auto cursor-pointer">
                    {/* Hover target (thicker invisible line) */}
                    <line 
                      x1={`${start.x}%`} y1={`${start.y}%`} 
                      x2={`${end.x}%`} y2={`${end.y}%`} 
                      stroke="transparent" 
                      strokeWidth="20" 
                    />
                    {/* Visible Line */}
                    <line 
                      x1={`${start.x}%`} y1={`${start.y}%`} 
                      x2={`${end.x}%`} y2={`${end.y}%`} 
                      stroke={edge.type === 'failed' ? '#EF4444' : isSelected ? '#FFFFFF' : '#3B82F6'} 
                      strokeWidth={isSelected ? 3 : 1.5} 
                      strokeDasharray={edge.type === 'failed' ? "4 4" : "none"}
                      className="opacity-40 transition-all duration-300"
                    />
                    {/* Animated Dot */}
                    {!isPaused && (
                      <circle r={isSelected ? 4 : 2} fill={edge.type === 'failed' ? '#EF4444' : '#3B82F6'}>
                        <animateMotion 
                          dur={edge.activityLevel === 'high' ? "1s" : edge.activityLevel === 'medium' ? "2s" : "4s"} 
                          repeatCount="indefinite"
                          path={`M${(start.x/100)*1400},${(start.y/100)*600} L${(end.x/100)*1400},${(end.y/100)*600}`} // Simplified path coord approximation for mockup
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes Layer */}
            {AGENTS.map((agent) => {
              if (!activeLayers.includes(agent.type)) return null;
              
              const isSelected = selectedAgent?.id === agent.id;
              const size = 48 + (agent.trustScore - 80); // dynamic size based on trust

              return (
                <motion.div
                  key={agent.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                  onClick={(e) => { e.stopPropagation(); setSelectedAgent(agent); setSelectedEdge(null); }}
                >
                  {/* Pulse Effect for Active Agents */}
                  {agent.status === 'processing' && !isPaused && (
                    <motion.div 
                      className={cn("absolute inset-0 rounded-full opacity-30", AgentColor(agent.type).split(' ')[0])}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}

                  {/* Main Node Body */}
                  <div 
                    className={cn(
                      "rounded-full flex items-center justify-center border-2 shadow-lg transition-all duration-300 relative bg-[#0A0E1A]",
                      AgentColor(agent.type),
                      isSelected ? "ring-4 ring-white/20 scale-110 z-10" : ""
                    )}
                    style={{ width: size, height: size }}
                  >
                    <AgentIcon type={agent.type} />
                    
                    {/* Status Badge Overlay */}
                    {agent.status === 'completed' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-[#0A0E1A]">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {agent.status === 'processing' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center border-2 border-[#0A0E1A]">
                        <Activity className="w-3 h-3 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-center pointer-events-none">
                    <div className="bg-[#0A0E1A]/80 backdrop-blur px-2 py-1 rounded text-[10px] font-medium text-white whitespace-nowrap border border-white/10">
                      {agent.name}
                    </div>
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-48">
                    <div className="bg-[#1A2032] border border-[#2D3548] rounded-lg p-3 shadow-xl text-xs text-left">
                      <div className="font-semibold text-white mb-1">{agent.name}</div>
                      <div className="text-muted-foreground">Trust Score: <span className="text-emerald-400">{agent.trustScore}/100</span></div>
                      <div className="text-muted-foreground">Task: <span className="text-white">{agent.currentTask || 'Idle'}</span></div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* --- Right Inspector Panel --- */}
      <AnimatePresence>
        {(selectedAgent || selectedEdge) && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-16 bottom-0 w-[350px] bg-[#1A2032] border-l border-[#2D3548] shadow-2xl z-40 flex flex-col"
          >
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 text-muted-foreground hover:text-white z-10"
              onClick={() => { setSelectedAgent(null); setSelectedEdge(null); }}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* --- AGENT DETAILS --- */}
            {selectedAgent && (
              <div className="flex flex-col h-full">
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-2xl border-4 border-[#0A0E1A] shadow-lg", AgentColor(selectedAgent.type))}>
                       <AgentIcon type={selectedAgent.type} />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{selectedAgent.name}</h2>
                      <Badge variant="outline" className="uppercase text-[10px] tracking-wider mt-1 bg-white/5 border-white/10 text-muted-foreground">
                        {selectedAgent.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Trust Score Ring (Mock Visual) */}
                  <div className="bg-[#0A0E1A] rounded-xl p-4 border border-[#2D3548] mb-6 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground uppercase font-medium">Trust Score</span>
                      <span className="text-2xl font-bold text-emerald-400">{selectedAgent.trustScore}/100</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border-4 border-[#2D3548] border-t-emerald-500 border-r-emerald-500 transform -rotate-45"></div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#2D3548]">
                      <div className="text-[10px] text-muted-foreground">Uptime</div>
                      <div className="text-sm font-mono text-white">{selectedAgent.uptime}%</div>
                    </div>
                    <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#2D3548]">
                      <div className="text-[10px] text-muted-foreground">Avg Response</div>
                      <div className="text-sm font-mono text-white">{selectedAgent.avgResponse}ms</div>
                    </div>
                    <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#2D3548]">
                      <div className="text-[10px] text-muted-foreground">Success Rate</div>
                      <div className="text-sm font-mono text-white">{selectedAgent.successRate}%</div>
                    </div>
                    <div className="bg-[#0A0E1A] p-3 rounded-lg border border-[#2D3548]">
                      <div className="text-[10px] text-muted-foreground">Status</div>
                      <div className={cn("text-sm font-medium capitalize", selectedAgent.status === 'processing' ? "text-amber-400" : "text-emerald-400")}>
                        {selectedAgent.status}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="px-6 py-2 bg-[#131825] border-y border-[#2D3548]">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">Recent Messages</h3>
                  </div>
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="text-xs border-l-2 border-[#2D3548] pl-3 py-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] text-muted-foreground">15:48:{40-i}</span>
                            <Badge variant="secondary" className="text-[8px] px-1 h-4 bg-blue-500/10 text-blue-400 border-blue-500/20">OUT</Badge>
                          </div>
                          <p className="text-gray-300 leading-relaxed">Submitted variant #{i} for review to Critic agent.</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )}

            {/* --- EDGE DETAILS --- */}
            {selectedEdge && (
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 text-blue-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Message Details</h2>
                    <div className="text-xs text-mono text-muted-foreground">ID: {MESSAGES[0].id}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-[#0A0E1A] p-4 rounded-lg border border-[#2D3548]">
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-1">FROM</div>
                      <div className="text-xs font-bold text-blue-400">{MESSAGES[0].from}</div>
                    </div>
                    <div className="h-[1px] flex-1 bg-[#2D3548] mx-4 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A2032] px-2 text-[10px] text-muted-foreground">➔</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-1">TO</div>
                      <div className="text-xs font-bold text-orange-400">{MESSAGES[0].to}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1 uppercase">Timestamp</div>
                      <div className="text-xs text-white font-mono">{MESSAGES[0].timestamp}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground mb-1 uppercase">Status</div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                        {MESSAGES[0].status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-1 uppercase">Type</div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 w-full justify-center py-1">
                      {MESSAGES[0].type}
                    </Badge>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] text-muted-foreground uppercase">Payload</div>
                      <div className="text-[10px] text-blue-400 cursor-pointer hover:text-blue-300">Copy JSON</div>
                    </div>
                    <div className="bg-[#0A0E1A] rounded-lg p-3 border border-[#2D3548] font-mono text-[10px] text-gray-300 overflow-x-auto">
                      <pre>{MESSAGES[0].payload}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
