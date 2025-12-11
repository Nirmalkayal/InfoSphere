/* MatchCenter.tsx - Live Scoring Dashboard */
import { useEffect, useState } from "react";
import { MockService } from "@/services/mockService";
import { Timer, ArrowLeft, Trophy, Flag, User, Activity, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface MatchCenterProps {
    match: any;
    onClose: () => void;
}

export function MatchCenter({ match, onClose }: MatchCenterProps) {
    const [localMatch, setLocalMatch] = useState(match);
    const [team1Players, setTeam1Players] = useState<any[]>([]);
    const [team2Players, setTeam2Players] = useState<any[]>([]);
    const [team1Name, setTeam1Name] = useState("Team 1");
    const [team2Name, setTeam2Name] = useState("Team 2");
    const [refereeName, setRefereeName] = useState("Unassigned");

    // Timer Logic (Simulation)
    const [time, setTime] = useState(0);

    useEffect(() => {
        // Fetch Details
        const load = async () => {
            const teams = await MockService.getTeams(match.tournamentId);
            const t1 = teams.find((t: any) => t.id === match.team1);
            const t2 = teams.find((t: any) => t.id === match.team2);

            if (t1) {
                setTeam1Name(t1.name);
                const p1 = await MockService.getPlayers(t1.id);
                setTeam1Players(p1);
            }
            if (t2) {
                setTeam2Name(t2.name);
                const p2 = await MockService.getPlayers(t2.id);
                setTeam2Players(p2);
            }

            // Fetch Referee
            const refs = await MockService.getReferees();
            const r = refs.find((x: any) => x.id === match.refereeId);
            if (r) setRefereeName(r.name);
        };
        load();

        // Timer
        const i = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(i);
    }, [match]);

    const handleEvent = async (type: string, teamId: string, player: any = null, value: number = 1) => {
        const event = {
            type,
            teamId,
            playerId: player?.id,
            playerName: player?.name || 'Unknown',
            minute: Math.floor(time / 60),
            value
        };

        const res: any = await MockService.addMatchEvent(match.id, event);
        if (res.success) {
            setLocalMatch(prev => ({ ...prev, score1: res.score1, score2: res.score2, events: [...(prev.events || []), event] }));
            toast({ title: `${type}!`, description: `Updated score for ${teamId === match.team1 ? team1Name : team2Name}` });
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-card border-b p-4 flex justify-between items-center shadow-sm">
                <button onClick={onClose} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-5 h-5" /> Exit
                </button>
                <div className="flex items-center gap-2 font-mono text-xl font-bold text-red-600 bg-red-100 px-3 py-1 rounded">
                    <div className="animate-pulse w-2 h-2 rounded-full bg-red-600" />
                    {formatTime(time)}
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-bold">
                    Finish Match
                </button>
            </div>

            {/* Scoreboard */}
            <div className="bg-muted/30 p-8 flex justify-center items-center gap-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{team1Name}</h2>
                    <div className="text-6xl font-black text-primary">{localMatch.score1 || 0}</div>
                </div>
                <div className="text-2xl font-bold text-muted-foreground">VS</div>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{team2Name}</h2>
                    <div className="text-6xl font-black text-primary">{localMatch.score2 || 0}</div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex-1 grid grid-cols-2 p-6 gap-6 overflow-hidden">
                {/* Team 1 Controls */}
                <div className="bg-card border rounded-xl p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> {team1Name} Actions</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleEvent('GOAL', match.team1)} className="bg-green-100 text-green-700 p-4 rounded-xl font-bold hover:bg-green-200 transition-colors flex flex-col items-center">
                            <Activity className="w-6 h-6 mb-1" /> GOAL
                        </button>
                        <button onClick={() => handleEvent('YELLOW_CARD', match.team1)} className="bg-yellow-100 text-yellow-700 p-4 rounded-xl font-bold hover:bg-yellow-200 transition-colors flex flex-col items-center">
                            <Flag className="w-6 h-6 mb-1 fill-yellow-500" /> CARD
                        </button>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Assist By / Player</h4>
                        <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                            {team1Players.map(p => (
                                <button key={p.id} onClick={() => handleEvent('GOAL', match.team1, p)} className="text-xs border p-2 rounded hover:bg-accent text-left flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center font-mono">{p.number}</span>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team 2 Controls */}
                <div className="bg-card border rounded-xl p-4 flex flex-col gap-4">
                    <h3 className="font-bold text-lg border-b pb-2 flex items-center gap-2"><Trophy className="w-5 h-5 text-blue-500" /> {team2Name} Actions</h3>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handleEvent('GOAL', match.team2)} className="bg-green-100 text-green-700 p-4 rounded-xl font-bold hover:bg-green-200 transition-colors flex flex-col items-center">
                            <Activity className="w-6 h-6 mb-1" /> GOAL
                        </button>
                        <button onClick={() => handleEvent('YELLOW_CARD', match.team2)} className="bg-yellow-100 text-yellow-700 p-4 rounded-xl font-bold hover:bg-yellow-200 transition-colors flex flex-col items-center">
                            <Flag className="w-6 h-6 mb-1 fill-yellow-500" /> CARD
                        </button>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-2">Assist By / Player</h4>
                        <div className="grid grid-cols-2 gap-2 max-h-[150px] overflow-y-auto">
                            {team2Players.map(p => (
                                <button key={p.id} onClick={() => handleEvent('GOAL', match.team2, p)} className="text-xs border p-2 rounded hover:bg-accent text-left flex items-center gap-2">
                                    <span className="bg-primary/10 text-primary w-5 h-5 rounded-full flex items-center justify-center font-mono">{p.number}</span>
                                    {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Feed */}
            <div className="h-[200px] border-t bg-muted/20 p-4 overflow-y-auto">
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Match Feed</h4>
                <div className="space-y-2">
                    {localMatch.events?.slice().reverse().map((e: any) => ( // Show newest first
                        <div key={e.id} className="text-sm flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                            <span className="font-mono text-muted-foreground w-10">{e.minute}'</span>
                            <span className={cn("font-bold px-1.5 py-0.5 rounded text-xs", e.type === 'GOAL' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>{e.type}</span>
                            <span className="font-medium">{e.playerId ? (e.playerName || 'Player') : (e.teamId === match.team1 ? team1Name : team2Name)}</span>
                        </div>
                    ))}
                    {!localMatch.events?.length && <div className="text-muted-foreground text-sm italic">Match started. Waiting for events...</div>}
                </div>
            </div>
        </div>
    );
}
