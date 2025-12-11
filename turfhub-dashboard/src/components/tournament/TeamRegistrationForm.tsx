/* TeamRegistrationForm.tsx */
import { useState } from "react";
import { MockService } from "@/services/mockService";
import { User, Shield, Phone, Plus, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TeamRegistrationFormProps {
    tournamentId: string;
    onClose: () => void;
}

export function TeamRegistrationForm({ tournamentId, onClose }: TeamRegistrationFormProps) {
    const [name, setName] = useState("");
    const [captain, setCaptain] = useState("");
    const [contact, setContact] = useState("");
    const [players, setPlayers] = useState<string[]>(['']);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddPlayer = () => setPlayers([...players, '']);
    const handlePlayerChange = (idx: number, val: string) => {
        const newPlayers = [...players];
        newPlayers[idx] = val;
        setPlayers(newPlayers);
    };
    const handleRemovePlayer = (idx: number) => {
        setPlayers(players.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation
        if (!name || !captain || !contact) {
            toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        const validPlayers = players.filter(p => p.trim() !== "");
        if (validPlayers.length < 5) {
            toast({ title: "Error", description: "Minimum 5 players required.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        await MockService.registerTeam(tournamentId, {
            name,
            captain,
            contact,
            players: validPlayers
        });

        toast({ title: "Registration Submitted!", description: "Your team request is pending approval." });
        onClose();
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-card w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border animate-in zoom-in-95">
                <div className="p-6 border-b flex justify-between items-center bg-muted/20">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" /> Team Registration
                        </h2>
                        <p className="text-sm text-muted-foreground">Join the tournament</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Team Name</label>
                        <input
                            className="bg-background border rounded-lg w-full p-2.5 focus:ring-2 ring-primary"
                            placeholder="e.g. Thunder Strikers"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Captain Name</label>
                            <input
                                className="bg-background border rounded-lg w-full p-2.5"
                                placeholder="Captain"
                                value={captain}
                                onChange={e => setCaptain(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Contact Number</label>
                            <input
                                className="bg-background border rounded-lg w-full p-2.5"
                                placeholder="+91 98765..."
                                value={contact}
                                onChange={e => setContact(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <label className="text-sm font-medium flex justify-between items-center">
                            Squad List <span className="text-xs text-muted-foreground">(Min 5)</span>
                        </label>
                        {players.map((player, idx) => (
                            <div key={idx} className="flex gap-2">
                                <span className="flex items-center justify-center w-8 h-10 bg-muted rounded font-mono text-xs text-muted-foreground">
                                    {idx + 1}
                                </span>
                                <input
                                    className="bg-background border rounded-lg w-full p-2 text-sm"
                                    placeholder={`Player ${idx + 1} Name`}
                                    value={player}
                                    onChange={e => handlePlayerChange(idx, e.target.value)}
                                />
                                {players.length > 5 && (
                                    <button type="button" onClick={() => handleRemovePlayer(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleAddPlayer} className="text-sm text-primary font-bold flex items-center gap-1 hover:underline mt-2">
                            <Plus className="w-4 h-4" /> Add Player
                        </button>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn("w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:shadow-lg transition-all", isSubmitting && "opacity-50")}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Registration"}
                        </button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                            By registering, you agree to the tournament rules.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
