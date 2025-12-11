import { StatsCard } from "@/components/StatsCard";
import {
  Activity,
  Zap,
  MapPin,
  AlertCircle,
  PlusCircle,
  TrendingUp,
  Play,
  StopCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useDashboardData } from "@/hooks/useDashboardData";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";


const performanceData = [
  { month: "Jan", value: 4200 },
  { month: "Feb", value: 3800 },
  { month: "Mar", value: 5100 },
  { month: "Apr", value: 4600 },
  { month: "May", value: 3200 },
  { month: "Jun", value: 5800 },
  { month: "Jul", value: 6200 },
  { month: "Aug", value: 5400 },
  { month: "Sep", value: 4900 },
  { month: "Oct", value: 5600 },
  { month: "Nov", value: 6100 },
  { month: "Dec", value: 5800 },
];

const platformData = [
  { name: "SportifyPro", value: 35, color: "hsl(262, 83%, 58%)" },
  { name: "Playo", value: 30, color: "hsl(24, 95%, 53%)" },
  { name: "Internal", value: 25, color: "hsl(160, 84%, 39%)" },
  { name: "Other", value: 10, color: "hsl(199, 89%, 48%)" },
];

const channelData = [
  { name: "SportifyPro", traffic: 35, color: "bg-sportify" },
  { name: "Playo", traffic: 30, color: "bg-playo" },
  { name: "Internal", traffic: 25, color: "bg-internal" },
];

const colorMap: Record<string, string> = {
  SportifyPro: "hsl(262, 83%, 58%)",
  Playo: "hsl(24, 95%, 53%)",
  Internal: "hsl(160, 84%, 39%)",
  Other: "hsl(199, 89%, 48%)",
};

const Dashboard = () => {
  const { performance, platforms, channels, stats, loading, error } = useDashboardData();
  const [lightsOn, setLightsOn] = useState(false);
  const [simulateTraffic, setSimulateTraffic] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulateTraffic) {
      toast({
        title: "Traffic Simulation Active",
        description: "Incoming requests from Playo & TurfTown...",
        className: "bg-blue-600 text-white border-none"
      });
      // Trigger one immediately
      // MockService.simulateTraffic();

      interval = setInterval(() => {
        // MockService.simulateTraffic();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [simulateTraffic]);

  const toggleLights = () => {
    const newState = !lightsOn;
    setLightsOn(newState);
    toast({
      title: newState ? "Lights Turned ON" : "Lights Turned OFF",
      description: newState ? "Court 1 floodlights are now active." : "Court 1 floodlights have been deactivated.",
      variant: newState ? "default" : "destructive",
      className: newState ? "bg-green-600 text-white border-none" : "",
    });
  };

  const demoStats = {
    totalApiCalls: 6120,
    activeIntegrations: 3,
    registeredGrounds: 5,
    failedRequests: 12,
  };

  const perf = (performance && performance.length) ? performance : performanceData;
  const plat = (platforms && platforms.length) ? platforms : platformData;
  const chan = (channels && channels.length) ? channels : channelData;
  const s = stats || demoStats;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Central Engine Status: Online</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulateTraffic(!simulateTraffic)}
            className={`px-4 py-2.5 rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2 ${simulateTraffic ? 'bg-red-500 text-white animate-pulse' : 'bg-muted text-foreground'}`}
          >
            {simulateTraffic ? <StopCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {simulateTraffic ? "Stop Traffic" : "Simulate Traffic"}
          </button>
          <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2">
            <PlusCircle className="w-4 h-4" />
            Add New Turf
          </button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Main Content - Scrollable */}
        <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Total API Calls" value={s ? String(s.totalApiCalls) : "-"} change="" changeType="positive" icon={Activity} iconColor="bg-primary/10 text-primary" />
            <StatsCard title="Active Integrations" value={s ? String(s.activeIntegrations) : "-"} change="" changeType="positive" icon={Zap} iconColor="bg-playo/10 text-playo" />
            <StatsCard title="Registered Grounds" value={s ? String(s.registeredGrounds) : "-"} change="" changeType="positive" icon={MapPin} iconColor="bg-internal/10 text-internal" />
            <StatsCard title="Failed Requests" value={s ? String(s.failedRequests) : "-"} change="" changeType="positive" icon={AlertCircle} iconColor="bg-chart-4/10 text-chart-4" />
          </div>

          {/* IoT Control */}
          <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-primary">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full transition-colors ${lightsOn ? 'bg-yellow-100 text-yellow-600' : 'bg-muted text-muted-foreground'}`}>
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Master Light Control</h2>
                <p className="text-sm text-muted-foreground">Manage all floodlights instantly.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">{lightsOn ? "Lights ON" : "Lights OFF"}</span>
              <button onClick={toggleLights} className={`w-14 h-8 rounded-full transition-all relative ${lightsOn ? 'bg-green-500' : 'bg-muted'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${lightsOn ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Performance</h2>
                <select className="text-sm bg-muted rounded-lg px-3 py-1.5 text-muted-foreground border-0 focus:ring-2 focus:ring-primary/20">
                  <option>This Year</option>
                  <option>Last Year</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={perf}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", boxShadow: "var(--shadow-md)" }} />
                  <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Sessions By Platform</h2>
                <select className="text-sm bg-muted rounded-lg px-3 py-1.5 text-muted-foreground border-0">
                  <option>Year</option>
                  <option>Month</option>
                </select>
              </div>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={plat} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {plat.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorMap[entry.name] || colorMap.Other} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {plat.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colorMap[item.name] || colorMap.Other }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Traffic by Channel</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-soft hover:shadow-medium transition-all">View</button>
              </div>
              <div className="space-y-4">
                {chan?.map ? chan.map((channel) => (
                  <div key={channel.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{channel.name}</span>
                      <span className="font-semibold text-foreground">{channel.traffic}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-primary/70 transition-all duration-500`} style={{ width: `${channel.traffic}%` }} />
                    </div>
                  </div>
                )) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Activity Feed */}
        <div className="w-80 hidden xl:flex flex-col rounded-xl overflow-hidden border border-border bg-card shadow-sm h-full">
          <LiveActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
