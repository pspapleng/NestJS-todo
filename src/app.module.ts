import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config.service';
import { ItemModule } from './item/item.module';
import { MembersModule } from './members/members.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()), ItemModule, MembersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
