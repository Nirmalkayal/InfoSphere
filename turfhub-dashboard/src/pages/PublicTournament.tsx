/* PublicTournament.tsx - Standalone Mobile-First Landing Page */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MockService } from "@/services/mockService";
import { BracketViewer } from "@/components/tournament/BracketViewer";
import { Leaderboard } from "@/components/tournament/Leaderboard";
import { TeamRegistrationForm } from "@/components/tournament/TeamRegistrationForm";
import { Trophy, Calendar, MapPin, Share2, ArrowLeft, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function PublicTournament() {
    const { id: tournamentId } = useParams();
    const [tournament, setTournament] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'matches'>('overview');
    const [isRegOpen, setIsRegOpen] = useState(false);

    useEffect(() => {
        if (tournamentId) {
            MockService.getTournaments().then(ts => setTournament(ts.find((t: any) => t.id === tournamentId)));
            MockService.getMatches(tournamentId).then(setMatches);
            MockService.getTeams(tournamentId).then(setTeams);
        }
    }, [tournamentId]);

    if (!tournament) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading...</div>;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied!", description: "Share this page with your friends." });
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans pb-20">
            {/* Hero Header */}
            <div className="relative h-[250px] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000')] bg-cover bg-center opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <button onClick={() => window.close()} className="mb-4 text-white/60 hover:text-white flex items-center gap-1 text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </button>
                    <div className="flex justify-between items-end">
                        <div>
                            <span className="inline-block px-2 py-1 rounded bg-yellow-500/20 text-yellow-500 text-xs font-bold mb-2 border border-yellow-500/30">
                                {tournament.sport?.toUpperCase() || 'SPORTS'}
                            </span>
                            <h1 className="text-3xl font-black tracking-tight mb-2">{tournament.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-white/70">
                                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {tournament.startDate}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Central Arena</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleShare} className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 p-2.5 rounded-full transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                            {tournament.status === 'UPCOMING' && (
                                <button
                                    onClick={() => setIsRegOpen(true)}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/25 transition-all animate-pulse"
                                >
                                    Register Team
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="sticky top-0 z-30 bg-neutral-950/80 backdrop-blur-md border-b border-white/10 px-6 overflow-x-auto">
                <div className="flex gap-8 min-w-max">
                    {['overview', 'leaderboard', 'matches'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-all",
                                activeTab === tab ? "border-primary text-white" : "border-transparent text-white/40 hover:text-white/70"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 max-w-4xl mx-auto space-y-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-4">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-white mb-1">₹{tournament.prizePool}</div>
                                <div className="text-xs text-white/50 uppercase tracking-widest">Prize Pool</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-white mb-1">{teams.length}</div>
                                <div className="text-xs text-white/50 uppercase tracking-widest">Teams</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-white mb-1">{matches.length}</div>
                                <div className="text-xs text-white/50 uppercase tracking-widest">Matches</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className="text-2xl font-black text-green-400 mb-1">{tournament.status}</div>
                                <div className="text-xs text-white/50 uppercase tracking-widest">Status</div>
                            </div>
                        </div>

                        {/* Participating Teams */}
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-primary" /> Participating Teams
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {teams.map(team => (
                                    <div key={team.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                                            {team.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold">{team.name}</div>
                                            <div className="text-xs text-white/50">{team.players?.length || 11} Players</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'leaderboard' && (
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden p-4">
                        <Leaderboard tournamentId={tournamentId || ''} />
                    </div>
                )}

                {activeTab === 'matches' && (
                    <div className="bg-white text-black rounded-xl overflow-hidden min-h-[500px] p-4">
                        <BracketViewer matches={matches} teams={teams} onMatchClick={() => { }} />
                    </div>
                )}
            </div>

            {/* Modals */}
            {isRegOpen && tournamentId && (
                <TeamRegistrationForm
                    tournamentId={tournamentId}
                    onClose={() => setIsRegOpen(false)}
                />
            )}
            <div className="fixed bottom-4 left-0 right-0 text-center">
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Powered by TurfHub Engine</p>
            </div>
        </div>
    );
}
