import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateStandAssignmentDto {
  @IsNumber()
  flightPlanId: number;

  @IsString()
  standId: string;

  @IsDateString()
  fromTime: string;

  @IsDateString()
  toTime: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
