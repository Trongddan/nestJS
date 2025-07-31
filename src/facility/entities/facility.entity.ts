import { Table } from 'src/table/entities/table.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Facility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 200 })
  description: string;

  @OneToMany(() => Table, (table) => table.facility)
  tables: Table[];

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date | null;
}
