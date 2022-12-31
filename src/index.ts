import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/UserResolver";
import { BudgetsResolver } from "./resolvers/BudgetResolver";
import { ExpensesResolver } from "./resolvers/ExpenseResolver";
import { CategoriesResolver } from "./resolvers/CategoryResolver";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4';
import http from 'http';
import https from 'https';
import fs from 'fs';

console.log('On the road to deployment !')

async function bootstrap(): Promise<void> {
  // ... Building schema here
  const schema = await buildSchema({
    resolvers: [
      UsersResolver,
      BudgetsResolver,
      ExpensesResolver,
      CategoriesResolver
    ],
  });

  const configurations = {
    // Note: You may need sudo to run on port 443
    production: { ssl: true, port: 443, hostname: 'example.com' },
    development: { ssl: false, port: 4000, hostname: 'localhost' },
  };

  const environment = process.env.NODE_ENV || 'development';
  const config = configurations[environment];

  // Create the GraphQL server
  const server = new ApolloServer({
    schema
  });
  await server.start();

  const app = express();
  // our express server is mounted at /
  app.use('/', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));

  let httpServer;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    httpServer = https.createServer(
      {
        key: fs.readFileSync(`./ssl/${environment}/server.key`),
        cert: fs.readFileSync(`./ssl/${environment}/server.crt`),
      },
      app,
    );
  } else {
    httpServer = http.createServer(app);
  }

  await new Promise<void>((resolve) => httpServer.listen({ port: 5000 }, resolve));

  try {
    await datasource.initialize();
    console.log("Server started!");
  } catch (err) {
    console.log("An error occured");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
