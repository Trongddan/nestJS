import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacilityDto } from './dto/create-facility.dto';
import { UpdateFacilityDto } from './dto/update-facility.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Facility } from './entities/facility.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FacilityService {
  constructor(
    @InjectRepository(Facility)
    private readonly facilityRepo: Repository<Facility>,
  ) {}

  async create(createFacilityDto: CreateFacilityDto) {
    const existingFacility = await this.facilityRepo.findOne({
      where: { name: createFacilityDto.name },
    });
    if (existingFacility) {
      throw new ConflictException('Cơ sở đã tồn tại với tên này');
    }
    return this.facilityRepo.save(createFacilityDto);
  }

  findAll() {
    return this.facilityRepo.find();
  }

  async update(id: number, updateFacilityDto: UpdateFacilityDto) {
    const existingFacility = await this.facilityRepo.findOne({
      where: { id },
    });
    if (!existingFacility) {
      throw new NotFoundException('Cơ sở không tồn tại hoặc không khả dụng');
    }
    return this.facilityRepo.update(id, updateFacilityDto);
  }

  async remove(id: number) {
    const existingFacility = await this.facilityRepo.findOne({
      where: { id },
      // relations: ['tables'],
    });
    if (!existingFacility) {
      throw new NotFoundException('Cơ sở không tồn tại');
    }

    // for (const table of existingFacility.tables) {
    //   await this.tableRepo.softDelete(table.id);
    // }

    return this.facilityRepo.softDelete(id).then(() => {
      return { message: 'Cơ sở đã được xóa thành công' };
    });
  }
}
