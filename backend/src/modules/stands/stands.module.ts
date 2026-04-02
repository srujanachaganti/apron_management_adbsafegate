import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandEntity } from '@database/entities/stand.entity';
import { StandsService } from './services/stands.service';
import { StandsController } from './controllers/stands.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StandEntity])],
  controllers: [StandsController],
  providers: [StandsService],
  exports: [StandsService],
})
export class StandsModule {}
