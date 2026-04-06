import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchFlightPlanDto {
  @IsOptional()
  @IsString()
  search?: string; // Free-text search across multiple fields

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

  @IsOptional()
  @IsString()
  flightPlanType?: string; // Filter by flightPlanType (Arrival, Departure, TowOutMovement)

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
  @IsDateString()
  originDateFrom?: string; // Filter by originDate range

  @IsOptional()
  @IsDateString()
  originDateTo?: string; // Filter by originDate range

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;
}
