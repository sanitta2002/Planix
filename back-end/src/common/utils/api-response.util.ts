import { ApiResponseDto } from '../dto/api-response.dto';

export class ApiResponse {
  static success<T>(
    statusCode: number,
    message: string,
    data?: T,
  ): ApiResponseDto<T> {
    return new ApiResponseDto(true, statusCode, message, data);
  }

  static error(statusCode: number, message: string): ApiResponseDto<null> {
    return new ApiResponseDto(false, statusCode, message);
  }
}
