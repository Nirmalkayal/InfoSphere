import React from "react";
import SlotCard from "./SlotCard";

export type DemoSlot = {
  id: string;
  turf: string;
  start: string;
  end: string;
  status: "booked" | "available" | "blocked";
  player?: string;
};

type Props = {
  slots?: DemoSlot[];
};

const CalendarSimple: React.FC<Props> = ({ slots = [] }) => {
  // Very simple layout: show next 6 slots vertically grouped by day label
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Calendar (Demo)</h3>
        <div className="text-sm text-muted-foreground">Next 24 hrs</div>
      </div>

      <div className="space-y-3">
        {slots.map((s) => (
          <SlotCard
            key={s.id}
            id={s.id}
            turfName={s.turf}
            start={s.start}
            end={s.end}
            status={s.status}
            playerName={s.player}
          />
        ))}

        {slots.length === 0 ? (
          <div className="text-sm text-muted-foreground">No slots in the demo window.</div>
        ) : null}
      </div>
    </div>
  );
};

export default CalendarSimple;
