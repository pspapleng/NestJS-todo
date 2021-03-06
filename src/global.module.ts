import { AssignedMemberEntity } from './model/assignedMembers.entity';
import { configService } from '@/config/config.service';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './auth/jwt.strategy';
import { MemberEntity } from './model/member.entity';
import { TodoEntity } from './model/todo.entity';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: configService.getJwtSecret(),
      signOptions: { expiresIn: '7d' },
    }),
    TypeOrmModule.forFeature([TodoEntity, MemberEntity, AssignedMemberEntity]),
    ThrottlerModule.forRoot({
      ttl: 60, // 60 sec
      limit: configService.getRateLimit(),
    }),
    BullModule.forRoot({
      redis: configService.getRedisConfig(),
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [],
  providers: [JwtStrategy],
  exports: [JwtModule, TypeOrmModule, ThrottlerModule, BullModule],
})
export class GlobalModule {}
