import React, { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Calendar,
  DollarSign,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  MousePointer2,
  Target,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import sneakerAdImage from "@assets/generated_images/Sneaker_advertisement_social_media_graphic_f4243563.png";

// --- Mock Data ---

const METRICS = [
  { id: 'imp', label: 'Impressions', value: 12847, change: 847, trend: 'up' },
  { id: 'clk', label: 'Clicks', value: 412, change: 34, trend: 'up' },
  { id: 'ctr', label: 'CTR', value: 3.21, change: 0.2, trend: 'up', suffix: '%' },
  { id: 'cnv', label: 'Conversions', value: 18, change: 3, trend: 'up' },
];

const CTR_DATA = [
  { time: '15:52', ctr: 2.1 },
  { time: '15:54', ctr: 2.4 },
  { time: '15:56', ctr: 2.3 },
  { time: '15:58', ctr: 2.8 },
  { time: '16:00', ctr: 2.9 },
  { time: '16:02', ctr: 3.1 },
  { time: '16:04', ctr: 3.15 },
  { time: '16:06', ctr: 3.18 },
  { time: '16:08', ctr: 3.21 },
];

const PLATFORM_DATA = [
  { name: 'Meta', ctr: 3.42, spend: 1247, color: '#3B82F6' },
  { name: 'Twitter', ctr: 2.89, spend: 831, color: '#0EA5E9' },
];

const TIMELINE_EVENTS = [
  { id: 1, time: '16:08', agent: 'Analytics Agent #4', type: 'info', title: 'Updated CTR projection → 3.9% (↑ from 3.8%)', reason: 'First 15 minutes showing stronger engagement than historical baseline.' },
  { id: 2, time: '16:02', agent: 'Deployment Agent #6', type: 'success', title: 'Twitter campaign metrics synced', reason: 'API handshake successful. Data stream active.' },
  { id: 3, time: '15:57', agent: 'Analytics Agent #4', type: 'success', title: 'First conversion detected! 🎉', reason: 'User flow: Twitter Ad > Landing Page > Checkout.' },
  { id: 4, time: '15:52', agent: 'Deployment Agent #6', type: 'info', title: 'Campaign published successfully', reason: 'All 3 variants pushed to Meta and Twitter ad managers.' },
  { id: 5, time: '15:51', agent: 'Approval System', type: 'warning', title: 'Human approval received (sarah@brand.com)', reason: 'Manual override of Critic Agent #2 concern.' },
];

const ASSETS = [
  { id: 1, title: 'Variant A - "Walk the Change"', status: 'approved', score: 94, ctr: 3.94, votes: '2/3', copy: 'Walk the change you want to see. Sustainable comfort for the modern soul. #EcoSteps' },
  { id: 2, title: 'Variant B - "Future Footprint"', status: 'rejected', score: 72, votes: '0/3', copy: 'Your footprint matters. Make it green. The future is now.' },
  { id: 3, title: 'Variant C - "Earth First"', status: 'review', score: 88, votes: '1/3', copy: 'Earth first. Style always. Don\'t compromise on either.' },
];

// --- Components ---

const Counter = ({ value, suffix = '' }: { value: number, suffix?: string }) => {
    // Simple visual counter effect could be done with more complex hooks, 
    // but for prototype React key change is enough to trigger simple animations
    return (
        <span className="tabular-nums tracking-tight">
            {value.toLocaleString()}{suffix}
        </span>
    );
};

export default function CampaignMonitoring() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("performance");
  const [metrics, setMetrics] = useState(METRICS);
  const [chartData, setChartData] = useState(CTR_DATA);
  const [selectedAsset, setSelectedAsset] = useState<typeof ASSETS[0] | null>(null);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // Simulate Real-time Updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Metrics
      setMetrics(prev => prev.map(m => ({
        ...m,
        value: m.id === 'ctr' ? +(m.value + (Math.random() * 0.05 - 0.02)).toFixed(2) : Math.floor(m.value + Math.random() * 5),
        change: Math.floor(m.change + Math.random() * 2)
      })));

      // Update Chart
      setChartData(prev => {
        const lastTime = prev[prev.length - 1].time;
        const [hours, minutes] = lastTime.split(':').map(Number);
        const newDate = new Date();
        newDate.setHours(hours, minutes + 2);
        const newTime = `${newDate.getHours()}:${newDate.getMinutes().toString().padStart(2, '0')}`;
        
        const newPoint = {
            time: newTime,
            ctr: +(prev[prev.length - 1].ctr + (Math.random() * 0.1 - 0.03)).toFixed(2)
        };
        
        return [...prev.slice(1), newPoint];
      });
    }, 5000); // 5 seconds for demo purposes (spec said 10s)

    return () => clearInterval(interval);
  }, []);

  const handleExport = () => {
    toast({
      title: "Exporting Report",
      description: "Generating PDF with latest analytics...",
    });
    setTimeout(() => {
        toast({
            title: "Export Complete",
            description: "Report downloaded: CM-2847_Report.pdf",
            className: "bg-emerald-500/10 border-emerald-500/20 text-white"
        });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* --- Hero Section --- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-semibold text-white">Q4 Sustainable Sneaker Launch</h1>
                    <span className="text-muted-foreground font-mono text-lg">#CM-2847</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2.5 py-0.5 h-6 animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                        LIVE
                    </Badge>
                    <div className="h-4 w-[1px] bg-border" />
                    <div className="flex items-center gap-2">
                        <div className="p-1 bg-[#1A2032] rounded border border-[#2D3548] text-blue-400"><Facebook className="w-3 h-3" /></div>
                        <div className="p-1 bg-[#1A2032] rounded border border-[#2D3548] text-sky-400"><Twitter className="w-3 h-3" /></div>
                    </div>
                    <div className="h-4 w-[1px] bg-border" />
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Started: Nov 19, 15:52</span>
                        <span className="text-[#2D3548]">|</span>
                        <span>Ends: Nov 30, 23:59</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Budget</div>
                    <div className="text-xl font-mono font-medium text-white">$5,000 <span className="text-sm text-muted-foreground">($3.2K left)</span></div>
                </div>
                <Button variant="outline" className="border-[#2D3548] hover:bg-[#1A2032] text-muted-foreground hover:text-white" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" /> Export Report
                </Button>
            </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric) => (
                <Card key={metric.id} className="bg-[#1A2032] border border-[#2D3548] p-5">
                    <div className="flex justify-between items-start">
                        <div className="text-sm text-muted-foreground font-medium">{metric.label}</div>
                        <div className="text-[10px] font-medium text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded flex items-center">
                            <ArrowUpRight className="w-3 h-3 mr-1" /> {metric.change} (5m)
                        </div>
                    </div>
                    <div className="mt-2 text-3xl font-bold text-white">
                        <Counter value={metric.value} suffix={metric.suffix} />
                    </div>
                </Card>
            ))}
        </div>
      </div>

      {/* --- Tabs Interface --- */}
      <Tabs defaultValue="performance" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-[#131825] border border-[#2D3548] p-1 h-auto">
            <TabsTrigger value="performance" className="data-[state=active]:bg-[#1A2032] data-[state=active]:text-white py-2 px-4">Performance</TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-[#1A2032] data-[state=active]:text-white py-2 px-4">Agent Activity</TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-[#1A2032] data-[state=active]:text-white py-2 px-4">Creative Assets</TabsTrigger>
        </TabsList>

        {/* TAB 1: PERFORMANCE */}
        <TabsContent value="performance" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <Card className="lg:col-span-2 bg-[#1A2032] border border-[#2D3548] p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">CTR Over Time</h3>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Real-time</Badge>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3548" vertical={false} />
                                <XAxis dataKey="time" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#0A0E1A', borderColor: '#2D3548', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line type="monotone" dataKey="ctr" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6', strokeWidth: 2, stroke: '#0A0E1A' }} activeDot={{ r: 6, fill: '#fff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Side Stats */}
                <div className="space-y-6">
                    <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Platform Breakdown</h3>
                        <div className="space-y-6">
                            {PLATFORM_DATA.map((platform) => (
                                <div key={platform.name} className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-white">
                                        <span>{platform.name}</span>
                                        <span>{platform.ctr}% CTR</span>
                                    </div>
                                    <div className="h-2 bg-[#0A0E1A] rounded-full overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${(platform.ctr / 4) * 100}%`, backgroundColor: platform.color }}></div>
                                    </div>
                                    <div className="text-xs text-muted-foreground text-right">${platform.spend} spent</div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">Goal Progress</h3>
                        <div className="flex justify-center gap-8">
                            {/* Circular Progress 1 */}
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="#0A0E1A" strokeWidth="8" fill="transparent" />
                                    <circle cx="48" cy="48" r="40" stroke="#3B82F6" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.12)} strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-center">
                                    <div className="text-xl font-bold text-white">12%</div>
                                </div>
                                <div className="absolute -bottom-8 w-32 text-center text-xs font-medium text-muted-foreground">Traffic Goal</div>
                            </div>
                             {/* Circular Progress 2 */}
                             <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="#0A0E1A" strokeWidth="8" fill="transparent" />
                                    <circle cx="48" cy="48" r="40" stroke="#10B981" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - 0.036)} strokeLinecap="round" />
                                </svg>
                                <div className="absolute text-center">
                                    <div className="text-xl font-bold text-white">3.6%</div>
                                </div>
                                <div className="absolute -bottom-8 w-32 text-center text-xs font-medium text-muted-foreground">Email Signups</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>

        {/* TAB 2: TIMELINE */}
        <TabsContent value="timeline" className="animate-in slide-in-from-bottom-2 duration-300">
            <Card className="bg-[#1A2032] border border-[#2D3548] p-8 max-w-3xl mx-auto">
                <div className="relative border-l border-[#2D3548] space-y-8 ml-3">
                    {TIMELINE_EVENTS.map((event, index) => (
                        <div key={event.id} className="relative pl-8">
                            {/* Dot on timeline */}
                            <div className={`
                                absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full border-2 border-[#1A2032]
                                ${event.type === 'info' ? 'bg-blue-500' : ''}
                                ${event.type === 'success' ? 'bg-emerald-500' : ''}
                                ${event.type === 'warning' ? 'bg-amber-500' : ''}
                            `}></div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                                <div className="font-mono text-sm text-muted-foreground min-w-[60px] pt-1">{event.time}</div>
                                
                                <div className="flex-1 group cursor-pointer" onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}>
                                    <div className="bg-[#0A0E1A] border border-[#2D3548] rounded-lg p-4 hover:border-primary/50 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="bg-[#131825] border-[#2D3548] text-xs">
                                                    {event.agent}
                                                </Badge>
                                                <h4 className="text-sm font-medium text-white">{event.title}</h4>
                                            </div>
                                            {expandedEvent === event.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </div>
                                        
                                        <p className="text-sm text-muted-foreground">{event.reason}</p>
                                        
                                        <AnimatePresence>
                                            {expandedEvent === event.id && (
                                                <motion.div 
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t border-[#2D3548] text-xs space-y-2">
                                                        <div className="bg-[#131825] p-3 rounded font-mono text-blue-300">
                                                            {`{ "event_id": "evt_${event.id}", "latency": "42ms", "verification": true }`}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <Button variant="link" className="text-primary h-auto p-0 text-xs">View Full Message Chain →</Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </TabsContent>

        {/* TAB 3: ASSETS */}
        <TabsContent value="assets" className="animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ASSETS.map((asset) => (
                    <Card 
                        key={asset.id} 
                        className="bg-[#1A2032] border border-[#2D3548] overflow-hidden group cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1"
                        onClick={() => setSelectedAsset(asset)}
                    >
                        <div className="h-48 bg-[#0A0E1A] relative overflow-hidden">
                            {/* Using generated image or placeholder */}
                            <img src={sneakerAdImage} alt="Ad Creative" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-3 right-3">
                                {asset.status === 'approved' && <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">✓ Approved</Badge>}
                                {asset.status === 'review' && <Badge className="bg-amber-500 text-white hover:bg-amber-600">⚠️ Needs Review</Badge>}
                                {asset.status === 'rejected' && <Badge className="bg-red-500 text-white hover:bg-red-600">✗ Rejected</Badge>}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium text-white truncate">{asset.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">"{asset.copy}"</p>
                            
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2D3548]">
                                <div className="text-xs text-muted-foreground">
                                    Score: <span className={asset.score > 90 ? "text-emerald-400" : "text-amber-400"}>{asset.score}/100</span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:text-white p-0">Details</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </TabsContent>
      </Tabs>

      {/* Asset Detail Modal */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] max-w-2xl">
            {selectedAsset && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                         <div className="rounded-lg overflow-hidden border border-[#2D3548]">
                            <img src={sneakerAdImage} alt="Ad Creative" className="w-full h-auto object-cover" />
                         </div>
                         <div className="mt-4 bg-[#0A0E1A] p-3 rounded border border-[#2D3548]">
                            <p className="text-sm text-white italic">"{selectedAsset.copy}"</p>
                         </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-white">{selectedAsset.title}</h2>
                            <Badge className={`mt-2 ${
                                selectedAsset.status === 'approved' ? 'bg-emerald-500' : 
                                selectedAsset.status === 'review' ? 'bg-amber-500' : 'bg-red-500'
                            }`}>
                                {selectedAsset.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-[#0A0E1A] p-4 rounded-lg border border-[#2D3548] space-y-3">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Critic Evaluation</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white">Quality Score</span>
                                    <span className="font-mono text-emerald-400">{selectedAsset.score}/100</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white">Brand Alignment</span>
                                    <span className="font-mono text-emerald-400">92%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white">Predicted CTR</span>
                                    <span className="font-mono text-blue-400">3.8%</span>
                                </div>
                            </div>

                            <div className="bg-[#0A0E1A] p-4 rounded-lg border border-[#2D3548] space-y-3">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase">Strategist Consensus</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-white">Votes</span>
                                    <span className="font-mono text-white">{selectedAsset.votes}</span>
                                </div>
                            </div>

                             {selectedAsset.status === 'approved' && (
                                <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/20">
                                    <h4 className="text-xs font-semibold text-emerald-500 uppercase mb-2">Live Performance</h4>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-white">Actual CTR</span>
                                        <span className="font-mono text-xl font-bold text-white">{selectedAsset.ctr}%</span>
                                    </div>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
