import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, InputType, ID, Float } from "type-graphql";
import { IsDate, IsNumber, IsString, } from "class-validator";
import { Expense } from "./Expense";
// import { DecimalTransformer } from "./DecimalTransformer";
// import Decimal from "decimal.js";

const today = new Date().toISOString().slice(0, 19).replace('T', ' ')

@Entity()
@ObjectType()
export class Budget extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field(() => String)
  name: string;

  @Column({default: today})
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => Date)
  startingAt: Date;
  
  @Column()
  @Field(() => Date)
  endingAt: Date;
  
  @Column({ type: 'float'})
  @Field(() => Float)
  kickoffAmount: number;

  // @Column({ name: 'leftAmount', type: 'float', precision: 10, scale: 2, transformer: new DecimalTransformer()})
  @Column({ type: 'float' })
  @Field(() => Float)
  leftAmount: number;

  @Column({default: false})
  @Field(() => Boolean)
  isFeatured: boolean;

  @OneToMany(() => Expense, (expense) => expense.budget, {onDelete: 'CASCADE'} )
  @Field(() => [Expense])
  expenses: Expense[]
}

@InputType()
export class BudgetInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsDate()
  startingAt: Date;

  @Field()
  @IsDate()
  endingAt: Date;

  @Field()
  @IsNumber()
  kickoffAmount: number;
}
