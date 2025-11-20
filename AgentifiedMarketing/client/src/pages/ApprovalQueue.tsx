import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ArrowRight, 
  Facebook, 
  Twitter, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Bot,
  Target,
  Eye,
  ThumbsUp,
  MessageSquare,
  Shield,
  Zap,
  Filter,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import sneakerAdImage from "@assets/generated_images/Sneaker_advertisement_social_media_graphic_f4243563.png";

// --- Mock Data ---

const QUEUE_ITEMS = [
  {
    id: "CM-2847",
    title: "Q4 Sustainable Sneaker Launch",
    status: "pending",
    priority: "expedited",
    submittedAt: "15:51 (4 mins ago)",
    consensus: "3/3 Approved",
    confidence: 89.7,
    platforms: ["meta", "twitter"],
  }
];

const AGENT_RATIONALE = [
  {
    id: "copywriter",
    agent: "Copywriter Agent #5",
    role: "Creator",
    trust: 91,
    text: "Selected 'Walk the Change' variant based on Gen Z trend analysis indicating preference for action-oriented sustainability messaging. Tone calibrated to be inspiring but grounded.",
    status: "approved"
  },
  {
    id: "critic",
    agent: "Critic Agent #2",
    role: "Quality Assessor",
    trust: 89,
    text: "Brand alignment score 96%. Verified compliance with 'No Greenwashing' policy v2.4. Checked against negative sentiment lexicon - clean.",
    status: "approved"
  },
  {
    id: "strategist",
    agent: "Strategist Consensus Agent #1",
    role: "Strategy",
    trust: 94,
    text: "Variant A predicted to yield 3.5% CTR based on historical Q4 data for similar cohorts. Budget allocation optimized for morning peak.",
    status: "approved"
  },
  {
    id: "targeting",
    agent: "Targeting Agent #3",
    role: "Optimization",
    trust: 87,
    text: "Adjusted age range from 25-35 to 24-36 to capture late-Gen Z cusp. Added 'Engagement with eco-content' filter to improve relevance score.",
    status: "modified"
  }
];

export default function ApprovalQueue() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>("CM-2847");
  const [activeTab, setActiveTab] = useState("copy");
  
  // Modals state
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentStep, setDeploymentStep] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  // Revision state
  const [revisionText, setRevisionText] = useState("");

  const handleDeploy = () => {
    setIsDeploying(true);
    setDeploymentStep("Initializing deployment sequence...");
    
    // Simulate deployment steps
    const steps = [
      { p: 10, s: "Creating immutable audit log..." },
      { p: 30, s: "Authenticating with Meta Marketing API..." },
      { p: 50, s: "Authenticating with Twitter Ads API..." },
      { p: 70, s: "Uploading creative assets (1/2)..." },
      { p: 90, s: "Uploading creative assets (2/2)..." },
      { p: 100, s: "Verifying publication status..." }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        setIsDeploying(false);
        setIsDeployed(true);
        toast({
          title: "Campaign Live",
          description: "Campaign successfully published to all platforms.",
          className: "bg-emerald-500/10 border-emerald-500/20 text-white"
        });
        setTimeout(() => setLocation("/monitoring"), 2000);
      } else {
        setDeploymentProgress(steps[stepIndex].p);
        setDeploymentStep(steps[stepIndex].s);
        stepIndex++;
      }
    }, 800);
  };

  const handleRequestRevision = () => {
    setShowRevisionModal(false);
    toast({
      title: "Feedback Sent",
      description: "Feedback routed to Copywriter Agent #5 for revision.",
      className: "bg-amber-500/10 border-amber-500/20 text-white"
    });
    // In a real app, this would update the card status
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0A0E1A] overflow-hidden">
      {/* --- LEFT PANEL: QUEUE LIST --- */}
      <div className="w-[400px] border-r border-[#2D3548] flex flex-col bg-[#0A0E1A]">
        <div className="p-4 border-b border-[#2D3548] flex items-center justify-between bg-[#131825]">
          <h2 className="font-semibold text-white flex items-center gap-2">
            Pending Approvals <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/20">1</Badge>
          </h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {QUEUE_ITEMS.map((item) => (
              <Card 
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`
                  p-4 cursor-pointer transition-all border-l-4 hover:bg-[#1A2032] group
                  ${selectedId === item.id 
                    ? "bg-[#1A2032] border-[#2D3548] border-l-amber-500 shadow-lg" 
                    : "bg-[#0A0E1A] border-[#2D3548] border-l-transparent hover:border-l-amber-500/50"}
                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] px-1.5 py-0.5">
                    PRIORITY: {item.priority.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{item.submittedAt}</span>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <div className="text-xs font-mono text-muted-foreground mb-3">{item.id}</div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Bot className="w-3 h-3 text-blue-400" />
                    {item.consensus}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <Zap className="w-3 h-3 text-purple-400" />
                    Confidence: {item.confidence}%
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2D3548]/50">
                   <div className="flex gap-2">
                      {item.platforms.includes("meta") && <Facebook className="w-3 h-3 text-blue-400" />}
                      {item.platforms.includes("twitter") && <Twitter className="w-3 h-3 text-sky-400" />}
                   </div>
                   <span className="text-xs text-primary group-hover:underline flex items-center">
                      View Details <ArrowRight className="w-3 h-3 ml-1" />
                   </span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* --- RIGHT PANEL: REVIEW --- */}
      <div className="flex-1 flex flex-col bg-[#0A0E1A] overflow-hidden">
        {selectedId ? (
          <>
            {/* Campaign Summary Header */}
            <div className="p-6 border-b border-[#2D3548] bg-[#131825]">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">Q4 Sustainable Sneaker Launch</h1>
                  <p className="text-muted-foreground text-sm max-w-2xl">
                    Launch Q4 campaign for sustainable sneakers targeting eco-conscious millennials. 
                    Goal: 30% increase in website traffic.
                  </p>
                </div>
                <div className="flex gap-2">
                   <Badge variant="outline" className="border-[#2D3548] text-muted-foreground bg-[#0A0E1A]">
                      Budget: $5,000
                   </Badge>
                   <Badge variant="outline" className="border-[#2D3548] text-muted-foreground bg-[#0A0E1A]">
                      Nov 15 - 30
                   </Badge>
                </div>
              </div>
              
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-3">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <div>
                    <div className="text-sm font-medium text-amber-500">Automated Adjustments Applied</div>
                    <p className="text-xs text-amber-400/80 mt-1">
                       Targeting parameters were adjusted by consensus (age range 24-36, added engagement filter).
                       <span className="underline cursor-pointer ml-1 hover:text-white">View Reasoning →</span>
                    </p>
                 </div>
              </div>
            </div>

            {/* Content Preview Tabs */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Goals Context Section */}
                <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/30 rounded-lg p-5 mb-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Left Section */}
                    <div className="flex-1">
                      <div className="text-xs text-primary uppercase tracking-wide font-semibold mb-2">
                        OPTIMIZING FOR
                      </div>
                      <div className="text-xl font-bold text-white mb-1">
                        +30% Website Traffic
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Target: 13,000 monthly visits
                      </div>
                    </div>

                    {/* Right Section - Secondary Goals */}
                    <div className="flex flex-col gap-2">
                      <Badge className="bg-[#131825] border border-border text-xs px-3 py-1.5 hover:bg-[#131825]">
                        CTR ≥ 2.5%
                      </Badge>
                      <Badge className="bg-[#131825] border border-border text-xs px-3 py-1.5 hover:bg-[#131825]">
                        CPA ≤ $25
                      </Badge>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/20">
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs text-muted-foreground flex-1">
                      Agents optimized for these goals
                    </span>
                    <span className="text-xs text-emerald-400 font-medium">
                      94% confidence
                    </span>
                  </div>
                </Card>

                <Tabs defaultValue="copy" className="space-y-6" onValueChange={setActiveTab}>
                  <TabsList className="bg-[#131825] border border-[#2D3548] w-full justify-start h-auto p-1">
                    <TabsTrigger value="copy" className="py-2 px-4 data-[state=active]:bg-[#1A2032] text-gray-400 data-[state=active]:text-white">Ad Copy</TabsTrigger>
                    <TabsTrigger value="visual" className="py-2 px-4 data-[state=active]:bg-[#1A2032] text-gray-400 data-[state=active]:text-white">Visual Design</TabsTrigger>
                    <TabsTrigger value="targeting" className="py-2 px-4 data-[state=active]:bg-[#1A2032] text-gray-400 data-[state=active]:text-white">Targeting</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: AD COPY */}
                  <TabsContent value="copy" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="grid grid-cols-3 gap-6">
                       <div className="col-span-2 space-y-4">
                          <Card className="bg-[#1A2032] border border-[#2D3548] p-6 space-y-4">
                             <div>
                                <Label className="text-xs text-muted-foreground uppercase mb-1 block">Headline</Label>
                                <div className="text-lg font-bold text-white">Walk the Change You Want to See</div>
                             </div>
                             <div>
                                <Label className="text-xs text-muted-foreground uppercase mb-1 block">Body Text</Label>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                   Every step counts. Our new sustainable sneaker line combines recycled ocean plastics with ergonomic design for all-day comfort. 
                                   Join the movement towards a cleaner planet, one footprint at a time. #EcoSteps
                                </p>
                             </div>
                             <div>
                                <Label className="text-xs text-muted-foreground uppercase mb-1 block">Call to Action</Label>
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Shop the Collection</Button>
                             </div>
                          </Card>
                       </div>

                       <div className="col-span-1 space-y-4">
                          <Card className="bg-[#1A2032] border border-[#2D3548] p-4 space-y-4">
                             <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                <Shield className="w-4 h-4 text-emerald-500" /> Critic Scores
                             </h3>
                             <div className="space-y-3">
                                <div>
                                   <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Quality</span>
                                      <span className="text-emerald-400">94/100</span>
                                   </div>
                                   <Progress value={94} className="h-1.5 bg-[#0A0E1A] [&>div]:bg-emerald-500" />
                                </div>
                                <div>
                                   <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Readability</span>
                                      <span className="text-emerald-400">91/100</span>
                                   </div>
                                   <Progress value={91} className="h-1.5 bg-[#0A0E1A] [&>div]:bg-emerald-500" />
                                </div>
                                <div>
                                   <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Emotional Impact</span>
                                      <span className="text-emerald-400">88/100</span>
                                   </div>
                                   <Progress value={88} className="h-1.5 bg-[#0A0E1A] [&>div]:bg-emerald-500" />
                                </div>
                             </div>
                             <div className="pt-3 border-t border-[#2D3548]">
                                <div className="flex justify-between items-center">
                                   <span className="text-xs text-gray-400">Brand Alignment</span>
                                   <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">92% Match</Badge>
                                </div>
                             </div>
                          </Card>
                       </div>
                    </div>
                  </TabsContent>

                  {/* TAB 2: VISUAL */}
                  <TabsContent value="visual" className="animate-in fade-in slide-in-from-bottom-2">
                     <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2">
                           <Card className="bg-[#1A2032] border border-[#2D3548] overflow-hidden">
                              <div className="aspect-video bg-[#0A0E1A] relative flex items-center justify-center">
                                 <img src={sneakerAdImage} alt="Ad Creative" className="max-h-full object-contain" />
                              </div>
                           </Card>
                        </div>
                        <div className="col-span-1 space-y-4">
                           <Card className="bg-[#1A2032] border border-[#2D3548] p-4">
                              <h3 className="text-sm font-semibold text-white mb-3">Color Palette</h3>
                              <div className="flex gap-2">
                                 <div className="w-8 h-8 rounded-full bg-[#2F4858] ring-2 ring-white/10" title="Deep Ocean"></div>
                                 <div className="w-8 h-8 rounded-full bg-[#86BBD8] ring-2 ring-white/10" title="Sky Blue"></div>
                                 <div className="w-8 h-8 rounded-full bg-[#F6AE2D] ring-2 ring-white/10" title="Sunlight"></div>
                                 <div className="w-8 h-8 rounded-full bg-[#F26419] ring-2 ring-white/10" title="Energy Orange"></div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-[#2D3548]">
                                 <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-medium text-white">Brand Alignment</span>
                                 </div>
                                 <p className="text-xs text-gray-400">
                                    Visuals adhere to "Organic & Modern" style guide. No artificial lighting detected.
                                 </p>
                              </div>
                           </Card>
                        </div>
                     </div>
                  </TabsContent>

                  {/* TAB 3: TARGETING */}
                  <TabsContent value="targeting" className="animate-in fade-in slide-in-from-bottom-2">
                     <Card className="bg-[#1A2032] border border-[#2D3548]">
                        <div className="grid grid-cols-2 divide-x divide-[#2D3548]">
                           <div className="p-6 space-y-4">
                              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Audience Definition</h3>
                              
                              <div className="space-y-3">
                                 <div className="flex justify-between items-center p-2 bg-[#0A0E1A] rounded border border-[#2D3548]">
                                    <span className="text-sm text-gray-400">Age Range</span>
                                    <div className="flex items-center gap-2">
                                       <span className="text-white font-mono">24 - 36</span>
                                       <AlertTriangle className="w-3 h-3 text-amber-500" />
                                    </div>
                                 </div>
                                 <div className="flex justify-between items-center p-2 bg-[#0A0E1A] rounded border border-[#2D3548]">
                                    <span className="text-sm text-gray-400">Locations</span>
                                    <span className="text-white text-sm text-right">USA West Coast, Western Europe</span>
                                 </div>
                                 <div className="p-2 bg-[#0A0E1A] rounded border border-[#2D3548]">
                                    <span className="text-sm text-gray-400 block mb-2">Interests</span>
                                    <div className="flex flex-wrap gap-2">
                                       {["Sustainable Fashion", "Eco-Friendly Living", "Minimalist Design", "Outdoor Hiking"].map(tag => (
                                          <Badge key={tag} variant="secondary" className="bg-[#1A2032] text-blue-300 border-blue-500/20 text-[10px]">
                                             {tag}
                                          </Badge>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="p-6 space-y-6">
                              <div className="text-center p-6 bg-[#0A0E1A] rounded-lg border border-[#2D3548] border-dashed">
                                 <div className="text-sm text-gray-400 mb-1">Estimated Reach</div>
                                 <div className="text-3xl font-bold text-white">2.4M <span className="text-sm font-normal text-gray-500">users</span></div>
                              </div>
                              
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-sm text-white">
                                    <Filter className="w-4 h-4 text-purple-500" />
                                    <span>Active Filters</span>
                                 </div>
                                 <div className="text-xs text-gray-400 pl-6">
                                    • Engaged with eco-content (last 30 days)<br/>
                                    • Online purchase behavior (top 10%)
                                 </div>
                              </div>
                           </div>
                        </div>
                     </Card>
                  </TabsContent>
                </Tabs>

                {/* Agent Rationale Accordion */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider px-1">Agent Rationale</h3>
                  <Accordion type="single" collapsible className="w-full space-y-2" defaultValue="copywriter">
                    {AGENT_RATIONALE.map((rationale) => (
                      <AccordionItem key={rationale.id} value={rationale.id} className="border border-[#2D3548] bg-[#1A2032] rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline py-3">
                          <div className="flex items-center gap-3 w-full">
                             <div className={`w-2 h-2 rounded-full ${rationale.status === 'modified' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                             <span className="text-sm font-medium text-white">{rationale.agent}</span>
                             <Badge variant="outline" className="ml-auto mr-4 bg-[#0A0E1A] border-[#2D3548] text-xs text-muted-foreground">
                                Trust: {rationale.trust}/100
                             </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-5">
                          <p className="text-sm text-gray-300 border-l-2 border-[#2D3548] pl-4 py-1">
                             {rationale.text}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[#2D3548] bg-[#131825] flex items-center gap-4">
               <Button 
                  variant="outline" 
                  className="border-[#2D3548] text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:border-red-500/20"
               >
                  Reject
               </Button>
               
               <div className="flex-1"></div>
               
               <Button 
                  variant="outline" 
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => setShowRevisionModal(true)}
               >
                  Request Revisions
               </Button>
               
               <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[200px] shadow-lg shadow-emerald-900/20"
                  onClick={() => setShowDeployModal(true)}
               >
                  Approve & Deploy
               </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
             <div className="w-16 h-16 rounded-full bg-[#1A2032] flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#2D3548]" />
             </div>
             <h3 className="text-lg font-medium text-white mb-2">No Campaign Selected</h3>
             <p className="text-sm max-w-sm">Select a pending approval from the queue to review content and agent rationale.</p>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      
      {/* 1. Deploy Confirmation Modal */}
      <Dialog open={showDeployModal} onOpenChange={setShowDeployModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white sm:max-w-[500px]">
          {isDeployed ? (
             <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                   <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold">Deployment Complete!</h2>
                <p className="text-muted-foreground">Campaign #CM-2847 is now live on Meta and Twitter.</p>
                <div className="pt-4">
                   <Button className="bg-primary hover:bg-primary/90 w-full" onClick={() => setLocation("/monitoring")}>
                      View Performance <ArrowRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
             </div>
          ) : isDeploying ? (
             <div className="py-6 space-y-6">
                <div className="space-y-2 text-center">
                   <h2 className="text-xl font-semibold">Deploying Campaign...</h2>
                   <p className="text-sm text-muted-foreground font-mono">{deploymentStep}</p>
                </div>
                <Progress value={deploymentProgress} className="h-2 bg-[#0A0E1A] [&>div]:bg-blue-500" />
                <div className="space-y-2 pt-4">
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${deploymentProgress > 10 ? 'bg-emerald-500 text-white' : 'bg-[#2D3548]'}`}>
                         {deploymentProgress > 10 && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      Audit log created
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${deploymentProgress > 50 ? 'bg-emerald-500 text-white' : 'bg-[#2D3548]'}`}>
                         {deploymentProgress > 50 && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      API Handshake (Meta, Twitter)
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${deploymentProgress > 90 ? 'bg-emerald-500 text-white' : 'bg-[#2D3548]'}`}>
                         {deploymentProgress > 90 && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      Asset Upload
                   </div>
                </div>
             </div>
          ) : (
             <>
               <DialogHeader>
                 <DialogTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> 
                    Confirm Deployment
                 </DialogTitle>
                 <DialogDescription className="pt-2 space-y-3">
                    <p>You are about to publish <strong>Campaign #CM-2847</strong> to live platforms.</p>
                    <div className="bg-[#0A0E1A] p-3 rounded border border-[#2D3548] space-y-2 text-sm">
                       <div className="flex justify-between">
                          <span className="text-gray-400">Meta Budget</span>
                          <span className="text-white font-mono">$3,000.00</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-gray-400">Twitter Budget</span>
                          <span className="text-white font-mono">$2,000.00</span>
                       </div>
                       <div className="border-t border-[#2D3548] pt-2 flex justify-between font-medium">
                          <span className="text-gray-300">Total Spend</span>
                          <span className="text-white font-mono">$5,000.00</span>
                       </div>
                    </div>
                    <p className="text-xs text-amber-500/80">
                       Warning: Campaign goes live immediately upon confirmation. You can pause it anytime from the Monitoring dashboard.
                    </p>
                 </DialogDescription>
               </DialogHeader>
               <DialogFooter className="mt-4">
                 <Button variant="ghost" onClick={() => setShowDeployModal(false)} className="hover:bg-[#2D3548] hover:text-white">Cancel</Button>
                 <Button onClick={handleDeploy} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Confirm & Deploy
                 </Button>
               </DialogFooter>
             </>
          )}
        </DialogContent>
      </Dialog>

      {/* 2. Revision Request Modal */}
      <Dialog open={showRevisionModal} onOpenChange={setShowRevisionModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Revisions</DialogTitle>
            <DialogDescription>
               Provide feedback to the agent network. This will trigger a new generation cycle.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
             <div className="space-y-2">
                <Label>Feedback Instructions</Label>
                <Textarea 
                   placeholder="E.g., Please improve the headline to be more action-oriented..." 
                   className="bg-[#0A0E1A] border-[#2D3548] min-h-[100px]"
                   value={revisionText}
                   onChange={(e) => setRevisionText(e.target.value)}
                />
             </div>
             
             <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-2">
                   <Checkbox id="route" defaultChecked className="border-[#2D3548] data-[state=checked]:bg-primary data-[state=checked]:text-white" />
                   <Label htmlFor="route" className="text-sm font-normal cursor-pointer">Route back to Copywriter Agent</Label>
                </div>
                <div className="flex items-center space-x-2">
                   <Checkbox id="consensus" defaultChecked className="border-[#2D3548] data-[state=checked]:bg-primary data-[state=checked]:text-white" />
                   <Label htmlFor="consensus" className="text-sm font-normal cursor-pointer">Require new consensus vote</Label>
                </div>
             </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowRevisionModal(false)} className="hover:bg-[#2D3548] hover:text-white">Cancel</Button>
            <Button onClick={handleRequestRevision} className="bg-amber-500 hover:bg-amber-600 text-white">
               Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
