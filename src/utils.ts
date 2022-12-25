import { User } from "./entities/User";
import { DataSource } from "typeorm";
import { Budget } from "./entities/Budget";
import { Expense } from "./entities/Expense";
import { Category } from "./entities/Category";

const datasource = new DataSource({
  type: "mysql",
  host: "containers-us-west-120.railway.app",
  port: 7556,
  username: "root", // etracker
  password: "kBsDiem5f96xq7t5BiuU",
  database: "railway", // etracker
  synchronize: true,
  entities: [User, Budget, Expense, Category],
  logging: ["query", "error"],
});

export default datasource;
