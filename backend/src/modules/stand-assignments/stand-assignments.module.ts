import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandAssignmentEntity } from '@database/entities/stand-assignment.entity';
import { FlightPlanEntity } from '@database/entities/flight-plan.entity';
import { StandEntity } from '@database/entities/stand.entity';
import { StandAssignmentsController } from './controllers/stand-assignments.controller';
import { StandAssignmentsService } from './services/stand-assignments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StandAssignmentEntity,
      FlightPlanEntity,
      StandEntity,
    ]),
  ],
  controllers: [StandAssignmentsController],
  providers: [StandAssignmentsService],
  exports: [StandAssignmentsService],
})
export class StandAssignmentsModule {}
