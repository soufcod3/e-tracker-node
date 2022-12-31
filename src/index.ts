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

  const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: 5000, hostname: 'localhost' },
  };

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const environment = process.env.NODE_ENV ?? 'development';
  const config = configurations[environment];

  // Create the GraphQL server
  const server = new ApolloServer({
    schema,
    cache: 'bounded'
  });
  await server.start().catch(err => console.log('server.start error :', err));


}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
