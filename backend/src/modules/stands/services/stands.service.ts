import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { StandEntity } from '@database/entities/stand.entity';
import { CreateStandDto } from '../dtos/create-stand.dto';
import { UpdateStandDto } from '../dtos/update-stand.dto';

@Injectable()
export class StandsService {
  constructor(
    @InjectRepository(StandEntity)
    private readonly standRepository: Repository<StandEntity>,
  ) {}

  async create(createStandDto: CreateStandDto) {
    const stand = this.standRepository.create(createStandDto);
    return await this.standRepository.save(stand);
  }

  async findAll(page: number = 1, limit: number = 50) {
    const [data, total] = await this.standRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { stand: 'ASC' },
    });

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(stand: string) {
    const standEntity = await this.standRepository.findOne({
      where: { stand },
    });

    if (!standEntity) {
      throw new NotFoundException(`Stand ${stand} not found`);
    }

    return standEntity;
  }

  async search(apron?: string, terminal?: string, stand?: string) {
    const where: any = {};

    if (apron) {
      where.apron = ILike(`%${apron}%`);
    }
    if (terminal) {
      where.terminal = ILike(`%${terminal}%`);
    }
    if (stand) {
      where.stand = ILike(`%${stand}%`);
    }

    return await this.standRepository.find({
      where,
      order: { stand: 'ASC' },
    });
  }

  async getByApron(apron: string) {
    return await this.standRepository.find({
      where: { apron },
      order: { stand: 'ASC' },
    });
  }

  async getByTerminal(terminal: string) {
    return await this.standRepository.find({
      where: { terminal },
      order: { stand: 'ASC' },
    });
  }

  async update(stand: string, updateStandDto: UpdateStandDto) {
    await this.findOne(stand); // Check if exists
    await this.standRepository.update({ stand }, updateStandDto);
    return await this.findOne(stand);
  }

  async remove(stand: string) {
    const standEntity = await this.findOne(stand);
    return await this.standRepository.remove(standEntity);
  }
}
