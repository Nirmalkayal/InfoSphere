/* Campaigns.tsx - Marketing Autopilot */
import { useState } from "react";
import { MockService } from "@/services/mockService";
import { Zap, CloudRain, Calendar, Users, Send, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Mock Campaign Templates
const CAMPAIGNS = [
    {
        id: 'c1',
        title: 'Rainy Day Flash Sale',
        description: 'Heavy rain predicted? Fill empty slots with a 50% discount blast.',
        icon: CloudRain,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        audience: '142 Nearby Users',
        potentialRevenue: '₹4,500'
    },
    {
        id: 'c2',
        title: 'Weekend Slot Filler',
        description: '2 PM - 5 PM slots empty on Saturday? Alert your regulars.',
        icon: Calendar,
        color: 'text-orange-400',
        bg: 'bg-orange-500/10',
        audience: '850 Regulars',
        potentialRevenue: '₹12,000'
    },
    {
        id: 'c3',
        title: 'Win-Back "Miss You"',
        description: 'Users who haven\'t booked in 30 days. Offer 10% off.',
        icon: Users,
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        audience: '45 Churn Risks',
        potentialRevenue: '₹2,200'
    }
];

export default function Campaigns() {
    const [activeCampaign, setActiveCampaign] = useState<string | null>(null);
    const [sendingState, setSendingState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [progress, setProgress] = useState(0);

    const handleLaunch = (id: string) => {
        setActiveCampaign(id);
        setSendingState('sending');
        setProgress(0);

        // Simulation
        let p = 0;
        const interval = setInterval(() => {
            p += 5;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setSendingState('sent');
                toast({
                    title: "Campaign Sent!",
                    description: "Messages delivered via WhatsApp API."
                });

                // Reset after delay
                setTimeout(() => {
                    setSendingState('idle');
                    setActiveCampaign(null);
                    setProgress(0);
                }, 3000);
            }
        }, 100);
    };

    return (
        <div className="space-y-8 animate-fade-in p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" /> Marketing Autopilot
                    </h1>
                    <p className="text-muted-foreground">One-click campaigns to boost occupancy.</p>
                </div>
            </div>

            {/* Campaign Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CAMPAIGNS.map(campaign => (
                    <div
                        key={campaign.id}
                        className={cn(
                            "group relative overflow-hidden bg-card border rounded-xl p-6 transition-all hover:shadow-xl hover:border-primary/50",
                            activeCampaign === campaign.id && sendingState !== 'idle' ? "ring-2 ring-primary border-primary" : ""
                        )}
                    >
                        {/* Background Decoration */}
                        <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-transform group-hover:scale-150", campaign.bg.replace('/10', '/30'))} />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={cn("p-3 rounded-lg", campaign.bg, campaign.color)}>
                                <campaign.icon className="w-6 h-6" />
                            </div>
                            <div className="bg-background/50 backdrop-blur-sm border px-2 py-1 rounded text-xs font-bold text-muted-foreground">
                                {campaign.audience}
                            </div>
                        </div>

                        <h3 className="font-bold text-lg mb-2 relative z-10">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground mb-6 h-10 relative z-10">{campaign.description}</p>

                        <div className="flex items-center justify-between text-sm font-medium mb-4 relative z-10">
                            <span className="text-muted-foreground">Est. Revenue</span>
                            <span className="text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> {campaign.potentialRevenue}
                            </span>
                        </div>

                        {activeCampaign === campaign.id && sendingState === 'sending' ? (
                            <div className="space-y-2 relative z-10">
                                <div className="flex justify-between text-xs font-bold text-primary">
                                    <span>Sending Blast...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-100 ease-linear"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        ) : activeCampaign === campaign.id && sendingState === 'sent' ? (
                            <button disabled className="w-full bg-green-500 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-default relative z-10">
                                <CheckCircle2 className="w-4 h-4" /> Sent Successfully
                            </button>
                        ) : (
                            <button
                                onClick={() => handleLaunch(campaign.id)}
                                disabled={activeCampaign !== null}
                                className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                            >
                                <Send className="w-4 h-4" /> Launch Campaign
                            </button>
                        )}
                    </div>
                ))}

                {/* Create Custom placeholder */}
                <div className="border border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer min-h-[280px]">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-foreground">Create Custom</h3>
                    <p className="text-sm mt-1 max-w-[200px]">Design your own message template and target audience.</p>
                </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-card border rounded-xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-700 rounded-full">
                        <Send className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">1,240</div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Messages Sent</div>
                    </div>
                </div>
                <div className="bg-card border rounded-xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-700 rounded-full">
                        <Users className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">18.5%</div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Conversion Rate</div>
                    </div>
                </div>
                <div className="bg-card border rounded-xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold">₹24,500</div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Revenue Generated</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Plus } from "lucide-react";
