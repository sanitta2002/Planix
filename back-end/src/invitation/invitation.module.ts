import { Module } from '@nestjs/common';
import { InvitationService } from '@/invitation/service/invitation.service';
import { InvitationController } from '@/invitation/controller/invitation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invitation, InvitationSchema } from '@/invitation/model/invitation.schema';
import { InvitationRepository } from '@/invitation/repository/invitation.repository';
import { WorkspaceModule } from '@/workspace/workspace.module';
import { MailModule } from '@/common/mail/mail.module';
import { HashingModule } from '@/common/hashing/hashing.module';
import { UsersModule } from '@/users/users.module';
import { AppJwtModule } from '@/common/jwt/jwt.module';
import { SubscriptionsModule } from '@/subscription/subscriptions/subscriptions.module';

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
    SubscriptionsModule,
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
