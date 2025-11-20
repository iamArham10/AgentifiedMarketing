import React from "react";
import { useLocation } from "wouter";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Plus,
  MoreHorizontal,
  TrendingUp,
  Target,
  Heart
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data
const activeCampaigns = [
  { id: 1, name: "Fall Promo", status: "Live", platforms: ["meta", "twitter"], color: "bg-emerald-500", goal: { type: 'traffic', progress: 67 } },
  { id: 2, name: "Summer Sale", status: "In Review", platforms: ["meta"], color: "bg-amber-500", goal: { type: 'conversions', progress: 42 } },
  { id: 3, name: "Holiday Launch", status: "Drafting", platforms: ["linkedin", "twitter"], color: "bg-blue-500", goal: { type: 'awareness', progress: 89 } },
];

const kpis = [
  { label: "Campaign Cycle Time", value: "2.3 hrs", change: "4.2 hrs", trend: "down", color: "text-emerald-500" },
  { label: "Brand Alignment", value: "92%", change: "2%", trend: "up", color: "text-emerald-500" },
  { label: "Consensus Rate", value: "87%", change: "3%", trend: "up", color: "text-emerald-500" },
  { label: "CTR Improvement", value: "+18%", change: "5%", trend: "up", color: "text-emerald-500" },
];

export default function Dashboard() {
  const [_, setLocation] = useLocation();

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
        <div className="col-span-12 lg:col-span-6 space-y-6">
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

                {/* Goal Progress Section */}
                <div className="pt-3 border-t border-[#2D3548] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {campaign.goal.type === 'traffic' && <TrendingUp className="w-3.5 h-3.5" />}
                      {campaign.goal.type === 'conversions' && <Target className="w-3.5 h-3.5" />}
                      {campaign.goal.type === 'awareness' && <Heart className="w-3.5 h-3.5" />}
                      <span className="capitalize">{campaign.goal.type} Goal</span>
                    </div>
                    <span 
                      className={`font-bold ${
                        campaign.goal.progress >= 75 ? 'text-emerald-500' :
                        campaign.goal.progress >= 50 ? 'text-blue-500' :
                        campaign.goal.progress >= 25 ? 'text-amber-500' :
                        'text-red-500'
                      }`}
                    >
                      {campaign.goal.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#131825] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        campaign.goal.progress >= 75 ? 'bg-emerald-500' :
                        campaign.goal.progress >= 50 ? 'bg-blue-500' :
                        campaign.goal.progress >= 25 ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${campaign.goal.progress}%` }}
                    ></div>
                  </div>
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
        <div className="col-span-12 lg:col-span-6 space-y-6">
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

        {/* Right Column removed per requirements */}
      </div>
    </div>
  );
}
