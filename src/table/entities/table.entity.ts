/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Facility } from 'src/facility/entities/facility.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
  name: string;

  @Column({ type: 'float', nullable: false })
  price_per_hour: number;

  @Column({ type: 'enum', enum: TableStatus, default: TableStatus.AVAILABLE })
  status: TableStatus;

  @Column({ default: null, nullable: true })
  type: string;

  @ManyToOne(() => Facility, (facility) => facility.tables, {
    onDelete: 'CASCADE', // hoặc SET NULL tuỳ ý
    nullable: false,
  })
  @JoinColumn({ name: 'facility_id' }) // tên cột foreign key
  facility: Facility;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;
}
