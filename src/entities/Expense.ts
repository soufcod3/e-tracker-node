import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field, InputType, ID } from "type-graphql";
import { IsDate, IsNumber, IsString, } from "class-validator";
import { Budget } from "./Budget";
import { Category } from "./Category";
// import Decimal from "decimal.js";
// import { DecimalTransformer } from "./DecimalTransformer";

@Entity()
@ObjectType()
export class Expense extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  // @Column({ name: 'amount', type: 'decimal', precision: 10, scale: 2, transformer: new DecimalTransformer()})
  @Column({ type: 'float' })
  @Field()
  amount: number;

  @Column()
  @Field(() => String)
  name: String;

  @Column()
  @Field(() => Date)
  date: Date;
  
  // {createForeignKeyConstraints: false} j'empêche la création de la Foreign Key Constraint pour vider la table 
  @ManyToOne(() => Budget, (budget) => budget.expenses, {createForeignKeyConstraints: false})
  @Field(() => Budget)
  budget: Budget;

  @ManyToOne(() => Category, (category) => category.expense)
  // @Column({nullable: true})
  @Field({nullable: true})
  category?: Category
}

@InputType()
export class ExpenseInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsNumber()
  amount: number;

  @Field()
  @IsDate()
  date: Date;

  @Field({nullable: true})
  @IsNumber()
  categoryId: number
}
