import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Globe,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Bot,
  Search,
  Activity,
  Target,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import mapImage from "@assets/generated_images/Stylized_dark_mode_world_map_for_UI_background_7a29deff.png";

const steps = [
  { id: 1, label: "Configuration" },
  { id: 2, label: "Audience" },
  { id: 3, label: "Budget & Timeline" },
];

export default function CampaignBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [_, setLocation] = useLocation();
  const [isInitializing, setIsInitializing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else handleInitialize();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleInitialize = () => {
    setIsInitializing(true);
    setTimeout(() => {
      setIsInitializing(false);
      setShowSuccess(true);
    }, 1500);
  };

  const handleCustomOrchestration = () => {
    setShowSuccess(false);
    setLocation("/agent-hub");
  };

  const handleBaseOrchestration = () => {
    setShowSuccess(false);
    setLocation("/monitoring");
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-8">
      {/* Main Wizard Area */}
      <div className="flex-1 flex flex-col">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#1A2032] -z-10"></div>
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-[#0A0E1A] px-4 z-10">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors duration-300
                    ${step.id === currentStep ? "bg-primary text-white ring-4 ring-primary/20" : ""}
                    ${step.id < currentStep ? "bg-emerald-500 text-white" : ""}
                    ${step.id > currentStep ? "bg-[#1A2032] text-muted-foreground border border-border" : ""}
                  `}
                >
                  {step.id < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <span 
                  className={`text-sm font-medium ${step.id === currentStep ? "text-white" : "text-muted-foreground"}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 bg-[#1A2032] border border-border rounded-xl p-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col"
                >
                    {currentStep === 1 && <StepConfiguration />}
                    {currentStep === 2 && <StepAudience />}
                    {currentStep === 3 && <StepBudget />}
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-6">
            <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 1}
                className="border-[#2D3548] text-muted-foreground hover:text-white hover:bg-[#1A2032]"
            >
                Back
            </Button>
            <Button 
                onClick={handleNext}
                disabled={isInitializing}
                className={`
                    min-w-[140px]
                    ${currentStep === 3 ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-primary hover:bg-primary/90"}
                `}
            >
                {isInitializing ? (
                    <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Initializing...</span>
                ) : (
                    currentStep === 3 ? "Initialize Campaign" : "Next Step"
                )}
            </Button>
        </div>
      </div>

      {/* Right Sidebar: Workflow Preview */}
      <div className="w-[320px] shrink-0">
        <div className="sticky top-24 space-y-4">
            {/* Campaign Goals Card */}
            <div className="bg-[#1A2032] border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Campaign Goals</h3>
                
                {/* Primary Goal Display */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-primary mt-1 shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-white">Website Traffic</span>
                                <span className="text-2xl font-bold text-primary">+30%</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Target: 13,000 visits</p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border mb-4"></div>

                {/* Secondary Goals */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <Badge className="bg-[#131825] border border-border text-xs px-3 py-1.5 rounded-full hover:bg-[#131825]">
                        CTR ≥ 2.5%
                    </Badge>
                    <Badge className="bg-[#131825] border border-border text-xs px-3 py-1.5 rounded-full hover:bg-[#131825]">
                        CPA ≤ $25
                    </Badge>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-xs text-emerald-400">Goals validated by Strategist Agent</span>
                </div>
            </div>

            <div className="bg-[#1A2032] border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">Agent Workflow Preview</h3>
                
                <div className="relative space-y-8 before:absolute before:left-[19px] before:top-4 before:h-[calc(100%-30px)] before:w-[2px] before:bg-[#2D3548] before:-z-10">
                    {[
                        { role: "Creator", color: "bg-blue-500", label: "Generates Concepts" },
                        { role: "Critic", color: "bg-orange-500", label: "Reviews Compliance" },
                        { role: "Strategist", color: "bg-purple-500", label: "Optimizes Targeting" },
                        { role: "Deployment", color: "bg-emerald-500", label: "Publishes to APIs" }
                    ].map((agent, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center shrink-0 text-white shadow-lg ring-4 ring-[#1A2032]`}>
                                <BotIcon i={i} />
                            </div>
                            <div>
                                <div className="font-medium text-white">{agent.role} Agent</div>
                                <div className="text-xs text-muted-foreground mt-1">{agent.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-[#131825] rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        System Ready
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        All agents are on standby. Estimated campaign generation time is <span className="text-white">45-90 minutes</span>.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="bg-[#1A2032] border border-border sm:max-w-md">
            <div className="flex flex-col items-center text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Campaign Initialized!</h2>
                <p className="text-muted-foreground">
                    Campaign <span className="text-white font-mono">#CM-2847</span> has been handed off to the agent network.
                </p>
                
                <div className="w-full bg-[#131825] p-4 rounded-lg border border-border text-left space-y-2 my-4">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Completion:</span>
                        <span className="text-white">45-90 minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assigned Agents:</span>
                        <span className="text-white">5 Agents</span>
                    </div>
                </div>

                <div className="w-full flex flex-col gap-3">
                    <Button 
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={handleCustomOrchestration}
                    >
                        Orchestrate Agents Yourself <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button 
                        variant="outline"
                        className="w-full border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-500/10"
                        onClick={handleBaseOrchestration}
                    >
                        Use Base Orchestration <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">Choose how this campaign should be orchestrated.</p>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StepConfiguration() {
    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Campaign Basics</h2>
                <p className="text-muted-foreground">Define the core objective and platforms for your campaign.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Campaign Objective</Label>
                    <Textarea 
                        placeholder="Describe your campaign objective..." 
                        className="min-h-[120px] bg-[#0A0E1A] border-[#2D3548] focus:border-primary resize-none text-base"
                        defaultValue="Launch Q4 campaign for sustainable sneakers targeting eco-conscious millennials. Goal: 30% increase in website traffic."
                    />
                </div>

                <div className="space-y-2">
                    <Label>Campaign Type</Label>
                    <Select defaultValue="product">
                        <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548]">
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A2032] border border-border text-white">
                            <SelectItem value="product">Product Launch</SelectItem>
                            <SelectItem value="brand">Brand Awareness</SelectItem>
                            <SelectItem value="lead">Lead Generation</SelectItem>
                            <SelectItem value="seasonal">Seasonal Promotion</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3 pt-2">
                    <Label>Target Platforms</Label>
                    <div className="flex gap-4">
                        <PlatformCard icon={Facebook} name="Meta" connected />
                        <PlatformCard icon={Twitter} name="Twitter" connected />
                        <PlatformCard icon={Linkedin} name="LinkedIn" connected={false} />
                    </div>
                </div>

                {/* Campaign Goals Section */}
                <div className="border-t border-border pt-6 space-y-6">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-white">Campaign Goals</h3>
                        <p className="text-sm text-muted-foreground">Define success metrics for this campaign</p>
                    </div>

                    {/* Primary Goal */}
                    <div className="space-y-4">
                        <Label>Primary Goal</Label>
                        <Select defaultValue="traffic">
                            <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548]">
                                <SelectValue placeholder="Select primary goal" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A2032] border border-border text-white">
                                <SelectItem value="traffic">Website Traffic</SelectItem>
                                <SelectItem value="conversions">Conversions</SelectItem>
                                <SelectItem value="engagement">Engagement</SelectItem>
                                <SelectItem value="leads">Lead Generation</SelectItem>
                                <SelectItem value="awareness">Brand Awareness</SelectItem>
                                <SelectItem value="sales">Sales Revenue</SelectItem>
                            </SelectContent>
                        </Select>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Current Baseline <span className="text-xs">(optional)</span></Label>
                                <Input 
                                    placeholder="10,000" 
                                    className="bg-[#0A0E1A] border-[#2D3548] focus:border-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Target Increase</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        defaultValue="30" 
                                        className="bg-[#0A0E1A] border-[#2D3548] focus:border-primary flex-1"
                                    />
                                    <Select defaultValue="percent">
                                        <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] w-24">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1A2032] border border-border text-white">
                                            <SelectItem value="percent">%</SelectItem>
                                            <SelectItem value="absolute">absolute #</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Target: <span className="text-white font-medium">13,000 visits per month</span>
                        </p>
                    </div>

                    {/* Secondary Goals */}
                    <div className="space-y-3">
                        <Label className="flex items-center gap-2">
                            Secondary Goals 
                            <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">Optional</Badge>
                        </Label>
                        
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-[#0A0E1A] rounded-lg border border-[#2D3548]">
                                <Checkbox defaultChecked id="goal-ctr" />
                                <label htmlFor="goal-ctr" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                                    Achieve CTR above
                                    <Input 
                                        defaultValue="2.5" 
                                        className="w-16 h-8 bg-[#131825] border-[#2D3548] px-2 text-center"
                                    />
                                    %
                                </label>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-[#0A0E1A] rounded-lg border border-[#2D3548]">
                                <Checkbox defaultChecked id="goal-cpa" />
                                <label htmlFor="goal-cpa" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                                    Keep CPA below $
                                    <Input 
                                        defaultValue="25" 
                                        className="w-16 h-8 bg-[#131825] border-[#2D3548] px-2 text-center"
                                    />
                                </label>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-[#0A0E1A] rounded-lg border border-[#2D3548]">
                                <Checkbox id="goal-roas" />
                                <label htmlFor="goal-roas" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                                    Minimum ROAS
                                    <Input 
                                        defaultValue="3" 
                                        className="w-16 h-8 bg-[#131825] border-[#2D3548] px-2 text-center"
                                    />
                                    x
                                </label>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-[#0A0E1A] rounded-lg border border-[#2D3548]">
                                <Checkbox id="goal-impressions" />
                                <label htmlFor="goal-impressions" className="flex items-center gap-2 text-sm cursor-pointer flex-1">
                                    Reach at least
                                    <Input 
                                        defaultValue="50000" 
                                        className="w-24 h-8 bg-[#131825] border-[#2D3548] px-2 text-center"
                                    />
                                    impressions
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* AI Validation Card */}
                    <Card className="bg-[#131825] border-primary/20 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <div className="font-medium text-white text-sm">AI Goal Validation</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    Strategist Agent will validate goals against industry benchmarks
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function PlatformCard({ icon: Icon, name, connected }: { icon: any, name: string, connected: boolean }) {
    return (
        <div className={`
            flex-1 p-4 rounded-lg border cursor-pointer transition-all
            ${connected 
                ? "bg-[#131825] border-primary/30 ring-1 ring-primary/20" 
                : "bg-[#0A0E1A] border-border opacity-60 grayscale hover:opacity-100 hover:grayscale-0"}
        `}>
            <div className="flex justify-between items-start">
                <Icon className={`w-6 h-6 ${connected ? "text-white" : "text-muted-foreground"}`} />
                {connected && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
            </div>
            <div className="mt-3 font-medium text-sm">{name}</div>
            <div className="text-[10px] text-muted-foreground mt-1">{connected ? "Connected" : "Not Connected"}</div>
        </div>
    );
}

function StepAudience() {
    return (
        <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Target Audience</h2>
                <p className="text-muted-foreground">Define who should see your campaign.</p>
            </div>

            <div className="grid grid-cols-2 gap-8 flex-1">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <Label>Age Range</Label>
                            <span className="text-sm text-primary font-medium">25 - 35</span>
                        </div>
                        <Slider defaultValue={[25, 35]} max={100} step={1} className="py-4" />
                        <div className="flex justify-between text-xs text-muted-foreground px-1">
                            <span>18</span>
                            <span>65+</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Interests & Tags</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {["#sustainability", "#ecofashion", "#ethicalbrands"].map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-[#131825] border border-primary/30 text-primary hover:bg-[#131825] pl-2 pr-1 py-1">
                                    {tag} <X className="w-3 h-3 ml-1 cursor-pointer hover:text-white" />
                                </Badge>
                            ))}
                        </div>
                        <Input placeholder="Add interests..." className="bg-[#0A0E1A] border-[#2D3548]" />
                    </div>

                    <div className="bg-[#131825] p-4 rounded-lg border border-border flex items-center justify-between mt-4">
                        <div className="space-y-1">
                            <div className="font-medium text-white">AI Optimization</div>
                            <div className="text-xs text-muted-foreground">Let Targeting Agent refine audience</div>
                        </div>
                        <Switch checked={true} />
                    </div>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-border group">
                    <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500" style={{ backgroundImage: `url(${mapImage})` }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A2032] to-transparent"></div>
                    
                    <div className="absolute top-4 right-4 bg-[#0A0E1A]/80 backdrop-blur-md border border-border p-2 rounded-lg">
                        <Globe className="w-5 h-5 text-primary" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#0A0E1A]/90 backdrop-blur-md border border-border rounded-lg">
                        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Geo-Targeting</div>
                        <div className="font-medium text-white">North America, Western Europe</div>
                        <div className="mt-2 h-1 w-full bg-[#131825] rounded-full overflow-hidden">
                            <div className="h-full w-[65%] bg-primary"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepBudget() {
    return (
        <div className="space-y-6 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-white">Budget & Schedule</h2>
                <p className="text-muted-foreground">Set your spending limits and timeline.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 mt-4">
                <div className="bg-[#131825] p-6 rounded-xl border border-border space-y-6">
                    <div className="flex items-center justify-between">
                        <Label className="text-base">Total Budget</Label>
                        <div className="relative w-40">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                            <Input className="bg-[#0A0E1A] pl-7 text-right text-lg font-semibold" defaultValue="5,000" />
                        </div>
                    </div>

                    <div className="space-y-6 pt-2 border-t border-border/50">
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-400"/> Meta Allocation</span>
                                <span className="font-mono text-white">$3,000</span>
                            </div>
                            <Slider defaultValue={[60]} max={100} step={1} className="[&>.range]:bg-blue-500" />
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="flex items-center gap-2"><Twitter className="w-4 h-4 text-sky-400"/> Twitter Allocation</span>
                                <span className="font-mono text-white">$2,000</span>
                            </div>
                            <Slider defaultValue={[40]} max={100} step={1} className="[&>.range]:bg-sky-500" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <Label>Campaign Dates</Label>
                        <div className="relative">
                            <Button variant="outline" className="w-full justify-start text-left font-normal bg-[#0A0E1A] border-[#2D3548] hover:bg-[#131825] text-white">
                                <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                                Nov 15 - Nov 30, 2025
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Launch Priority</Label>
                        <RadioGroup defaultValue="expedited" className="flex gap-4">
                            <div className="flex items-center space-x-2 bg-[#0A0E1A] border border-border p-3 rounded-lg flex-1 cursor-pointer hover:border-primary/50 transition-colors">
                                <RadioGroupItem value="standard" id="r1" />
                                <Label htmlFor="r1" className="cursor-pointer">Standard</Label>
                            </div>
                            <div className="flex items-center space-x-2 bg-[#0A0E1A] border border-primary/50 p-3 rounded-lg flex-1 cursor-pointer ring-1 ring-primary/20">
                                <RadioGroupItem value="expedited" id="r2" />
                                <Label htmlFor="r2" className="cursor-pointer text-primary">Expedited</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BotIcon({ i }: { i: number }) {
    if (i === 0) return <Bot className="w-5 h-5" />; // Creator
    if (i === 1) return <Search className="w-5 h-5" />; // Critic
    if (i === 2) return <Activity className="w-5 h-5" />; // Strategist
    return <Globe className="w-5 h-5" />; // Deployment
}
