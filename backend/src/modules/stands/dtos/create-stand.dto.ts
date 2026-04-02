import { IsString, IsOptional } from 'class-validator';

export class CreateStandDto {
  @IsString()
  stand: string;

  @IsOptional()
  @IsString()
  apron?: string;

  @IsOptional()
  @IsString()
  terminal?: string;
}
