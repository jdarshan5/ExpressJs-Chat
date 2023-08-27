import { Request, Response } from "express";

const getUser = (req: Request, res: Response) => {
  const { user } = res.locals;
  res.status(200).json(user);
}

export default {
  getUser,
};