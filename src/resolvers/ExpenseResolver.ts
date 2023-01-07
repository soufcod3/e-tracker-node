/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Resolver, Mutation, Arg, Query, ID} from "type-graphql";
import { Budget } from "../entities/Budget";
import { Category } from "../entities/Category";
import { Expense, ExpenseInput } from "../entities/Expense";

@Resolver()
export class ExpensesResolver {
  
  @Mutation(() => Expense)
  async createExpense(
    @Arg("data", () => ExpenseInput) data: ExpenseInput,
    @Arg("budgetId", () => ID) budgetId: number,
    // @Arg("categoryId") categoryId?: number
  ): Promise<Expense> {

    const budget = await Budget.findOne({ where : { id : budgetId } })

    if (budget) {
      const expense = new Expense()
      expense.name = data.name
      expense.amount = data.amount
      expense.date = data.date
      expense.budget = budget

      if (data.categoryId) {
        const category = await Category.findOneOrFail({ where : { id : data.categoryId } })
        expense.category = category
      }
      budget.leftAmount = budget.leftAmount - expense.amount
      await Budget.save(budget)

      return await Expense.save(expense)
    }
    throw new Error("Budget or Category not found")
  }

  @Query(() => [Expense])
  async getExpenses(): Promise<Expense[]> {
    return await Expense.find({relations: { budget: true, category: true }})
  }

  @Query(() => [Expense])
  async getExpensesByBudgetId(
    @Arg("budgetId") budgetId: number
  ): Promise<Expense[]> {
    return await Expense.find({ where: {budget: { id: budgetId }}, relations: { budget: true, category: true } })
  }

  @Mutation(() => Expense)
  async deleteExpense(
    @Arg("id") id: number,
  ): Promise<Expense> {

    const expense = await Expense.findOne({ where: { id } });
    if (!expense) throw new Error("Expense not found!")

    return await expense.remove()
  }

  @Mutation(() => Budget)
  async deleteExpenses(): Promise<void> {
    
    return await Expense.clear()
  }

}
