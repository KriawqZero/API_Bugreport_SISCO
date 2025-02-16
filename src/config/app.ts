import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';

export const configureApp = (app: express.Application) => {
  app.use(helmet());
  app.use(cors({
    origin: process.env.URL_FRONTEND,
    optionsSuccessStatus: 200,
    credentials: true
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};
