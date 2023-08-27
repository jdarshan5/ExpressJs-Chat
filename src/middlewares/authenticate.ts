import {
  Request,
  Response,
  NextFunction
} from 'express';

import jwt from 'jsonwebtoken';

import User from '../models/user/index.ts';

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  let token: string;
  try {
    token = req.headers.authorization.split(' ')[1];
  } catch (e) {
    return res.status(401).json({
      message: 'Please provide valid authentication token',
    });
  }
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    return res.status(401).json(e);
  }
  let user: any;
  try {
    user = await User.findOne({
      _id: decoded.id,
    }).select({ "password": 0 }).exec();
  } catch (e) {
    return res.status(500).json(e);
  }
  res.locals.user = user;
  next();
}

export default {
  isAuthenticated,
};