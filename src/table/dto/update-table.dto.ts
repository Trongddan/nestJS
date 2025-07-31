import { PartialType } from '@nestjs/mapped-types';
import { CreateTableDto } from './create-table.dto';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TableStatus } from '../entities/table.entity';

export class UpdateTableDto extends PartialType(CreateTableDto) {
  @IsString()
  name?: string;

  @IsNumber({}, { message: 'Giá theo giờ phải là số' })
  price_per_hour?: number;

  @IsString()
  type?: string;

  @IsEnum(TableStatus, { message: 'Trạng thái bàn không được để trống' })
  status?: TableStatus; // Có thể sử dụng enum nếu cần
}
