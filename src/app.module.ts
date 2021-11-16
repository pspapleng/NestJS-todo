import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { MembersModule } from './members/members.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()), MembersModule, AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
