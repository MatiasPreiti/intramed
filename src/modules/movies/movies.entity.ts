import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Movies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  director?: string;

  @Column({ nullable: true })
  release_date?: string;

  @Column({ nullable: true })
  description?: string;

  @Column('json', { nullable: true })
  properties?: Record<string, string>;
}
