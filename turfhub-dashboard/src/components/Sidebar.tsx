import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  BarChart2,
  DollarSign,
  Calendar,
  MapPin,
  Key,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Wrench,
  Trophy,
  Zap,
  Package,
  GraduationCap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/tournaments", icon: Trophy, label: "Tournaments" },
  { to: "/coaching", icon: GraduationCap, label: "Coaching" },
  { to: "/marketing", icon: Zap, label: "Marketing" },
  { to: "/inventory", icon: Package, label: "Inventory & Cafe" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/operations", icon: Wrench, label: "Operations" },
  { to: "/staff", icon: Users, label: "Staff & Shifts" },
  { to: "/pricing", icon: DollarSign, label: "Dynamic Pricing" },
  { to: "/turfs", icon: MapPin, label: "Turfs & Grounds" },
  { to: "/api-keys", icon: Key, label: "API Keys" },
  { to: "/logs", icon: FileText, label: "Integration Logs" },
  { to: "/users", icon: Users, label: "Users" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Get user initials
  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-card shadow-card lg:hidden"
      >
        <Menu className="w-5 h-5 text-foreground" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300 flex flex-col",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center transition-all duration-300 shrink-0",
          collapsed ? "flex-col justify-center gap-4 py-4" : "justify-between p-6"
        )}>
          <div className={cn("flex items-center gap-3 transition-all", collapsed && "justify-center scale-90")}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-medium shrink-0">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            {!collapsed && (
              <span className="font-bold text-xl text-foreground transition-opacity duration-300">TurfHub</span>
            )}
          </div>
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors lg:block hidden"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors lg:hidden"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation with Scroll */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className="nav-item"
              activeClassName="active"
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-semibold text-sm">{userInitials}</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || 'admin@turfhub.com'}
                </p>
              </div>
            )}
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-accent transition-colors shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
