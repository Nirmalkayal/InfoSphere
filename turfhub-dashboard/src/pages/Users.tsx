import { useEffect, useState } from "react";
import { Users as UsersIcon, Plus, Search, MoreVertical, Shield, Mail, AlertTriangle, CheckCircle, MessageCircle } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { adminApi } from "@/services/api";
import { ChurnPredictor, type ChurnAnalysis } from "@/services/churnPredictor";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  status: "active" | "pending";
  lastActiveAt?: string;
  avatar?: string;
  // Augmented for CRM
  churn?: ChurnAnalysis;
}

const roleColors = {
  admin: "bg-primary/10 text-primary border-primary/20",
  manager: "bg-playo/10 text-playo border-playo/20",
  staff: "bg-muted text-muted-foreground border-muted-foreground/20",
};

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.get('/users');
        // Augment with Mock AI Data
        const augmented = res.data.map((u: any) => {
          // Simulate random last booking if missing, for demo
          const randomDays = Math.floor(Math.random() * 45);
          const mockDate = new Date();
          mockDate.setDate(mockDate.getDate() - randomDays);
          const lastDate = u.lastActiveAt || mockDate.toISOString();

          return {
            ...u,
            lastActiveAt: lastDate,
            churn: ChurnPredictor.analyze(lastDate)
          };
        });
        setUsers(augmented);
      } catch (e) {
        console.error('Failed to load users', e);
      }
    })();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase();
  };

  const handleWhatsApp = (phone: string = "919999999999", message: string) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const highRiskCount = users.filter(u => u.churn?.riskLevel === 'high').length;
  const mediumRiskCount = users.filter(u => u.churn?.riskLevel === 'medium').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Smart CRM & Staff</h1>
          <p className="text-muted-foreground">AI-Powered Retention Engine & Team Management</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <UsersIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Players</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-red-500">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{highRiskCount}</p>
              <p className="text-sm text-muted-foreground">High Churn Risk</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mediumRiskCount}</p>
              <p className="text-sm text-muted-foreground">At Risk</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {users.length - highRiskCount - mediumRiskCount}
              </p>
              <p className="text-sm text-muted-foreground">Loyal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            className="glass-card p-5 animate-slide-up flex flex-col justify-between"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center text-primary-foreground font-bold">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <StatusBadge status={user.status} />
              </div>

              {/* CRM Stats */}
              {user.churn && (
                <div className="bg-muted/30 p-3 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">Last Seen</span>
                    <span className="text-xs font-medium">
                      {user.churn.lastBookingDays} days ago
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Risk Level</span>
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-bold uppercase",
                      user.churn.riskLevel === 'high' ? "bg-red-100 text-red-700" :
                        user.churn.riskLevel === 'medium' ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                    )}>
                      {user.churn.riskLevel}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              {user.churn?.riskLevel !== 'low' ? (
                <button
                  onClick={() => handleWhatsApp("919876543210", user.churn?.recommendedAction.message || "")}
                  className="w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {user.churn?.recommendedAction.label || "WhatsApp"}
                </button>
              ) : (
                <button className="w-full py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium cursor-default">
                  Loyal Customer 🌟
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;
