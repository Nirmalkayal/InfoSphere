import { useEffect, useState } from "react";
import { ApiService } from "@/services/apiService";
import { BracketViewer } from "@/components/tournament/BracketViewer";
import { Leaderboard } from "@/components/tournament/Leaderboard";
import { RefereeManager } from "@/components/tournament/RefereeManager";
import { TournamentReports } from "@/components/tournament/TournamentReports";
import { CreateTournamentWizard } from "@/components/tournament/CreateTournamentWizard";
import { MatchCenter } from "@/components/tournament/MatchCenter";
import { Trophy, Users, Calendar, ArrowRight, X, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Tournaments() {
    const [tournaments, setTournaments] = useState<any[]>([]);
    const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [activeMatch, setActiveMatch] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const loadTournaments = async () => {
        try {
            const data = await ApiService.getTournaments();
            setTournaments(data);
        } catch (e) {
            console.error(e);
            toast({
                title: "Error loading tournaments",
                description: "Failed to fetch tournament data.",
                variant: "destructive",
            });
        }
    };

    // Initial Load
    useEffect(() => {
        loadTournaments();
    }, []);

    // Load Details when Tournament Selected
    useEffect(() => {
        if (selectedTournament) {
            Promise.all([
                ApiService.getMatches(selectedTournament),
                ApiService.getTeams(selectedTournament)
            ]).then(([m, t]) => {
                setMatches(m);
                setTeams(t);
            });
        }
    }, [selectedTournament]);

    const handleMatchClick = (match: any) => {
        setActiveMatch(match);
    };

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Tournaments</h1>
                    <p className="text-muted-foreground">Manage ongoing leagues and cups.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
                >
                    <Trophy className="w-4 h-4" /> New Tournament
                </button>
            </div>

            {/* List */}
            {!selectedTournament ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map(t => (
                        <div key={t.id} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedTournament(t.id)}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Trophy className="w-6 h-6" />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${t.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{t.status}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-1">{t.name}</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {t.startDate} - {t.endDate}</div>
                                <div className="flex items-center gap-2"><Users className="w-4 h-4" /> {t.registeredTeams}/{t.maxTeams} Teams</div>
                            </div>
                            <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm font-medium">
                                <span>Prize: ₹{t.prizePool}</span>
                                <span className="flex items-center gap-1 text-primary">Manage <ArrowRight className="w-4 h-4" /></span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    <button onClick={() => setSelectedTournament(null)} className="text-sm hover:underline flex items-center gap-1 text-muted-foreground">
                        ← Back to List
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Bracket & Management Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card border rounded-xl p-6 overflow-hidden min-h-[500px]">
                                <div className="flex justify-between items-center mb-6 border-b pb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                        Tournament Bracket
                                    </h2>
                                    <span className="text-sm text-muted-foreground">Click a match to open Scoreboard</span>
                                </div>

                                <div className="overflow-x-auto pb-4">
                                    <BracketViewer matches={matches} teams={teams} onMatchClick={handleMatchClick} />
                                </div>
                            </div>

                            {/* Referee Manager */}
                            <RefereeManager tournamentId={selectedTournament} />
                        </div>

                        {/* Stats Section */}
                        <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            <Leaderboard tournamentId={selectedTournament} />

                            {/* Engagement Card */}
                            <div className="bg-gradient-to-br from-primary to-violet-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform" />
                                <h3 className="font-bold text-lg mb-2 relative z-10">Share Results!</h3>
                                <p className="text-white/80 text-sm mb-4 relative z-10">Send current standings to players via WhatsApp.</p>
                                <button
                                    onClick={() => window.open(`/p/tournament/${selectedTournament}`, '_blank')}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 relative z-10"
                                >
                                    <Share2 className="w-4 h-4" /> Broadcast Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Wizard */}
            {isCreateOpen && (
                <CreateTournamentWizard
                    onClose={() => setIsCreateOpen(false)}
                    onSuccess={() => { setIsCreateOpen(false); loadTournaments(); }}
                />
            )}

            {/* Match Center (Live Scoring) */}
            {activeMatch && (
                <MatchCenter
                    match={activeMatch}
                    onClose={() => {
                        setActiveMatch(null);
                        ApiService.getMatches(selectedTournament!).then(setMatches);
                    }}
                />
            )}
        </div>
    );
}
