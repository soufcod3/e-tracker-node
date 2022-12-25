import { Resolver, Arg, Query } from "type-graphql";
import { User } from "../entities/User";
import datasource from "../utils";
// import { hash } from "argon2";

@Resolver()
export class UsersResolver {
  @Query(() => [User])
  async users(): Promise<User[]> {
    return await datasource.getRepository(User).find({});
  }
}
