import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Terminal,
  Plus,
  MoreHorizontal,
  Bot
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data
const activeCampaigns = [
  { id: 1, name: "Fall Promo", status: "Live", platforms: ["meta", "twitter"], color: "bg-emerald-500" },
  { id: 2, name: "Summer Sale", status: "In Review", platforms: ["meta"], color: "bg-amber-500" },
  { id: 3, name: "Holiday Launch", status: "Drafting", platforms: ["linkedin", "twitter"], color: "bg-blue-500" },
];

const kpis = [
  { label: "Campaign Cycle Time", value: "2.3 hrs", change: "4.2 hrs", trend: "down", color: "text-emerald-500" },
  { label: "Brand Alignment", value: "92%", change: "2%", trend: "up", color: "text-emerald-500" },
  { label: "Consensus Rate", value: "87%", change: "3%", trend: "up", color: "text-emerald-500" },
  { label: "CTR Improvement", value: "+18%", change: "5%", trend: "up", color: "text-emerald-500" },
];

const initialActivityLog = [
  { time: "15:32", text: "Designer Agent #7 created 3 variants for Campaign XYZ", type: "info" },
  { time: "15:28", text: "Consensus reached for Campaign 'Holiday Launch'", type: "success" },
  { time: "15:24", text: "Campaign 'Fall Promo' deployed to Twitter", type: "success" },
  { time: "15:15", text: "Critic Agent #2 flagged compliance issue in Copy v2", type: "warning" },
  { time: "15:10", text: "Strategist Agent initiated optimization sequence", type: "info" },
];

const agents = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  type: i < 4 ? "creator" : i < 7 ? "critic" : i < 10 ? "strategist" : "support",
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

const AgentNode = ({ type, x, y }: { type: string, x: number, y: number }) => {
  const colors = {
    creator: "bg-blue-500",
    critic: "bg-orange-500",
    strategist: "bg-purple-500",
    support: "bg-gray-500",
  };
  
  return (
    <motion.div
      className={`absolute w-3 h-3 rounded-full ${colors[type as keyof typeof colors]} shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        x: [0, Math.random() * 10 - 5, 0],
        y: [0, Math.random() * 10 - 5, 0],
      }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

export default function Dashboard() {
  const [_, setLocation] = useLocation();
  const [logs, setLogs] = useState(initialActivityLog);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate live logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = [
        { time: "15:35", text: "Optimization Agent #3 adjusted bid strategy", type: "info" },
        { time: "15:36", text: "Audience Target expanded by 5%", type: "success" },
        { time: "15:38", text: "Content Writer #4 generating new hooks", type: "info" },
      ];
      const randomLog = newLogs[Math.floor(Math.random() * newLogs.length)];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      setLogs(prev => [{ ...randomLog, time: timestamp }, ...prev].slice(0, 50));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of agent activities and campaign performance</p>
        </div>
        <Button 
          onClick={() => setLocation("/campaign-builder")}
          className="bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2" /> Create New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Active Campaigns */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Active Campaigns</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
          </div>
          
          <div className="space-y-4">
            {activeCampaigns.map((campaign) => (
              <Card 
                key={campaign.id}
                onClick={() => setLocation("/monitoring")}
                className="bg-[#1A2032] border border-border p-5 cursor-pointer hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-lg text-white group-hover:text-primary transition-colors">{campaign.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Updated 24m ago</p>
                  </div>
                  <Badge 
                    className={`
                      ${campaign.status === "Live" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}
                      ${campaign.status === "In Review" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : ""}
                      ${campaign.status === "Drafting" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : ""}
                    `}
                  >
                    {campaign.status === "Live" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-900 border-2 border-[#1A2032] flex items-center justify-center text-[10px] text-blue-200">A1</div>
                    <div className="w-8 h-8 rounded-full bg-purple-900 border-2 border-[#1A2032] flex items-center justify-center text-[10px] text-purple-200">A2</div>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#1A2032] flex items-center justify-center text-[10px] text-gray-400">+3</div>
                  </div>
                  
                  <div className="flex gap-2">
                    {campaign.platforms.includes("meta") && <div className="p-1.5 bg-[#131825] rounded-md border border-border text-blue-400"><Facebook className="w-3 h-3" /></div>}
                    {campaign.platforms.includes("twitter") && <div className="p-1.5 bg-[#131825] rounded-md border border-border text-sky-400"><Twitter className="w-3 h-3" /></div>}
                    {campaign.platforms.includes("linkedin") && <div className="p-1.5 bg-[#131825] rounded-md border border-border text-blue-600"><Linkedin className="w-3 h-3" /></div>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Center Column: KPIs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <h2 className="text-xl font-semibold text-white">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 gap-4">
            {kpis.map((kpi, idx) => (
              <Card key={idx} className="bg-[#1A2032] border border-border p-5 flex flex-col justify-between min-h-[160px] hover:border-border/80 transition-colors">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
                  <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{kpi.value}</h3>
                </div>
                
                <div className="flex items-end justify-between mt-4">
                  <div className={`flex items-center text-xs font-medium ${kpi.color}`}>
                    {kpi.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                    {kpi.change}
                  </div>
                  <div className="h-8 w-16 flex items-end space-x-1">
                    {[40, 70, 50, 90, 60, 80].map((h, i) => (
                      <div key={i} className="w-2 bg-primary/20 rounded-sm" style={{ height: `${h}%` }}></div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Agent Network */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Agent Network</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">12 Active</Badge>
          </div>
          
          <Card className="bg-[#1A2032] border border-border p-6 h-[400px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50"></div>
            
            {/* Mock Network Graph */}
            <div className="relative w-full h-full">
              {/* Connecting lines (simplified) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 animate-pulse">
                <line x1="20%" y1="30%" x2="60%" y2="40%" stroke="#3B82F6" strokeWidth="1" />
                <line x1="60%" y1="40%" x2="80%" y2="20%" stroke="#3B82F6" strokeWidth="1" />
                <line x1="60%" y1="40%" x2="50%" y2="70%" stroke="#3B82F6" strokeWidth="1" />
                <line x1="20%" y1="30%" x2="50%" y2="70%" stroke="#3B82F6" strokeWidth="1" />
                <line x1="80%" y1="20%" x2="90%" y2="60%" stroke="#3B82F6" strokeWidth="1" />
              </svg>

              {/* Nodes */}
              <div className="absolute top-[30%] left-[20%] group/node cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#131825] border-2 border-blue-500 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-transform group-hover/node:scale-110">
                  <Bot className="w-6 h-6 text-blue-500" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-blue-400 opacity-0 group-hover/node:opacity-100 transition-opacity bg-[#0A0E1A] px-2 py-1 rounded border border-blue-500/30">
                  Copywriter #5
                </div>
              </div>

              <div className="absolute top-[40%] left-[60%] group/node cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#131825] border-2 border-purple-500 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-transform group-hover/node:scale-110">
                  <Bot className="w-6 h-6 text-purple-500" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-purple-400 opacity-0 group-hover/node:opacity-100 transition-opacity bg-[#0A0E1A] px-2 py-1 rounded border border-purple-500/30">
                  Strategist #1
                </div>
              </div>

              <div className="absolute top-[70%] left-[50%] group/node cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#131825] border-2 border-orange-500 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-transform group-hover/node:scale-110">
                  <Bot className="w-6 h-6 text-orange-500" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-orange-400 opacity-0 group-hover/node:opacity-100 transition-opacity bg-[#0A0E1A] px-2 py-1 rounded border border-orange-500/30">
                  Critic #2
                </div>
              </div>

              <div className="absolute top-[20%] left-[80%] group/node cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-[#131825] border-2 border-gray-500 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(107,114,128,0.3)] transition-transform group-hover/node:scale-110">
                  <Bot className="w-6 h-6 text-gray-400" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-400 opacity-0 group-hover/node:opacity-100 transition-opacity bg-[#0A0E1A] px-2 py-1 rounded border border-gray-500/30">
                  Support #8
                </div>
              </div>
              
              {/* Background particles */}
              {agents.map((agent) => (
                 <AgentNode key={agent.id} type={agent.type} x={agent.x} y={agent.y} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Panel: Activity Feed */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>
        
        <Card className="bg-[#0A0E1A] border border-border p-0 overflow-hidden font-mono text-sm relative h-48">
            <div className="absolute top-0 left-0 w-full h-6 bg-[#131825] border-b border-border flex items-center px-3 gap-1.5 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                <div className="ml-2 text-[10px] text-muted-foreground">agent_logs.log — bash — 80x24</div>
            </div>
            <div ref={scrollRef} className="p-4 pt-10 h-full overflow-y-auto scrollbar-hide space-y-2">
                <AnimatePresence initial={false}>
                  {logs.map((log, i) => (
                      <motion.div 
                        key={`${log.time}-${i}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-3"
                      >
                          <span className="text-muted-foreground opacity-50 shrink-0">{log.time}</span>
                          <span className="text-muted-foreground shrink-0">—</span>
                          <span className={`
                              ${log.type === 'success' ? 'text-emerald-400' : ''}
                              ${log.type === 'warning' ? 'text-amber-400' : ''}
                              ${log.type === 'info' ? 'text-blue-400' : ''}
                          `}>
                              {log.text}
                          </span>
                      </motion.div>
                  ))}
                </AnimatePresence>
                <div className="flex gap-3 animate-pulse">
                    <span className="text-primary">➜</span>
                    <span className="text-white">_</span>
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
}
