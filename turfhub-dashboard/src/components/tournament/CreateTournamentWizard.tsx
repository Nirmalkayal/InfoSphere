import { useState } from "react";
import { Trophy, Calendar, CheckCircle, ArrowRight, Shield, Clock } from "lucide-react";
import { MockService } from "@/services/mockService";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface WizardProps {
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateTournamentWizard({ onClose, onSuccess }: WizardProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        sport: "Football", // Football, Cricket, Badminton
        type: "KNOCKOUT",
        maxTeams: 8,
        entryFee: 2000,
        prizePool: 10000,
        startDate: "",
        endDate: "",
        startTime: "09:00",
        endTime: "18:00",
        groundIds: ['all'] // Mock: block all matching grounds
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Construct the payload for MockService
            const payload = {
                name: formData.name,
                type: formData.type,
                sport: formData.sport,
                status: 'UPCOMING',
                startDate: formData.startDate,
                endDate: formData.endDate,
                prizePool: formData.prizePool,
                entryFee: formData.entryFee,
                maxTeams: formData.maxTeams,
                scheduleConfig: {
                    groundIds: formData.groundIds,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    startTime: formData.startTime,
                    endTime: formData.endTime
                }
            };

            await MockService.createTournament(payload);
            toast({
                title: "Tournament Created!",
                description: `Slots from ${formData.startDate} to ${formData.endDate} have been auto-blocked.`
            });
            onSuccess();
        } catch (e) {
            toast({ title: "Error", description: "Failed to create tournament", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-primary" /> Create Tournament
                        </h2>
                        <p className="text-muted-foreground">Step {step} of 3</p>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={cn("h-2 w-8 rounded-full transition-all", step >= i ? "bg-primary" : "bg-muted")} />
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <label className="font-semibold">Tournament Name</label>
                                <input
                                    className="w-full p-3 bg-muted rounded-xl border focus:ring-2 ring-primary/20 outline-none"
                                    placeholder="e.g. Winter Corporate Cup"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-semibold">Sport</label>
                                    <select
                                        className="w-full p-3 bg-muted rounded-xl border"
                                        value={formData.sport}
                                        onChange={(e) => handleChange('sport', e.target.value)}
                                    >
                                        <option value="Football">Football</option>
                                        <option value="Cricket">Cricket</option>
                                        <option value="Badminton">Badminton</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-semibold">Format</label>
                                    <select
                                        className="w-full p-3 bg-muted rounded-xl border"
                                        value={formData.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                    >
                                        <option value="KNOCKOUT">Knockout (Single Elim)</option>
                                        <option value="LEAGUE">League (Round Robin)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4">
                            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                                <Shield className="w-5 h-5 text-primary mt-1" />
                                <div>
                                    <h4 className="font-bold text-primary">Smart Scheduling (USP)</h4>
                                    <p className="text-sm text-muted-foreground">We will automatically block slots on your calendar for these dates.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-semibold">Start Date</label>
                                    <input type="date" className="w-full p-3 bg-muted rounded-xl border" value={formData.startDate} onChange={e => handleChange('startDate', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="font-semibold">End Date</label>
                                    <input type="date" className="w-full p-3 bg-muted rounded-xl border" value={formData.endDate} onChange={e => handleChange('endDate', e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-semibold">Daily Start Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                        <select className="w-full p-3 pl-10 bg-muted rounded-xl border" value={formData.startTime} onChange={e => handleChange('startTime', e.target.value)}>
                                            <option value="09:00">09:00 AM</option>
                                            <option value="12:00">12:00 PM</option>
                                            <option value="18:00">06:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="font-semibold">Daily End Time</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                                        <select className="w-full p-3 pl-10 bg-muted rounded-xl border" value={formData.endTime} onChange={e => handleChange('endTime', e.target.value)}>
                                            <option value="14:00">02:00 PM</option>
                                            <option value="18:00">06:00 PM</option>
                                            <option value="22:00">10:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 text-center">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold">Ready to Launch!</h3>
                            <p className="text-muted-foreground">
                                We will create <strong>{formData.name}</strong> and block slots from
                                <br />{formData.startDate} to {formData.endDate} ({formData.startTime} - {formData.endTime}).
                            </p>

                            <div className="bg-muted p-4 rounded-xl max-w-xs mx-auto text-left space-y-2 mt-4">
                                <div className="flex justify-between"><span>Entry Fee:</span> <span>₹{formData.entryFee}</span></div>
                                <div className="flex justify-between"><span>Prize Pool:</span> <span>₹{formData.prizePool}</span></div>
                                <div className="flex justify-between"><span>Max Teams:</span> <span>{formData.maxTeams}</span></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-muted/30 flex justify-between">
                    <button
                        onClick={() => step === 1 ? onClose() : setStep(s => s - 1)}
                        className="px-6 py-2 rounded-xl hover:bg-muted font-medium"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                        >
                            Next <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-600 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Launch Tournament'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
