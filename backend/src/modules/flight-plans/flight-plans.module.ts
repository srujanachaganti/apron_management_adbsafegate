import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlightPlanEntity } from '@database/entities/flight-plan.entity';
import { FlightPlansService } from './services/flight-plans.service';
import { FlightPlansController } from './controllers/flight-plans.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FlightPlanEntity])],
  controllers: [FlightPlansController],
  providers: [FlightPlansService],
  exports: [FlightPlansService],
})
export class FlightPlansModule {}
