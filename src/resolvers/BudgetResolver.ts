/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Resolver, Mutation, Arg, Query } from "type-graphql";
import datasource from "../utils";
import { Budget, BudgetInput } from "../entities/Budget";
import { Expense } from "../entities/Expense";

@Resolver()
export class BudgetsResolver {

  @Mutation(() => Budget)
  async createBudget(
    @Arg("data", () => BudgetInput) data: BudgetInput & { leftAmount: number} // pour ajouter propriété à type existant
  ): Promise<Budget> {
    data.leftAmount = data.kickoffAmount
    return await datasource.getRepository(Budget).save(data);
  }

  @Query(() => [Budget])
  async getBudgets(): Promise<Budget[]> {
    console.log(await Budget.find())
    return await Budget.find()
  }

  @Query(() => [Budget])
  async getFeaturedBudgets(): Promise<Budget[]> {
    return await Budget.find({ where : { isFeatured: true }, relations : { expenses: true }})
  }

  @Mutation(() => Budget)
  async switchIsFeatured(
    @Arg('id') id: number
  ): Promise<Budget> {
    const budget = await Budget.findOne({ where: { id } });
    if (!budget) throw new Error("Budget not found!")
    budget.isFeatured = !budget.isFeatured
    return await budget.save();
  }

  @Query(() => Budget)
  async getBudgetById(
    @Arg("id") id: number
  ): Promise<Budget> {
    const budget = await Budget.findOne({ where: { id } });
    if (!budget) throw new Error("Budget not found!")
    return budget
  }

  @Mutation(() => Budget)
  async deleteBudget(
    @Arg("id") id: number
  ): Promise<Budget> {
    const budget = await Budget.findOne({ where: { id } });
    console.log('budget : ', budget);
    if (!budget) throw new Error("Budget not found!")
    return await budget.remove()
  }

  @Mutation(() => Budget)
  async deleteBudgets(): Promise<void> {
    await Expense.clear()
    return await Budget.clear()
  }

}
