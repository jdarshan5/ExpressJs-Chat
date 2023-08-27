import {
  Request,
  Response
} from 'express';

import User, { UserDocument } from '../../models/user/index.js';

/**
 * @description Register user
 * @method POST
 * @param req 
 * @param res
 * @returns HTTP response
 */
const register = async (req: Request, res: Response) => {
  let user: UserDocument = await User.findOne(
    {
      email: req.body.email
    }
  ).exec();
  // If already exists
  if (user) {
    return res.status(401).json({
      message: `The email address you have entered is already associated with another account.`
    });
  }
  user = await (await User.create(req.body)).save();
  User.findOne({
    email: req.body.email,
  }).then(async user => {
    if (user) return res.status(401).json({ message: `The email address you have entered is already associated with another account.` });
    let newUser: UserDocument;
    try {
      newUser = await (await User.create(req.body)).save();
      if (newUser) {
        return res.status(200).json(user);
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }).catch(e => {
    res.status(500).json(e);
  });
}

/**
 * @description Login user
 * @method POST
 * @param req 
 * @param res 
 * @returns HTTP response
 */
const login = (req: Request, res: Response) => {
  User.findOne({
    email: req.body.email
  }).then(async user => {
    if (!user) return res.status(404).json({
      message: `The email address ${req.body.email} is not associated with any account. Double-check your email address and try again.`,
    });
    if (!user.comparePassword(req.body.password)) {
      return res.status(401).json({ message: `Invalid email or password` });
    }
    const userUpdate = await User.updateOne(
      {
        _id: user._id,
      },
      [
        {
          $set: {
            fcmToken: req.body.fcmToken,
          },
        }
      ]
    ).exec();
    if (userUpdate.acknowledged) {
      const newUser = await User.findById(user._id).exec();
      return res.status(200).json({
        token: newUser.generateJWT(),
        user: newUser,
      });
    }
  }).catch(err => {
    return res.status(500).json({
      message: err.message,
    });
  });
}

export default {
  register,
  login,
};
