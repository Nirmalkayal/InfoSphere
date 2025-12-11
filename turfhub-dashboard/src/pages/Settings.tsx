import { useState } from "react";
import { Settings as SettingsIcon, Bell, Shield, Globe, Webhook, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [formData, setFormData] = useState({
    turfName: "Green Field Arena",
    email: "contact@greenfield.com",
    phone: "+91 98765 43210",
    address: "123 Sports Complex, Mumbai, Maharashtra 400001",
    timezone: "Asia/Kolkata",
    currency: "INR",
    gstNumber: "22AAAAA0000A1Z5",
    logoUrl: "",
    businessHours: "09:00 AM - 11:00 PM",
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your turf and account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground">General Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Turf Name</label>
                  <input
                    type="text"
                    value={formData.turfName}
                    onChange={(e) => setFormData({ ...formData, turfName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Timezone</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Business Hours</label>
                  <input
                    type="text"
                    value={formData.businessHours}
                    onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">GST Number</label>
                  <input
                    type="text"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Logo URL</label>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: "emailNotifications", label: "Email Notifications", description: "Receive booking confirmations and updates via email" },
                  { key: "smsNotifications", label: "SMS Notifications", description: "Get instant SMS alerts for new bookings" },
                  { key: "pushNotifications", label: "Push Notifications", description: "Browser push notifications for real-time updates" },
                  { key: "weeklyReports", label: "Weekly Reports", description: "Receive weekly summary reports every Monday" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key as keyof typeof formData] })}
                      className={cn(
                        "w-12 h-7 rounded-full transition-colors relative",
                        formData[item.key as keyof typeof formData] ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-1 w-5 h-5 rounded-full bg-card shadow transition-transform",
                          formData[item.key as keyof typeof formData] ? "translate-x-6" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="glass-card p-6 space-y-6 animate-fade-in">
              <h2 className="text-lg font-semibold text-foreground">Security Settings</h2>

              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-medium text-foreground mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">Update your password regularly for security</p>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-xl">
                  <h3 className="font-medium text-foreground mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <button className="px-4 py-2 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Update Password
              </button>
            </div>
          )}


        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
