import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Target, 
  Bot, 
  Activity, 
  CheckSquare, 
  BarChart3, 
  Settings, 
  Lock, 
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Target, label: "Campaign Builder", href: "/campaign-builder" },
    { icon: Bot, label: "Agent Orchestration", href: "/agent-hub" },
    { icon: Activity, label: "Monitoring", href: "/monitoring" },
    { icon: CheckSquare, label: "Approval Queue", href: "/approvals" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Settings, label: "Configuration", href: "/config" },
    { icon: Lock, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary/20">
      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-[260px] bg-[#0A0E1A] border-r border-border fixed h-full z-30 flex flex-col transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link href="/landing">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl tracking-tight">Agentified</span>
            </div>
          </Link>
          
          {/* Close button for mobile/tablet */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8 text-muted-foreground hover:text-white hover:bg-red-500/10"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group",
                    isActive
                      ? "bg-[#1A2032] text-white border-l-2 border-primary"
                      : "text-muted-foreground hover:text-white hover:bg-[#131825]"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="bg-[#131825] rounded-lg p-3 border border-border">
            <div className="text-xs font-medium text-muted-foreground mb-1">System Status</div>
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              99.1% Uptime
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:ml-[260px]" : "ml-0"
      )}>
        {/* Top Nav */}
        <header className="h-16 bg-[#131825] border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            {/* Hamburger Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-white hover:bg-[#1A2032]"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search campaigns, agents, or logs..." 
                className="w-full bg-[#0A0E1A] border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-white transition-colors rounded-full hover:bg-[#1A2032]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-[#131825]"></span>
            </button>
            
            <div className="h-8 w-[1px] bg-border mx-1"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">Admin User</div>
                <div className="text-xs text-muted-foreground">Marketing Lead</div>
              </div>
              <Avatar className="h-9 w-9 border border-border cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-[#0A0E1A]">
          <div className="w-full h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
