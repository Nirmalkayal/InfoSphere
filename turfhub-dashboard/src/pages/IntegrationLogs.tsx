import { useEffect, useState } from "react";
import { FileText, Search, Filter, Download, ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";

import { adminApi } from "@/services/api";

interface LogEntry {
  id: string;
  timestamp: string;
  platform: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  status: "success" | "failed";
  responseTimeMs?: number;
  dataRequested: string;
}

const methodColors = {
  GET: "bg-internal/10 text-internal",
  POST: "bg-primary/10 text-primary",
  PUT: "bg-playo/10 text-playo",
  DELETE: "bg-destructive/10 text-destructive",
};

const IntegrationLogsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "failed">("all");
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await adminApi.get('/logs');
        setLogs(res.data);
      } catch (e) {
        console.error('Failed to load logs', e);
      }
    })();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integration Logs</h1>
          <p className="text-muted-foreground">Monitor API requests and responses</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-soft hover:shadow-medium transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{logs.length}</p>
              <p className="text-sm text-muted-foreground">Total Requests</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-internal/10">
              <FileText className="w-5 h-5 text-internal" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {logs.filter((l) => l.status === "success").length}
              </p>
              <p className="text-sm text-muted-foreground">Successful</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-destructive/10">
              <FileText className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {logs.filter((l) => l.status === "failed").length}
              </p>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-playo/10">
              <FileText className="w-5 h-5 text-playo" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{
                logs.length ? Math.round(logs.reduce((acc, l) => acc + (l.responseTimeMs || 0), 0) / logs.length) : 0
              }ms</p>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by platform or endpoint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "success" | "failed")}
              className="appearance-none pl-4 pr-10 py-2.5 bg-muted rounded-xl text-sm font-medium text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <button className="px-4 py-2.5 bg-muted rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Timestamp</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Platform</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Endpoint</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Method</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Response</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <tr
                  key={log.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="px-6 py-4 text-sm text-muted-foreground font-mono">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-foreground">{log.platform}</span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                      {log.endpoint}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded text-xs font-semibold",
                      methodColors[log.method]
                    )}>
                      {log.method}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {log.responseTimeMs ? `${log.responseTimeMs}ms` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground max-w-[200px] truncate">
                    {log.dataRequested}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IntegrationLogsPage;
