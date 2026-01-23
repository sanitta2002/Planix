import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppJwtService } from './jwt.service';


@Module({
  imports:[JwtModule.register({
    secret:process.env.JWT_SECRET || 'default-secret' ,
    signOptions:{expiresIn:'15m'}
    
  })],
  providers: [{
    provide:'IJwtService',
    useClass:AppJwtService
  }],
  exports:['IJwtService']
})
export class AppJwtModule {}
