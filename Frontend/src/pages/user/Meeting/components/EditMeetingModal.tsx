import React from 'react';
import { useForm } from 'react-hook-form';
import { MeetingType, type Meeting, type UpdateMeetingDto } from '../../../../types/meeting';
import { useUpdateMeeting } from '../../../../hooks/meeting/meetingHooks';
import { Calendar as CalendarIcon, Clock, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';

interface EditMeetingModalProps {
  meeting: Meeting;
  onClose: () => void;
}

interface MeetingFormInputs {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
}

export const EditMeetingModal: React.FC<EditMeetingModalProps> = ({ meeting, onClose }) => {
  const { mutate: updateMeeting, isPending } = useUpdateMeeting();

  const startDate = new Date(meeting.startTime);
  const endDate = new Date(meeting.endTime);

  const { register, handleSubmit, formState: { errors } } = useForm<MeetingFormInputs>({
    defaultValues: {
      title: meeting.title,
      description: meeting.description || '',
      startDate: format(startDate, 'yyyy-MM-dd'),
      startTime: format(startDate, 'HH:mm'),
      endTime: format(endDate, 'HH:mm'),
      meetingType: meeting.meetingType,
    }
  });

  const onSubmit = (data: MeetingFormInputs) => {
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`).toISOString();
    const endDateTime = new Date(`${data.startDate}T${data.endTime}`).toISOString();

    const dto: UpdateMeetingDto = {
      title: data.title,
      description: data.description,
      startTime: startDateTime,
      endTime: endDateTime,
      meetingType: data.meetingType,
    };

    updateMeeting(
      { meetingId: meeting.id, dto },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-200 p-4">
      <div className="bg-card border border-border/50 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold text-foreground mb-6 relative z-10">Edit Meeting</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
          <div className="group">
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 group-focus-within:text-primary transition-colors">Meeting Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="e.g., Weekly Sync"
            />
            {errors.title && <span className="text-xs text-destructive mt-1">{errors.title.message}</span>}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 group-focus-within:text-primary transition-colors">Description</label>
            <textarea
              {...register('description')}
              className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none h-24"
              placeholder="Add meeting agenda..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-muted-foreground mb-1.5 group-focus-within:text-primary transition-colors">Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                <input
                  type="date"
                  {...register('startDate', { required: true })}
                  className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-muted-foreground mb-1.5 group-focus-within:text-primary transition-colors">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                <input
                  type="time"
                  {...register('startTime', { required: true })}
                  className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-muted-foreground mb-1.5 group-focus-within:text-primary transition-colors">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
                <input
                  type="time"
                  {...register('endTime', { required: true })}
                  className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert"
                />
              </div>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-muted-foreground mb-1.5 group-focus-within:text-primary transition-colors">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
              <select
                {...register('meetingType')}
                className="w-full bg-background/50 border border-border/50 rounded-xl pl-10 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
              >
                <option value={MeetingType.ONLINE}>Online Location</option>
                <option value={MeetingType.PHYSICAL}>Physical Location</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted/30 hover:bg-muted/50 rounded-xl transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/40"
            >
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
