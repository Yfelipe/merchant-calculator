import express, { NextFunction, Request, Response } from 'express';
import { User, UserStore } from '../models/user';
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
    res.json(`Invalid token ${err}`);
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
    const token = jwt.sign(
      { user: { user_name: user.user_name, user_type: user.user_type } },
      process.env.TOKEN_SECRET as string
    );

    res.json(token);
    return;
  }

  res.status(401).send('Sorry your login was unsuccessful');
};

//Just a request to make sure the token is legit
const checkToken = async (_req: Request, res: Response) => {
  res.json('success');
};

const userRoutes = (app: express.Application) => {
  app.post('/api/check', verifyToken, checkToken);
  app.post('/api/login', authenticate);
  app.put('/api/user', create);
};

export default userRoutes;
