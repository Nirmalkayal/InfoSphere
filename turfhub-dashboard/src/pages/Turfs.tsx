import { useEffect, useState } from "react";
import { MapPin, Plus, ChevronRight, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminApi } from "@/services/api";

interface Turf {
  id: string;
  name: string;
  location: string;
  grounds: number;
  availableSlots: number;
  integrations: number;
  status: "active" | "inactive";
}

const TurfsPage = () => {
  const [selectedTurf, setSelectedTurf] = useState<string | null>(null);
  const [turfs, setTurfs] = useState<Turf[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.get('/turfs');
        setTurfs(res.data);
      } catch (e) {
        console.error('Failed to load turfs', e);
      }
    })();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Turfs & Grounds</h1>
          <p className="text-muted-foreground">Manage your registered turf venues</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Turf
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{turfs.length}</p>
            <p className="text-sm text-muted-foreground">Total Turfs</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-internal/10">
            <Calendar className="w-5 h-5 text-internal" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {turfs.reduce((acc, t) => acc + t.grounds, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Grounds</p>
          </div>
        </div>
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-playo/10">
            <Zap className="w-5 h-5 text-playo" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {turfs.reduce((acc, t) => acc + t.integrations, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Active Integrations</p>
          </div>
        </div>
      </div>

      {/* Turf Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {turfs.map((turf, index) => (
          <div
            key={turf.id}
            className={cn(
              "glass-card p-5 cursor-pointer transition-all hover:shadow-medium hover:-translate-y-0.5 animate-slide-up",
              selectedTurf === turf.id && "ring-2 ring-primary"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedTurf(turf.id === selectedTurf ? null : turf.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground font-bold text-lg">
                  {turf.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{turf.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {turf.location}
                  </p>
                </div>
              </div>
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                turf.status === "active"
                  ? "bg-internal/10 text-internal"
                  : "bg-muted text-muted-foreground"
              )}>
                {turf.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold text-foreground">{turf.grounds}</p>
                <p className="text-xs text-muted-foreground">Grounds</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold text-foreground">{turf.availableSlots}</p>
                <p className="text-xs text-muted-foreground">Slots</p>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded-lg">
                <p className="text-lg font-bold text-foreground">{turf.integrations}</p>
                <p className="text-xs text-muted-foreground">APIs</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
              View Details
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TurfsPage;
