import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user-desktop' })
export class UserDesktop extends BaseEntity {
  @PrimaryGeneratedColumn() // Auto-incrementing ID column
  id: number;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: false })
  anydeskId: string;

  @Column({ type: 'text', nullable: false })
  walletPublicKey: string;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  }) // Date column with default value
  timestamp: Date;

  @Column({ type: 'bool', default: false })
  setupDone: boolean;
}
