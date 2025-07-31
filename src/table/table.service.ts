/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Facility } from 'src/facility/entities/facility.entity';
import { Repository } from 'typeorm';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { Table } from './entities/table.entity';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(Table) private readonly tableRepo: Repository<Table>,
    @InjectRepository(Facility)
    private readonly facilityRepo: Repository<Facility>,
  ) {}
  async create(createTableDto: CreateTableDto) {
    const existFacility = await this.facilityRepo.findOne({
      where: { id: +createTableDto.facility_id },
    });
    if (!existFacility) {
      throw new ConflictException('Cơ sở không tồn tại');
    }
    const newTable = this.tableRepo.create({
      ...createTableDto,
      facility: existFacility, // Gán entity Facility thay vì facility_id
    });
    return this.tableRepo.save(newTable);
  }

  findAll() {
    return this.tableRepo.find({ relations: ['facility'] });
  }

  async findByFacility(id: number) {
    const existFacility = await this.facilityRepo.findOne({
      where: { id },
    });
    if (!existFacility) {
      throw new NotFoundException('Cơ sở không tồn tại');
    }
    const tables = await this.tableRepo.find({
      where: { facility: { id } },
      relations: ['facility'],
    });
    return tables;
  }

  findOne(id: number) {
    return this.tableRepo.findOne({
      where: { id },
      relations: ['facility'],
    });
  }

  async update(id: number, updateTableDto: UpdateTableDto) {
    const existTable = await this.tableRepo.findOne({
      where: { id },
    });
    if (!existTable) {
      throw new NotFoundException('Bàn không tồn tại hoặc không khả dụng');
    }
    return this.tableRepo.update(id, updateTableDto).then(() => {
      return this.tableRepo.findOne({
        where: { id },
        relations: ['facility'],
      });
    });
  }

  remove(id: number) {
    return `This action removes a #${id} table`;
  }
}
