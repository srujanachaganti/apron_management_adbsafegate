import { PartialType } from '@nestjs/mapped-types';
import { CreateFlightPlanDto } from './create-flight-plan.dto';

export class UpdateFlightPlanDto extends PartialType(CreateFlightPlanDto) {}
