import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In, MoreThanOrEqual, LessThanOrEqual, Brackets } from 'typeorm';
import { FlightPlanEntity } from '@database/entities/flight-plan.entity';
import { CreateFlightPlanDto } from '../dtos/create-flight-plan.dto';
import { UpdateFlightPlanDto } from '../dtos/update-flight-plan.dto';
import { SearchFlightPlanDto } from '../dtos/search-flight-plan.dto';

@Injectable()
export class FlightPlansService {
  constructor(
    @InjectRepository(FlightPlanEntity)
    private readonly flightPlanRepository: Repository<FlightPlanEntity>,
  ) {}

  async create(createFlightPlanDto: CreateFlightPlanDto) {
    const flightPlan = this.flightPlanRepository.create(createFlightPlanDto);
    return await this.flightPlanRepository.save(flightPlan);
  }

  async findAll(page: number = 1, limit: number = 50) {
    const [data, total] = await this.flightPlanRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { created: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const flightPlan = await this.flightPlanRepository.findOne({
      where: { id },
    });

    if (!flightPlan) {
      throw new NotFoundException(`FlightPlan with ID ${id} not found`);
    }

    return flightPlan;
  }

  async search(searchDto: SearchFlightPlanDto) {
    const {
      search,
      carrier,
      flightNumber,
      flightPlanType,
      stand,
      apron,
      terminal,
      originDateFrom,
      originDateTo,
      limit = 50,
      page = 1,
    } = searchDto;

    const queryBuilder = this.flightPlanRepository
      .createQueryBuilder('fp')
      .orderBy('fp.created', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // Free-text search across multiple fields
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('fp.calculatedCallsign ILIKE :search', { search: `%${search}%` })
            .orWhere('fp.carrier ILIKE :search', { search: `%${search}%` })
            .orWhere('fp.flightNumber ILIKE :search', { search: `%${search}%` })
            .orWhere('fp.adep ILIKE :search', { search: `%${search}%` })
            .orWhere('fp.ades ILIKE :search', { search: `%${search}%` })
            .orWhere('fp.aircraftRegistration ILIKE :search', { search: `%${search}%` });
        }),
      );
    }

    // Specific field filters
    if (carrier) {
      queryBuilder.andWhere('fp.carrier ILIKE :carrier', { carrier: `%${carrier}%` });
    }
    if (flightNumber) {
      queryBuilder.andWhere('fp.flightNumber ILIKE :flightNumber', { flightNumber: `%${flightNumber}%` });
    }
    if (flightPlanType) {
      queryBuilder.andWhere('fp.flightPlanType = :flightPlanType', { flightPlanType });
    }
    if (stand) {
      queryBuilder.andWhere('fp.stand ILIKE :stand', { stand: `%${stand}%` });
    }
    if (apron) {
      queryBuilder.andWhere('fp.apron ILIKE :apron', { apron: `%${apron}%` });
    }
    if (terminal) {
      queryBuilder.andWhere('fp.terminal ILIKE :terminal', { terminal: `%${terminal}%` });
    }

    // Date range filters
    if (originDateFrom) {
      queryBuilder.andWhere('fp.originDate >= :originDateFrom', { originDateFrom });
    }
    if (originDateTo) {
      queryBuilder.andWhere('fp.originDate <= :originDateTo', { originDateTo });
    }

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getByStand(stand: string) {
    return await this.flightPlanRepository.find({
      where: { stand },
      order: { created: 'DESC' },
    });
  }

  async getByApron(apron: string) {
    return await this.flightPlanRepository.find({
      where: { apron },
      order: { created: 'DESC' },
    });
  }

  /**
   * Get linked flight plans by flight plan ID
   * Links are determined by:
   * 1. Same linkedFlightId
   * 2. The flight's linkedFlightId matches another flight's ifplid
   */
  async getLinkedFlightPlans(id: number) {
    const flightPlan = await this.findOne(id);

    if (!flightPlan.linkedFlightId) {
      return [flightPlan]; // No linked flights, return just this one
    }

    // Find all flight plans with the same linkedFlightId or matching ifplid
    const linked = await this.flightPlanRepository
      .createQueryBuilder('fp')
      .where('fp.linkedFlightId = :linkedFlightId', {
        linkedFlightId: flightPlan.linkedFlightId,
      })
      .orWhere('fp.ifplid LIKE :linkedFlightId', {
        linkedFlightId: `${flightPlan.linkedFlightId}%`,
      })
      .orderBy('fp.created', 'ASC')
      .getMany();

    return linked;
  }

  /**
   * Legacy method - get by flightId (UUID)
   */
  async getLinkedByFlightId(flightId: string) {
    return await this.flightPlanRepository.find({
      where: [{ flightId }, { linkedFlightId: flightId }],
      order: { created: 'DESC' },
    });
  }

  async update(id: number, updateFlightPlanDto: UpdateFlightPlanDto) {
    const flightPlan = await this.findOne(id);
    Object.assign(flightPlan, updateFlightPlanDto);
    return await this.flightPlanRepository.save(flightPlan);
  }

  async remove(id: number) {
    const flightPlan = await this.findOne(id);
    return await this.flightPlanRepository.remove(flightPlan);
  }

  async getActiveFlightPlans(page: number = 1, limit: number = 50) {
    const [data, total] = await this.flightPlanRepository.findAndCount({
      where: { flightPlanAction: 'Active' },
      skip: (page - 1) * limit,
      take: limit,
      order: { created: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
}
