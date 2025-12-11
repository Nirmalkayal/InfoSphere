import React from "react";

type SlotProps = {
  id: string;
  turfName?: string;
  start: string; // ISO or formatted
  end: string; // ISO or formatted
  status?: "booked" | "available" | "blocked";
  playerName?: string;
};

export const SlotCard: React.FC<SlotProps> = ({ id, turfName, start, end, status = "available", playerName }) => {
  const color = status === "booked" ? "bg-playo/90 text-white" : status === "blocked" ? "bg-red-500/90 text-white" : "bg-green-600/90 text-white";

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg shadow-sm ${color}`} title={`${turfName} • ${start} — ${end}`}>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{turfName ?? "Turf"}</span>
        <span className="text-xs opacity-90">{start} — {end}</span>
        {playerName ? <span className="text-xs opacity-80 mt-1">Booked by {playerName}</span> : null}
      </div>
      <div className="text-xs font-medium uppercase opacity-90">{status}</div>
    </div>
  );
};

export default SlotCard;
