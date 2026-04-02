import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('flight_plans')
@Index(['flightPlanType'])
@Index(['flightPlanAction'])
@Index(['carrier'])
@Index(['stand'])
@Index(['apron'])
export class FlightPlanEntity {
  @PrimaryColumn('integer')
  id: number;

  @Column('varchar', { nullable: true })
  ifplid: string;

  @Column('uuid')
  flightId: string;

  @Column('varchar')
  flightPlanType: string;

  @Column('varchar')
  flightPlanAction: string;

  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;

  @Column('varchar', { nullable: true })
  linkedFlightId: string;

  @Column('varchar', { nullable: true })
  linkedFlightPlanType: string;

  @Column('date')
  originDate: Date;

  @Column('varchar', { length: 3 })
  carrier: string;

  @Column('varchar', { length: 5 })
  flightNumber: string;

  @Column('varchar')
  calculatedCallsign: string;

  @Column('varchar', { length: 6 })
  aircraftRegistration: string;

  @Column('varchar')
  aircraftType: string;

  @Column('varchar')
  aircraftTypeIcao: string;

  @Column('varchar', { length: 4 })
  adep: string;

  @Column('varchar', { length: 4 })
  ades: string;

  @Column('varchar', { nullable: true })
  stand: string;

  @Column('varchar', { nullable: true })
  apron: string;

  @Column('varchar', { nullable: true })
  terminal: string;

  @Column('timestamp', { nullable: true })
  aibt: Date;

  @Column('timestamp', { nullable: true })
  sta: Date;

  @Column('timestamp')
  aobt: Date;

  @Column('timestamp')
  std: Date;
}
