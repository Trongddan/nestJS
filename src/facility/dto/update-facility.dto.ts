import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateFacilityDto } from './create-facility.dto';

export class UpdateFacilityDto extends PartialType(CreateFacilityDto) {
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsString({ message: 'Description must be a string' })
  description?: string;
}
