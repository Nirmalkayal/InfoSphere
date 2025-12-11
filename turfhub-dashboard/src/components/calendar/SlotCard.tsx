import { cn } from "@/lib/utils";
import type { Slot } from "./CalendarGrid";
import { GripVertical, Zap, Tag, Lock, Smartphone, Globe, Shield } from "lucide-react";

interface SlotCardProps {
  slot: Slot;
  onClick: () => void;
}

const getSlotStyle = (slot: Slot) => {
  if (slot.status === 'maintenance') {
    return {
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      text: "text-red-700",
      label: "Maintenance",
      icon: null
    };
  }

  if (slot.status === 'blocked' || (slot.status as any) === 'locked') {
    return {
      bg: "bg-gray-100/80 bg-[image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.05)_4px,rgba(0,0,0,0.05)_8px)]",
      border: "border-gray-200 dashed border-2",
      text: "text-gray-500 italic",
      label: `Locked by ${slot.lockedBy || 'External User'}`,
      icon: <Lock className="w-3 h-3 mb-0.5" />
    };
  }

  if (slot.status === 'booked') {
    const p = (slot.platform || '').toLowerCase();
    if (p.includes('playo')) {
      return {
        bg: "bg-blue-100",
        border: "border-blue-300 shadow-sm",
        text: "text-blue-900",
        label: slot.customerName,
        subLabel: "Playo Booking",
        icon: <Smartphone className="w-3 h-3 text-blue-600" />
      };
    }
    if (p.includes('turftown')) {
      return {
        bg: "bg-orange-100",
        border: "border-orange-300 shadow-sm",
        text: "text-orange-900",
        label: slot.customerName,
        subLabel: "TurfTown",
        icon: <Globe className="w-3 h-3 text-orange-600" />
      };
    }
    // Internal / Walk-in
    return {
      bg: "bg-green-100",
      border: "border-green-300 shadow-sm",
      text: "text-green-900",
      label: slot.customerName,
      subLabel: "Walk-In",
      icon: <Shield className="w-3 h-3 text-green-600" />
    };
  }

  // Available
  return {
    bg: "bg-background hover:bg-muted/50",
    border: "border-border",
    text: "text-foreground",
    label: slot.price ? `₹${slot.price}` : "Open",
    icon: null
  };
};

export function SlotCard({ slot, onClick }: SlotCardProps) {
  const style = getSlotStyle(slot);

  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute inset-x-0 mx-1 rounded-md border p-2 text-xs cursor-pointer transition-all group flex flex-col justify-between h-full overflow-hidden",
        style.bg,
        style.border,
        style.text,
        slot.status === 'available' && "hover:border-primary/50"
      )}
    >
      <div className="flex items-start justify-between w-full">
        <div className="flex items-start gap-1 w-full">
          {/* Status Icon */}
          {style.icon && <div className="mt-0.5 opacity-80">{style.icon}</div>}

          <div className="flex-1 min-w-0">
            {slot.status === 'available' ? (
              <div className="flex items-center gap-1">
                {slot.pricingType === 'surge' && <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />}
                {slot.pricingType === 'discount' && <Tag className="w-3 h-3 text-green-500 fill-green-500" />}
                <span className="font-bold">{style.label}</span>
              </div>
            ) : (
              <div className="flex flex-col leading-tight">
                <span className="font-bold truncate">{style.label}</span>
                {/* @ts-ignore */}
                {style.subLabel && <span className="text-[10px] opacity-75 truncate">{style.subLabel}</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer for Available Slots */}
      {slot.status === 'available' && (
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
        </div>
      )}
    </div>
  );
}
