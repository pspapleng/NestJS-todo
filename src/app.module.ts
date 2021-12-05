import { NotificationConsumer } from './consumer/notification.consumer';
import { Module } from '@nestjs/common';
import { GlobalModule } from './global.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationSchedule } from './schedule/notification.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GlobalModule,
    AuthModule,
    TodoModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [NotificationSchedule, NotificationConsumer],
})
export class AppModule {}
