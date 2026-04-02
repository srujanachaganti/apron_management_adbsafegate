import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlightPlanEntity } from '../entities/flight-plan.entity';
import { StandEntity } from '../entities/stand.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(FlightPlanEntity)
    private readonly flightPlanRepository: Repository<FlightPlanEntity>,
    @InjectRepository(StandEntity)
    private readonly standRepository: Repository<StandEntity>,
  ) {}

  async seed() {
    try {
      this.logger.log('🌱 Starting database seeding...');

      // Seed flight plans
      await this.seedFlightPlans();

      // Seed stands
      await this.seedStands();

      this.logger.log('✅ Database seeding completed successfully');
    } catch (error) {
      this.logger.error('❌ Database seeding failed', error.stack);
      throw error;
    }
  }

  private async seedFlightPlans() {
    try {
      const filePath = path.join(
        process.cwd(),
        '..',
        'data',
        'flightplans.json',
      );

      if (!fs.existsSync(filePath)) {
        this.logger.warn(`⚠️  File not found: ${filePath}`);
        return;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const flightPlans = JSON.parse(fileContent);

      // Clear existing data
      await this.flightPlanRepository.delete({});

      // Insert new data
      const entities = flightPlans.map((plan) => {
        return this.flightPlanRepository.create({
          ...plan,
          created: new Date(plan.created),
          updated: new Date(plan.updated),
          originDate: new Date(plan.originDate),
          aobt: new Date(plan.aobt),
          std: new Date(plan.std),
          aibt: plan.aibt ? new Date(plan.aibt) : null,
          sta: plan.sta ? new Date(plan.sta) : null,
        });
      });

      await this.flightPlanRepository.save(entities);
      this.logger.log(`✅ Seeded ${entities.length} flight plans`);
    } catch (error) {
      this.logger.error('Error seeding flight plans', error.stack);
      throw error;
    }
  }

  private async seedStands() {
    try {
      const filePath = path.join(
        process.cwd(),
        '..',
        'data',
        'stands.json',
      );

      if (!fs.existsSync(filePath)) {
        this.logger.warn(`⚠️  File not found: ${filePath}`);
        return;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const stands = JSON.parse(fileContent);

      // Clear existing data
      await this.standRepository.delete({});

      // Insert new data
      const entities = stands.map((stand) =>
        this.standRepository.create(stand),
      );

      await this.standRepository.save(entities);
      this.logger.log(`✅ Seeded ${entities.length} stands`);
    } catch (error) {
      this.logger.error('Error seeding stands', error.stack);
      throw error;
    }
  }
}
