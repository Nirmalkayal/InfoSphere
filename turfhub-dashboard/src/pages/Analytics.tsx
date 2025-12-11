import { useState, useEffect } from "react";
import { adminApi } from "@/services/api";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";

interface AnalyticsData {
    stats: {
        revenue: number;
        expenses: number;
        profit: number;
        bookings: number;
    };
    revenueChart: { _id: string; revenue: number }[];
    peakHours: { hour: number; count: number }[];
    platforms: { name: string; value: number }[];
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

export default function Analytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const { data } = await adminApi.get('/analytics');
            setData(data);
        } catch (e) { console.error(e); }
    }

    if (!data) return <div className="p-8">Loading Analytics...</div>;

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Business Analytics</h1>
                <p className="text-muted-foreground mt-1">Insights into revenue, peak hours, and platform performance.</p>
            </div>

            {/* HEADLINE STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Revenue</p>
                        <h3 className="text-2xl font-bold">₹{data.stats.revenue.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><TrendingUp className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Net Profit</p>
                        <h3 className="text-2xl font-bold">₹{data.stats.profit.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Calendar className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Bookings</p>
                        <h3 className="text-2xl font-bold">{data.stats.bookings}</h3>
                    </div>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full"><Users className="w-6 h-6" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Expenses</p>
                        <h3 className="text-2xl font-bold">₹{data.stats.expenses.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* REVENUE TREND */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-lg font-semibold mb-6">Revenue Trend (Last 7 Days)</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.revenueChart}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="_id" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="#e0f2fe" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* PEAK HOURS */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-lg font-semibold mb-6">Peak Booking Hours</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.peakHours}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}:00`} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* PLATFORM DISTRIBUTION */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="text-lg font-semibold mb-6">Booking Source</h3>
                    <div className="h-[300px] w-full flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.platforms}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.platforms.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
