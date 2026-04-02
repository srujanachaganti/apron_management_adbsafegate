import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StandsService } from '../services/stands.service';
import { CreateStandDto } from '../dtos/create-stand.dto';
import { UpdateStandDto } from '../dtos/update-stand.dto';

@Controller('stands')
export class StandsController {
  constructor(private readonly standsService: StandsService) {}

  @Post()
  create(@Body() createStandDto: CreateStandDto) {
    return this.standsService.create(createStandDto);
  }

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.standsService.findAll(page || 1, limit || 50);
  }

  @Get('search')
  search(
    @Query('apron') apron?: string,
    @Query('terminal') terminal?: string,
    @Query('stand') stand?: string,
  ) {
    return this.standsService.search(apron, terminal, stand);
  }

  @Get('by-apron/:apron')
  getByApron(@Param('apron') apron: string) {
    return this.standsService.getByApron(apron);
  }

  @Get('by-terminal/:terminal')
  getByTerminal(@Param('terminal') terminal: string) {
    return this.standsService.getByTerminal(terminal);
  }

  @Get(':stand')
  findOne(@Param('stand') stand: string) {
    return this.standsService.findOne(stand);
  }

  @Patch(':stand')
  update(
    @Param('stand') stand: string,
    @Body() updateStandDto: UpdateStandDto,
  ) {
    return this.standsService.update(stand, updateStandDto);
  }

  @Delete(':stand')
  remove(@Param('stand') stand: string) {
    return this.standsService.remove(stand);
  }
}
