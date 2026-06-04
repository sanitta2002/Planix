import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { IMeetingService } from '../interface/IMeetingService';
import { CreateMeetingDto } from '../dto/req/CreateMeetingDto';
import { GetUser } from '@/common/decorators/getuser.decorator';
import type { AuthUser } from '@/common/decorators/getuser.decorator';
import { ApiResponseDto } from '@/common/dto/api-response.dto';
import { MeetingResponse } from '../dto/res/ MeetingResponse';
import { MEETING_MESSAGES } from '@/common/constants/messages.constant';
import { ApiResponse } from '@/common/utils/api-response.util';
import { UpdateMeetingDto } from '../dto/req/UpdateMeetingDto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('meeting')
export class MeetingController {
  constructor(
    @Inject('IMeetingService')
    private readonly _meetingService: IMeetingService,
  ) {}
  @Post()
  async createMeeting(
    @Body() dto: CreateMeetingDto,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<MeetingResponse>> {
    const meeting = await this._meetingService.createMeeting(dto, user.userId);

    return ApiResponse.success(
      HttpStatus.CREATED,
      MEETING_MESSAGES.CREATED,
      meeting,
    );
  }
  @Get('project/:projectId')
  async getMeetingsByProject(
    @Param('projectId') projectId: string,
  ): Promise<ApiResponseDto<MeetingResponse[]>> {
    const meetings = await this._meetingService.getMeetingsByProject(projectId);

    return ApiResponse.success(
      HttpStatus.OK,
      MEETING_MESSAGES.FETCHED,
      meetings,
    );
  }
  @Get(':meetingId')
  async getMeetingById(
    @Param('meetingId') meetingId: string,
  ): Promise<ApiResponseDto<MeetingResponse>> {
    const meeting = await this._meetingService.getMeetingById(meetingId);

    return ApiResponse.success(
      HttpStatus.OK,
      MEETING_MESSAGES.FETCHED,
      meeting,
    );
  }
  @Patch(':meetingId')
  async updateMeeting(
    @Param('meetingId') meetingId: string,
    @Body() dto: UpdateMeetingDto,
  ): Promise<ApiResponseDto<MeetingResponse>> {
    const meeting = await this._meetingService.updateMeeting(meetingId, dto);

    return ApiResponse.success(
      HttpStatus.OK,
      MEETING_MESSAGES.UPDATED,
      meeting,
    );
  }
  @Post(':meetingId/join')
  async joinMeeting(
    @Param('meetingId') meetingId: string,
    @GetUser() user: AuthUser,
  ): Promise<ApiResponseDto<MeetingResponse>> {
    const meeting = await this._meetingService.joinMeeting(
      meetingId,
      user.userId,
    );

    return ApiResponse.success(
      HttpStatus.OK,
      MEETING_MESSAGES.STARTED,
      meeting,
    );
  }
  @Post(':meetingId/end')
  async endMeeting(
    @Param('meetingId') meetingId: string,
  ): Promise<ApiResponseDto<MeetingResponse>> {
    const meeting = await this._meetingService.endMeeting(meetingId);

    return ApiResponse.success(
      HttpStatus.OK,
      MEETING_MESSAGES.COMPLETED,
      meeting,
    );
  }
}
