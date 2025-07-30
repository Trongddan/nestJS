import { Module } from '@nestjs/common';
import { FacilityService } from './facility.service';
import { FacilityController } from './facility.controller';
import { Facility } from './entities/facility.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Facility])], // Import TypeOrmModule with Facility entity
  controllers: [FacilityController],
  providers: [FacilityService],
})
export class FacilityModule {}
