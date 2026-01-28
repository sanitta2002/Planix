import { Module } from '@nestjs/common';
import { RedisProvider } from '../redis/redis.provider';
import { TempStoreUserService } from './temp-store-user.service';

@Module({
    providers:[RedisProvider,{
        provide:'ITempStoreService',
        useClass:TempStoreUserService
    }],
    exports:['ITempStoreService']
})
export class TempStoreUserModule {}
