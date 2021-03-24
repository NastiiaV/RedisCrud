import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class dbObject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string;

  @Column()
  value: string;
}