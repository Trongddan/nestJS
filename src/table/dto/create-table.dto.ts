import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TableStatus } from '../entities/table.entity';

export class CreateTableDto {
  @IsString()
  name: string;

  @IsNumber({}, { message: 'Giá theo giờ phải là số' })
  price_per_hour: number;

  @IsString()
  type?: string;

  @IsEnum(TableStatus, { message: 'Trạng thái bàn không được để trống' })
  status: TableStatus; // Có thể sử dụng enum nếu cần

  @IsNumber({}, { message: 'ID cơ sở không được để trống' })
  facility_id: number; // Sử dụng number nếu ID là số, hoặc string nếu ID là chuỗi
}
