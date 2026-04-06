import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { StandAssignmentsService } from '../services/stand-assignments.service';
import { CreateStandAssignmentDto } from '../dtos/create-stand-assignment.dto';
import { SearchStandAssignmentDto } from '../dtos/search-stand-assignment.dto';

@Controller('stand-assignments')
export class StandAssignmentsController {
  constructor(
    private readonly standAssignmentsService: StandAssignmentsService,
  ) {}

  @Post()
  create(@Body() createDto: CreateStandAssignmentDto) {
    return this.standAssignmentsService.create(createDto);
  }

  @Get()
  findAll(@Query() searchDto: SearchStandAssignmentDto) {
    return this.standAssignmentsService.findAll(searchDto);
  }

  @Get('stand/:standId')
  getByStand(@Param('standId') standId: string) {
    return this.standAssignmentsService.getByStand(standId);
  }

  @Get('flight-plan/:flightPlanId')
  getByFlightPlan(@Param('flightPlanId') flightPlanId: string) {
    return this.standAssignmentsService.getByFlightPlan(+flightPlanId);
  }

  @Get('check-availability')
  checkAvailability(
    @Query('standId') standId: string,
    @Query('fromTime') fromTime: string,
    @Query('toTime') toTime: string,
    @Query('excludeAssignmentId') excludeAssignmentId?: string,
  ) {
    return this.standAssignmentsService.checkAvailability(
      standId,
      new Date(fromTime),
      new Date(toTime),
      excludeAssignmentId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.standAssignmentsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.standAssignmentsService.remove(id);
  }
}
