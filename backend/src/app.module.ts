import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { FlightPlansModule } from './modules/flight-plans/flight-plans.module';
import { StandsModule } from './modules/stands/stands.module';
import { StandAssignmentsModule } from './modules/stand-assignments/stand-assignments.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    FlightPlansModule,
    StandsModule,
    StandAssignmentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
