import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/services/api";
import { Plus, Tag, Calendar, Percent, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    minOrderValue: number;
    expiryDate: string;
    isActive: boolean;
    usedCount: number;
}

export default function Marketing() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 0,
        expiryDate: '',
        maxDiscount: 100
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        try {
            const { data } = await adminApi.get('/coupons');
            setCoupons(data);
        } catch (e) { console.error(e); }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await adminApi.post('/coupons', formData);
            setShowForm(false);
            alert('Coupon Created!');
            loadCoupons();
        } catch (e) { alert('Failed'); }
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Marketing & Promotions</h1>
                    <p className="text-muted-foreground mt-1">Create discount codes to boost bookings.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Coupon
                </Button>
            </div>

            {showForm && (
                <div className="bg-muted/30 p-6 rounded-xl border border-border max-w-lg mx-auto">
                    <h3 className="text-lg font-semibold mb-4">New Coupon</h3>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Coupon Code</label>
                            <input type="text" placeholder="e.g. SUMMER50" className="w-full p-2 rounded border text-black uppercase" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select className="w-full p-2 rounded border text-black" value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value as any })}>
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Amount (₹)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Value</label>
                                <input type="number" className="w-full p-2 rounded border text-black" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Min Order (₹)</label>
                                <input type="number" className="w-full p-2 rounded border text-black" value={formData.minOrderValue} onChange={e => setFormData({ ...formData, minOrderValue: Number(e.target.value) })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                <input type="date" className="w-full p-2 rounded border text-black" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit">Create Coupon</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid gap-4">
                {coupons.map(c => (
                    <div key={c._id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-pink-100 text-pink-600 rounded-full">
                                <Ticket className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">{c.code}</h4>
                                <p className="text-sm text-gray-500">
                                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                                    {c.minOrderValue > 0 && ` • Min Order ₹${c.minOrderValue}`}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-medium text-muted-foreground flex items-center gap-1 justify-end">
                                <Calendar className="w-3 h-3" /> Expires {new Date(c.expiryDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Used {c.usedCount} times
                            </div>
                        </div>
                    </div>
                ))}
                {coupons.length === 0 && (
                    <p className="text-center text-muted-foreground py-10">No coupons active.</p>
                )}
            </div>
        </div>
    );
}
