import { format } from "date-fns";
import {
    MOCK_SLOTS,
    MOCK_ANALYTICS,
    MOCK_COUPONS,
    MOCK_EXPENSES,
    MOCK_MAINTENANCE,
    MOCK_STAFF,
    MOCK_SHIFTS,
    MOCK_PRICING_RULES,
    MOCK_TURFS,
    MOCK_API_KEYS,
    MOCK_LOGS,
    MOCK_TOURNAMENTS,
    MOCK_TEAMS,
    MOCK_MATCHES,
    MOCK_PLAYERS,
    MOCK_REFEREES,
    MOCK_BATCHES,
    MOCK_STUDENTS
} from './mockData';

// Keys for LocalStorage
const KEYS = {
    SLOTS: 'turfhub_mock_slots',
    ANALYTICS: 'turfhub_mock_analytics',
    EXPENSES: 'turfhub_mock_expenses',
    MAINTENANCE: 'turfhub_mock_maintenance',
    LOGS: 'turfhub_mock_logs',
    TOURNAMENTS: 'turfhub_mock_tournaments',
    TEAMS: 'turfhub_mock_teams',
    MATCHES: 'turfhub_mock_matches',
    PLAYERS: 'turfhub_mock_players',
    REFEREES: 'turfhub_mock_referees',
    BATCHES: 'turfhub_mock_batches',
    STUDENTS: 'turfhub_mock_students'
};

// Helper: Get data from LS or seed
const getLocal = <T>(key: string, seed: T): T => {
    const stored = localStorage.getItem(key);
    if (!stored) return seed;
    try {
        return JSON.parse(stored);
    } catch (e) {
        console.error(`Failed to parse ${key}`, e);
        return seed;
    }
};

const setLocal = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const MockService = {
    // --- SLOTS ---
    getSlots: () => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const slots = getLocal(KEYS.SLOTS, MOCK_SLOTS);
                resolve(slots);
            }, 300);
        });
    },

    // EXTERNAL API: Lock a Slot (The "Handshake")
    lockSlot: (slotId: string, platform: string) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const slots: any[] = getLocal(KEYS.SLOTS, MOCK_SLOTS);
                const slotIndex = slots.findIndex(s => s.id === slotId);

                if (slotIndex === -1) return reject("Slot not found");
                const slot = slots[slotIndex];

                if (slot.status === 'booked') return reject("Slot already booked");
                if (slot.status === 'locked' && slot.lockedBy !== platform) return reject("Slot locked by another platform");

                const updatedSlot = {
                    ...slot,
                    status: 'locked',
                    lockedBy: platform,
                    lockedAt: new Date().toISOString(),
                    lockExpiresAt: new Date(Date.now() + 10 * 60000).toISOString() // 10 mins
                };

                slots[slotIndex] = updatedSlot;
                setLocal(KEYS.SLOTS, slots);

                // Add to Logs
                MockService.logApi(platform, 'POST /slots/lock', 'success', `Locked ${slot.groundName}`);

                resolve({ success: true, expiresAt: updatedSlot.lockExpiresAt });
            }, 200);
        });
    },

    // Called when payment is verified
    confirmBooking: (slotId: string, customerName: string, amount: number, platform: string = 'internal') => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // 1. Update Slot Status
                const slots: any[] = getLocal(KEYS.SLOTS, MOCK_SLOTS);
                const updatedSlots = slots.map(slot => {
                    if (slot.id === slotId) {
                        return {
                            ...slot,
                            status: 'booked',
                            customerName: customerName,
                            platform: platform,
                            lockedBy: null, // Clear lock
                            bookingId: `b-${Date.now()}`
                        };
                    }
                    return slot;
                });
                setLocal(KEYS.SLOTS, updatedSlots);

                // 2. Update Revenue (Analytics)
                const analytics: any = getLocal(KEYS.ANALYTICS, MOCK_ANALYTICS);
                analytics.stats.revenue += amount;
                analytics.stats.bookings += 1;

                // Update Revenue Chart (Today)
                const todayStr = new Date().toISOString().split('T')[0];
                const chartEntryIndex = analytics.revenueChart.findIndex((e: any) => e._id === todayStr);
                if (chartEntryIndex >= 0) {
                    analytics.revenueChart[chartEntryIndex].revenue += amount;
                } else {
                    analytics.revenueChart.push({ _id: todayStr, revenue: amount });
                }

                setLocal(KEYS.ANALYTICS, analytics);

                // Log
                MockService.logApi(platform, 'POST /webhooks/payment', 'success', `Confirmed booking for ${customerName}`);

                resolve({ success: true, slotId });
            }, 300);
        });
    },

    // --- LOGS & LIVE FEED ---
    logApi: (platform: string, endpoint: string, status: string, details: string) => {
        const logs: any[] = getLocal(KEYS.LOGS, MOCK_LOGS);
        const newLog = {
            id: `log-${Date.now()}`,
            timestamp: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            platform,
            endpoint,
            status,
            dataRequested: details,
            responseTimeMs: Math.floor(Math.random() * 150) + 20
        };
        setLocal('turfhub_mock_logs', [newLog, ...logs].slice(0, 100)); // Keep last 100
    },

    getRecentLogs: () => {
        return Promise.resolve(getLocal('turfhub_mock_logs', MOCK_LOGS).slice(0, 20));
    },

    // --- TRAFFIC SIMULATION (DEMO ONLY) ---
    simulateTraffic: () => {
        const platforms = ['Playo', 'TurfTown', 'KheloMore'];
        const randomPlatform = platforms[Math.floor(Math.random() * platforms.length)];

        const slots: any[] = getLocal(KEYS.SLOTS, MOCK_SLOTS);
        const available = slots.filter(s => s.status === 'available');

        if (available.length > 0) {
            const randomSlot = available[Math.floor(Math.random() * available.length)];
            MockService.logApi(randomPlatform, 'POST /slots/lock', 'pending', `Requesting lock on ${randomSlot.groundName}...`);

            setTimeout(() => {
                MockService.lockSlot(randomSlot.id, randomPlatform);
            }, 800);
        }
    },

    // --- TOURNAMENTS ---
    createTournament: (data: any) => {
        return new Promise((resolve) => {
            const tournaments: any[] = getLocal(KEYS.TOURNAMENTS, MOCK_TOURNAMENTS);
            const newId = `t-${Date.now()}`;
            // Remove scheduleConfig from saved tournament object to keep it clean, or keep it for reference? Keep it.
            const newTournament = { ...data, id: newId, status: 'UPCOMING', registeredTeams: 0 };

            tournaments.push(newTournament);
            setLocal(KEYS.TOURNAMENTS, tournaments);

            // Auto-Block Logic (The USP)
            if (data.scheduleConfig) {
                const { groundIds, startDate, endDate, startTime, endTime } = data.scheduleConfig;
                const slots: any[] = getLocal(KEYS.SLOTS, MOCK_SLOTS);

                // Normalize dates to start of day for comparison
                const start = new Date(startDate); start.setHours(0, 0, 0, 0);
                const end = new Date(endDate); end.setHours(23, 59, 59, 999);

                let blockedCount = 0;

                const updatedSlots = slots.map(slot => {
                    const slotDate = new Date(slot.start);
                    // Check Date Range
                    if (slotDate >= start && slotDate <= end) {
                        // Check Ground - Using 'Central Arena' etc names mappings or IDs? 
                        // Mock slots usually have 'groundName' or 'groundId'.
                        // Let's assume we match on 'groundName' or just block all for demo if groundIds is ['all']
                        // Simple check:
                        const matchGround = groundIds.includes('all') || groundIds.includes(slot.groundName);

                        if (matchGround) {
                            const slotTime = format(slotDate, 'HH:mm');
                            // Check Time Range
                            if (slotTime >= startTime && slotTime < endTime) {
                                blockedCount++;
                                return {
                                    ...slot,
                                    status: 'blocked',
                                    lockedBy: `Tournament: ${data.name}`,
                                    platform: 'internal'
                                };
                            }
                        }
                    }
                    return slot;
                });

                if (blockedCount > 0) {
                    setLocal(KEYS.SLOTS, updatedSlots);
                    MockService.logApi('Internal', 'POST /tournaments/create', 'success', `Created ${data.name} & Blocked ${blockedCount} Slots`);
                }
            }

            resolve({ success: true, id: newId });
        });
    },

    getTournaments: () => Promise.resolve(getLocal(KEYS.TOURNAMENTS, MOCK_TOURNAMENTS)),
    getTeams: (tId: string) => Promise.resolve(getLocal(KEYS.TEAMS, MOCK_TEAMS).filter((t: any) => t.tournamentId === tId)),
    getPlayers: (teamId: string) => Promise.resolve(getLocal(KEYS.PLAYERS, MOCK_PLAYERS).filter((p: any) => p.teamId === teamId)),
    getMatches: (tId: string) => Promise.resolve(getLocal(KEYS.MATCHES, MOCK_MATCHES).filter((m: any) => m.tournamentId === tId)),

    addMatchEvent: (matchId: string, event: any) => {
        return new Promise((resolve) => {
            const matches: any[] = getLocal(KEYS.MATCHES, MOCK_MATCHES);
            const matchIndex = matches.findIndex(m => m.id === matchId);
            if (matchIndex === -1) { resolve({ success: false }); return; }

            const match = matches[matchIndex];
            const events = match.events || [];
            events.push({ ...event, id: `evt-${Date.now()}`, timestamp: new Date().toISOString() });

            // Auto-Score Logic (The Magic)
            let score1 = match.score1 || 0;
            let score2 = match.score2 || 0;

            // Football Logic
            if (event.type === 'GOAL') {
                if (event.teamId === match.team1) score1++;
                else score2++;
            }
            // Cricket Logic (Executes if type is RUN or BOUNDARY)
            else if (['RUN', 'BOUNDARY'].includes(event.type)) {
                if (event.teamId === match.team1) score1 += (event.value || 1);
                else score2 += (event.value || 1);
            }
            // Add more sports here

            matches[matchIndex] = { ...match, events, score1, score2 };

            // Check for Auto-Win (e.g. if status changed to COMPLETED elsewhere, needed? 
            // No, updateMatch handles completion. This is just live scoring.)

            setLocal(KEYS.MATCHES, matches);
            resolve({ success: true, score1, score2 });
        });
    },

    updateMatch: (matchId: string, score1: number, score2: number) => {
        return new Promise((resolve) => {
            const matches: any[] = getLocal(KEYS.MATCHES, MOCK_MATCHES);
            const matchIndex = matches.findIndex(m => m.id === matchId);
            if (matchIndex === -1) { resolve({ success: false }); return; }

            const match = matches[matchIndex];
            const winnerId = score1 > score2 ? match.team1 : match.team2;

            // Update current match
            matches[matchIndex] = { ...match, score1, score2, winner: winnerId, status: 'COMPLETED' };

            // Advance to next round
            if (match.nextMatchId && winnerId) {
                const nextMatchIndex = matches.findIndex(m => m.id === match.nextMatchId);
                if (nextMatchIndex > -1) {
                    const nextMatch = matches[nextMatchIndex];
                    // Fill first empty slot
                    const updates: any = {};
                    if (!nextMatch.team1) updates.team1 = winnerId;
                    else if (!nextMatch.team2) updates.team2 = winnerId;

                    matches[nextMatchIndex] = { ...nextMatch, ...updates };
                }
            }

            setLocal(KEYS.MATCHES, matches);
            resolve({ success: true, winnerId });
        });
    },

    getLeaderboard: (tournamentId: string) => {
        return new Promise((resolve) => {
            const matches: any[] = getLocal(KEYS.MATCHES, MOCK_MATCHES).filter((m: any) => m.tournamentId === tournamentId);
            const players: any[] = getLocal(KEYS.PLAYERS, MOCK_PLAYERS);

            const stats: Record<string, number> = {};

            matches.forEach(m => {
                if (m.events) {
                    m.events.forEach((e: any) => {
                        if (e.playerId && (e.type === 'GOAL' || e.type === 'RUN' || e.type === 'BOUNDARY')) {
                            // Points: GOAL=1, RUN=Value, BOUNDARY=Value
                            const val = e.value || 1;
                            stats[e.playerId] = (stats[e.playerId] || 0) + val;
                        }
                    });
                }
            });

            const leaderboard = Object.entries(stats).map(([pId, score]) => {
                const p = players.find(x => x.id === pId);
                return {
                    id: pId,
                    name: p?.name || 'Unknown',
                    teamId: p?.teamId,
                    score
                };
            }).sort((a, b) => b.score - a.score).slice(0, 10); // Top 10

            resolve(leaderboard);
        });
    },

    // --- ANALYTICS ---
    getAnalytics: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getLocal(KEYS.ANALYTICS, MOCK_ANALYTICS));
            }, 300);
        });
    },



    // Helpers for other static data (optional pass-through)
    getCoupons: () => Promise.resolve(MOCK_COUPONS),
    getStaff: () => Promise.resolve(MOCK_STAFF),
    getShifts: () => Promise.resolve(MOCK_SHIFTS),
    getPricingRules: () => Promise.resolve(MOCK_PRICING_RULES),
    getTurfs: () => Promise.resolve(MOCK_TURFS),
    getApiKeys: () => Promise.resolve(MOCK_API_KEYS),
    getLogs: () => Promise.resolve(MOCK_LOGS),

    // --- REFEREES ---
    getReferees: () => Promise.resolve(getLocal(KEYS.REFEREES, MOCK_REFEREES)),

    assignReferee: (matchId: string, refereeId: string) => {
        return new Promise((resolve) => {
            const matches: any[] = getLocal(KEYS.MATCHES, MOCK_MATCHES);
            const matchIndex = matches.findIndex(m => m.id === matchId);
            if (matchIndex > -1) {
                matches[matchIndex] = { ...matches[matchIndex], refereeId };
                setLocal(KEYS.MATCHES, matches);
                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        });
    },

    // --- REGISTRATION ---
    registerTeam: (tournamentId: string, teamData: any) => {
        return new Promise((resolve) => {
            const teams: any[] = getLocal(KEYS.TEAMS, MOCK_TEAMS);
            const newTeam = {
                id: `tm-${Date.now()}`,
                tournamentId,
                name: teamData.name,
                captain: teamData.captain,
                contact: teamData.contact,
                status: 'PENDING', // Pending approval
                icon: 'Users', // Default icon
                players: teamData.players || [] // Array of names
            };

            teams.push(newTeam);
            setLocal(KEYS.TEAMS, teams);
            resolve({ success: true, id: newTeam.id });
        });
    },

    approveTeam: (teamId: string) => {
        return new Promise((resolve) => {
            const teams: any[] = getLocal(KEYS.TEAMS, MOCK_TEAMS);
            const idx = teams.findIndex(t => t.id === teamId);
            if (idx > -1) {
                teams[idx].status = 'APPROVED';
                setLocal(KEYS.TEAMS, teams);

                // Update Tournament Team Count
                const tournaments: any[] = getLocal(KEYS.TOURNAMENTS, MOCK_TOURNAMENTS);
                const tIdx = tournaments.findIndex(t => t.id === teams[idx].tournamentId);
                if (tIdx > -1) {
                    tournaments[tIdx].registeredTeams = (tournaments[tIdx].registeredTeams || 0) + 1;
                    setLocal(KEYS.TOURNAMENTS, tournaments);
                }

                resolve({ success: true });
            } else {
                resolve({ success: false });
            }
        });
    },

    // --- OPERATIONS ---
    getMaintenance: () => Promise.resolve([
        { id: 'm1', type: 'cleaning', description: 'Deep Clean Turf A', startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600000).toISOString(), cost: 500 },
        { id: 'm2', type: 'repair', description: 'Net Fixing', startTime: new Date(Date.now() - 86400000).toISOString(), endTime: new Date(Date.now() - 82800000).toISOString(), cost: 1200 }
    ]),

    getExpenses: () => Promise.resolve([
        { id: 'e1', category: 'electricity', description: 'Monthly Bill', amount: 15000, date: new Date().toISOString() },
        { id: 'e2', category: 'water', description: 'Water Tanker', amount: 800, date: new Date(Date.now() - 172800000).toISOString() }
    ]),

    // --- FINANCE & SHIFTS ---
    getCurrentShiftStats: () => {
        return new Promise((resolve) => {
            const slots: any[] = getLocal(KEYS.SLOTS, MOCK_SLOTS);
            // Calculate cash collected today (or "current shift" simulation)
            const today = new Date().toISOString().split('T')[0];

            const relevantSlots = slots.filter(s => s.status === 'booked' && s.start.startsWith(today));

            // Assume price is present, else default 1200
            const cashCollected = relevantSlots
                .filter(s => s.platform === 'internal')
                .reduce((acc, s) => acc + (s.price || 1200), 0);

            const onlineCollected = relevantSlots
                .filter(s => s.platform !== 'internal')
                .reduce((acc, s) => acc + (s.price || 1200), 0);

            resolve({
                cashCollected,
                onlineCollected,
                totalRevenue: cashCollected + onlineCollected,
                bookingsCount: relevantSlots.length
            });
        });
    },

    closeShift: (cashInHand: number, notes: string) => {
        return new Promise((resolve) => {
            const logs: any[] = getLocal(KEYS.LOGS, MOCK_LOGS);
            const newLog = {
                id: `shift-${Date.now()}`,
                timestamp: new Date().toISOString(),
                platform: 'internal',
                endpoint: 'SHIFT_CLOSE',
                status: 'success',
                dataRequested: `Closed Shift. Cash: ${cashInHand}. Notes: ${notes}`,
                responseTimeMs: 0
            };
            setLocal(KEYS.LOGS, [newLog, ...logs]);

            resolve({ success: true, timestamp: newLog.timestamp });
        });
    },

    // --- COACHING & ACADEMY ---
    getBatches: () => Promise.resolve(getLocal(KEYS.BATCHES, MOCK_BATCHES)),
    getStudents: () => Promise.resolve(getLocal(KEYS.STUDENTS, MOCK_STUDENTS)),

    createBatch: (batchData: any) => {
        return new Promise((resolve) => {
            const batches: any[] = getLocal(KEYS.BATCHES, MOCK_BATCHES);
            const newBatch = { ...batchData, id: `b-${Date.now()}` };
            batches.push(newBatch);
            setLocal(KEYS.BATCHES, batches);

            MockService.logApi('Internal', 'POST /coaching/batch', 'success', `Created Batch: ${newBatch.name}`);
            resolve({ success: true });
        });
    },

    updateStudentStatus: (studentId: string, status: string) => {
        return new Promise((resolve) => {
            const students: any[] = getLocal(KEYS.STUDENTS, MOCK_STUDENTS);
            const idx = students.findIndex(s => s.id === studentId);
            if (idx > -1) {
                students[idx].status = status;
                setLocal(KEYS.STUDENTS, students);
                resolve({ success: true });
            } else resolve({ success: false });
        });
    },
};
