import { ChevronsRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface Match {
    id: string;
    tournamentId: string;
    round: number;
    team1: string | null;
    team2: string | null;
    score1: number | null;
    score2: number | null;
    winner: string | null;
    status: string;
    nextMatchId: string | null;
}

interface Team {
    id: string;
    name: string;
}

interface BracketViewerProps {
    matches: Match[];
    teams: Team[];
    onMatchClick: (match: Match) => void;
}

export function BracketViewer({ matches, teams, onMatchClick }: BracketViewerProps) {
    // Group matches by round
    const rounds = [1, 2, 3]; // Assuming 3 rounds for now (Quarter, Semi, Final)

    const getTeamName = (id: string | null) => {
        if (!id) return "TBD";
        return teams.find(t => t.id === id)?.name || "Unknown";
    };

    return (
        <div className="flex items-center gap-8 overflow-x-auto p-4 min-w-[800px]">
            {rounds.map((round) => {
                const roundMatches = matches.filter(m => m.round === round);
                const roundName = round === 3 ? "Final" : round === 2 ? "Semi Finals" : "Quarter Finals";

                return (
                    <div key={round} className="flex flex-col flex-1 gap-8 justify-center min-w-[200px]">
                        <h3 className="text-center text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">{roundName}</h3>
                        <div className="flex flex-col justify-around h-full gap-8">
                            {roundMatches.map((match) => (
                                <div
                                    key={match.id}
                                    onClick={() => onMatchClick(match)}
                                    className="relative bg-card border border-border rounded-lg shadow-sm p-3 hover:border-primary/50 cursor-pointer transition-all group"
                                >
                                    {/* Connector Line (Right) - Skip for Final */}
                                    {round < 3 && (
                                        <div className="absolute top-1/2 -right-8 w-8 h-px bg-border group-hover:bg-primary/50 transition-colors" />
                                    )}

                                    {/* Connector Line (Vertical) - Just for visual if wanted, skip for now to keep simple list */}

                                    <div className="space-y-2">
                                        {/* Team 1 */}
                                        <div className={cn("flex justify-between items-center text-sm p-1 rounded", match.winner === match.team1 && match.status === 'COMPLETED' ? "bg-green-500/10 font-bold text-green-700" : "")}>
                                            <span className="truncate max-w-[120px]">{getTeamName(match.team1)}</span>
                                            <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{match.score1 ?? '-'}</span>
                                        </div>
                                        <div className="h-px bg-border/50" />
                                        {/* Team 2 */}
                                        <div className={cn("flex justify-between items-center text-sm p-1 rounded", match.winner === match.team2 && match.status === 'COMPLETED' ? "bg-green-500/10 font-bold text-green-700" : "")}>
                                            <span className="truncate max-w-[120px]">{getTeamName(match.team2)}</span>
                                            <span className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{match.score2 ?? '-'}</span>
                                        </div>
                                    </div>

                                    {round === 3 && match.winner && (
                                        <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg animate-bounce">
                                            <Trophy className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
