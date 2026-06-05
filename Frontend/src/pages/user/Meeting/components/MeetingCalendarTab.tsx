import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  isToday
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Meeting } from '../../../../types/meeting';
import { cn } from '../../../../lib/utils';

interface MeetingCalendarTabProps {
  meetings: Meeting[];
}

export const MeetingCalendarTab: React.FC<MeetingCalendarTabProps> = ({ meetings }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-card/40 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-border/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">
            {format(currentMonth, "MMMM yyyy")}
            <span className="block text-sm font-normal text-muted-foreground mt-1">View all scheduled meetings</span>
          </h2>
          
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goToToday}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-medium transition-colors"
            >
              Today
            </button>
            <button onClick={nextMonth} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 mb-4">
        {weekDays.map((day, i) => (
          <div key={i} className="text-center text-xs font-medium text-muted-foreground/60">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, i) => {
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);
          
          // Find meetings for this day
          const dayMeetings = meetings.filter(m => isSameDay(new Date(m.startTime), day));

          return (
            <div 
              key={i} 
              className={cn(
                "relative h-24 rounded-2xl p-3 transition-all duration-300 border border-transparent",
                isSelectedMonth ? "bg-card/50 hover:bg-card/80 hover:border-border/50" : "bg-card/20 text-muted-foreground/30",
                isCurrentDay && "border-primary/50 shadow-[0_0_15px_rgba(var(--primary),0.15)] bg-card/80"
              )}
            >
              <div className="flex justify-between items-start">
                <span className={cn(
                  "text-sm font-medium",
                  isCurrentDay 
                    ? "w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 -ml-1 -mt-1" 
                    : "text-foreground/80",
                  !isSelectedMonth && "text-muted-foreground/30"
                )}>
                  {format(day, dateFormat)}
                </span>
              </div>
              
              {/* Meeting Dots */}
              {dayMeetings.length > 0 && (
                <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                  {dayMeetings.slice(0, 3).map((m, idx) => {
                    const colors = ['bg-primary', 'bg-accent', 'bg-emerald-500'];
                    return (
                      <div 
                        key={idx} 
                        className={cn("w-2 h-2 rounded-full", colors[idx % colors.length])} 
                        title={m.title}
                      />
                    );
                  })}
                  {dayMeetings.length > 3 && (
                    <div className="w-2 h-2 rounded-full bg-muted-foreground" title="More meetings..." />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
