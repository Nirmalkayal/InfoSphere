import { CalendarGrid } from "@/components/calendar/CalendarGrid";

const CalendarPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage your turf slot bookings</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-sportify" />
            <span className="text-muted-foreground">SportifyPro</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-playo" />
            <span className="text-muted-foreground">Playo</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full bg-internal" />
            <span className="text-muted-foreground">Internal</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <CalendarGrid />
    </div>
  );
};

export default CalendarPage;
