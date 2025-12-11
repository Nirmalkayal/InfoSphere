import { useEffect, useState, useRef } from "react";
import { ApiService } from "@/services/apiService";
import { Activity, Globe, Database, Server, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface Log {
    id: string;
    timestamp: string;
    platform: string;
    endpoint: string;
    status: string;
    dataRequested: string;
}

export function LiveActivityFeed() {
    const [logs, setLogs] = useState<Log[]>([]);
    const [stats, setStats] = useState({ reqPerSec: 12, health: '99.9%' });
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initial Load & Polling
    useEffect(() => {
        const fetchLogs = async () => {
            const data = await ApiService.getLogs();
            setLogs(data);
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 2000); // Poll every 2s

        // Random stats jitter
        const statInterval = setInterval(() => {
            setStats(prev => ({
                reqPerSec: Math.floor(Math.random() * 5) + 10,
                health: '99.9%'
            }));
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(statInterval);
        };
    }, []);

    const getIcon = (platform: string) => {
        if (platform === 'Playo') return <Smartphone className="w-3 h-3 text-green-400" />;
        if (platform === 'TurfTown') return <Globe className="w-3 h-3 text-orange-400" />;
        return <Server className="w-3 h-3 text-blue-400" />;
    };

    return (
        <div className="bg-card w-full h-full flex flex-col border-l border-border/50">
            {/* Header */}
            <div className="p-3 border-b border-border/50 bg-muted/20 backdrop-blur-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">Live API Traffic</span>
                </div>
                <div className="flex gap-2 text-[10px] items-center">
                    <span className="text-muted-foreground">RPS: {stats.reqPerSec}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                </div>
            </div>

            {/* Logs Stream */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[10px]">
                {logs.map((log) => (
                    <div key={log.id} className="group flex items-start gap-2 p-1.5 hover:bg-muted/50 rounded transition-colors border border-transparent hover:border-border/30">
                        <span className="text-muted-foreground whitespace-nowrap opacity-60">[{log.timestamp.split(' ')[1]}]</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                                {getIcon(log.platform)}
                                <span className={cn(
                                    "font-bold",
                                    log.platform === 'Playo' ? "text-green-400" :
                                        log.platform === 'TurfTown' ? "text-orange-400" : "text-blue-400"
                                )}>{log.platform}</span>
                                <span className="text-muted-foreground">→</span>
                                <span className="text-foreground/80">{log.endpoint}</span>
                            </div>
                            <p className="text-muted-foreground/80 truncate">{log.dataRequested}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={cn(
                                "px-1 py-0.5 rounded text-[9px] uppercase font-bold",
                                log.status === 'success' ? "bg-green-500/10 text-green-500" :
                                    log.status === 'pending' ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                            )}>{log.status}</span>
                            <span className="text-muted-foreground/50">{Math.floor(Math.random() * 50) + 20}ms</span>
                        </div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
