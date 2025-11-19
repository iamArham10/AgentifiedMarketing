import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  User, Mail, Lock, Trash2, Save, Shield, Smartphone, Monitor, Globe,
  AlertTriangle, Key, Plus, Copy, Download, Search, ChevronLeft, ChevronRight,
  Check, X, Eye, Moon, Sun, Bell, Calendar, Clock, Database, RotateCcw,
  FileText, CheckCircle, XCircle, AlertCircle, ExternalLink, Loader2
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Account Tab State
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [fullName, setFullName] = useState("Sarah Mitchell");
  const [jobTitle, setJobTitle] = useState("Marketing Manager");
  const [company, setCompany] = useState("EcoFashion Brand");
  const [isSaving, setIsSaving] = useState(false);

  // Security Tab State
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome on Windows", icon: "desktop", status: "Active now", location: "Lahore, PK", isCurrent: true },
    { id: 2, device: "Safari on iPhone", icon: "mobile", status: "2 hours ago", location: "Lahore, PK", isCurrent: false },
    { id: 3, device: "Firefox on macOS", icon: "desktop", status: "1 day ago", location: "Lahore, PK", isCurrent: false }
  ]);
  const [tokens, setTokens] = useState([
    { id: 1, name: "Production API", token: "sk_prod_abc123...xyz", created: "2mo ago", lastUsed: "3 days ago" }
  ]);

  // Preferences Tab State
  const [theme, setTheme] = useState("dark");
  const [emailNotifications, setEmailNotifications] = useState({
    approvals: true,
    failures: true,
    reports: true,
    tips: false
  });
  const [inAppNotifications, setInAppNotifications] = useState({
    agentUpdates: true,
    consensus: true,
    deployments: true
  });
  const [dashboardView, setDashboardView] = useState("campaigns");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [shareAnalytics, setShareAnalytics] = useState(true);
  const [betaFeatures, setBetaFeatures] = useState(false);

  // Audit Logs Tab State
  const [actionFilter, setActionFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("30");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  const [auditLogs] = useState([
    { id: 1, timestamp: "Nov 19, 15:52", user: "sarah@brand", action: "✓ Approved Campaign CM-2847", metadata: "IP: 103.255.x.x | Location: Lahore, PK", type: "approval" },
    { id: 2, timestamp: "Nov 19, 15:48", user: "system", action: "🤖 Consensus reached for CM-2847", metadata: "Agents: 3/3 voted, 89.7% confidence", type: "system" },
    { id: 3, timestamp: "Nov 19, 14:32", user: "sarah@brand", action: "🔐 Logged in", metadata: "IP: 103.255.x.x | Device: Chrome/Windows", type: "login" },
    { id: 4, timestamp: "Nov 18, 09:15", user: "sarah@brand", action: "⚙️ Changed password", metadata: "", type: "change" },
    { id: 5, timestamp: "Nov 18, 08:42", user: "sarah@brand", action: "✓ Approved Campaign CM-2839", metadata: "IP: 103.255.x.x | Location: Lahore, PK", type: "approval" },
    { id: 6, timestamp: "Nov 17, 22:03", user: "unknown", action: "⚠️ Failed login attempt", metadata: "IP: 45.132.x.x | Location: Unknown", type: "error" },
    { id: 7, timestamp: "Nov 17, 16:20", user: "deployment_agent_06", action: "🚀 Deployed Campaign CM-2839 to Meta", metadata: "Campaign ID: 120948273649 | Status: Success", type: "deployment" },
    { id: 8, timestamp: "Nov 17, 16:15", user: "sarah@brand", action: "✓ Approved Campaign CM-2839", metadata: "Consensus: 3/3 agents, 92.4% confidence", type: "approval" }
  ]);

  // Modal State
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showGenerateTokenModal, setShowGenerateTokenModal] = useState(false);
  const [showTokenDisplayModal, setShowTokenDisplayModal] = useState(false);
  const [showRevokeSessionModal, setShowRevokeSessionModal] = useState(false);
  const [showSignOutAllModal, setShowSignOutAllModal] = useState(false);
  const [showDeleteTokenModal, setShowDeleteTokenModal] = useState(false);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [generatedToken, setGeneratedToken] = useState("");
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenExpiration, setTokenExpiration] = useState("never");

  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        toast({
          title: "Photo Updated",
          description: "Profile photo uploaded successfully",
          className: "bg-emerald-500/10 border-emerald-500/20 text-white"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast({
      title: "Settings Saved",
      description: "✅ Settings saved successfully",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "❌ Passwords do not match",
        variant: "destructive"
      });
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowChangePasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast({
      title: "Password Changed",
      description: "✅ Password changed successfully",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== "sarah@brand.com") {
      toast({
        title: "Error",
        description: "❌ Email doesn't match",
        variant: "destructive"
      });
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowDeleteAccountModal(false);
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted",
      variant: "destructive"
    });
  };

  const handleEnable2FA = async () => {
    if (twoFACode.length !== 6) {
      toast({
        title: "Error",
        description: "❌ Please enter a 6-digit code",
        variant: "destructive"
      });
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    setTwoFAEnabled(true);
    setShow2FAModal(false);
    setTwoFACode("");
    toast({
      title: "2FA Enabled",
      description: "✅ Two-factor authentication enabled",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleGenerateToken = async () => {
    if (!tokenName.trim()) {
      toast({
        title: "Error",
        description: "❌ Please enter a token name",
        variant: "destructive"
      });
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    const newToken = `sk_prod_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setGeneratedToken(newToken);
    setShowGenerateTokenModal(false);
    setShowTokenDisplayModal(true);
    const newTokenObj = {
      id: tokens.length + 1,
      name: tokenName,
      token: `${newToken.substring(0, 15)}...${newToken.substring(newToken.length - 3)}`,
      created: "Just now",
      lastUsed: "Never"
    };
    setTokens([...tokens, newTokenObj]);
    setTokenName("");
    setTokenExpiration("never");
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(generatedToken);
    toast({
      title: "Token Copied",
      description: "✅ Token copied to clipboard",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleRevokeSession = async () => {
    if (!selectedSession) return;
    await new Promise(resolve => setTimeout(resolve, 300));
    setSessions(sessions.filter(s => s.id !== selectedSession.id));
    setShowRevokeSessionModal(false);
    setSelectedSession(null);
    toast({
      title: "Session Revoked",
      description: "✅ Session revoked successfully",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleSignOutAll = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setSessions(sessions.filter(s => s.isCurrent));
    setShowSignOutAllModal(false);
    toast({
      title: "Sessions Terminated",
      description: "✅ All other devices signed out",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleDeleteToken = async () => {
    if (!selectedToken) return;
    await new Promise(resolve => setTimeout(resolve, 300));
    setTokens(tokens.filter(t => t.id !== selectedToken.id));
    setShowDeleteTokenModal(false);
    setSelectedToken(null);
    toast({
      title: "Token Deleted",
      description: "✅ Access token deleted",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    toast({
      title: "Preferences Saved",
      description: "✅ Preferences saved successfully",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  const handleExportLogs = async () => {
    setIsExporting(true);
    toast({
      title: "Generating...",
      description: "Preparing your audit log export",
      className: "bg-blue-500/10 border-blue-500/20 text-white"
    });
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    toast({
      title: "Export Complete",
      description: "✅ Audit logs downloaded successfully",
      className: "bg-emerald-500/10 border-emerald-500/20 text-white"
    });
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings & Audit Logs</h1>
          <p className="text-muted-foreground">Manage your account, security, and system preferences</p>
        </div>
        {activeTab === "audit" && (
          <Button
            onClick={handleExportLogs}
            disabled={isExporting}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isExporting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
            ) : (
              <><Download className="w-4 h-4 mr-2" /> Export Logs</>
            )}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-[#1A2032] border border-[#2D3548]">
          <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <User className="w-4 h-4 mr-2" /> Account
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <Bell className="w-4 h-4 mr-2" /> Preferences
          </TabsTrigger>
          <TabsTrigger value="audit" className="data-[state=active]:bg-primary data-[state=active]:text-white">
            <FileText className="w-4 h-4 mr-2" /> Audit Logs
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ACCOUNT */}
        <TabsContent value="account" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex items-center gap-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-full bg-[#0A0E1A] border-2 border-[#2D3548] flex items-center justify-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden"
                    >
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <User className="w-12 h-12 text-muted-foreground" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white">
                        Change Photo
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Click to upload a new photo</p>
                      <p className="text-xs">JPG, PNG or GIF (max. 5MB)</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Full Name</Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-[#0A0E1A] border-[#2D3548] text-white focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Email Address</Label>
                      <div className="relative">
                        <Input
                          value="sarah@brand.com"
                          disabled
                          className="bg-[#0A0E1A] border-[#2D3548] text-gray-400 cursor-not-allowed"
                        />
                        <Lock className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">Contact support to change email</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Job Title</Label>
                      <Input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="bg-[#0A0E1A] border-[#2D3548] text-white focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">Company</Label>
                      <Input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="bg-[#0A0E1A] border-[#2D3548] text-white focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Account Actions</h2>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                    onClick={() => setShowChangePasswordModal(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" /> Change Password
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-red-500/20 text-red-500 hover:bg-red-500/10"
                    onClick={() => setShowDeleteAccountModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                  </Button>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Changes</>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6 sticky top-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-[#0A0E1A] border-2 border-[#2D3548] flex items-center justify-center overflow-hidden">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{fullName}</h3>
                    <p className="text-sm text-muted-foreground">sarah@brand.com</p>
                  </div>

                  <Separator className="bg-[#2D3548]" />

                  <div className="w-full space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="text-white">Jan 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last login</span>
                      <div className="text-right">
                        <div className="text-white">Nov 19, 2025</div>
                        <div className="text-xs text-muted-foreground">14:32 UTC</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subscription</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-white">Pro Plan</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-[#2D3548] text-white hover:bg-[#0A0E1A]">
                    Manage Plan
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: SECURITY - TO BE CONTINUED */}
        <TabsContent value="security" className="mt-6">
          <div className="max-w-3xl space-y-6">
            {/* 2FA Card */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
                  <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account with 2FA</p>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-medium ${twoFAEnabled ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                  {twoFAEnabled ? 'Enabled ✓' : 'Disabled'}
                </div>
              </div>
              {!twoFAEnabled && (
                <Button
                  variant="outline"
                  className="border-[#2D3548] text-primary hover:bg-[#0A0E1A]"
                  onClick={() => setShow2FAModal(true)}
                >
                  Configure 2FA →
                </Button>
              )}
            </Card>

            {/* Session Management Card */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Session Management</h2>
                <p className="text-sm text-muted-foreground mt-1">You are currently signed in on {sessions.length} device{sessions.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="space-y-3 mb-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-[#0A0E1A] rounded-lg border border-[#2D3548]">
                    <div className="flex items-center gap-4">
                      {session.icon === 'mobile' ? (
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <Monitor className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <div className="text-white font-medium">{session.device}</div>
                        <div className="text-sm text-muted-foreground">
                          {session.status} • {session.location}
                        </div>
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                        onClick={() => {
                          setSelectedSession(session);
                          setShowRevokeSessionModal(true);
                        }}
                      >
                        Revoke
                      </Button>
                    )}
                    {session.isCurrent && (
                      <div className="px-3 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Current
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                onClick={() => setShowSignOutAllModal(true)}
                disabled={sessions.filter(s => !s.isCurrent).length === 0}
              >
                Sign Out All Other Devices
              </Button>
            </Card>

            {/* API Tokens Card */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-white">Personal Access Tokens</h2>
                <p className="text-sm text-muted-foreground mt-1">Generate tokens for API access</p>
              </div>

              <div className="space-y-3 mb-4">
                {tokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-4 bg-[#0A0E1A] rounded-lg border border-[#2D3548]">
                    <div className="flex-1">
                      <div className="text-white font-mono text-sm">{token.token}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Created {token.created} | Last used: {token.lastUsed}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                        onClick={() => {
                          setSelectedToken(token);
                          setShowGenerateTokenModal(true);
                        }}
                      >
                        Regenerate
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                        onClick={() => {
                          setSelectedToken(token);
                          setShowDeleteTokenModal(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full border-[#2D3548] text-primary hover:bg-[#0A0E1A]"
                onClick={() => setShowGenerateTokenModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" /> Generate New Token
              </Button>
            </Card>

            {/* Security Logs Card */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Security Events</h2>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Nov 19, 14:32 ✓ Successful login</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span>Nov 18, 09:15 ✓ Password changed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Nov 17, 22:03 ⚠️ Failed login attempt</span>
                </div>
              </div>
              <Button
                variant="link"
                className="text-primary p-0 h-auto"
                onClick={() => setActiveTab("audit")}
              >
                View All Security Logs →
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: PREFERENCES - TO BE CONTINUED */}
        <TabsContent value="preferences" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appearance */}
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Appearance</h2>
                <div className="space-y-2">
                  <Label className="text-white">Theme</Label>
                  <RadioGroup value={theme} onValueChange={setTheme}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" className="border-[#2D3548]" />
                      <Label htmlFor="dark" className="text-muted-foreground cursor-pointer">
                        <Moon className="w-4 h-4 inline mr-2" />
                        Dark Mode
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" className="border-[#2D3548]" />
                      <Label htmlFor="light" className="text-muted-foreground cursor-pointer">
                        <Sun className="w-4 h-4 inline mr-2" />
                        Light Mode
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="auto" id="auto" className="border-[#2D3548]" />
                      <Label htmlFor="auto" className="text-muted-foreground cursor-pointer">
                        <Globe className="w-4 h-4 inline mr-2" />
                        Auto (system)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </Card>

              {/* Notifications */}
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-white mb-3 block">Email Notifications</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email-approvals"
                          checked={emailNotifications.approvals}
                          onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, approvals: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="email-approvals" className="text-muted-foreground cursor-pointer">
                          Campaign approvals needed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email-failures"
                          checked={emailNotifications.failures}
                          onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, failures: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="email-failures" className="text-muted-foreground cursor-pointer">
                          Agent failures & errors
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email-reports"
                          checked={emailNotifications.reports}
                          onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, reports: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="email-reports" className="text-muted-foreground cursor-pointer">
                          Weekly performance reports
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email-tips"
                          checked={emailNotifications.tips}
                          onCheckedChange={(checked) => setEmailNotifications({...emailNotifications, tips: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="email-tips" className="text-muted-foreground cursor-pointer">
                          Marketing tips
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-[#2D3548]" />

                  <div>
                    <Label className="text-white mb-3 block">In-App Notifications</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="app-updates"
                          checked={inAppNotifications.agentUpdates}
                          onCheckedChange={(checked) => setInAppNotifications({...inAppNotifications, agentUpdates: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="app-updates" className="text-muted-foreground cursor-pointer">
                          Real-time agent updates
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="app-consensus"
                          checked={inAppNotifications.consensus}
                          onCheckedChange={(checked) => setInAppNotifications({...inAppNotifications, consensus: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="app-consensus" className="text-muted-foreground cursor-pointer">
                          Consensus decisions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="app-deployments"
                          checked={inAppNotifications.deployments}
                          onCheckedChange={(checked) => setInAppNotifications({...inAppNotifications, deployments: checked as boolean})}
                          className="border-[#2D3548]"
                        />
                        <Label htmlFor="app-deployments" className="text-muted-foreground cursor-pointer">
                          Campaign deployments
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Display Preferences */}
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Display Preferences</h2>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Default Dashboard View</Label>
                    <Select value={dashboardView} onValueChange={setDashboardView}>
                      <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                        <SelectItem value="campaigns">Campaigns Overview</SelectItem>
                        <SelectItem value="network">Agent Network</SelectItem>
                        <SelectItem value="analytics">Analytics</SelectItem>
                        <SelectItem value="activity">Recent Activity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Timezone</Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                        <SelectItem value="Asia/Karachi">Asia/Karachi (PKT)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                        <SelectItem value="Australia/Sydney">Australia/Sydney (AEDT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Data & Privacy */}
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Data & Privacy</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="share-analytics"
                      checked={shareAnalytics}
                      onCheckedChange={(checked) => setShareAnalytics(checked as boolean)}
                      className="border-[#2D3548] mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="share-analytics" className="text-white cursor-pointer">
                        Share analytics for platform improvement
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="beta-features"
                      checked={betaFeatures}
                      onCheckedChange={(checked) => setBetaFeatures(checked as boolean)}
                      className="border-[#2D3548] mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="beta-features" className="text-white cursor-pointer">
                        Participate in beta features
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Get early access to new features before public release
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isSaving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" /> Save Preferences</>
                  )}
                </Button>
              </div>
            </div>

            {/* Right Column - Preview Card */}
            <div className="lg:col-span-1">
              <Card className="bg-[#1A2032] border border-[#2D3548] p-6 sticky top-6">
                <h3 className="text-sm font-semibold text-white mb-4">Preview</h3>
                <div className="aspect-video bg-[#0A0E1A] rounded border border-[#2D3548] mb-4"></div>
                <p className="text-sm text-muted-foreground">
                  Your current settings will affect how you receive updates and alerts
                </p>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: AUDIT LOGS - TO BE CONTINUED */}
        <TabsContent value="audit" className="mt-6">
          <div className="space-y-6">
            {/* Filter Bar */}
            <Card className="bg-[#1A2032] border border-[#2D3548] p-4">
              <div className="flex flex-wrap gap-4">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-[180px] bg-[#0A0E1A] border-[#2D3548] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="approvals">Approvals</SelectItem>
                    <SelectItem value="logins">Logins</SelectItem>
                    <SelectItem value="changes">Changes</SelectItem>
                    <SelectItem value="deployments">Deployments</SelectItem>
                    <SelectItem value="errors">Errors</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger className="w-[180px] bg-[#0A0E1A] border-[#2D3548] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="sarah">sarah@brand.com</SelectItem>
                    <SelectItem value="system">system</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[180px] bg-[#0A0E1A] border-[#2D3548] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#0A0E1A] border-[#2D3548] text-white"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Audit Log Table */}
            <Card className="bg-[#1A2032] border border-[#2D3548] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2D3548] bg-[#0A0E1A]">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Timestamp</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className="border-b border-[#2D3548] hover:bg-[#0A0E1A] transition-colors"
                      >
                        <td className="p-4 text-sm text-white">{log.timestamp}</td>
                        <td className="p-4 text-sm text-muted-foreground">{log.user}</td>
                        <td className="p-4 text-sm text-white">
                          {log.action}
                          {log.metadata && (
                            <div className="text-xs text-muted-foreground mt-1">{log.metadata}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-primary p-0 h-auto"
                            onClick={() => {
                              setSelectedLog(log);
                              setShowLogDetailModal(true);
                            }}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 p-4 border-t border-[#2D3548]">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={currentPage === page ? "bg-primary text-white" : "border-[#2D3548] text-white hover:bg-[#0A0E1A]"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <span className="text-muted-foreground">...</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                >
                  15
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === 15}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODALS */}

      {/* Change Password Modal */}
      <Dialog open={showChangePasswordModal} onOpenChange={setShowChangePasswordModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-[#0A0E1A] border-[#2D3548] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[#0A0E1A] border-[#2D3548] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-[#0A0E1A] border-[#2D3548] text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowChangePasswordModal(false)} className="hover:bg-[#2D3548]">
              Cancel
            </Button>
            <Button onClick={handleChangePassword} className="bg-primary hover:bg-primary/90">
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Modal */}
      <Dialog open={showDeleteAccountModal} onOpenChange={setShowDeleteAccountModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle>Delete Account</DialogTitle>
            <p className="text-muted-foreground">
              This action cannot be undone. All your campaigns, settings, and data will be permanently deleted.
            </p>
            <div className="w-full space-y-2 text-left">
              <Label>Type your email to confirm</Label>
              <Input
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                placeholder="sarah@brand.com"
                className="bg-[#0A0E1A] border-[#2D3548] text-white"
              />
            </div>
            <div className="flex gap-3 w-full pt-4">
              <Button
                variant="ghost"
                className="flex-1 hover:bg-[#2D3548]"
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmEmail("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure 2FA Modal */}
      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>Scan this QR code with your authenticator app</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-48 h-48 bg-white rounded flex items-center justify-center">
                <div className="text-center text-black text-xs p-4">
                  QR Code Placeholder
                  <br />
                  [Scan with authenticator app]
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Or enter this code manually: ABCD-EFGH-IJKL-MNOP</p>
            </div>
            <div className="space-y-2">
              <Label>Enter the 6-digit code from your app</Label>
              <Input
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                placeholder="000000"
                className="bg-[#0A0E1A] border-[#2D3548] text-white text-center text-2xl tracking-widest"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShow2FAModal(false)} className="hover:bg-[#2D3548]">
              Cancel
            </Button>
            <Button onClick={handleEnable2FA} className="bg-primary hover:bg-primary/90">
              Enable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Token Modal */}
      <Dialog open={showGenerateTokenModal} onOpenChange={setShowGenerateTokenModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <DialogHeader>
            <DialogTitle>Generate New Access Token</DialogTitle>
            <DialogDescription>Choose a descriptive name to remember what this token is for</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Token Name</Label>
              <Input
                value={tokenName}
                onChange={(e) => setTokenName(e.target.value)}
                placeholder="e.g., Production API Access"
                className="bg-[#0A0E1A] border-[#2D3548] text-white"
              />
            </div>
            <div className="space-y-2">
              <Label>Expiration</Label>
              <Select value={tokenExpiration} onValueChange={setTokenExpiration}>
                <SelectTrigger className="bg-[#0A0E1A] border-[#2D3548] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1A2032] border-[#2D3548] text-white">
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowGenerateTokenModal(false)} className="hover:bg-[#2D3548]">
              Cancel
            </Button>
            <Button onClick={handleGenerateToken} className="bg-primary hover:bg-primary/90">
              Generate Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Token Display Modal */}
      <Dialog open={showTokenDisplayModal} onOpenChange={setShowTokenDisplayModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <DialogTitle>Token Generated Successfully</DialogTitle>
            <div className="w-full space-y-4">
              <p className="text-sm text-amber-500">
                ⚠️ Copy this token now. You won't be able to see it again!
              </p>
              <div className="bg-[#0A0E1A] border border-[#2D3548] rounded p-3">
                <code className="text-sm text-white break-all">{generatedToken}</code>
              </div>
              <Button
                variant="outline"
                className="w-full border-[#2D3548] text-white hover:bg-[#0A0E1A]"
                onClick={handleCopyToken}
              >
                <Copy className="w-4 h-4 mr-2" /> Copy to Clipboard
              </Button>
              <p className="text-xs text-muted-foreground">
                Store this token securely. Treat it like a password.
              </p>
            </div>
            <Button
              onClick={() => setShowTokenDisplayModal(false)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Revoke Session Modal */}
      <Dialog open={showRevokeSessionModal} onOpenChange={setShowRevokeSessionModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <DialogTitle>Revoke Session</DialogTitle>
            <p className="text-muted-foreground">
              This will immediately sign out this device. The user will need to log in again.
            </p>
            {selectedSession && (
              <div className="w-full bg-[#0A0E1A] border border-[#2D3548] rounded p-4 text-left space-y-1">
                <div className="text-white font-medium">{selectedSession.device}</div>
                <div className="text-sm text-muted-foreground">Last active: {selectedSession.status}</div>
                <div className="text-sm text-muted-foreground">Location: {selectedSession.location}</div>
              </div>
            )}
            <div className="flex gap-3 w-full pt-4">
              <Button
                variant="ghost"
                className="flex-1 hover:bg-[#2D3548]"
                onClick={() => setShowRevokeSessionModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleRevokeSession}
              >
                Revoke
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Out All Modal */}
      <Dialog open={showSignOutAllModal} onOpenChange={setShowSignOutAllModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <DialogTitle>Sign Out All Other Devices</DialogTitle>
            <p className="text-muted-foreground">
              This will sign you out of all devices except this one. You'll need to log in again on those devices.
            </p>
            <div className="w-full space-y-2">
              <p className="text-sm text-white font-medium text-left">Devices to be signed out:</p>
              {sessions.filter(s => !s.isCurrent).map((session) => (
                <div key={session.id} className="bg-[#0A0E1A] border border-[#2D3548] rounded p-3 text-left">
                  <div className="text-sm text-white">{session.device}</div>
                  <div className="text-xs text-muted-foreground">{session.status}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 w-full pt-4">
              <Button
                variant="ghost"
                className="flex-1 hover:bg-[#2D3548]"
                onClick={() => setShowSignOutAllModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleSignOutAll}
              >
                Sign Out All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Token Modal */}
      <Dialog open={showDeleteTokenModal} onOpenChange={setShowDeleteTokenModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white">
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <DialogTitle>Delete Access Token</DialogTitle>
            <p className="text-muted-foreground">
              Any applications using this token will immediately lose access. This action cannot be undone.
            </p>
            {selectedToken && (
              <div className="w-full bg-[#0A0E1A] border border-[#2D3548] rounded p-4 text-left space-y-1">
                <div className="text-white font-mono text-sm">{selectedToken.token}</div>
                <div className="text-xs text-muted-foreground">Created: {selectedToken.created}</div>
                <div className="text-xs text-muted-foreground">Last used: {selectedToken.lastUsed}</div>
              </div>
            )}
            <div className="flex gap-3 w-full pt-4">
              <Button
                variant="ghost"
                className="flex-1 hover:bg-[#2D3548]"
                onClick={() => setShowDeleteTokenModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDeleteToken}
              >
                Delete Token
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Log Detail Modal */}
      <Dialog open={showLogDetailModal} onOpenChange={setShowLogDetailModal}>
        <DialogContent className="bg-[#1A2032] border border-[#2D3548] text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6 py-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">{selectedLog.action}</h3>
                <p className="text-sm text-muted-foreground">{selectedLog.timestamp}, 2025 at 15:52:33 UTC</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-white">{selectedLog.user}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">User Information</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-white">sarah@brand.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="text-white">Sarah Mitchell</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="text-white">Marketing Manager</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-white">Action Details</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="text-white capitalize">{selectedLog.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="text-emerald-500">Success</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-white">1.2 seconds</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedLog.metadata && (
                <div className="bg-[#0A0E1A] border border-[#2D3548] rounded p-4">
                  <p className="text-sm text-muted-foreground">{selectedLog.metadata}</p>
                </div>
              )}

              <Button
                onClick={() => setShowLogDetailModal(false)}
                variant="outline"
                className="w-full border-[#2D3548] text-white hover:bg-[#0A0E1A]"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
