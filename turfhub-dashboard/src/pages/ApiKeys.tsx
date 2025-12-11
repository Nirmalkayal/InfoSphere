import { useState } from "react";
import { Check, Plus, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface Integration {
  id: string;
  name: string;
  description: string;
  status: "connected" | "disconnected";
  color: string;
  icon: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "playo",
    name: "Playo",
    description: "Sync bookings and inventory with Playo.",
    status: "connected",
    color: "bg-green-500",
    icon: "P"
  },
  {
    id: "sportify",
    name: "Sportify",
    description: "Manage court availability on Sportify.",
    status: "disconnected",
    color: "bg-blue-500",
    icon: "S"
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Send automated booking receipts and reminders.",
    status: "connected",
    color: "bg-green-600",
    icon: "W"
  },
  {
    id: "hudle",
    name: "Hudle",
    description: "Connect with Hudle tailored for sports venues.",
    status: "disconnected",
    color: "bg-orange-500",
    icon: "H"
  }
];

const ApiKeysPage = () => {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(int => {
      if (int.id === id) {
        const newStatus = int.status === "connected" ? "disconnected" : "connected";
        toast({
          title: newStatus === "connected" ? "Integration Connected" : "Integration Disconnected",
          description: `${int.name} has been ${newStatus}.`,
        });
        return { ...int, status: newStatus };
      }
      return int;
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integrations Store</h1>
        <p className="text-muted-foreground">Manage your platform connections and extend functionality.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div key={integration.id} className="glass-card p-6 flex flex-col justify-between space-y-4 border border-border/50 hover:border-primary/20 transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md", integration.color)}>
                  {integration.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{integration.name}</h3>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium border",
                    integration.status === "connected"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : "bg-muted text-muted-foreground border-border"
                  )}>
                    {integration.status === "connected" ? "Connected" : "Not Connected"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{integration.description}</p>

            <button
              onClick={() => toggleIntegration(integration.id)}
              className={cn(
                "w-full py-2.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                integration.status === "connected"
                  ? "bg-muted text-foreground hover:bg-destructive/10 hover:text-destructive"
                  : "bg-primary text-primary-foreground shadow-soft hover:shadow-medium"
              )}
            >
              {integration.status === "connected" ? (
                <>Disconnect</>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Connect
                </>
              )}
            </button>
          </div>
        ))}

        {/* Coming Soon Card */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center space-y-4 border border-dashed border-border/50 opacity-60">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground">Request Integration</h3>
            <p className="text-sm text-muted-foreground">Need a specific tool? Let us know.</p>
          </div>
          <button className="text-sm text-primary font-medium hover:underline">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysPage;
