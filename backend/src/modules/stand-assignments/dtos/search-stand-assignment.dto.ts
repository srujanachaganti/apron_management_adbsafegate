import { IsString, IsOptional, IsDateString } from 'class-validator';

export class SearchStandAssignmentDto {
  @IsOptional()
  @IsString()
  standId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
