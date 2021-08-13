import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const verifyAdminToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];

    req.body.decodedToken = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    );

    if (req.body.decodedToken.user.user_type !== 'admin') {
      throw new Error('Invalid user for request');
    }

    next();
  } catch (err) {
    res.json(`Invalid token ${err}`);
  }
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
