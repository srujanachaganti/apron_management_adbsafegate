import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FlightPlansService } from '../services/flight-plans.service';
import { CreateFlightPlanDto } from '../dtos/create-flight-plan.dto';
import { UpdateFlightPlanDto } from '../dtos/update-flight-plan.dto';
import { SearchFlightPlanDto } from '../dtos/search-flight-plan.dto';

@Controller('flight-plans')
export class FlightPlansController {
  constructor(private readonly flightPlansService: FlightPlansService) {}

  @Post()
  create(@Body() createFlightPlanDto: CreateFlightPlanDto) {
    return this.flightPlansService.create(createFlightPlanDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchFlightPlanDto) {
    // If any search parameters are provided, use search method
    const hasSearchParams = searchDto.search || searchDto.carrier || searchDto.flightNumber ||
      searchDto.flightPlanType || searchDto.stand || searchDto.apron || searchDto.terminal ||
      searchDto.originDateFrom || searchDto.originDateTo;

    if (hasSearchParams) {
      return this.flightPlansService.search(searchDto);
    }

    return this.flightPlansService.findAll(searchDto.page || 1, searchDto.limit || 50);
  }

  @Get('search')
  search(@Query() searchDto: SearchFlightPlanDto) {
    return this.flightPlansService.search(searchDto);
  }

  @Get('active')
  getActiveFlightPlans(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.flightPlansService.getActiveFlightPlans(page || 1, limit || 50);
  }

  @Get('stand/:stand')
  getByStand(@Param('stand') stand: string) {
    return this.flightPlansService.getByStand(stand);
  }

  @Get('apron/:apron')
  getByApron(@Param('apron') apron: string) {
    return this.flightPlansService.getByApron(apron);
  }

  @Get(':id/linked')
  getLinkedFlightPlans(@Param('id') id: string) {
    return this.flightPlansService.getLinkedFlightPlans(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flightPlansService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlightPlanDto: UpdateFlightPlanDto,
  ) {
    return this.flightPlansService.update(+id, updateFlightPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.flightPlansService.remove(+id);
  }
}
