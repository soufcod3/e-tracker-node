/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Resolver, Mutation, Arg, Query, ID} from "type-graphql";
import { Category, CategoryInput } from "../entities/Category";
// import { Expense } from "../entities/Expense";

@Resolver()
export class CategoriesResolver {
  
  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryInput) data: CategoryInput
  ): Promise<Category> {

    const category = new Category()
    category.name = data.name
    return await Category.save(category)
  }

  @Query(() => [Category])
  async getCategories(): Promise<Category[]> {

    return await Category.find({relations: { expense: true }})
  }

  @Mutation(() => Category)
  async deleteCategory(
    @Arg("id", () => ID) id: number,
  ): Promise<Category> {

    const category = await Category.findOne({ where: { id } });
    if (!category) throw new Error("Expense not found!")

    return await category.remove()
  }

  @Mutation(() => Category)
  async deleteCategories(): Promise<void> {
    
    return await Category.clear()
  }

}
