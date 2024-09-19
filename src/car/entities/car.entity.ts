import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // sedan, hatchback, etc.

  @Column()
  model: string;

  @Column({ type: 'float', default: 0 })
  latitude: number;

  @Column({ type: 'float', default: 0 })
  longitude: number;

  @Column()
  mileage: number;

  @Column()
  year: number;

  @Column()
  color: string;
}
