import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;
}

@InputType()
export class UserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 60)
  password: string;
}
