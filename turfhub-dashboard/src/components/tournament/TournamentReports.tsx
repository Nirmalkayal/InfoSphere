/* TournamentReports.tsx - Analytics & Exports */
import { useEffect, useState } from "react";
import { MockService } from "@/services/mockService";
import { Download, FileText, Printer, Table } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function TournamentReports({ tournamentId }: { tournamentId: string }) {
    const [matches, setMatches] = useState<any[]>([]);
    const [players, setPlayers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'matches' | 'players'>('matches');

    useEffect(() => {
        Promise.all([
            MockService.getMatches(tournamentId),
            MockService.getLeaderboard(tournamentId), // Reusing Leaderboard logic for player stats
            MockService.getTeams(tournamentId)
        ]).then(([m, p, t]) => {
            setMatches(m);
            setPlayers(p as any[]);
            setTeams(t);
        });
    }, [tournamentId]);

    const downloadCSV = (type: 'matches' | 'players') => {
        let headers = "";
        let rows: string[] = [];
        const filename = `tournament_${type}_${new Date().toISOString().split('T')[0]}.csv`;

        if (type === 'matches') {
            headers = "Match ID,Round,Team 1,Team 2,Score 1,Score 2,Winner,Status,Referee\n";
            rows = matches.map(m => {
                const t1 = teams.find(t => t.id === m.team1)?.name || 'TBD';
                const t2 = teams.find(t => t.id === m.team2)?.name || 'TBD';
                return `${m.id},${m.round},${t1},${t2},${m.score1 || 0},${m.score2 || 0},${m.winner || '-'},${m.status},${m.refereeId || 'None'}`;
            });
        } else {
            headers = "Player ID,Name,Team ID,Total Score\n";
            rows = players.map(p => `${p.id},${p.name},${p.teamId},${p.score}`);
        }

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Complete", description: `Downloaded ${filename}` });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-card border rounded-xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b flex justify-between items-center bg-muted/20">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" /> Reports & Analytics
                    </h3>
                    <p className="text-sm text-muted-foreground">Export data for offline analysis.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="p-2 hover:bg-background rounded border text-muted-foreground hover:text-foreground" title="Print View">
                        <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={() => downloadCSV(activeTab)} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab('matches')}
                    className={cn("px-6 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'matches' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                    Match Results
                </button>
                <button
                    onClick={() => setActiveTab('players')}
                    className={cn("px-6 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'players' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
                >
                    Player Performance
                </button>
            </div>

            {/* Content */}
            <div className="p-0">
                {activeTab === 'matches' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Round</th>
                                    <th className="px-6 py-3">Fixture</th>
                                    <th className="px-6 py-3 text-center">Score</th>
                                    <th className="px-6 py-3">Winner</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {matches.map(m => (
                                    <tr key={m.id} className="hover:bg-muted/30">
                                        <td className="px-6 py-4 font-mono">{m.round === 3 ? 'Final' : `Round ${m.round}`}</td>
                                        <td className="px-6 py-4">
                                            <span className={cn(m.winner === m.team1 && "font-bold text-green-600")}>{teams.find(t => t.id === m.team1)?.name || 'TBD'}</span>
                                            <span className="text-muted-foreground mx-2">vs</span>
                                            <span className={cn(m.winner === m.team2 && "font-bold text-green-600")}>{teams.find(t => t.id === m.team2)?.name || 'TBD'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold font-mono">
                                            {m.score1 !== null ? `${m.score1} - ${m.score2}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {m.winner ? (teams.find(t => t.id === m.winner)?.name || 'Unknown') : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-bold",
                                                m.status === 'COMPLETED' ? "bg-green-100 text-green-700" :
                                                    m.status === 'LIVE' ? "bg-red-100 text-red-700 animate-pulse" :
                                                        "bg-gray-100 text-gray-700"
                                            )}>
                                                {m.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {matches.length === 0 && <tr><td colSpan={5} className="text-center p-8 text-muted-foreground">No matches found.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'players' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Rank</th>
                                    <th className="px-6 py-3">Player Name</th>
                                    <th className="px-6 py-3">Team</th>
                                    <th className="px-6 py-3 text-right">Total Score (G/R)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {players.map((p, i) => (
                                    <tr key={p.id} className="hover:bg-muted/30">
                                        <td className="px-6 py-4 font-mono text-muted-foreground">#{i + 1}</td>
                                        <td className="px-6 py-4 font-bold">{p.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{p.teamId === 'tm1' ? 'Spartans FC' : p.teamId === 'tm2' ? 'Turf Kings' : 'Team 3'}</td>
                                        <td className="px-6 py-4 text-right font-black text-primary">{p.score}</td>
                                    </tr>
                                ))}
                                {players.length === 0 && <tr><td colSpan={4} className="text-center p-8 text-muted-foreground">No player stats recorded yet.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
