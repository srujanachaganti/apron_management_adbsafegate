import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';
import { FlightPlanEntity } from './entities/flight-plan.entity';
import { StandEntity } from './entities/stand.entity';
import { StandAssignmentEntity } from './entities/stand-assignment.entity';
import { UserEntity } from './entities/user.entity';
import { SeedService } from './seeds/seed.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig()),
    TypeOrmModule.forFeature([FlightPlanEntity, StandEntity, StandAssignmentEntity, UserEntity]),
  ],
  providers: [SeedService],
  exports: [TypeOrmModule, SeedService],
})
export class DatabaseModule {}
