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
  Activity,
  ZoomIn,
  ZoomOut,
  Maximize2,
  UserPlus,
  Trash2,
  Edit3,
  Link2,
  Link2Off,
  Save,
  FolderOpen,
  Undo,
  Redo,
  RotateCcw,
  Calendar,
  DollarSign,
  Send,
  RotateCcwIcon,
  Move,
  UserMinus,
  GitBranch,
  Scissors,
  TrendingUp
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// --- Types ---

type AgentType = 'creator' | 'critic' | 'strategist' | 'support';

interface Agent {
  id: string;
  name: string;
  type: AgentType;
  x: number;
  y: number;
  trustScore: number;
  status: 'idle' | 'processing' | 'completed' | 'paused';
  currentTask?: string;
  uptime: number;
  avgResponse: number;
  successRate: number;
  priority?: 'low' | 'normal' | 'high';
  roleFocus?: string;
  isAssigned?: boolean;
  notes?: string;
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type: 'success' | 'failed';
  activityLevel: 'low' | 'medium' | 'high';
}

interface WorkflowPreset {
  id: string;
  name: string;
  agents: Agent[];
  edges: Edge[];
  createdAt: string;
}

interface HistoryState {
  agents: Agent[];
  edges: Edge[];
}

interface Campaign {
  id: string;
  name: string;
  objective: string;
  deadline: string;
  budget: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: Date;
  action: 'move' | 'assign' | 'unassign' | 'connect' | 'disconnect' | 'update';
  description: string;
  agentName?: string;
}

// --- Mock Data ---

const CAMPAIGNS: Campaign[] = [
  {
    id: 'cm2847',
    name: 'CM-2847 (Fall)',
    objective: 'Launch Q4 campaign for sustainable sneakers targeting eco-conscious millennials. Goal: 30% increase in website traffic.',
    deadline: '2025-12-15',
    budget: '$45,000'
  },
  {
    id: 'cm2839',
    name: 'CM-2839 (Summer)',
    objective: 'Summer collection promotional campaign focusing on social media engagement and influencer partnerships.',
    deadline: '2025-06-30',
    budget: '$32,500'
  }
];

const INITIAL_ASSIGNED_AGENTS: Agent[] = [
  { id: 'a1', name: 'Copywriter #5', type: 'creator', x: 20, y: 20, trustScore: 91, status: 'processing', currentTask: 'Writing headlines', uptime: 99.2, avgResponse: 420, successRate: 94, priority: 'high', roleFocus: 'Headline Generation', isAssigned: true },
  { id: 'a2', name: 'Designer #9', type: 'creator', x: 30, y: 50, trustScore: 88, status: 'completed', currentTask: 'Asset generation', uptime: 98.5, avgResponse: 850, successRate: 92, priority: 'normal', roleFocus: 'Visual Assets', isAssigned: true },
  { id: 'a3', name: 'Campaign Lead', type: 'creator', x: 15, y: 70, trustScore: 95, status: 'idle', uptime: 99.9, avgResponse: 120, successRate: 98, priority: 'high', roleFocus: 'Campaign Strategy', isAssigned: true },
  
  { id: 'a6', name: 'Critic #2', type: 'critic', x: 50, y: 20, trustScore: 94, status: 'processing', currentTask: 'Compliance check', uptime: 99.5, avgResponse: 200, successRate: 97, priority: 'high', roleFocus: 'Compliance Review', isAssigned: true },
  { id: 'a7', name: 'Critic #1', type: 'critic', x: 55, y: 60, trustScore: 92, status: 'idle', uptime: 99.3, avgResponse: 250, successRate: 96, priority: 'normal', roleFocus: 'Quality Assurance', isAssigned: true },
  
  { id: 'a9', name: 'Strategist #1', type: 'strategist', x: 75, y: 30, trustScore: 89, status: 'processing', currentTask: 'Bid optimization', uptime: 97.5, avgResponse: 600, successRate: 91, priority: 'normal', roleFocus: 'Bid Management', isAssigned: true },
  { id: 'a10', name: 'Market Analyst', type: 'strategist', x: 80, y: 70, trustScore: 93, status: 'idle', uptime: 98.9, avgResponse: 550, successRate: 94, priority: 'normal', roleFocus: 'Market Analysis', isAssigned: true },
];

const BENCH_AGENTS: Agent[] = [
  { id: 'a4', name: 'Video Gen', type: 'creator', x: 0, y: 0, trustScore: 82, status: 'idle', uptime: 95.0, avgResponse: 1200, successRate: 89, priority: 'normal', roleFocus: 'Video Creation', isAssigned: false },
  { id: 'a5', name: 'Social Writer', type: 'creator', x: 0, y: 0, trustScore: 90, status: 'idle', uptime: 99.1, avgResponse: 300, successRate: 95, priority: 'normal', roleFocus: 'Social Media Copy', isAssigned: false },
  { id: 'a8', name: 'Brand Guard', type: 'critic', x: 0, y: 0, trustScore: 96, status: 'idle', uptime: 99.8, avgResponse: 180, successRate: 99, priority: 'normal', roleFocus: 'Brand Guidelines', isAssigned: false },
  { id: 'a11', name: 'Planner', type: 'strategist', x: 0, y: 0, trustScore: 90, status: 'idle', uptime: 98.2, avgResponse: 400, successRate: 93, priority: 'normal', roleFocus: 'Schedule Planning', isAssigned: false },
  { id: 'a12', name: 'Support #1', type: 'support', x: 0, y: 0, trustScore: 99, status: 'idle', uptime: 100, avgResponse: 50, successRate: 100, priority: 'low', roleFocus: 'General Support', isAssigned: false },
  { id: 'a13', name: 'Logger', type: 'support', x: 0, y: 0, trustScore: 99, status: 'idle', uptime: 100, avgResponse: 30, successRate: 100, priority: 'low', roleFocus: 'Activity Logging', isAssigned: false },
  { id: 'a14', name: 'Monitor', type: 'support', x: 0, y: 0, trustScore: 98, status: 'idle', uptime: 99.9, avgResponse: 40, successRate: 100, priority: 'low', roleFocus: 'Health Monitoring', isAssigned: false },
  { id: 'a15', name: 'Router', type: 'support', x: 0, y: 0, trustScore: 99, status: 'idle', uptime: 100, avgResponse: 20, successRate: 100, priority: 'low', roleFocus: 'Task Routing', isAssigned: false },
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
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState<string>('cm2847');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLayers, setActiveLayers] = useState<AgentType[]>(['creator', 'critic', 'strategist', 'support']);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  
  // Canvas state
  const [agents, setAgents] = useState<Agent[]>(INITIAL_ASSIGNED_AGENTS);
  const [benchAgents, setBenchAgents] = useState<Agent[]>(BENCH_AGENTS);
  const [edges, setEdges] = useState<Edge[]>(EDGES);
  const [showBench, setShowBench] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Edge connection mode
  const [connectMode, setConnectMode] = useState(false);
  const [connectSource, setConnectSource] = useState<string | null>(null);
  
  // Presets
  const [presets, setPresets] = useState<WorkflowPreset[]>([
    {
      id: 'default',
      name: 'Default Workflow',
      agents: INITIAL_ASSIGNED_AGENTS,
      edges: EDGES,
      createdAt: new Date().toISOString()
    }
  ]);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [presetName, setPresetName] = useState('');
  
  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([
    { agents: INITIAL_ASSIGNED_AGENTS, edges: EDGES }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Helper to get coordinates for lines
  const getCoords = (id: string) => {
    const agent = agents.find(a => a.id === id);
    return agent ? { x: agent.x, y: agent.y } : { x: 0, y: 0 };
  };

  // Get current campaign
  const currentCampaign = CAMPAIGNS.find(c => c.id === selectedCampaign);

  // Count agents by role
  const agentCounts = {
    creator: agents.filter(a => a.type === 'creator').length,
    critic: agents.filter(a => a.type === 'critic').length,
    strategist: agents.filter(a => a.type === 'strategist').length,
    support: agents.filter(a => a.type === 'support').length,
  };

  const toggleLayer = (layer: AgentType) => {
    if (activeLayers.includes(layer)) {
      setActiveLayers(activeLayers.filter(l => l !== layer));
    } else {
      setActiveLayers([...activeLayers, layer]);
    }
  };

  // Add audit log entry (keep last 5)
  const addAuditEntry = (action: AuditLogEntry['action'], description: string, agentName?: string) => {
    const newEntry: AuditLogEntry = {
      id: `audit_${Date.now()}`,
      timestamp: new Date(),
      action,
      description,
      agentName
    };
    setAuditLog(prev => [newEntry, ...prev].slice(0, 5));
  };

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-background')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Update agent position after drag
  const handleAgentDragEnd = (agentId: string, info: any) => {
    const agent = agents.find(a => a.id === agentId);
    const updatedAgents = agents.map(a => {
      if (a.id === agentId) {
        // Calculate new position as percentage relative to canvas
        const canvas = canvasRef.current;
        if (!canvas) return a;
        
        const rect = canvas.getBoundingClientRect();
        const newX = ((info.point.x - rect.left - pan.x) / (rect.width * zoom)) * 100;
        const newY = ((info.point.y - rect.top - pan.y) / (rect.height * zoom)) * 100;
        
        return {
          ...a,
          x: Math.max(5, Math.min(95, newX)),
          y: Math.max(5, Math.min(95, newY))
        };
      }
      return a;
    });
    setAgents(updatedAgents);
    addToHistory(updatedAgents, edges);
    
    // Add audit log entry
    if (agent) {
      addAuditEntry('move', `Repositioned on canvas`, agent.name);
    }
  };

  // Assign agent from bench to canvas
  const handleAssignAgent = (agentId: string) => {
    const agent = benchAgents.find(a => a.id === agentId);
    if (!agent) return;

    // Find a good position for the new agent (avoid overlaps)
    const assignedCount = agents.length;
    const newX = 20 + (assignedCount % 5) * 15;
    const newY = 20 + Math.floor(assignedCount / 5) * 20;

    const assignedAgent = {
      ...agent,
      x: newX,
      y: newY,
      isAssigned: true,
      status: 'idle' as const
    };

    const updatedAgents = [...agents, assignedAgent];
    setAgents(updatedAgents);
    setBenchAgents(prev => prev.filter(a => a.id !== agentId));
    addToHistory(updatedAgents, edges);
    
    // Add audit log entry
    addAuditEntry('assign', `Assigned to canvas`, agent.name);
    
    toast({
      title: "Agent Assigned",
      description: `${agent.name} added to canvas`,
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  // Remove agent from canvas back to bench
  const handleRemoveAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const benchAgent = {
      ...agent,
      x: 0,
      y: 0,
      isAssigned: false,
      status: 'idle' as const
    };

    const updatedAgents = agents.filter(a => a.id !== agentId);
    setBenchAgents(prev => [...prev, benchAgent]);
    setAgents(updatedAgents);
    setSelectedAgent(null);
    addToHistory(updatedAgents, edges);
    
    // Add audit log entry
    addAuditEntry('unassign', `Removed from canvas`, agent.name);
    
    toast({
      title: "Agent Removed",
      description: `${agent.name} returned to bench`,
      className: "bg-amber-500/10 border-amber-500/20 text-white"
    });
  };

  // Update agent details
  const handleUpdateAgent = (agentId: string, updates: Partial<Agent>) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, ...updates } : a));
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Toggle agent pause/resume
  const handleTogglePause = (agentId: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const newStatus = a.status === 'paused' ? 'idle' : 'paused';
        return { ...a, status: newStatus };
      }
      return a;
    }));
    
    if (selectedAgent?.id === agentId) {
      const newStatus = selectedAgent.status === 'paused' ? 'idle' : 'paused';
      setSelectedAgent(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: newStatus === 'paused' ? "Agent Paused" : "Agent Resumed",
        description: `${selectedAgent.name} is now ${newStatus}`,
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    }
  };

  // Toggle connect mode
  const handleToggleConnectMode = () => {
    setConnectMode(!connectMode);
    setConnectSource(null);
    if (!connectMode) {
      toast({
        title: "Connect Mode Activated",
        description: "Click a source agent, then a target agent to create a connection",
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    }
  };

  // Handle node click in connect mode
  const handleNodeClickForConnection = (agentId: string) => {
    if (!connectMode) return;

    if (!connectSource) {
      // Set source
      setConnectSource(agentId);
      toast({
        title: "Source Selected",
        description: "Now click a target agent to complete the connection",
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    } else {
      // Create edge
      if (connectSource === agentId) {
        toast({
          title: "Invalid Connection",
          description: "Cannot connect an agent to itself",
          variant: "destructive"
        });
        return;
      }

      // Check if edge already exists
      const edgeExists = edges.some(
        e => (e.source === connectSource && e.target === agentId) ||
             (e.source === agentId && e.target === connectSource)
      );

      if (edgeExists) {
        toast({
          title: "Connection Exists",
          description: "An edge already exists between these agents",
          variant: "destructive"
        });
        setConnectSource(null);
        return;
      }

      const sourceAgent = agents.find(a => a.id === connectSource);
      const targetAgent = agents.find(a => a.id === agentId);
      
      const newEdge: Edge = {
        id: `e${edges.length + 1}`,
        source: connectSource,
        target: agentId,
        type: 'success',
        activityLevel: 'medium'
      };

      const updatedEdges = [...edges, newEdge];
      setEdges(updatedEdges);
      setConnectSource(null);
      addToHistory(agents, updatedEdges);
      
      // Add audit log entry
      if (sourceAgent && targetAgent) {
        addAuditEntry('connect', `Connected ${sourceAgent.name} → ${targetAgent.name}`);
      }
      
      toast({
        title: "Connection Created",
        description: "New edge added between agents",
        className: "bg-emerald-500/10 border-emerald-500/20 text-white"
      });
    }
  };

  // Delete edge
  const handleDeleteEdge = (edgeId: string) => {
    const edge = edges.find(e => e.id === edgeId);
    const sourceAgent = edge ? agents.find(a => a.id === edge.source) : null;
    const targetAgent = edge ? agents.find(a => a.id === edge.target) : null;
    
    const updatedEdges = edges.filter(e => e.id !== edgeId);
    setEdges(updatedEdges);
    setSelectedEdge(null);
    addToHistory(agents, updatedEdges);
    
    // Add audit log entry
    if (sourceAgent && targetAgent) {
      addAuditEntry('disconnect', `Disconnected ${sourceAgent.name} → ${targetAgent.name}`);
    }
    
    toast({
      title: "Connection Removed",
      description: "Edge deleted successfully",
      className: "bg-amber-500/10 border-amber-500/20 text-white"
    });
  };

  // Update edge
  const handleUpdateEdge = (edgeId: string, updates: Partial<Edge>) => {
    setEdges(prev => prev.map(e => e.id === edgeId ? { ...e, ...updates } : e));
    if (selectedEdge?.id === edgeId) {
      setSelectedEdge(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Add to history
  const addToHistory = (newAgents: Agent[], newEdges: Edge[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ agents: newAgents, edges: newEdges });
    // Keep last 20 states
    if (newHistory.length > 20) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setAgents(history[prevIndex].agents);
      setEdges(history[prevIndex].edges);
      toast({
        title: "Undo Applied",
        description: "Reverted to previous state",
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setAgents(history[nextIndex].agents);
      setEdges(history[nextIndex].edges);
      toast({
        title: "Redo Applied",
        description: "Restored next state",
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    }
  };

  // Save preset
  const handleSavePreset = () => {
    if (!presetName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a preset name",
        variant: "destructive"
      });
      return;
    }

    const newPreset: WorkflowPreset = {
      id: `preset_${Date.now()}`,
      name: presetName,
      agents: [...agents],
      edges: [...edges],
      createdAt: new Date().toISOString()
    };

    setPresets(prev => [...prev, newPreset]);
    setShowPresetDialog(false);
    setPresetName('');
    
    toast({
      title: "Preset Saved",
      description: `"${newPreset.name}" saved successfully`,
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  // Load preset
  const handleLoadPreset = (presetId: string) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    addToHistory(preset.agents, preset.edges);
    setAgents(preset.agents);
    setEdges(preset.edges);
    setBenchAgents(BENCH_AGENTS.filter(ba => !preset.agents.some(a => a.id === ba.id)));
    setShowLoadDialog(false);
    
    toast({
      title: "Preset Loaded",
      description: `"${preset.name}" applied to canvas`,
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  // Reset to default
  const handleResetToDefault = () => {
    const defaultPreset = presets.find(p => p.id === 'default');
    if (defaultPreset) {
      addToHistory(defaultPreset.agents, defaultPreset.edges);
      setAgents(defaultPreset.agents);
      setEdges(defaultPreset.edges);
      setBenchAgents(BENCH_AGENTS);
      
      toast({
        title: "Reset Complete",
        description: "Workflow reset to default configuration",
        className: "bg-amber-500/10 border-amber-500/20 text-white"
      });
    }
  };

  // Publish orchestration
  const handlePublishOrchestration = () => {
    toast({
      title: "Orchestration Published",
      description: "Agent workflow has been deployed to the campaign",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  // Revert to base
  const handleRevertToBase = () => {
    toast({
      title: "Reverted to Base",
      description: "Orchestration has been reverted to the base configuration",
      className: "bg-blue-500/10 border-blue-500/20 text-white"
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#0A0E1A] overflow-hidden relative">
      
      {/* --- Top Control Bar --- */}
      <div className="bg-[#131825] border-b border-[#2D3548] px-3 sm:px-4 lg:px-6 py-3 z-20 shrink-0">
        <div className="flex flex-col gap-6">
          {/* Row 1: Campaign + Layers */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-[160px] sm:w-[180px] bg-[#0A0E1A] border-[#2D3548] h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="Filter Campaign" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                  {CAMPAIGNS.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-6 w-[1px] bg-[#2D3548] hidden sm:block" />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium hidden lg:inline">Layers:</span>
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
                    "px-2 sm:px-3 py-1.5 rounded text-xs font-medium transition-all border",
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

          {/* Row 2: Controls + Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 bg-[#0A0E1A] rounded-lg p-1 border border-[#2D3548]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-muted-foreground hover:text-white disabled:opacity-30"
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="Undo"
              >
                <Undo className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-muted-foreground hover:text-white disabled:opacity-30"
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                title="Redo"
              >
                <Redo className="w-3 h-3" />
              </Button>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1 bg-[#0A0E1A] rounded-lg p-1 border border-[#2D3548]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-muted-foreground hover:text-white text-xs"
                onClick={() => setShowPresetDialog(true)}
                title="Save Preset"
              >
                <Save className="w-3 h-3 mr-1" /> <span className="hidden sm:inline">Save</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-muted-foreground hover:text-white text-xs"
                onClick={() => setShowLoadDialog(true)}
                title="Load Preset"
              >
                <FolderOpen className="w-3 h-3 mr-1" /> <span className="hidden sm:inline">Load</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-muted-foreground hover:text-white text-xs"
                onClick={handleResetToDefault}
                title="Reset to Default"
              >
                <RotateCcw className="w-3 h-3 mr-1" /> <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>

            {/* Bench Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBench(!showBench)}
              className={cn(
                "border-[#2D3548] hover:bg-[#1A2032] h-7 text-xs px-2 sm:px-3",
                showBench ? "bg-primary/20 text-primary border-primary/50" : "text-muted-foreground hover:text-white"
              )}
            >
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
              <span className="hidden sm:inline">Bench ({benchAgents.length})</span>
            </Button>

            {/* Connect Mode Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleConnectMode}
              className={cn(
                "border-[#2D3548] hover:bg-[#1A2032] h-7 text-xs px-2 sm:px-3",
                connectMode ? "bg-emerald-500/20 text-emerald-500 border-emerald-500/50" : "text-muted-foreground hover:text-white"
              )}
            >
              {connectMode ? <Link2Off className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" /> : <Link2 className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />}
              <span className="hidden sm:inline">{connectMode ? 'Exit' : 'Connect'}</span>
            </Button>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#0A0E1A] rounded-lg p-1 border border-[#2D3548]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-muted-foreground hover:text-white"
                onClick={handleZoomOut}
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </Button>
              <span className="text-xs text-muted-foreground min-w-[2.5rem] text-center font-mono">
                {Math.round(zoom * 100)}%
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-muted-foreground hover:text-white"
                onClick={handleZoomIn}
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0 text-muted-foreground hover:text-white"
                onClick={handleZoomReset}
                title="Reset View"
              >
                <Maximize2 className="w-3 h-3" />
              </Button>
            </div>

            {/* Simulation Toggle */}
            <div className="flex items-center gap-2 bg-[#0A0E1A] rounded-lg px-2 sm:px-3 py-1 border border-[#2D3548]">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium hidden md:inline">
                Sim
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-7 w-7 p-0 transition-all",
                  !isPaused 
                    ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30" 
                    : "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
                )}
                onClick={() => {
                  setIsPaused(!isPaused);
                  toast({
                    title: isPaused ? "Simulation Started" : "Simulation Paused",
                    description: isPaused ? "Edge animations now running" : "Edge animations stopped",
                    className: "bg-blue-500/10 border-blue-500/20 text-white"
                  });
                }}
                title={isPaused ? "Play Simulation" : "Pause Simulation"}
              >
                {!isPaused ? (
                  <Pause className="w-3 h-3" fill="currentColor" />
                ) : (
                  <Play className="w-3 h-3" fill="currentColor" />
                )}
              </Button>
            </div>

            <div className="h-6 w-[1px] bg-[#2D3548] hidden lg:block" />

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePublishOrchestration}
              className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 h-7 text-xs px-2 sm:px-3"
            >
              <Send className="w-3 h-3 sm:mr-2" />
              <span className="hidden md:inline">Publish</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevertToBase}
              className="border-[#2D3548] text-muted-foreground hover:bg-[#1A2032] hover:text-white h-7 text-xs px-2 sm:px-3"
            >
              <RotateCcwIcon className="w-3 h-3 sm:mr-2" />
              <span className="hidden md:inline">Revert</span>
            </Button>
          </div>
        </div>
      </div>

      {/* --- Campaign Context Panel & Assignment Summary --- */}
      {currentCampaign && (
        <div className="bg-[#131825] border-b border-[#2D3548] px-3 sm:px-4 lg:px-6 py-3 sm:py-4 z-20 shrink-0">
          <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
            {/* Campaign Context */}
            <div className="w-full lg:flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Objective</div>
                  <div className="text-sm text-white line-clamp-2">{currentCampaign.objective}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Deadline</div>
                  <div className="text-sm text-white">{new Date(currentCampaign.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Budget</div>
                  <div className="text-sm text-white font-semibold">{currentCampaign.budget}</div>
                </div>
              </div>
            </div>

            {/* Assignment Summary */}
            <div className="w-full lg:w-auto lg:shrink-0">
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">Assignment Summary</div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { type: 'creator' as AgentType, label: 'Creators', icon: PenTool, bgClass: 'bg-blue-500/10', borderClass: 'border-blue-500/30', textClass: 'text-blue-400' },
                  { type: 'critic' as AgentType, label: 'Critics', icon: Scale, bgClass: 'bg-orange-500/10', borderClass: 'border-orange-500/30', textClass: 'text-orange-400' },
                  { type: 'strategist' as AgentType, label: 'Strategists', icon: Brain, bgClass: 'bg-purple-500/10', borderClass: 'border-purple-500/30', textClass: 'text-purple-400' },
                  { type: 'support' as AgentType, label: 'Support', icon: LifeBuoy, bgClass: 'bg-gray-500/10', borderClass: 'border-gray-500/30', textClass: 'text-gray-400' },
                ].map(role => {
                  const count = agentCounts[role.type];
                  const Icon = role.icon;
                  const hasZero = count === 0;
                  
                  return (
                    <div
                      key={role.type}
                      className={cn(
                        "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border transition-all",
                        hasZero 
                          ? "bg-red-500/10 border-red-500/50 text-red-400"
                          : `${role.bgClass} ${role.borderClass} ${role.textClass}`
                      )}
                      title={`${count} ${role.label} assigned`}
                    >
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-xs font-medium hidden sm:inline">{role.label}</span>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold px-1.5 min-w-[20px] justify-center",
                          hasZero
                            ? "bg-red-500/20 border-red-500/50 text-red-300"
                            : "bg-white/10 border-white/20 text-white"
                        )}
                      >
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

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
      <div 
        ref={canvasRef}
        className={cn(
          "flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,#1A2032_1px,transparent_1px)] bg-[size:40px_40px] opacity-100",
          isPanning ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Floating Campaign Goals Panel */}
        {currentCampaign && (
          <Card className="absolute top-6 left-6 w-80 bg-[#1A2032]/95 backdrop-blur-md border-border rounded-xl p-5 shadow-xl z-10">
            {/* Header */}
            <div className="space-y-2 mb-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase tracking-wider">
                Current Campaign
              </Badge>
              <h3 className="text-base font-semibold text-white">
                Q4 Sustainable Sneaker Launch
              </h3>
              <p className="text-xs font-mono text-muted-foreground">#CM-2847</p>
            </div>

            {/* Divider */}
            <Separator className="my-4 bg-border" />

            {/* Goals Section */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-muted-foreground">Campaign Goals</div>
              
              {/* Primary Goal */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-white">+30% Website Traffic</span>
                </div>
                <div className="text-sm text-muted-foreground">5,460 / 13,000</div>
                
                {/* Progress Bar */}
                <div className="h-1.5 bg-[#131825] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: '42%' }}
                  ></div>
                </div>
              </div>

              {/* Secondary Goals */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-[#131825] border border-border text-xs px-2.5 py-1 hover:bg-[#131825]">
                  CTR ≥2.5%
                </Badge>
                <Badge className="bg-[#131825] border border-border text-xs px-2.5 py-1 hover:bg-[#131825]">
                  CPA ≤$25
                </Badge>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs text-muted-foreground">
                  Agents optimizing for these goals
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Canvas Container with Pan/Zoom Transform */}
        <div 
          className="absolute inset-0 w-full h-full canvas-background"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="relative w-full h-full max-w-[2000px] mx-auto p-4 sm:p-8 lg:p-12">
            
            {/* Edges Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {edges.map((edge) => {
                const start = getCoords(edge.source);
                const end = getCoords(edge.target);
                const isVisible = activeLayers.includes(agents.find((a: Agent) => a.id === edge.source)?.type as AgentType) && 
                                  activeLayers.includes(agents.find((a: Agent) => a.id === edge.target)?.type as AgentType);
                
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
            {agents.map((agent) => {
              if (!activeLayers.includes(agent.type)) return null;
              
              const isSelected = selectedAgent?.id === agent.id;
              const isConnectSource = connectSource === agent.id;
              const size = 48 + (agent.trustScore - 80); // dynamic size based on trust

              return (
                <motion.div
                  key={agent.id}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 group",
                    connectMode ? "cursor-pointer" : "cursor-move"
                  )}
                  style={{ left: `${agent.x}%`, top: `${agent.y}%` }}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDragEnd={(_, info) => handleAgentDragEnd(agent.id, info)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1, zIndex: 50 }}
                  whileDrag={{ scale: 1.15, zIndex: 100 }}
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    if (connectMode) {
                      handleNodeClickForConnection(agent.id);
                    } else {
                      setSelectedAgent(agent); 
                      setSelectedEdge(null);
                    }
                  }}
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
                      isSelected ? "ring-4 ring-white/20 scale-110 z-10" : "",
                      isConnectSource ? "ring-4 ring-emerald-500/50 scale-110 z-10 animate-pulse" : "",
                      agent.status === 'paused' ? "opacity-50 grayscale" : ""
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
                    {agent.status === 'paused' && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center border-2 border-[#0A0E1A]">
                        <Pause className="w-3 h-3 text-white" />
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
        </div>
      </div>

      {/* --- Left Bench Sidebar --- */}
      <AnimatePresence>
        {showBench && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 top-16 bg-black/50 z-39 backdrop-blur-sm"
              onClick={() => setShowBench(false)}
            />
            
            {/* Sidebar panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-16 bottom-0 w-[280px] sm:w-[320px] lg:w-[360px] bg-[#1A2032] border-r border-[#2D3548] shadow-2xl z-40 flex flex-col"
            >
            <div className="p-4 border-b border-[#2D3548] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Agent Bench</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-red-500/10 transition-colors"
                onClick={() => setShowBench(false)}
                title="Close Agent Bench"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              {benchAgents.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-sm">
                  <UserPlus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>All agents are assigned</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {benchAgents.map((agent) => (
                    <Card 
                      key={agent.id}
                      className="bg-[#131825] border border-[#2D3548] p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", AgentColor(agent.type))}>
                          <AgentIcon type={agent.type} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-white text-sm truncate">{agent.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{agent.roleFocus}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 capitalize">
                              {agent.type}
                            </Badge>
                            <div className="text-[10px] text-emerald-400">
                              Trust: {agent.trustScore}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignAgent(agent.id)}
                        className="w-full mt-3 bg-primary hover:bg-primary/90 text-white h-8"
                      >
                        <UserPlus className="w-3 h-3 mr-2" />
                        Assign to Canvas
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- Right Inspector Panel --- */}
      <AnimatePresence>
        {(selectedAgent || selectedEdge) && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-16 bottom-0 w-[280px] sm:w-[320px] lg:w-[380px] bg-[#1A2032] border-l border-[#2D3548] shadow-2xl z-40 flex flex-col"
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

                  {/* Status & Controls */}
                  <div className="bg-[#0A0E1A] rounded-xl p-4 border border-[#2D3548] mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-xs text-muted-foreground uppercase">Status Control</Label>
                      <Badge variant="outline" className={cn(
                        "capitalize text-xs",
                        selectedAgent.status === 'paused' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        selectedAgent.status === 'processing' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                        "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      )}>
                        {selectedAgent.status}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTogglePause(selectedAgent.id)}
                      className="w-full border-[#2D3548] hover:bg-[#131825] text-white"
                    >
                      {selectedAgent.status === 'paused' ? (
                        <><Play className="w-3 h-3 mr-2" /> Resume Agent</>
                      ) : (
                        <><Pause className="w-3 h-3 mr-2" /> Pause Agent</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Editable Fields */}
                <ScrollArea className="flex-1 px-6 pb-6">
                  <div className="space-y-4">
                    <Separator className="bg-[#2D3548]" />
                    
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Current Task</Label>
                      <Textarea
                        value={selectedAgent.currentTask || ''}
                        onChange={(e) => handleUpdateAgent(selectedAgent.id, { currentTask: e.target.value })}
                        placeholder="Describe the current task..."
                        className="bg-[#0A0E1A] border-[#2D3548] text-white text-sm resize-none h-20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Role Focus</Label>
                      <Input
                        value={selectedAgent.roleFocus || ''}
                        onChange={(e) => handleUpdateAgent(selectedAgent.id, { roleFocus: e.target.value })}
                        placeholder="e.g., Headline Generation"
                        className="bg-[#0A0E1A] border-[#2D3548] text-white text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Priority</Label>
                      <Select
                        value={selectedAgent.priority || 'normal'}
                        onValueChange={(value) => handleUpdateAgent(selectedAgent.id, { priority: value as 'low' | 'normal' | 'high' })}
                      >
                        <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Collaboration Notes</Label>
                      <Textarea
                        value={selectedAgent.notes || ''}
                        onChange={(e) => handleUpdateAgent(selectedAgent.id, { notes: e.target.value })}
                        placeholder="Add notes about this agent's configuration, tasks, or observations..."
                        className="bg-[#0A0E1A] border-[#2D3548] text-white text-sm resize-none h-24"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use this space to document configuration details or team notes.
                      </p>
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    {/* Stats Grid (Read-only) */}
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase mb-3 block">Performance Stats</Label>
                      <div className="grid grid-cols-2 gap-3">
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
                          <div className="text-[10px] text-muted-foreground">Type</div>
                          <div className="text-sm font-medium capitalize text-white">{selectedAgent.type}</div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    {/* Audit Trail */}
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Recent Activity (Last 5)</Label>
                      {auditLog.length === 0 ? (
                        <div className="bg-[#0A0E1A] rounded-lg p-4 border border-[#2D3548] text-center">
                          <p className="text-xs text-muted-foreground">No recent activity</p>
                        </div>
                      ) : (
                        <div className="bg-[#0A0E1A] rounded-lg border border-[#2D3548] divide-y divide-[#2D3548]">
                          {auditLog.map((entry) => {
                            const getActionIcon = () => {
                              switch (entry.action) {
                                case 'move': return <Move className="w-3 h-3" />;
                                case 'assign': return <UserPlus className="w-3 h-3" />;
                                case 'unassign': return <UserMinus className="w-3 h-3" />;
                                case 'connect': return <GitBranch className="w-3 h-3" />;
                                case 'disconnect': return <Scissors className="w-3 h-3" />;
                                case 'update': return <Edit3 className="w-3 h-3" />;
                                default: return <Activity className="w-3 h-3" />;
                              }
                            };
                            
                            return (
                              <div key={entry.id} className="p-3 hover:bg-white/5 transition-colors">
                                <div className="flex items-start gap-2">
                                  <div 
                                    className={cn(
                                      "w-6 h-6 rounded flex items-center justify-center shrink-0",
                                      entry.action === 'move' && "bg-blue-500/20 text-blue-400",
                                      entry.action === 'assign' && "bg-emerald-500/20 text-emerald-400",
                                      entry.action === 'unassign' && "bg-amber-500/20 text-amber-400",
                                      entry.action === 'connect' && "bg-purple-500/20 text-purple-400",
                                      entry.action === 'disconnect' && "bg-red-500/20 text-red-400",
                                      entry.action === 'update' && "bg-gray-500/20 text-gray-400"
                                    )}
                                  >
                                    {getActionIcon()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge 
                                        variant="outline" 
                                        className={cn(
                                          "text-[10px] uppercase px-1.5 py-0.5",
                                          entry.action === 'move' && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                                          entry.action === 'assign' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
                                          entry.action === 'unassign' && "bg-amber-500/10 text-amber-400 border-amber-500/30",
                                          entry.action === 'connect' && "bg-purple-500/10 text-purple-400 border-purple-500/30",
                                          entry.action === 'disconnect' && "bg-red-500/10 text-red-400 border-red-500/30",
                                          entry.action === 'update' && "bg-gray-500/10 text-gray-400 border-gray-500/30"
                                        )}
                                      >
                                        {entry.action}
                                      </Badge>
                                      <p className="text-[10px] text-muted-foreground">
                                        {entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                      </p>
                                    </div>
                                    <p className="text-xs text-white break-words">
                                      {entry.agentName && <span className="font-semibold">{entry.agentName}:</span>} {entry.description}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    {/* Remove Agent */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveAgent(selectedAgent.id)}
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Remove from Canvas
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* --- EDGE DETAILS --- */}
            {selectedEdge && (
              <div className="flex flex-col h-full">
                <div className="p-6 pb-0">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 text-blue-400">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Connection</h2>
                      <div className="text-xs text-mono text-muted-foreground">Edge ID: {selectedEdge.id}</div>
                    </div>
                  </div>

                  {/* Agent Connection Visual */}
                  <div className="flex items-center justify-between bg-[#0A0E1A] p-4 rounded-lg border border-[#2D3548] mb-6">
                    <div className="text-center flex-1">
                      <div className="text-[10px] text-muted-foreground mb-1 uppercase">Source</div>
                      <div className="text-xs font-bold text-blue-400">
                        {agents.find(a => a.id === selectedEdge.source)?.name || 'Unknown'}
                      </div>
                    </div>
                    <div className="h-[1px] flex-1 bg-[#2D3548] mx-4 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A2032] px-2 text-[10px] text-muted-foreground">➔</div>
                    </div>
                    <div className="text-center flex-1">
                      <div className="text-[10px] text-muted-foreground mb-1 uppercase">Target</div>
                      <div className="text-xs font-bold text-orange-400">
                        {agents.find(a => a.id === selectedEdge.target)?.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editable Edge Properties */}
                <ScrollArea className="flex-1 px-6 pb-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Connection Type</Label>
                      <Select
                        value={selectedEdge.type}
                        onValueChange={(value) => handleUpdateEdge(selectedEdge.id, { type: value as 'success' | 'failed' })}
                      >
                        <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                          <SelectItem value="success">Success Path</SelectItem>
                          <SelectItem value="failed">Failure Path</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        {selectedEdge.type === 'success' 
                          ? 'Messages flow when conditions are met' 
                          : 'Messages flow when conditions fail'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Activity Level</Label>
                      <Select
                        value={selectedEdge.activityLevel}
                        onValueChange={(value) => handleUpdateEdge(selectedEdge.id, { activityLevel: value as 'low' | 'medium' | 'high' })}
                      >
                        <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Controls animation speed and visual prominence
                      </p>
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    {/* Connection Info */}
                    <div className="bg-[#0A0E1A] rounded-lg p-4 border border-[#2D3548] space-y-3">
                      <h3 className="text-xs font-semibold text-white uppercase">Connection Details</h3>
                      
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Visual Style</span>
                        <Badge variant="outline" className={cn(
                          "text-[10px]",
                          selectedEdge.type === 'success' 
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          {selectedEdge.type === 'success' ? 'Solid Line' : 'Dashed Line'}
                        </Badge>
                      </div>

                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Animation Speed</span>
                        <span className="text-white font-mono">
                          {selectedEdge.activityLevel === 'high' ? '1s' : 
                           selectedEdge.activityLevel === 'medium' ? '2s' : '4s'}
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    {/* Delete Connection */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteEdge(selectedEdge.id)}
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete Connection
                    </Button>
                  </div>
                </ScrollArea>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Save Preset Dialog --- */}
      <Dialog open={showPresetDialog} onOpenChange={setShowPresetDialog}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <DialogHeader>
            <DialogTitle>Save Workflow Preset</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Save the current agent layout and connections as a preset for future use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Preset Name</Label>
              <Input
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="e.g., Content Creation Flow"
                className="bg-[#0A0E1A] border-[#2D3548] text-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSavePreset();
                  }
                }}
              />
            </div>
            <div className="bg-[#0A0E1A] rounded-lg p-3 border border-[#2D3548] text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Agents on Canvas:</span>
                <span className="text-white font-medium">{agents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connections:</span>
                <span className="text-white font-medium">{edges.length}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowPresetDialog(false);
                setPresetName('');
              }}
              className="border-[#2D3548] text-muted-foreground hover:text-white"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSavePreset}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Load Preset Dialog --- */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Load Workflow Preset</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a saved preset to restore agent layout and connections.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] py-4">
            {presets.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No presets saved yet
              </div>
            ) : (
              <div className="space-y-2">
                {presets.map((preset) => (
                  <Card
                    key={preset.id}
                    className="bg-[#0A0E1A] border border-[#2D3548] p-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleLoadPreset(preset.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-white">{preset.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(preset.createdAt).toLocaleDateString()} at{' '}
                          {new Date(preset.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {preset.id === 'default' && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-4 text-xs">
                      <div className="text-muted-foreground">
                        Agents: <span className="text-white">{preset.agents.length}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Edges: <span className="text-white">{preset.edges.length}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLoadDialog(false)}
              className="border-[#2D3548] text-muted-foreground hover:text-white w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
