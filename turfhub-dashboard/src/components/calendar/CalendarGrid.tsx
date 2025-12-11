import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlotCard } from "./SlotCard";
import { SlotModal } from "./SlotModal";
import { adminApi } from "@/services/api";
import { useSocket } from "@/contexts/SocketContext";
import { PricingEngine } from "@/services/pricingEngine";

type BackendSlot = {
  id: string;
  start: string;
  end: string;
  status: string;
  platform?: 'sportify' | 'playo' | 'internal' | 'other';
  apiKey?: string;
  groundName?: string;
  customerName?: string;
  bookingId?: string;
  price?: number;
  lockedBy?: string;
};

export interface Slot {
  id: string;
  time: string;
  endTime: string;
  customerName: string;
  platform: "sportify" | "playo" | "internal" | "other" | string;
  status: "booked" | "blocked" | "maintenance" | "available";
  apiKey?: string;
  groundName?: string;
  dayIndex: number;
  bookingId?: string;
  price?: number;
  pricingType?: 'surge' | 'discount' | 'normal';
  lockedBy?: string;
}

interface CalendarGridProps {
  view?: "day" | "week" | "month";
}

const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function pad(n: number) { return String(n).padStart(2, '0'); }
function toHHMM(d: Date) { return `${pad(d.getHours())}:${pad(d.getMinutes())}`; }

export function CalendarGrid({ view = "week" }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState<"day" | "week" | "month">(view);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const { onSlotUpdate, onLockEvent } = useSocket();

  const getWeekDates = () => {
    if (selectedView === 'day') return [currentDate];

    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      return date;
    });
  };

  const weekDates = getWeekDates();

  const formatDateRange = () => {
    if (selectedView === 'day') return currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    if (selectedView === 'month') return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  // Socket subscription
  useEffect(() => {
    const unsubSlot = onSlotUpdate((event) => {
      console.log('Real-time update:', event);
      setSlots(prev => prev.map(slot => {
        if (slot.id === event.slotId) {
          return {
            ...slot,
            status: event.status === 'booked' ? 'booked' : 'available',
            customerName: event.customerName || slot.customerName,
            platform: (event.platform as any) || slot.platform,
            lockedBy: undefined
          };
        }
        return slot;
      }));
    });

    const unsubLock = onLockEvent((event) => {
      setSlots(prev => prev.map(slot => {
        if (slot.id === event.slotId) {
          return {
            ...slot,
            status: event.action === 'acquired' ? 'blocked' : 'available',
            lockedBy: event.action === 'acquired' ? event.details : undefined
          };
        }
        return slot;
      }));
    });

    return () => {
      unsubSlot();
      unsubLock();
    };
  }, [onSlotUpdate, onLockEvent]);

  const fetchSlots = async () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    const from = new Date(start);
    const to = new Date(start);
    to.setDate(to.getDate() + 6);
    try {
      const res = await adminApi.get('/slots', {
        params: {
          from: from.toISOString(),
          to: to.toISOString()
        }
      });
      const mapped: Slot[] = (res.data as BackendSlot[]).map((s) => {
        const p = s.platform || 'internal';
        const d = new Date(s.start);
        const weekday = d.getDay();
        const dayIndex = weekday === 0 ? 6 : weekday - 1; // Monday=0 ... Sunday=6

        // Calculate Dynamic Price
        const basePrice = s.price || 1000;
        const pricing = PricingEngine.calculatePrice(d, basePrice);
        const pricingType = pricing.modifiers.some(m => m.type === 'surge')
          ? 'surge'
          : pricing.modifiers.some(m => m.type === 'discount') ? 'discount' : 'normal';

        return ({
          id: s.id,
          time: toHHMM(new Date(s.start)),
          endTime: toHHMM(new Date(s.end)),
          customerName: s.customerName || '—',
          platform: p,
          status: s.status === 'booked' ? 'booked' : s.status === 'locked' ? 'blocked' : 'available',
          apiKey: s.apiKey,
          groundName: s.groundName,
          dayIndex,
          bookingId: s.bookingId,
          price: pricing.finalPrice,
          pricingType,
          lockedBy: s.lockedBy
        });
      });

      if (!mapped || mapped.length === 0) {
        setSlots([]);
      } else {
        setSlots(mapped);
      }
    } catch (e) {
      console.error('Failed to load slots', e);
      setSlots([]);
    }
  };

  // Initial Data Fetch
  useEffect(() => {
    fetchSlots();
  }, [currentDate]);

  const getSlotForCell = (date: Date, time: string): Slot | undefined => {
    const weekday = date.getDay();
    const targetDayIndex = weekday === 0 ? 6 : weekday - 1;
    return slots.find(slot => slot.dayIndex === targetDayIndex && slot.time === time);
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm shadow-soft hover:shadow-medium transition-shadow"
          >
            Today
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (selectedView === 'day') newDate.setDate(newDate.getDate() - 1);
                else if (selectedView === 'month') newDate.setMonth(newDate.getMonth() - 1);
                else newDate.setDate(newDate.getDate() - 7);
                setCurrentDate(newDate);
              }}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <span className="font-semibold text-foreground min-w-[180px] text-center">
              {formatDateRange()}
            </span>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                if (selectedView === 'day') newDate.setDate(newDate.getDate() + 1);
                else if (selectedView === 'month') newDate.setMonth(newDate.getMonth() + 1);
                else newDate.setDate(newDate.getDate() + 7);
                setCurrentDate(newDate);
              }}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-muted rounded-xl p-1">
          {(["day", "week", "month"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setSelectedView(v)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
                selectedView === v
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className={cn("grid gap-2 mb-4", selectedView === 'day' ? "grid-cols-2" : "grid-cols-8")}>
            <div className="text-xs font-medium text-muted-foreground" />
            {weekDates.map((date, idx) => (
              <div
                key={idx}
                className="text-center cursor-pointer hover:bg-accent/50 rounded-lg p-1 transition-colors"
                onClick={() => {
                  setCurrentDate(date);
                  if (selectedView === 'week') setSelectedView('day');
                }}
              >
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={cn(
                  "text-lg font-bold rounded-md py-1 px-2 inline-block",
                  date.toDateString() === new Date().toDateString()
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                )}>
                  {date.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Time Slots Grid */}
          <div className="relative">
            {/* Current Time Indicator */}
            <div
              className="absolute left-0 right-0 border-t-2 border-playo z-10 pointer-events-none"
              style={{ top: `${((new Date().getHours() - 9) / 12) * 100}%` }}
            >
              <div className="absolute -left-1 -top-1.5 w-3 h-3 rounded-full bg-playo" />
            </div>

            {timeSlots.map((time, timeIdx) => (
              <div key={time} className={cn("grid gap-2 min-h-[80px] border-t border-border/50", selectedView === 'day' ? "grid-cols-2" : "grid-cols-8")}>
                <div className="text-xs font-medium text-muted-foreground py-2 pr-2 text-right">
                  {time}
                </div>
                {weekDates.map((date, _) => {
                  const slot = getSlotForCell(date, time);
                  return (
                    <div
                      key={`${date.toISOString()}-${time}`}
                      className="relative py-1"
                    >
                      {slot && (slot.status === 'booked' || slot.status === 'blocked') && (
                        <SlotCard
                          slot={slot}
                          onClick={() => setSelectedSlot(slot)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slot Modal */}
      <SlotModal
        slot={selectedSlot}
        open={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        onSuccess={fetchSlots}
      />
    </div>
  );
}
