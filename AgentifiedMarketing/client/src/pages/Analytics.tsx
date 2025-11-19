import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  Calendar,
  Filter,
  Lightbulb,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Users,
  BarChart3,
  FileText,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// --- Mock Data ---

const CAMPAIGNS = [
  { id: "cm1", name: "Q4 Sneaker Launch", ctr: 3.94, conversions: 147, roi: 284, status: "active", duration: "7/14 d", data: [2.1, 2.4, 2.8, 3.1, 3.5, 3.8, 3.94] },
  { id: "cm2", name: "Fall Promo", ctr: 2.87, conversions: 89, roi: 156, status: "completed", duration: "14/14 d", data: [1.8, 2.0, 2.2, 2.5, 2.4, 2.7, 2.87] },
  { id: "cm3", name: "Summer Sale", ctr: 4.12, conversions: 203, roi: 312, status: "completed", duration: "14/14 d", data: [2.5, 3.0, 3.5, 3.8, 4.0, 4.2, 4.12] },
  { id: "cm4", name: "Brand Awareness Q3", ctr: 1.85, conversions: 45, roi: 110, status: "completed", duration: "30/30 d", data: [1.2, 1.4, 1.5, 1.7, 1.8, 1.85] },
  { id: "cm5", name: "Flash Sale", ctr: 5.23, conversions: 312, roi: 450, status: "completed", duration: "3/3 d", data: [3.0, 4.5, 5.0, 5.23] },
];

const AGENT_PERFORMANCE = [
  { type: "Copywriter", response: 420, success: 94, trend: 3, status: "good" },
  { type: "Designer", response: 890, success: 89, trend: 2, status: "warning" },
  { type: "Critic", response: 310, success: 96, trend: 5, status: "good" },
  { type: "Strategist", response: 2100, success: 91, trend: 4, status: "good" },
];

const INSIGHTS = [
  { id: 1, text: "Designer agents consistently perform best between 10-12 PM UTC (avg trust score: 94 vs. 87 overall)", time: "2h ago" },
  { id: 2, text: "Campaigns targeting age 25-35 show 22% higher CTR than 18-24 segment", time: "5h ago" },
  { id: 3, text: "Consensus time reduced by 35% after reputation threshold adjustment", time: "1d ago" },
];

// --- Components ---

const KPICard = ({ label, value, subtext, trend, trendVal, color = "text-emerald-500" }: any) => (
  <Card className="bg-[#1A2032] border border-[#2D3548] p-5 hover:border-primary/30 transition-colors group">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
      <Badge variant="outline" className="bg-[#131825] border-[#2D3548] text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
        Updated 12s ago
      </Badge>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className={`text-xs font-medium flex items-center ${color}`}>
      {trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
      {subtext}
    </div>
  </Card>
);

const Sparkline = ({ data, color }: { data: number[], color: string }) => (
  <div className="h-8 w-24">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data.map((val, i) => ({ i, val }))}>
        <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default function Analytics() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState("7d");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedAgentType, setSelectedAgentType] = useState<string | null>(null);
  const [insights, setInsights] = useState(INSIGHTS);

  // Simulate new insights arriving
  useEffect(() => {
    const interval = setInterval(() => {
      const newInsight = {
        id: Date.now(),
        text: "New optimization opportunity detected in Meta ad sets based on recent engagement spikes.",
        time: "Just now"
      };
      setInsights(prev => [newInsight, ...prev].slice(0, 4));
      toast({
        title: "New Insight Generated",
        description: "Analytics Agent has detected a new pattern.",
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    }, 60000); // Every minute for demo
    return () => clearInterval(interval);
  }, []);

  const handleGenerateReport = () => {
    setShowReportModal(false);
    toast({
      title: "Report Generated",
      description: "Analytics_Report_Q4.pdf has been downloaded.",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* --- Top Controls --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Select defaultValue="7d" onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px] bg-[#0A0E1A] border-[#2D3548]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="h-8 w-[1px] bg-[#2D3548] hidden md:block"></div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="active" defaultChecked className="border-[#2D3548] data-[state=checked]:bg-primary" />
              <label htmlFor="active" className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Active</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="completed" defaultChecked className="border-[#2D3548] data-[state=checked]:bg-primary" />
              <label htmlFor="completed" className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Completed</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="paused" className="border-[#2D3548] data-[state=checked]:bg-primary" />
              <label htmlFor="paused" className="text-sm font-medium leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Paused</label>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="bg-[#131825] border-[#2D3548] text-white hover:bg-[#1A2032]"
          onClick={() => setShowReportModal(true)}
        >
          <FileText className="w-4 h-4 mr-2" /> Generate Report
        </Button>
      </div>

      {/* --- Row 1: Global KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Campaigns" value="47" subtext="12 vs. last month" trend="up" />
        <KPICard label="Avg Cycle Time" value="2.3 hrs" subtext="35% vs. last month" trend="down" color="text-emerald-500" />
        <KPICard label="Brand Alignment" value="91%" subtext="3% vs. last month" trend="up" />
        <KPICard label="System Uptime" value="99.1%" subtext="(30-day rolling)" trend="up" />
      </div>

      {/* --- Row 2: Agent Efficiency Heatmap --- */}
      <Card className="bg-[#1A2032] border border-[#2D3548] p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Agent Efficiency Matrix
          </h3>
          <Badge variant="outline" className="bg-[#0A0E1A] border-[#2D3548] text-muted-foreground">
            Live Performance
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#2D3548]">
                <th className="px-4 py-3 font-medium">Agent Type</th>
                <th className="px-4 py-3 font-medium">Avg Response</th>
                <th className="px-4 py-3 font-medium">Success Rate</th>
                <th className="px-4 py-3 font-medium">Trust Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3548]">
              {AGENT_PERFORMANCE.map((agent) => (
                <tr 
                  key={agent.type} 
                  className="group hover:bg-[#131825] transition-colors cursor-pointer"
                  onClick={() => setSelectedAgentType(agent.type)}
                >
                  <td className="px-4 py-4 font-medium text-white flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${agent.status === 'good' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                    {agent.type}
                  </td>
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded ${agent.response < 500 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {agent.response < 1000 ? `${agent.response}ms` : `${(agent.response/1000).toFixed(1)}s`}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded ${agent.success > 90 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {agent.success}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-emerald-500 font-medium">
                    ↑ +{agent.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- Row 3: Campaign Performance Table --- */}
      <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> Campaign Performance
          </h3>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#2D3548] bg-[#131825]">
                <th className="px-4 py-3 font-medium rounded-tl-lg">Campaign Name</th>
                <th className="px-4 py-3 font-medium">CTR Trend</th>
                <th className="px-4 py-3 font-medium">Conversions</th>
                <th className="px-4 py-3 font-medium">ROI</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium rounded-tr-lg">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D3548]">
              {CAMPAIGNS.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="group hover:bg-[#131825] transition-colors cursor-pointer"
                  onClick={() => setLocation("/monitoring")}
                >
                  <td className="px-4 py-4 font-medium text-white">{campaign.name}</td>
                  <td className="px-4 py-4 flex items-center gap-3">
                    <span className="font-mono text-white w-12">{campaign.ctr}%</span>
                    <Sparkline data={campaign.data} color="#3B82F6" />
                  </td>
                  <td className="px-4 py-4 text-white">{campaign.conversions}</td>
                  <td className="px-4 py-4 text-emerald-500 font-medium">+{campaign.roi}%</td>
                  <td className="px-4 py-4">
                    <Badge 
                      variant="outline" 
                      className={`
                        border-0 capitalize
                        ${campaign.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-400'}
                      `}
                    >
                      {campaign.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>}
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground font-mono text-xs">{campaign.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* --- Row 4: Insights Feed --- */}
      <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-amber-400" /> Auto-Generated Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <AnimatePresence>
            {insights.slice(0, 3).map((insight, i) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0A0E1A] p-4 rounded-lg border border-[#2D3548] hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-amber-500/10 rounded-md text-amber-500 shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-2">{insight.text}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> Generated {insight.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* --- Modals --- */}

      {/* Report Generation Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Generate Performance Report</DialogTitle>
            <DialogDescription>Select the sections you want to include in your PDF report.</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2 bg-[#0A0E1A] p-3 rounded border border-[#2D3548]">
              <Checkbox id="summary" defaultChecked className="border-[#2D3548]" />
              <Label htmlFor="summary" className="flex-1 cursor-pointer text-sm font-medium">Executive Summary</Label>
            </div>
            <div className="flex items-center space-x-2 bg-[#0A0E1A] p-3 rounded border border-[#2D3548]">
              <Checkbox id="kpis" defaultChecked className="border-[#2D3548]" />
              <Label htmlFor="kpis" className="flex-1 cursor-pointer text-sm font-medium">Global KPI Breakdown</Label>
            </div>
            <div className="flex items-center space-x-2 bg-[#0A0E1A] p-3 rounded border border-[#2D3548]">
              <Checkbox id="agents" defaultChecked className="border-[#2D3548]" />
              <Label htmlFor="agents" className="flex-1 cursor-pointer text-sm font-medium">Agent Performance Matrix</Label>
            </div>
            <div className="flex items-center space-x-2 bg-[#0A0E1A] p-3 rounded border border-[#2D3548]">
              <Checkbox id="campaigns" className="border-[#2D3548]" />
              <Label htmlFor="campaigns" className="flex-1 cursor-pointer text-sm font-medium">Individual Campaign Details</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowReportModal(false)} className="hover:bg-[#2D3548] hover:text-white">Cancel</Button>
            <Button onClick={handleGenerateReport} className="bg-primary hover:bg-primary/90 text-white">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Agent Detail Modal */}
      <Dialog open={!!selectedAgentType} onOpenChange={(open) => !open && setSelectedAgentType(null)}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle>{selectedAgentType} Agent Performance</DialogTitle>
                <DialogDescription>Detailed metrics for the last 30 days</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedAgentType && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#0A0E1A] p-3 rounded border border-[#2D3548] text-center">
                  <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                  <div className="text-xl font-bold text-white">
                    {AGENT_PERFORMANCE.find(a => a.type === selectedAgentType)?.success}%
                  </div>
                </div>
                <div className="bg-[#0A0E1A] p-3 rounded border border-[#2D3548] text-center">
                  <div className="text-xs text-muted-foreground mb-1">Avg Latency</div>
                  <div className="text-xl font-bold text-white">
                    {AGENT_PERFORMANCE.find(a => a.type === selectedAgentType)?.response}ms
                  </div>
                </div>
                <div className="bg-[#0A0E1A] p-3 rounded border border-[#2D3548] text-center">
                  <div className="text-xs text-muted-foreground mb-1">Trust Trend</div>
                  <div className="text-xl font-bold text-emerald-500">
                    +{AGENT_PERFORMANCE.find(a => a.type === selectedAgentType)?.trend}
                  </div>
                </div>
              </div>
              
              <div className="bg-[#0A0E1A] p-4 rounded border border-[#2D3548] h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                [Detailed Performance Chart Placeholder]
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
