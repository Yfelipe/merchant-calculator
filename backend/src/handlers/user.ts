import express, { NextFunction, Request, Response } from 'express';
import {User, UserStore} from '../models/user';
import jwt from 'jsonwebtoken';

const store = new UserStore();

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];

    req.body.decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    );

    next();
  } catch (err) {
    res.json(`Invalid token ${err}`).status(401);
  }
};

const create = async (_req: Request, res: Response) => {
  const newUser: User = {
    user_name: _req.body.user_name,
    user_type: _req.body.user_type,
    password: _req.body.password
  };

  const user = await store.create(newUser);
  const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);

  res.json(token);
};

const authenticate = async (_req: Request, res: Response) => {
  const userLogin: User = {
    user_name: _req.body.user_name,
    password: _req.body.password
  };

  const user = await store.authenticate(userLogin);

  if (user) {
    const token = jwt.sign({ user: {user_name: user.user_name, user_type: user.user_type} }, process.env.TOKEN_SECRET as string);

    res.json(token);
  }

  res.json('Sorry your login was unsuccessful').status(401)
};

const user_routes = (app: express.Application) => {
  app.post('/login', authenticate);
  app.put('/user', create);
};

export default user_routes;
