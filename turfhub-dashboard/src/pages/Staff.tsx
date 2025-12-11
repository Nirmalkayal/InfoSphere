import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ApiService } from "@/services/apiService";
import { Plus, Users, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface Shift {
    _id: string;
    user: { _id: string; name: string };
    start: string;
    end: string;
    checkIn?: string;
    checkOut?: string;
    status: string;
}

export default function Staff() {
    const [shifts, setShifts] = useState<Shift[]>([]);
    const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
    const [showAssignForm, setShowAssignForm] = useState(false);

    const [assignForm, setAssignForm] = useState({
        userId: '',
        start: '',
        end: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [u, s] = await Promise.all([
                ApiService.getStaff(),
                ApiService.getShifts()
            ]);
            setStaffUsers(u);
            setShifts(s);
            if (u.length > 0) setAssignForm(prev => ({ ...prev, userId: u[0]._id }));
        } catch (e) { console.error(e); }
    }

    async function handleAssign(e: React.FormEvent) {
        e.preventDefault();
        try {
            await ApiService.createShift(assignForm);
            setShowAssignForm(false);
            loadData();
            alert('Shift Assigned');
        } catch (e) { alert('Failed'); }
    }

    // CheckIn/Out not yet in ApiService, adding placeholder or skipping
    async function handleCheckIn(shiftId: string) {
        // Not implemented in ApiService yet
        alert("Check-in via API not fully linked yet");
    }

    async function handleCheckOut(shiftId: string) {
        alert("Check-out via API not fully linked yet");
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Management</h1>
                    <p className="text-muted-foreground mt-1">Assign shifts and track attendance.</p>
                </div>
                <Button onClick={() => setShowAssignForm(!showAssignForm)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Assign Shift
                </Button>
            </div>

            {/* Assign Form */}
            {showAssignForm && (
                <div className="bg-muted/30 p-6 rounded-xl border border-border max-w-lg mx-auto">
                    <h3 className="text-lg font-semibold mb-4">Assign Staff Shift</h3>
                    <form onSubmit={handleAssign} className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Staff Member</label>
                            <select
                                className="w-full p-2 rounded border text-black"
                                value={assignForm.userId}
                                onChange={e => setAssignForm({ ...assignForm, userId: e.target.value })}
                            >
                                {staffUsers.map(u => (
                                    <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Start Time</label>
                                <input type="datetime-local" className="w-full p-2 rounded border text-black" value={assignForm.start} onChange={e => setAssignForm({ ...assignForm, start: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">End Time</label>
                                <input type="datetime-local" className="w-full p-2 rounded border text-black" value={assignForm.end} onChange={e => setAssignForm({ ...assignForm, end: e.target.value })} required />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setShowAssignForm(false)}>Cancel</Button>
                            <Button type="submit">Assign</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Shift List */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground">
                        <tr>
                            <th className="p-4 font-medium">Staff Name</th>
                            <th className="p-4 font-medium">Shift Time</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Check In/Out</th>
                            <th className="p-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {shifts.map(shift => (
                            <tr key={shift._id} className="hover:bg-muted/30">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {shift.user?.name?.[0] || 'U'}
                                        </div>
                                        <span className="font-medium">{shift.user?.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{new Date(shift.start).toLocaleDateString()}</span>
                                        <span className="text-muted-foreground text-xs">
                                            {new Date(shift.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(shift.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        shift.status === 'scheduled' ? "bg-blue-100 text-blue-700" :
                                            shift.status === 'present' ? "bg-green-100 text-green-700" :
                                                "bg-gray-100 text-gray-700"
                                    )}>
                                        {shift.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-xs text-muted-foreground">
                                    {shift.checkIn ? new Date(shift.checkIn).toLocaleTimeString() : '--:--'} /
                                    {shift.checkOut ? new Date(shift.checkOut).toLocaleTimeString() : ' --:--'}
                                </td>
                                <td className="p-4 text-right">
                                    {shift.status === 'scheduled' && (
                                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleCheckIn(shift._id)}>
                                            Check In
                                        </Button>
                                    )}
                                    {shift.status === 'present' && !shift.checkOut && (
                                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleCheckOut(shift._id)}>
                                            Check Out
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {shifts.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No shifts found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
