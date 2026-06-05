import React from 'react';
import {  MeetingStatus, MeetingType, type Meeting } from '../../../../types/meeting';
import { Edit2, MoreHorizontal, Video, Calendar, Clock } from 'lucide-react';
import { useJoinMeeting } from '../../../../hooks/meeting/meetingHooks';
import { format, isToday, isTomorrow } from 'date-fns';
import { cn } from '../../../../lib/utils';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../store/Store';

interface MeetingCardProps {
  meeting: Meeting;
  isRecent?: boolean;
  onJoin?: (meeting: Meeting) => void;
  onEdit?: (meeting: Meeting) => void;
}

export const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, isRecent = false, onJoin, onEdit }) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { mutate: joinMeeting, isPending } = useJoinMeeting();
  // Using user as host for dummy UI if host data not populated fully
  const user = useSelector((state: RootState) => state.auth.user);

  const startDate = new Date(meeting.startTime);
  const endDate = new Date(meeting.endTime);
  
  // Format Date String
  let dateString = format(startDate, 'MMM dd');
  let badgeText = '';
  let badgeColor = '';

  if (isRecent) {
     if (meeting.status === MeetingStatus.COMPLETED) {
       badgeText = 'Completed';
       badgeColor = 'bg-green-500/10 text-green-500 border-green-500/20';
     } else if (meeting.status === MeetingStatus.MISSED) {
       badgeText = 'Missed';
       badgeColor = 'bg-destructive/10 text-destructive border-destructive/20';
     } else {
       badgeText = 'Not Attended';
       badgeColor = 'bg-destructive/10 text-destructive border-destructive/20';
     }
  } else {
     if (isToday(startDate)) {
       badgeText = 'Today';
       badgeColor = 'bg-primary/10 text-primary border-primary/20';
       dateString = 'Today';
     } else if (isTomorrow(startDate)) {
       badgeText = 'Tomorrow';
       badgeColor = 'bg-accent/10 text-accent border-accent/20';
       dateString = 'Tomorrow';
     } else {
       badgeText = 'Scheduled';
       badgeColor = 'bg-muted/50 text-muted-foreground border-border';
     }
  }

  const formattedTime = `${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
  
  // Calculate duration in hours/mins
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffMins = Math.round((diffMs % 3600000) / 60000);
  let durationStr = '';
  if (diffHrs > 0) durationStr += `${diffHrs}h `;
  if (diffMins > 0 || diffHrs === 0) durationStr += `${diffMins}m`;

  // Use actual host from populated backend data
  const host = {
    name: meeting.host?.name || 'Unknown Host',
    avatar: meeting.host?.avatarUrl || 'https://via.placeholder.com/40'
  };


  const handleJoin = () => {
    joinMeeting(meeting.id);
    
    if (onJoin) {
      onJoin(meeting);
    } else if (meeting.meetingLink) {
      window.open(meeting.meetingLink, '_blank');
    }
  };

  return (
    <div className="w-full bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 mb-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/50 flex flex-col md:flex-row md:items-center justify-between group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Left Section: Details */}
      <div className="flex-1 min-w-0 mb-4 md:mb-0 relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-lg font-bold text-foreground truncate">{meeting.title}</h3>
          {badgeText && (
            <span className={cn("px-2.5 py-0.5 text-xs font-medium rounded-full border", badgeColor)}>
              {badgeText}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-muted-foreground/70" />
            <span>{dateString}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-muted-foreground/70" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground/70">
            <span>•</span>
            <span>{durationStr.trim()}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">Host:</span>
            <div className="flex items-center gap-2">
              <img src={host.avatar} alt="host" className="w-6 h-6 rounded-full border border-border" />
              <span className="text-foreground/80 text-xs">{host.name}</span>
            </div>
          </div>
          
          <div className="h-4 w-px bg-border"></div>
          
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center gap-3 md:pl-6 relative z-10">
        {!isRecent ? (
          <button
            onClick={handleJoin}
            disabled={isPending || meeting.meetingType !== MeetingType.ONLINE}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 shadow-lg shadow-primary/20 whitespace-nowrap"
          >
            <Video className="w-4 h-4" />
            {isPending ? 'Joining...' : 'Join'}
          </button>
        ) : (
          <button className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
            {/* <FileText className="w-4 h-4" />
            Notes */}
          </button>
        )}
        
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
          
          {showDropdown && (meeting.host?.id === user?.id || meeting.createdBy === user?.id) && !isRecent && (
            <div className="absolute right-0 mt-2 w-40 bg-card border border-border/50 rounded-xl shadow-lg z-50 overflow-hidden py-1">
              <button 
                onClick={() => {
                  setShowDropdown(false);
                  if (onEdit) onEdit(meeting);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent/10 hover:text-primary transition-colors flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Meeting
              </button>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};
