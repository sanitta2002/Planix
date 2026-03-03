import { Module } from '@nestjs/common';
import { InvitationService } from './service/invitation.service';
import { InvitationController } from './controller/invitation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from './model/invitation.schema';
import { InvitationRepository } from './repository/invitation.repository';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { MailModule } from 'src/common/mail/mail.module';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { UsersModule } from 'src/users/users.module';
import { AppJwtModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    WorkspaceModule,
    MailModule,
    HashingModule,
    UsersModule,
    AppJwtModule,
  ],
  providers: [
    {
      provide: 'IInvitationService',
      useClass: InvitationService,
    },
    {
      provide: 'IInvitationRepository',
      useClass: InvitationRepository,
    },
  ],
  controllers: [InvitationController],
  exports: ['IInvitationService'],
})
export class InvitationModule {}
