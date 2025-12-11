/* Coaching.tsx - Academy & Memberships Manager */
import { useState, useEffect } from "react";
import { MockService } from "@/services/mockService";
import {
    Users,
    Calendar,
    CheckCircle2,
    AlertTriangle,
    BadgeIndianRupee,
    Clock,
    Plus,
    Search,
    GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Coaching() {
    const [activeTab, setActiveTab] = useState<'batches' | 'students'>('batches');
    const [batches, setBatches] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showBatchForm, setShowBatchForm] = useState(false);

    // New Batch Form State
    const [newBatch, setNewBatch] = useState({
        name: '',
        startTime: '16:00',
        endTime: '18:00',
        price: 1500,
        days: ['Mon', 'Wed', 'Fri'],
        sport: 'Football'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [b, s] = await Promise.all([
            MockService.getBatches(),
            MockService.getStudents()
        ]);
        setBatches(b);
        setStudents(s);
    };

    const handleCreateBatch = async () => {
        if (!newBatch.name) return toast({ title: "Name required", variant: "destructive" });
        await MockService.createBatch({
            ...newBatch,
            students: 0,
            maxStudents: 20,
            color: 'bg-indigo-100 text-indigo-700'
        });
        toast({ title: "Batch Created", description: "Slots will be auto-blocked." });
        setShowBatchForm(false);
        loadData();
    };

    const handleMarkPaid = async (id: string, name: string) => {
        await MockService.updateStudentStatus(id, 'PAID');
        toast({ title: "Updated", description: `${name} marked as PAID.` });
        loadData();
    };

    // Derived Stats
    const totalRevenue = batches.reduce((acc, b) => acc + (b.students * b.price), 0);
    const pendingFees = students.filter(s => s.status !== 'PAID').length;
    const activeStudents = students.length;

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact.includes(searchTerm)
    );

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <GraduationCap className="w-8 h-8 text-primary" /> Coaching & Memberships
                    </h1>
                    <p className="text-muted-foreground mt-1">Manage academy batches, students, and monthly memberships.</p>
                </div>

                <div className="flex bg-muted rounded-lg p-1 self-start">
                    <button
                        onClick={() => setActiveTab('batches')}
                        className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'batches' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
                    >Batches</button>
                    <button
                        onClick={() => setActiveTab('students')}
                        className={cn("px-4 py-2 rounded-md text-sm font-medium transition-all", activeTab === 'students' ? "bg-card shadow-sm text-foreground" : "text-muted-foreground")}
                    >Students & Fees</button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <BadgeIndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                        <h3 className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="p-6 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Active Students</p>
                        <h3 className="text-2xl font-bold">{activeStudents}</h3>
                    </div>
                </div>
                <div className="p-6 rounded-xl border bg-card shadow-sm flex items-center gap-4">
                    <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Pending Fees From</p>
                        <h3 className="text-2xl font-bold">{pendingFees} Students</h3>
                    </div>
                </div>
            </div>

            {/* BATCHES TAB */}
            {activeTab === 'batches' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg">Active Batches</h3>
                        <Button onClick={() => setShowBatchForm(!showBatchForm)} className="gap-2">
                            <Plus className="w-4 h-4" /> Create Batch
                        </Button>
                    </div>

                    {showBatchForm && (
                        <div className="bg-muted/40 p-6 rounded-xl border animate-in slide-in-from-top-2 max-w-2xl">
                            <h4 className="font-bold mb-4">New Coaching Batch</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input placeholder="Batch Name (e.g. U-14 Football)" value={newBatch.name} onChange={e => setNewBatch({ ...newBatch, name: e.target.value })} />
                                <Input placeholder="Fees (₹/month)" type="number" value={newBatch.price} onChange={e => setNewBatch({ ...newBatch, price: Number(e.target.value) })} />
                                <div className="flex gap-2">
                                    <Input type="time" value={newBatch.startTime} onChange={e => setNewBatch({ ...newBatch, startTime: e.target.value })} />
                                    <span className="self-center">to</span>
                                    <Input type="time" value={newBatch.endTime} onChange={e => setNewBatch({ ...newBatch, endTime: e.target.value })} />
                                </div>
                                <Input placeholder="Sport" value={newBatch.sport} onChange={e => setNewBatch({ ...newBatch, sport: e.target.value })} />
                            </div>
                            <Button onClick={handleCreateBatch}>Create & Block Slots</Button>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map(batch => (
                            <div key={batch.id} className="bg-card border rounded-xl p-6 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("px-2 py-1 rounded text-xs font-bold uppercase", batch.color || "bg-gray-100 text-gray-700")}>
                                        {batch.sport}
                                    </div>
                                    <h3 className="font-bold text-lg">₹{batch.price}/mo</h3>
                                </div>
                                <h3 className="font-bold text-xl mb-1">{batch.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <Calendar className="w-4 h-4" /> {batch.days.join(', ')} • {batch.startTime} - {batch.endTime}
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>Capacity</span>
                                        <span className="font-bold">{batch.students} / {batch.maxStudents}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${(batch.students / batch.maxStudents) * 100}%` }} />
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full">Manage Students</Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* STUDENTS TAB */}
            {activeTab === 'students' && (
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search students..."
                                className="pl-9 bg-card border-none shadow-sm"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="p-4">Student Name</th>
                                    <th className="p-4">Contact</th>
                                    <th className="p-4">Batch ID</th>
                                    <th className="p-4">Renewal Date</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredStudents.map(student => (
                                    <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="p-4 font-bold">{student.name}</td>
                                        <td className="p-4 text-muted-foreground">{student.contact}</td>
                                        <td className="p-4 text-xs font-mono">{student.batchId}</td>
                                        <td className="p-4 text-muted-foreground">{new Date(student.renewalDate).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            {student.status === 'PAID' ? (
                                                <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-100 px-2 py-1 rounded w-fit">
                                                    <CheckCircle2 className="w-3 h-3" /> Paid
                                                </span>
                                            ) : student.status === 'DUE' ? (
                                                <span className="flex items-center gap-1 text-orange-600 font-bold text-xs bg-orange-100 px-2 py-1 rounded w-fit">
                                                    <Clock className="w-3 h-3" /> Due Soon
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-100 px-2 py-1 rounded w-fit">
                                                    <AlertTriangle className="w-3 h-3" /> Expired
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {student.status !== 'PAID' && (
                                                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleMarkPaid(student.id, student.name)}>
                                                    Mark Paid
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredStudents.length === 0 && <div className="p-8 text-center text-muted-foreground">No students found.</div>}
                    </div>
                </div>
            )}
        </div>
    );
}
