import 'reflect-metadata';
import express from 'express';
import { createServer } from './app/server';
import { DatabaseConnection } from '@shreehari/data-access';

let app: express.Express | null = null;

async function getApp(): Promise<express.Express> {
  if (!app) {
    const dbConnection = DatabaseConnection.getInstance();
    await dbConnection.connect();
    app = createServer();
  }
  return app;
}

export default async function handler(req: any, res: any) {
  const application = await getApp();
  return application(req, res);
}
