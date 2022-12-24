import { User } from "./entities/User";
import { DataSource } from "typeorm";
import { Budget } from "./entities/Budget";
import { Expense } from "./entities/Expense";
import { Category } from "./entities/Category";

const datasource = new DataSource({
  type: "mysql",
  host: "127.0.0.1",
  port: 3306,
  username: "u273251244_etracker", // etracker
  password: "3rxt@95VF5ht",
  database: "u273251244_etracker", // etracker
  synchronize: true,
  entities: [User, Budget, Expense, Category],
  logging: ["query", "error"],
});

export default datasource;
