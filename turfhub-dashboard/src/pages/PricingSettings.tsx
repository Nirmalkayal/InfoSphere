import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/services/api";
import { Plus, DollarSign, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingRule {
    _id: string;
    name: string;
    dayOfWeek: number[];
    startTime: string;
    endTime: string;
    adjustmentType: 'percentage' | 'flat';
    adjustmentValue: number;
    isActive: boolean;
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function PricingSettings() {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: 'Weekend Surge',
        dayOfWeek: [0, 6], // Sun, Sat
        startTime: '18:00',
        endTime: '22:00',
        adjustmentType: 'percentage',
        adjustmentValue: 20
    });

    useEffect(() => {
        loadRules();
    }, []);

    async function loadRules() {
        try {
            const { data } = await adminApi.get('/pricing-rules');
            setRules(data);
        } catch (e) { console.error(e); }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await adminApi.post('/pricing-rules', formData);
            setShowForm(false);
            alert('Rule Created!');
            loadRules();
        } catch (e) { alert('Failed'); }
    }

    function toggleDay(dayIndex: number) {
        setFormData(prev => {
            const days = prev.dayOfWeek.includes(dayIndex)
                ? prev.dayOfWeek.filter(d => d !== dayIndex)
                : [...prev.dayOfWeek, dayIndex];
            return { ...prev, dayOfWeek: days };
        });
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dynamic Pricing</h1>
                    <p className="text-muted-foreground mt-1">Configure surge pricing for peak hours and weekends.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Pricing Rule
                </Button>
            </div>

            {showForm && (
                <div className="bg-muted/30 p-6 rounded-xl border border-border max-w-lg mx-auto">
                    <h3 className="text-lg font-semibold mb-4">New Pricing Rule</h3>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Rule Name</label>
                            <input type="text" className="w-full p-2 rounded border text-black" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Days Active</label>
                            <div className="flex gap-2 flex-wrap">
                                {dayNames.map((day, idx) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(idx)}
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-medium border",
                                            formData.dayOfWeek.includes(idx) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border"
                                        )}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Time</label>
                                <input type="time" className="w-full p-2 rounded border text-black" value={formData.startTime} onChange={e => setFormData({ ...formData, startTime: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Time</label>
                                <input type="time" className="w-full p-2 rounded border text-black" value={formData.endTime} onChange={e => setFormData({ ...formData, endTime: e.target.value })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select className="w-full p-2 rounded border text-black" value={formData.adjustmentType} onChange={e => setFormData({ ...formData, adjustmentType: e.target.value as any })}>
                                    <option value="percentage">Percentage (+%)</option>
                                    <option value="flat">Flat Price (₹)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input type="number" className="w-full p-2 rounded border text-black" value={formData.adjustmentValue} onChange={e => setFormData({ ...formData, adjustmentValue: Number(e.target.value) })} required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit">Create Rule</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Rule List */}
            <div className="grid gap-4">
                {rules.map(rule => (
                    <div key={rule._id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold">{rule.name}</h4>
                                <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {rule.dayOfWeek.map(d => dayNames[d]).join(', ')}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rule.startTime} - {rule.endTime}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-bold text-primary">
                                {rule.adjustmentType === 'percentage' ? `+${rule.adjustmentValue}%` : `₹${rule.adjustmentValue}`}
                            </div>
                            <div className={cn("text-xs font-medium", rule.isActive ? "text-green-600" : "text-gray-400")}>
                                {rule.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>
                ))}
                {rules.length === 0 && (
                    <p className="text-center text-muted-foreground py-10">No pricing rules configured.</p>
                )}
            </div>
        </div>
    );
}
