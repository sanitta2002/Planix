import React from 'react';
import { useForm } from 'react-hook-form';
import { MeetingType } from '../../../../types/meeting';
import { useCreateMeeting } from '../../../../hooks/meeting/meetingHooks';
import { useSelector } from 'react-redux';
import { Calendar as CalendarIcon, Clock, MapPin,} from 'lucide-react';
import type { RootState } from '../../../../store/Store';

interface MeetingFormInputs {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endTime: string;
  meetingType: MeetingType;
}

export const ScheduleMeetingTab: React.FC = () => {
  const currentProject = useSelector((state: RootState) => state.project.currentProject);
  const currentWorkspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
  const { mutate: createMeeting, isPending } = useCreateMeeting();


  const { register, handleSubmit, formState: { errors }, reset } = useForm<MeetingFormInputs>({
    defaultValues: {
      meetingType: MeetingType.ONLINE
    }
  });

  const onSubmit = (data: MeetingFormInputs) => {
    if (!currentProject || !currentWorkspace) return;

    const startDateTime = new Date(`${data.startDate}T${data.startTime}`).toISOString();
    const endDateTime = new Date(`${data.startDate}T${data.endTime}`).toISOString();

    createMeeting(
      {
        title: data.title,
        description: data.description,
        startTime: startDateTime,
        endTime: endDateTime,
        meetingType: data.meetingType,
        projectId: currentProject.id || currentProject.id,
        workspaceId: currentWorkspace.id || currentWorkspace.id,
      },
      {
        onSuccess: () => {
          reset();
        }
      }
    );
  };

  // const removeAttendee = (id: string) => {
  //   setAttendees(attendees.filter(a => a.id !== id));
  // };

  return (
    <div className="w-full max-w-4xl mx-auto bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border/50 p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <h2 className="text-2xl font-bold text-foreground mb-8 relative z-10">Schedule New Meeting</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
        <div className="group">
          <label className="block text-sm font-medium text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Meeting Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder="e.g., Weekly Sync"
          />
          {errors.title && <span className="text-xs text-destructive mt-1">{errors.title.message}</span>}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Description</label>
          <textarea
            {...register('description')}
            className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none h-32"
            placeholder="Add meeting agenda..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group">
            <label className="block text-sm font-medium text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
              <input
                type="date"
                {...register('startDate', { required: true })}
                className="w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Start Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
              <input
                type="time"
                {...register('startTime', { required: true })}
                className="w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">End Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
              <input
                type="time"
                {...register('endTime', { required: true })}
                className="w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
        </div>

        <div>
          {/* <label className="block text-sm font-medium text-muted-foreground mb-2">Attendees</label> */}
          {/* <div className="w-full bg-background/50 border border-border/50 rounded-xl p-2 min-h-[56px] flex flex-wrap gap-2 items-center transition-colors"> */}
            {/* {attendees.map(attendee => ( */}
              {/* // <div key={attendee.id} className="flex items-center gap-2 bg-muted border border-border/50 rounded-full px-1.5 py-1 pr-3 shadow-sm">
              //   <img src={attendee.avatar} alt={attendee.name} className="w-6 h-6 rounded-full" />
              //   <span className="text-xs text-foreground/80 font-medium">{attendee.name}</span>
              //   <button type="button" onClick={() => removeAttendee(attendee.id)} className="text-muted-foreground hover:text-destructive transition-colors">
              //     <X className="w-3.5 h-3.5" />
              //   </button>
              // </div> */}
            {/* ))} */}
            {/* <button type="button" className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-full transition-colors ml-1">
              <Plus className="w-3.5 h-3.5" /> Add Attendee
            </button> */}
          {/* </div> */}
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-muted-foreground mb-2 group-focus-within:text-primary transition-colors">Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 group-focus-within:text-primary transition-colors" />
            <select
              {...register('meetingType')}
              className="w-full bg-background/50 border border-border/50 rounded-xl pl-11 pr-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
            >
              <option value={MeetingType.ONLINE}>Online Location</option>
              <option value={MeetingType.PHYSICAL}>Physical Location</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isPending}
            className="px-8 py-3 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-300 disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
          >
            {isPending ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
};
