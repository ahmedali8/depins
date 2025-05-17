import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() // Auto-incrementing ID column
  id: number;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  }) // Date column with default value
  dateJoined: Date;

  @Column({ type: 'text', nullable: false, unique: true })
  walletPublicKey: string;

  @Column({ type: 'text', nullable: false, unique: true })
  walletPrivateKey: string;

  @Column({ type: 'numeric', default: 0 })
  marinadeDespoited: number;

  @Column({ type: 'numeric', default: 0 })
  grassEarned: number;

  @Column({ type: 'numeric', default: 0 })
  amountWithdrawn: number;
}
