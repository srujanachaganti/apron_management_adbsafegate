import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { FlightPlanEntity } from './entities/flight-plan.entity';
import { StandEntity } from './entities/stand.entity';
import { StandAssignmentEntity } from './entities/stand-assignment.entity';
import { UserEntity } from './entities/user.entity';

export const databaseConfig = (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'apron_management',
    entities: [FlightPlanEntity, StandEntity, StandAssignmentEntity, UserEntity],
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    dropSchema: false,
  };
};
