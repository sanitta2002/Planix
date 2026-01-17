import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto): Promise<RegisterUserDto> {
    return this.authService.registerUser(dto);
  }
}
