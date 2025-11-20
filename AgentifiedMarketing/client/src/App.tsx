import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import CampaignBuilder from "@/pages/CampaignBuilder";
import AgentHub from "@/pages/AgentHub";
import CampaignMonitoring from "@/pages/CampaignMonitoring";
import ApprovalQueue from "@/pages/ApprovalQueue";
import Analytics from "@/pages/Analytics";
import Config from "@/pages/Config";
import Settings from "@/pages/Settings";
import Landing from "@/pages/Landing";

// Placeholder for missing pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in duration-500">
    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
      {title.charAt(0)}
    </div>
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="text-muted-foreground max-w-md">
      This module is currently under development by the Agent Network.
      Please check back later.
    </p>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/landing" component={Landing} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/campaign-builder" component={CampaignBuilder} />
            <Route path="/agent-hub" component={AgentHub} />
            <Route path="/monitoring" component={CampaignMonitoring} />
            <Route path="/approvals" component={ApprovalQueue} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/config" component={Config} />
            
            {/* Routes for sidebar items that don't have full specs yet */}
            <Route path="/agents">
                {/* Redirect legacy route to new hub */}
                <AgentHub />
            </Route>
            <Route path="/settings" component={Settings} />
            
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
