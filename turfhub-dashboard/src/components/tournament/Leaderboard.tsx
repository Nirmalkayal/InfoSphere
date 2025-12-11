/* Leaderboard.tsx - Top Scorers Visualization */
import { useEffect, useState } from "react";
import { MockService } from "@/services/mockService";
import { Medal, TrendingUp, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
    tournamentId: string;
}

export function Leaderboard({ tournamentId }: LeaderboardProps) {
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {
        MockService.getLeaderboard(tournamentId).then((data: any) => setPlayers(data));
    }, [tournamentId]);

    const getRankStyle = (index: number) => {
        if (index === 0) return "bg-yellow-100 text-yellow-700 border-yellow-200";
        if (index === 1) return "bg-gray-100 text-gray-700 border-gray-200";
        if (index === 2) return "bg-orange-100 text-orange-700 border-orange-200";
        return "bg-card border-border";
    };

    const getIcon = (index: number) => {
        if (index === 0) return <Medal className="w-6 h-6 text-yellow-500 fill-yellow-200" />;
        if (index === 1) return <Medal className="w-6 h-6 text-gray-400 fill-gray-200" />;
        if (index === 2) return <Medal className="w-6 h-6 text-orange-500 fill-orange-200" />;
        return <span className="w-6 text-center font-bold text-muted-foreground">#{index + 1}</span>;
    };

    return (
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in">
            <div className="p-4 border-b flex justify-between items-center bg-muted/20">
                <h3 className="font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Top Performers
                </h3>
                <button className="text-xs flex items-center gap-1 text-primary hover:underline">
                    <Share2 className="w-3 h-3" /> Share
                </button>
            </div>

            <div className="p-0">
                {players.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground italic">
                        No stats recorded yet.
                    </div>
                ) : (
                    <div className="divide-y">
                        {players.map((p, i) => (
                            <div key={p.id} className={cn("p-4 flex items-center justify-between hover:bg-muted/50 transition-colors", i < 3 && "bg-opacity-20", i === 0 && "bg-yellow-50/50")}>
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 w-8 flex justify-center">
                                        {getIcon(i)}
                                    </div>
                                    <div>
                                        <p className="font-bold">{p.name}</p>
                                        <p className="text-xs text-muted-foreground uppercase">{p.teamId === 'tm1' ? 'Spartans FC' : p.teamId === 'tm2' ? 'Turf Kings' : 'Team 3'}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xl font-black text-primary">{p.score}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Points</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
