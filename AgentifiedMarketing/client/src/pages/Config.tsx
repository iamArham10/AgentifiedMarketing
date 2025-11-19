import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Globe, 
  Palette, 
  Shield, 
  Plus, 
  MoreHorizontal, 
  Power, 
  Trash2, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Download, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  Facebook,
  Twitter,
  Linkedin,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// --- Mock Data ---

const INITIAL_AGENTS = [
  { id: "copywriter_05", type: "Copywriter", status: "online", trust: 91, uptime: 99.2 },
  { id: "designer_09", type: "Designer", status: "online", trust: 88, uptime: 98.7 },
  { id: "critic_02", type: "Critic", status: "offline", trust: 89, uptime: 95.1 },
  { id: "strategist_01", type: "Strategist", status: "online", trust: 94, uptime: 99.5 },
  { id: "targeting_03", type: "Targeting", status: "online", trust: 87, uptime: 97.8 },
];

const INITIAL_FILES = [
  { id: 1, name: "Brand_Guide_2025.pdf", size: "4.2 MB", type: "pdf" },
  { id: 2, name: "Logo_Assets.zip", size: "12.8 MB", type: "zip" },
];

const INITIAL_GUIDELINES = {
  tone: "Professional yet approachable",
  prohibited: ["Cheap", "Discount", "Limited time", "Hurry"],
  colors: ["#3B82F6", "#10B981", "#1A2032"]
};

export default function Config() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("agents");
  
  // Tab 1: Agents
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgentType, setNewAgentType] = useState("Copywriter");

  // Tab 2: Integrations
  const [integrations, setIntegrations] = useState({
    meta: { status: "connected", limit: 450, max: 500 },
    twitter: { status: "connected", limit: 230, max: 500 },
    linkedin: { status: "disconnected", limit: 0, max: 500 }
  });
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // Tab 3: Brand
  const [files, setFiles] = useState(INITIAL_FILES);
  const [isExtracting, setIsExtracting] = useState(false);
  const [guidelines, setGuidelines] = useState(INITIAL_GUIDELINES);
  const [guidelinesExtracted, setGuidelinesExtracted] = useState(false);

  // Tab 4: Trust
  const [trustSettings, setTrustSettings] = useState({
    initialScore: 50,
    decayRate: 5,
    reputationWeight: 75
  });
  const [showResetModal, setShowResetModal] = useState(false);

  // --- Handlers ---

  const handleAddAgent = () => {
    setShowAddAgentModal(false);
    const newId = `${newAgentType.toLowerCase()}_${Math.floor(Math.random() * 90 + 10)}`;
    const newAgent = {
      id: newId,
      type: newAgentType,
      status: "online",
      trust: 50,
      uptime: 100
    };
    setAgents([...agents, newAgent]);
    toast({
      title: "Agent Created",
      description: `✅ ${newAgentType} Agent #${newId.split('_')[1]} created successfully`,
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleConnect = (platform: string) => {
    setIsConnecting(platform);
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [platform]: { ...prev[platform as keyof typeof prev], status: "connected", limit: 10, max: 500 }
      }));
      setIsConnecting(null);
      toast({
        title: "Integration Connected",
        description: `✅ ${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully`,
        className: "bg-emerald-500/10 border-emerald-500/20 text-white"
      });
    }, 2000);
  };

  const handleExtractGuidelines = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setGuidelinesExtracted(true);
      toast({
        title: "Extraction Complete",
        description: "Brand guidelines extracted from PDF successfully.",
        className: "bg-blue-500/10 border-blue-500/20 text-white"
      });
    }, 3000);
  };

  const handleSaveTrustSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Trust and reputation settings have been updated.",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleResetScores = () => {
    setShowResetModal(false);
    setAgents(prev => prev.map(a => ({ ...a, trust: 50 })));
    toast({
      title: "Scores Reset",
      description: "All agent trust scores have been reset to default.",
      className: "bg-amber-500/10 border-amber-500/20 text-white"
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-white">System Configuration</h1>
        <p className="text-muted-foreground">Manage agent pools, API integrations, and system-wide settings.</p>
      </div>

      <Tabs defaultValue="agents" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-[#131825] border border-[#2D3548] p-1 h-auto w-full justify-start">
          <TabsTrigger value="agents" className="py-2 px-4 data-[state=active]:bg-[#1A2032] data-[state=active]:text-white flex gap-2">
            <Users className="w-4 h-4" /> Agent Pool
          </TabsTrigger>
          <TabsTrigger value="integrations" className="py-2 px-4 data-[state=active]:bg-[#1A2032] data-[state=active]:text-white flex gap-2">
            <Globe className="w-4 h-4" /> API Integrations
          </TabsTrigger>
          <TabsTrigger value="brand" className="py-2 px-4 data-[state=active]:bg-[#1A2032] data-[state=active]:text-white flex gap-2">
            <Palette className="w-4 h-4" /> Brand Guidelines
          </TabsTrigger>
          <TabsTrigger value="trust" className="py-2 px-4 data-[state=active]:bg-[#1A2032] data-[state=active]:text-white flex gap-2">
            <Shield className="w-4 h-4" /> Trust Settings
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: AGENT POOL */}
        <TabsContent value="agents" className="space-y-6">
          <Card className="bg-[#1A2032] border border-[#2D3548] overflow-hidden">
            <div className="p-6 border-b border-[#2D3548] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Active Agents</h3>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowAddAgentModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Add New Agent
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs text-muted-foreground uppercase tracking-wider bg-[#131825] border-b border-[#2D3548]">
                    <th className="px-6 py-3 font-medium">Agent ID</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Trust Score</th>
                    <th className="px-6 py-3 font-medium">Uptime</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D3548]">
                  {agents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-[#131825] transition-colors">
                      <td className="px-6 py-4 font-mono text-white">{agent.id}</td>
                      <td className="px-6 py-4 text-gray-300">{agent.type}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className={`border-0 ${agent.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                        >
                          {agent.status === 'online' ? '🟢 Online' : '🔴 Offline'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 w-[200px]">
                        <div className="flex items-center gap-3">
                          <span className="text-white w-8">{agent.trust}</span>
                          <Progress value={agent.trust} className={`h-1.5 flex-1 bg-[#0A0E1A] ${agent.trust > 90 ? '[&>div]:bg-emerald-500' : agent.trust > 70 ? '[&>div]:bg-blue-500' : '[&>div]:bg-amber-500'}`} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{agent.uptime}%</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            {agent.status === 'online' ? <Power className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 2: API INTEGRATIONS */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meta */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#1877F2]/10 rounded-lg border border-[#1877F2]/20">
                  <Facebook className="w-8 h-8 text-[#1877F2]" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-0 ${integrations.meta.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                >
                  {integrations.meta.status === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Meta Marketing API</h3>
                  <p className="text-xs text-muted-foreground">Last sync: 2 mins ago</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rate Limit Usage</span>
                    <span className="text-amber-500 font-medium">{integrations.meta.limit}/{integrations.meta.max}</span>
                  </div>
                  <Progress value={(integrations.meta.limit / integrations.meta.max) * 100} className="h-2 bg-[#0A0E1A] [&>div]:bg-amber-500" />
                </div>
                
                <div className="flex gap-2 pt-2">
                  {integrations.meta.status === 'connected' ? (
                    <>
                       <Button variant="outline" className="flex-1 border-[#2D3548] hover:bg-[#0A0E1A] text-white">Test</Button>
                       <Button variant="outline" className="flex-1 border-[#2D3548] hover:bg-[#0A0E1A] text-white">Reconnect</Button>
                    </>
                  ) : (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleConnect('meta')}>
                      Connect with OAuth
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Twitter */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#1DA1F2]/10 rounded-lg border border-[#1DA1F2]/20">
                  <Twitter className="w-8 h-8 text-[#1DA1F2]" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-0 ${integrations.twitter.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                >
                  {integrations.twitter.status === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Twitter Ads API</h3>
                  <p className="text-xs text-muted-foreground">Last sync: 5 mins ago</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rate Limit Usage</span>
                    <span className="text-emerald-500 font-medium">{integrations.twitter.limit}/{integrations.twitter.max}</span>
                  </div>
                  <Progress value={(integrations.twitter.limit / integrations.twitter.max) * 100} className="h-2 bg-[#0A0E1A] [&>div]:bg-emerald-500" />
                </div>
                
                <div className="flex gap-2 pt-2">
                   {integrations.twitter.status === 'connected' ? (
                    <>
                       <Button variant="outline" className="flex-1 border-[#2D3548] hover:bg-[#0A0E1A] text-white">Test</Button>
                       <Button variant="outline" className="flex-1 border-[#2D3548] hover:bg-[#0A0E1A] text-white">Reconnect</Button>
                    </>
                  ) : (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleConnect('twitter')}>
                      Connect with OAuth
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* LinkedIn */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6 space-y-6 opacity-80 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-[#0077B5]/10 rounded-lg border border-[#0077B5]/20">
                  <Linkedin className="w-8 h-8 text-[#0077B5]" />
                </div>
                <Badge 
                  variant="outline" 
                  className={`border-0 ${integrations.linkedin.status === 'connected' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                >
                  {integrations.linkedin.status === 'connected' ? '🟢 Connected' : '🔴 Disconnected'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white">LinkedIn Ads</h3>
                  <p className="text-xs text-muted-foreground">Not connected</p>
                </div>
                
                <div className="space-y-2 opacity-50">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rate Limit Usage</span>
                    <span className="text-gray-500 font-medium">0/500</span>
                  </div>
                  <Progress value={0} className="h-2 bg-[#0A0E1A]" />
                </div>
                
                <div className="pt-2">
                  {isConnecting === 'linkedin' ? (
                    <Button disabled className="w-full bg-blue-600/50 text-white">
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Connecting...
                    </Button>
                  ) : integrations.linkedin.status === 'connected' ? (
                     <Button variant="outline" className="w-full border-[#2D3548] hover:bg-[#0A0E1A] text-white">Manage</Button>
                  ) : (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleConnect('linkedin')}>
                      Connect with OAuth
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: BRAND GUIDELINES */}
        <TabsContent value="brand" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Upload & List */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-[#1A2032] border border-[#2D3548] border-dashed p-8 flex flex-col items-center justify-center text-center hover:bg-[#1A2032]/80 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#0A0E1A] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-sm font-medium text-white">Upload Guidelines</h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">Drag & drop PDF, DOCX, or ZIP</p>
                <Button variant="outline" size="sm" className="border-[#2D3548] text-white hover:bg-[#0A0E1A]">Browse Files</Button>
              </Card>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider px-1">Uploaded Files</h3>
                {files.map(file => (
                  <Card key={file.id} className="bg-[#1A2032] border border-[#2D3548] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-[#0A0E1A] rounded border border-[#2D3548]">
                          <FileText className="w-5 h-5 text-blue-400" />
                       </div>
                       <div>
                          <div className="text-sm font-medium text-white">{file.name}</div>
                          <div className="text-xs text-muted-foreground">{file.size}</div>
                       </div>
                    </div>
                    <div className="flex gap-1">
                       {file.type === 'pdf' && (
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-muted-foreground hover:text-white"
                           onClick={handleExtractGuidelines}
                           disabled={isExtracting}
                          >
                           {isExtracting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                         </Button>
                       )}
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white">
                          <Download className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Extracted Data */}
            <div className="lg:col-span-2">
              <Card className="bg-[#1A2032] border border-[#2D3548] h-full flex flex-col">
                <div className="p-6 border-b border-[#2D3548] flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-blue-500" />
                      <h3 className="text-lg font-semibold text-white">Extracted Guidelines</h3>
                   </div>
                   {guidelinesExtracted && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Active</Badge>}
                </div>
                
                {isExtracting ? (
                   <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                      <h3 className="text-lg font-medium text-white">Extracting Guidelines with NLP...</h3>
                      <p className="text-muted-foreground">Analyzing document structure and brand voice.</p>
                   </div>
                ) : (
                   <div className="p-6 space-y-6 flex-1">
                      <div className="space-y-2">
                         <Label className="text-white">Brand Tone</Label>
                         <Input 
                           className="bg-[#0A0E1A] border-[#2D3548] text-white" 
                           defaultValue={guidelines.tone} 
                         />
                      </div>

                      <div className="space-y-2">
                         <Label className="text-white">Prohibited Words</Label>
                         <div className="bg-[#0A0E1A] border border-[#2D3548] rounded-md p-2 flex flex-wrap gap-2 min-h-[42px]">
                            {guidelines.prohibited.map(word => (
                               <Badge key={word} variant="secondary" className="bg-[#1A2032] text-white hover:bg-[#1A2032] border border-[#2D3548] flex gap-1 pr-1">
                                  {word} <X className="w-3 h-3 cursor-pointer hover:text-red-400" />
                               </Badge>
                            ))}
                            <input className="bg-transparent border-none outline-none text-sm text-white w-24 placeholder:text-muted-foreground" placeholder="+ Add" />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label className="text-white">Color Palette</Label>
                         <div className="flex gap-3">
                            {guidelines.colors.map((color, i) => (
                               <div key={i} className="group relative">
                                  <div className="w-12 h-12 rounded-lg border border-white/10 cursor-pointer" style={{ backgroundColor: color }}></div>
                                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 whitespace-nowrap bg-[#0A0E1A] px-1 rounded border border-[#2D3548]">
                                     {color}
                                  </div>
                               </div>
                            ))}
                            <div className="w-12 h-12 rounded-lg border border-[#2D3548] border-dashed flex items-center justify-center cursor-pointer hover:border-white/30 hover:text-white text-muted-foreground transition-colors">
                               <Plus className="w-5 h-5" />
                            </div>
                         </div>
                      </div>
                   </div>
                )}
                
                <div className="p-6 border-t border-[#2D3548] bg-[#131825] flex justify-end">
                   <Button className="bg-primary hover:bg-primary/90 text-white" disabled={isExtracting}>
                      <Save className="w-4 h-4 mr-2" /> Save Guidelines
                   </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: TRUST SETTINGS */}
        <TabsContent value="trust" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                 <Card className="bg-[#1A2032] border border-[#2D3548] p-8 space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div className="space-y-1">
                             <Label className="text-base text-white font-semibold">Initial Trust Score</Label>
                             <p className="text-sm text-muted-foreground">Starting score for newly instantiated agents.</p>
                          </div>
                          <span className="font-mono text-xl text-primary font-bold">{trustSettings.initialScore}/100</span>
                       </div>
                       <Slider 
                          defaultValue={[trustSettings.initialScore]} 
                          max={100} 
                          step={1} 
                          className="py-2"
                          onValueChange={(val) => setTrustSettings({...trustSettings, initialScore: val[0]})}
                        />
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div className="space-y-1">
                             <Label className="text-base text-white font-semibold">Trust Decay Rate</Label>
                             <p className="text-sm text-muted-foreground">Penalty points applied per failed task verification.</p>
                          </div>
                          <span className="font-mono text-xl text-amber-500 font-bold">{trustSettings.decayRate} pts</span>
                       </div>
                       <Slider 
                          defaultValue={[trustSettings.decayRate]} 
                          max={20} 
                          step={1} 
                          className="py-2 [&>.range]:bg-amber-500"
                          onValueChange={(val) => setTrustSettings({...trustSettings, decayRate: val[0]})}
                        />
                    </div>

                    <Separator className="bg-[#2D3548]" />

                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <div className="space-y-1">
                             <Label className="text-base text-white font-semibold">Reputation Weight</Label>
                             <p className="text-sm text-muted-foreground">Influence of trust score on consensus voting power.</p>
                          </div>
                          <span className="font-mono text-xl text-purple-500 font-bold">{trustSettings.reputationWeight}%</span>
                       </div>
                       <Slider 
                          defaultValue={[trustSettings.reputationWeight]} 
                          max={100} 
                          step={1} 
                          className="py-2 [&>.range]:bg-purple-500"
                          onValueChange={(val) => setTrustSettings({...trustSettings, reputationWeight: val[0]})}
                        />
                    </div>
                 </Card>

                 <div className="flex justify-between items-center">
                    <Button variant="outline" className="border-[#2D3548] text-muted-foreground hover:text-white hover:bg-[#1A2032]">
                       <RotateCcw className="w-4 h-4 mr-2" /> Reset to Defaults
                    </Button>
                    <div className="flex gap-4">
                       <Button 
                          variant="destructive" 
                          className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
                          onClick={() => setShowResetModal(true)}
                       >
                          Reset All Scores
                       </Button>
                       <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleSaveTrustSettings}>
                          Save Changes
                       </Button>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-1">
                 <Card className="bg-[#1A2032] border border-[#2D3548] p-6 sticky top-6">
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                       <AlertCircle className="w-5 h-5" />
                       <h3 className="font-semibold">About Trust Scores</h3>
                    </div>
                    <div className="space-y-4 text-sm text-gray-400 leading-relaxed">
                       <p>
                          Trust scores determine an agent's autonomy level. Agents with scores <strong>below 70</strong> require human approval for all actions.
                       </p>
                       <p>
                          Scores <strong>above 90</strong> grant "Autonomous" status, allowing instant deployment to low-risk channels.
                       </p>
                       <div className="bg-[#0A0E1A] p-3 rounded border border-[#2D3548] mt-4">
                          <div className="text-xs uppercase text-muted-foreground mb-2">Current Network Health</div>
                          <div className="flex justify-between items-center">
                             <span className="text-white">Avg Trust</span>
                             <span className="text-emerald-500 font-mono font-bold">89/100</span>
                          </div>
                       </div>
                    </div>
                 </Card>
              </div>
           </div>
        </TabsContent>
      </Tabs>

      {/* --- MODALS --- */}
      
      {/* Add Agent Modal */}
      <Dialog open={showAddAgentModal} onOpenChange={setShowAddAgentModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Instantiate New Agent</DialogTitle>
            <DialogDescription>Configure the parameters for the new autonomous agent.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
               <Label>Agent Role</Label>
               <Select onValueChange={setNewAgentType} defaultValue="Copywriter">
                  <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                     <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                     <SelectItem value="Copywriter">Copywriter (Creator)</SelectItem>
                     <SelectItem value="Designer">Designer (Creator)</SelectItem>
                     <SelectItem value="Critic">Critic (Quality)</SelectItem>
                     <SelectItem value="Strategist">Strategist (Optimization)</SelectItem>
                     <SelectItem value="Deployment">Deployment (Ops)</SelectItem>
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <Label>Initial Trust Score</Label>
               <Input type="number" defaultValue={50} className="bg-[#0A0E1A] border-[#2D3548] text-white" />
            </div>
            <div className="space-y-2">
               <Label>Layer Assignment</Label>
               <Select defaultValue="Creator">
                  <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                     <SelectValue placeholder="Select layer" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                     <SelectItem value="Creator">Creator Layer</SelectItem>
                     <SelectItem value="Critic">Critic Layer</SelectItem>
                     <SelectItem value="Strategist">Strategist Layer</SelectItem>
                     <SelectItem value="Support">Support Layer</SelectItem>
                  </SelectContent>
               </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddAgentModal(false)} className="hover:bg-[#2D3548] hover:text-white">Cancel</Button>
            <Button onClick={handleAddAgent} className="bg-blue-600 hover:bg-blue-700 text-white">Create Agent</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Modal */}
      <Dialog open={showResetModal} onOpenChange={setShowResetModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white sm:max-w-[425px]">
           <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                 <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-xl font-bold">Reset All Trust Scores?</h2>
              <p className="text-muted-foreground">
                 This action cannot be undone. All agents will revert to the default trust score of 50/100 and will require re-verification.
              </p>
              <div className="flex gap-3 w-full pt-4">
                 <Button variant="ghost" className="flex-1 hover:bg-[#2D3548] hover:text-white" onClick={() => setShowResetModal(false)}>Cancel</Button>
                 <Button variant="destructive" className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleResetScores}>Confirm Reset</Button>
              </div>
           </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
