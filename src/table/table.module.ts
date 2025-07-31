import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from './entities/table.entity';
import { Facility } from 'src/facility/entities/facility.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Facility])], // Add your Table entity here if needed
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule {}
