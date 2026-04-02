import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { FlightPlansModule } from './modules/flight-plans/flight-plans.module';
import { StandsModule } from './modules/stands/stands.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    FlightPlansModule,
    StandsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
