
import { AxiosInstance } from '../../axios/axios';
import { API_ROUTES } from '../../constants/apiRoutes';
import type { CreateMeetingDto, Meeting, UpdateMeetingDto } from '../../types/meeting';

export const MeetingService = {
  createMeeting: async (dto: CreateMeetingDto): Promise<{ data: Meeting; message: string }> => {
    const response = await AxiosInstance.post(API_ROUTES.MEETING.CREATE, dto);
    return response.data;
  },

  getMeetingsByProject: async (projectId: string): Promise<{ data: Meeting[]; message: string }> => {
    const url = API_ROUTES.MEETING.GET_BY_PROJECT.replace(':projectId', projectId);
    const response = await AxiosInstance.get(url);
    return response.data;
  },

  getMeetingById: async (meetingId: string): Promise<{ data: Meeting; message: string }> => {
    const url = API_ROUTES.MEETING.GET_BY_ID.replace(':meetingId', meetingId);
    const response = await AxiosInstance.get(url);
    return response.data;
  },

  updateMeeting: async (meetingId: string, dto: UpdateMeetingDto): Promise<{ data: Meeting; message: string }> => {
    const url = API_ROUTES.MEETING.UPDATE.replace(':meetingId', meetingId);
    const response = await AxiosInstance.patch(url, dto);
    return response.data;
  },

  joinMeeting: async (meetingId: string): Promise<{ data: Meeting; message: string }> => {
    const url = API_ROUTES.MEETING.JOIN.replace(':meetingId', meetingId);
    const response = await AxiosInstance.post(url);
    return response.data;
  },

  endMeeting: async (meetingId: string): Promise<{ data: Meeting; message: string }> => {
    const url = API_ROUTES.MEETING.END.replace(':meetingId', meetingId);
    const response = await AxiosInstance.post(url);
    return response.data;
  },
};
