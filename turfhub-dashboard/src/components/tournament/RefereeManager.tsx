/* RefereeManager.tsx */
import { useEffect, useState } from "react";
import { MockService } from "@/services/mockService";
import { User, Check, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function RefereeManager({ tournamentId }: { tournamentId: string }) {
    const [matches, setMatches] = useState<any[]>([]);
    const [referees, setReferees] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);

    const loadData = async () => {
        const [m, r, t] = await Promise.all([
            MockService.getMatches(tournamentId),
            MockService.getReferees(),
            MockService.getTeams(tournamentId)
        ]);
        setMatches(m);
        setReferees(r);
        setTeams(t);
    };

    useEffect(() => { loadData(); }, [tournamentId]);

    const handleAssign = async (matchId: string, refereeId: string) => {
        await MockService.assignReferee(matchId, refereeId);
        toast({ title: "Referee Assigned", description: "Match official updated." });
        loadData(); // Refresh to show assignment
    };

    const getTeamName = (id: string) => teams.find(t => t.id === id)?.name || 'TBD';

    return (
        <div className="bg-card border rounded-xl overflow-hidden animate-in fade-in">
            <div className="p-6 border-b">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Referee Assignments
                </h3>
                <p className="text-sm text-muted-foreground">Assign officials to upcoming matches.</p>
            </div>

            <div className="divide-y">
                {matches.filter(m => m.status === 'SCHEDULED' || m.status === 'PENDING').map(match => (
                    <div key={match.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                            <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">
                                {match.round === 1 ? 'Quarter Final' : match.round === 2 ? 'Semi Final' : 'Final'}
                            </div>
                            <div className="font-semibold flex items-center gap-2">
                                {match.team1 ? getTeamName(match.team1) : 'TBD'}
                                <span className="text-muted-foreground text-xs">vs</span>
                                {match.team2 ? getTeamName(match.team2) : 'TBD'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {match.refereeId ? (
                                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                    <Check className="w-4 h-4" />
                                    {referees.find(r => r.id === match.refereeId)?.name || 'Unknown'}
                                </div>
                            ) : (
                                <span className="text-xs text-orange-500 font-medium bg-orange-100 px-2 py-1 rounded">Unassigned</span>
                            )}

                            <select
                                className="bg-background border rounded-md text-sm p-2 w-[180px]"
                                value={match.refereeId || ''}
                                onChange={(e) => handleAssign(match.id, e.target.value)}
                            >
                                <option value="" disabled>Select Referee</option>
                                {referees.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} ({r.certification})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                {matches.length === 0 && <div className="p-8 text-center text-muted-foreground">No matches found.</div>}
            </div>
        </div>
    );
}
