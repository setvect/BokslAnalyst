import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { AccountClose, NationCode } from '../../common/CommonType';

@Entity('AA_STOCK')
export default class StockEntity {
  @PrimaryGeneratedColumn({ name: 'STOCK_SEQ' })
  stockSeq!: number;

  @Column({ type: 'varchar', length: 2 })
  nation!: NationCode;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 20 })
  code!: string;
}
