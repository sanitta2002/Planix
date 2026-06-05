import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { MeetingService } from '../../Service/meeting/meeting.service';

import { toast } from 'sonner';
import type { CreateMeetingDto, UpdateMeetingDto } from '../../types/meeting';

export const useGetProjectMeetings = (projectId: string) => {
  return useQuery({
    queryKey: ['meetings', projectId],
    queryFn: () => MeetingService.getMeetingsByProject(projectId),
    enabled: !!projectId,
  });
};

export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dto: CreateMeetingDto) => MeetingService.createMeeting(dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', variables.projectId] });
      toast.success(data.message || 'Meeting created successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to create meeting');
    }
  });
};

export const useJoinMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => MeetingService.joinMeeting(meetingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', data.data.projectId] });
      // The component using this should handle opening the link
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to join meeting');
    }
  });
};

export const useUpdateMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ meetingId, dto }: { meetingId: string; dto: UpdateMeetingDto }) => 
      MeetingService.updateMeeting(meetingId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', data.data.projectId] });
      toast.success(data.message || 'Meeting updated successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to update meeting');
    }
  });
};

export const useEndMeeting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => MeetingService.endMeeting(meetingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['meetings', data.data.projectId] });
      toast.success(data.message || 'Meeting ended successfully');
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || 'Failed to end meeting');
    }
  });
};
