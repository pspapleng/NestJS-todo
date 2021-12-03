import { Module } from '@nestjs/common';
import { GlobalModule } from './global.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    GlobalModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
