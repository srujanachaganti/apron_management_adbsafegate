import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('stands')
@Index(['apron'])
@Index(['terminal'])
export class StandEntity {
  @PrimaryColumn('varchar')
  stand: string;

  @Column('varchar', { nullable: true })
  apron: string;

  @Column('varchar', { nullable: true })
  terminal: string;
}
