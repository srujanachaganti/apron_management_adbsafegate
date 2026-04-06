import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, And } from 'typeorm';
import { StandAssignmentEntity } from '@database/entities/stand-assignment.entity';
import { FlightPlanEntity } from '@database/entities/flight-plan.entity';
import { StandEntity } from '@database/entities/stand.entity';
import { CreateStandAssignmentDto } from '../dtos/create-stand-assignment.dto';
import { SearchStandAssignmentDto } from '../dtos/search-stand-assignment.dto';

@Injectable()
export class StandAssignmentsService {
  constructor(
    @InjectRepository(StandAssignmentEntity)
    private readonly standAssignmentRepository: Repository<StandAssignmentEntity>,
    @InjectRepository(FlightPlanEntity)
    private readonly flightPlanRepository: Repository<FlightPlanEntity>,
    @InjectRepository(StandEntity)
    private readonly standRepository: Repository<StandEntity>,
  ) {}

  async create(createDto: CreateStandAssignmentDto): Promise<StandAssignmentEntity> {
    // 1. Validate that the flight plan exists
    const flightPlan = await this.flightPlanRepository.findOne({
      where: { id: createDto.flightPlanId },
    });

    if (!flightPlan) {
      throw new NotFoundException(
        `FlightPlan with ID ${createDto.flightPlanId} not found`,
      );
    }

    // 2. Validate that the stand exists
    const stand = await this.standRepository.findOne({
      where: { stand: createDto.standId },
    });

    if (!stand) {
      throw new NotFoundException(`Stand ${createDto.standId} not found`);
    }

    // 3. Parse dates
    const fromTime = new Date(createDto.fromTime);
    const toTime = new Date(createDto.toTime);

    // 4. Check for overlapping assignments
    // Two intervals [A, B) and [C, D) overlap if A < D AND C < B
    const overlapping = await this.standAssignmentRepository
      .createQueryBuilder('sa')
      .where('sa.standId = :standId', { standId: createDto.standId })
      .andWhere('sa.fromTime < :toTime', { toTime })
      .andWhere('sa.toTime > :fromTime', { fromTime })
      .getOne();

    if (overlapping) {
      throw new ConflictException(
        `Stand ${createDto.standId} already occupied between ${overlapping.fromTime.toISOString()} and ${overlapping.toTime.toISOString()}`,
      );
    }

    // 5. Create the assignment
    const assignment = this.standAssignmentRepository.create({
      flightPlanId: createDto.flightPlanId,
      standId: createDto.standId,
      fromTime,
      toTime,
      remarks: createDto.remarks,
    });

    return await this.standAssignmentRepository.save(assignment);
  }

  async findAll(searchDto: SearchStandAssignmentDto): Promise<StandAssignmentEntity[]> {
    const queryBuilder = this.standAssignmentRepository
      .createQueryBuilder('sa')
      .leftJoinAndSelect('sa.flightPlan', 'flightPlan')
      .leftJoinAndSelect('sa.stand', 'stand');

    if (searchDto.standId) {
      queryBuilder.andWhere('sa.standId = :standId', {
        standId: searchDto.standId,
      });
    }

    if (searchDto.from) {
      queryBuilder.andWhere('sa.toTime > :from', {
        from: new Date(searchDto.from),
      });
    }

    if (searchDto.to) {
      queryBuilder.andWhere('sa.fromTime < :to', {
        to: new Date(searchDto.to),
      });
    }

    return await queryBuilder
      .orderBy('sa.fromTime', 'ASC')
      .getMany();
  }

  async findOne(id: string): Promise<StandAssignmentEntity> {
    const assignment = await this.standAssignmentRepository.findOne({
      where: { id },
      relations: ['flightPlan', 'stand'],
    });

    if (!assignment) {
      throw new NotFoundException(`StandAssignment with ID ${id} not found`);
    }

    return assignment;
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await this.standAssignmentRepository.remove(assignment);
  }

  async getByStand(standId: string): Promise<StandAssignmentEntity[]> {
    return await this.standAssignmentRepository.find({
      where: { standId },
      relations: ['flightPlan', 'stand'],
      order: { fromTime: 'ASC' },
    });
  }

  async getByFlightPlan(flightPlanId: number): Promise<StandAssignmentEntity[]> {
    return await this.standAssignmentRepository.find({
      where: { flightPlanId },
      relations: ['flightPlan', 'stand'],
      order: { fromTime: 'ASC' },
    });
  }

  /**
   * Check if a stand is available during a given time window
   */
  async checkAvailability(
    standId: string,
    fromTime: Date,
    toTime: Date,
    excludeAssignmentId?: string,
  ): Promise<{ available: boolean; conflicts: StandAssignmentEntity[] }> {
    const queryBuilder = this.standAssignmentRepository
      .createQueryBuilder('sa')
      .leftJoinAndSelect('sa.flightPlan', 'flightPlan')
      .where('sa.standId = :standId', { standId })
      .andWhere('sa.fromTime < :toTime', { toTime })
      .andWhere('sa.toTime > :fromTime', { fromTime });

    if (excludeAssignmentId) {
      queryBuilder.andWhere('sa.id != :excludeId', {
        excludeId: excludeAssignmentId,
      });
    }

    const conflicts = await queryBuilder.getMany();

    return {
      available: conflicts.length === 0,
      conflicts,
    };
  }
}
