import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/UserResolver";
import { BudgetsResolver } from "./resolvers/BudgetResolver";
import { ExpensesResolver } from "./resolvers/ExpenseResolver";
import { CategoriesResolver } from "./resolvers/CategoryResolver";
import express from 'express';
import http from 'http';
import https from 'https';
import fs from 'fs';

async function bootstrap(): Promise<void> {

  // Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      BudgetsResolver,
      ExpensesResolver,
      CategoriesResolver
    ],
  }).catch(err => {
    console.log('buildSchema error', err)
    return undefined
  });


}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
