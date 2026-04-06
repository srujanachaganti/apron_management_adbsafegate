import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { FlightPlanEntity } from './flight-plan.entity';
import { StandEntity } from './stand.entity';

@Entity('stand_assignments')
@Index(['stand', 'fromTime', 'toTime'])
export class StandAssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FlightPlanEntity, { eager: true })
  @JoinColumn({ name: 'flightPlanId' })
  flightPlan: FlightPlanEntity;

  @Column('integer')
  flightPlanId: number;

  @ManyToOne(() => StandEntity, { eager: true })
  @JoinColumn({ name: 'standId', referencedColumnName: 'stand' })
  stand: StandEntity;

  @Column('varchar')
  standId: string;

  @Column('timestamp')
  fromTime: Date;

  @Column('timestamp')
  toTime: Date;

  @Column('varchar', { nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
