import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PeriodType } from '../../common/CommonType';

@Entity('AB_CANDLE')
export default class CandleEntity {
  @PrimaryGeneratedColumn({ name: 'CANDLE_SEQ' })
  candleSeq!: number;

  @Column({ type: 'integer' })
  stockSeq!: number;

  @Column({ type: 'datetime' })
  candleDateTime!: Date;

  @Column({ type: 'varchar', length: 20, enum: PeriodType })
  periodType!: PeriodType;

  @Column({ type: 'real' })
  openPrice!: number;

  @Column({ type: 'real' })
  highPrice!: number;

  @Column({ type: 'real' })
  lowPrice!: number;

  @Column({ type: 'real' })
  closePrice!: number;
}
