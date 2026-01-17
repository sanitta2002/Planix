import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { IuserService } from '../interfaces/user.service.interface';
import type { IUserRepository } from 'src/users/interfaces/user.repository.interface';
import { User } from 'src/users/Models/user.schema';
import { RegisterUserDto } from '../dto/RequestDTO/Register.dto';
import type { IHashingService } from 'src/common/hashing/interface/hashing.service.interface';

@Injectable()
export class AuthService implements IuserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    @Inject('IHashingService') private readonly hashingService: IHashingService,
  ) {}
  async registerUser(dto: RegisterUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await this.hashingService.hashPassword(dto.password);
    return this.userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password: hashedPassword,
    });
  }
}
