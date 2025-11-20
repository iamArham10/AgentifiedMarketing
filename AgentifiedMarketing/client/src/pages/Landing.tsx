import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Zap, Shield, Activity, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Multi-Agent Campaigns",
    description:
      "Spin up copy, design, targeting, and deployment agents that collaborate autonomously.",
    icon: Bot,
  },
  {
    title: "Human-in-the-Loop Guardrails",
    description:
      "Approval queues and audit logs keep every launch on brand and compliant.",
    icon: Shield,
  },
  {
    title: "Live Orchestration Console",
    description:
      "Monitor KPIs, re-route workflows, and trigger optimizations in real time.",
    icon: Activity,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#111633,_#05070F)] text-white flex flex-col">
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          Agentified Marketing
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-white">
            <Link href="/">Enter Console</Link>
          </Button>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/campaign-builder">Start a Campaign</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 space-y-16">
        <section className="text-center space-y-6">
          <Badge className="mx-auto bg-primary/20 text-primary border-primary/30 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Autonomous marketing, supervised by you
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
            Orchestrate AI marketing agents with human-grade oversight.
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Agentified Marketing pairs an agent network with dashboards, approvals, and analytics
            so your team can ideate, launch, and optimize campaigns in hours—not weeks.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-base px-8" asChild>
              <Link href="/campaign-builder">
                Launch a Campaign <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white" asChild>
              <Link href="/">View Live Dashboard</Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-white/5 border-white/10 backdrop-blur p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </section>

        <section className="bg-[#0F1424] border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-semibold">Ready to see it in action?</h2>
            <p className="text-muted-foreground">
              Jump into the dashboard to review live KPIs or open the campaign builder to hand off the
              next initiative to the agent network.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-[#0F1424]" asChild>
              <Link href="/">Open Console</Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white" asChild>
              <Link href="/approvals">Review Approvals</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Agentified Marketing • Built for multi-agent creative ops
      </footer>
    </div>
  );
}

