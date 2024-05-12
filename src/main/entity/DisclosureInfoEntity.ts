import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AccountClose, FinancialMetricType } from '../../common/CommonType';

@Entity('AC_DISCLOSURE_INFO')
export default class DisclosureInfoEntity {
  @PrimaryGeneratedColumn({ name: 'DISCLOSURE_INFO_SEQ' })
  disclosureInfoSeq!: number;

  @Column({ type: 'varchar', length: 20 })
  code!: string;

  @Column({ type: 'varchar', length: 50, enum: FinancialMetricType })
  financialMetricType!: FinancialMetricType;

  @Column({ type: 'integer' })
  year!: number;

  @Column({ type: 'varchar', length: 20, enum: AccountClose })
  accountClose!: AccountClose;

  @Column({ type: 'varchar', length: 50 })
  itemName!: string;

  @Column({ type: 'integer' })
  q1Value!: number;

  @Column({ type: 'integer' })
  q2Value!: number;

  @Column({ type: 'integer' })
  q3Value!: number;

  @Column({ type: 'integer' })
  q4Value!: number;

  @Column({ type: 'datetime' })
  regDate!: Date;

  @Column({ type: 'datetime' })
  editDate!: Date;
}
