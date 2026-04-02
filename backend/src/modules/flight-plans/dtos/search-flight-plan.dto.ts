import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SearchFlightPlanDto {
  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsString()
  flightNumber?: string;

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
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  page?: number;
}
