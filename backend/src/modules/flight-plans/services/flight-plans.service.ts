import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
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
    const { carrier, flightNumber, stand, apron, terminal, limit = 50, page = 1 } = searchDto;

    const where: any = {};

    if (carrier) {
      where.carrier = ILike(`%${carrier}%`);
    }
    if (flightNumber) {
      where.flightNumber = ILike(`%${flightNumber}%`);
    }
    if (stand) {
      where.stand = ILike(`%${stand}%`);
    }
    if (apron) {
      where.apron = ILike(`%${apron}%`);
    }
    if (terminal) {
      where.terminal = ILike(`%${terminal}%`);
    }

    const [data, total] = await this.flightPlanRepository.findAndCount({
      where,
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

  async getLinkedFlightPlans(flightId: string) {
    return await this.flightPlanRepository.find({
      where: [
        { flightId },
        { linkedFlightId: flightId },
      ],
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
