import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  account: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;
}
