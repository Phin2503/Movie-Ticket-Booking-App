import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
  })
  price: string;

  @Column({
    length: 150,
  })
  description: string;

  @Column()
  img_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToMany(() => Order, (order) => order.foods)
  orders: Order[];
}
