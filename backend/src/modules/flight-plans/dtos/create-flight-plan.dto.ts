import { IsOptional, IsString, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlightPlanDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  ifplid?: string;

  @IsUUID()
  flightId: string;

  @IsString()
  flightPlanType: string;

  @IsString()
  flightPlanAction: string;

  @IsOptional()
  @IsString()
  linkedFlightId?: string;

  @IsOptional()
  @IsString()
  linkedFlightPlanType?: string;

  @IsDate()
  @Type(() => Date)
  originDate: Date;

  @IsString()
  carrier: string;

  @IsString()
  flightNumber: string;

  @IsString()
  calculatedCallsign: string;

  @IsString()
  aircraftRegistration: string;

  @IsString()
  aircraftType: string;

  @IsString()
  aircraftTypeIcao: string;

  @IsString()
  adep: string;

  @IsString()
  ades: string;

  @IsOptional()
  @IsString()
  stand?: string;

  @IsOptional()
  @IsString()
  apron?: string;

  @IsOptional()
  @IsString()
  terminal?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  aibt?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  sta?: Date;

  @IsDate()
  @Type(() => Date)
  aobt: Date;

  @IsDate()
  @Type(() => Date)
  std: Date;
}
