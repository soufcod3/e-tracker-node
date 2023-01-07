import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";
import { Expense } from "./Expense";

@Entity()
@ObjectType()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @OneToMany(() => Expense, (expense) => expense.category)
  @Field(() => Expense)
  expense: Expense;
}

@InputType()
export class CategoryInput {
  @Column()
  @Field(() => String)
  name: string;
}
