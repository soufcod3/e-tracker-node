import "reflect-metadata";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import datasource from "./utils";
import { buildSchema } from "type-graphql";
import { UsersResolver } from "./resolvers/UserResolver";
import { BudgetsResolver } from "./resolvers/BudgetResolver";
import { ExpensesResolver } from "./resolvers/ExpenseResolver";
import { CategoriesResolver } from "./resolvers/CategoryResolver";
import express from 'express';
// import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import http from 'http';
import https from 'https';
import fs from 'fs';

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
  await server.start();

  const app = express();
  server.applyMiddleware({app})
  // our express server is mounted at /
  // app.use('/', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));
  app.use('/', cors<cors.CorsRequest>())
  let httpServer;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    httpServer = https.createServer(
      {
        key: fs.readFileSync(`/etc/letsencrypt/live/e-tracker-server.soufcode.fr-0001/fullchain.pem`),
        cert: fs.readFileSync(`/etc/letsencrypt/live/e-tracker-server.soufcode.fr-0001/privkey.pem`),
      },
      app,
    );
  } else {
    httpServer = http.createServer(app);
  }

  await new Promise<void>((resolve) => httpServer.listen({ port: config.port }, resolve)).catch(err => console.log('Promise Error :', err));

  try {
    await datasource.initialize();
    console.log("Server started!");
    console.log('On the road to deployment !', process.env.NODE_ENV)
  } catch (err) {
    console.log("An error occured");
    console.error(err);
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
