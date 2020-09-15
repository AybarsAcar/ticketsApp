import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { signupValidator } from '../validators';
import { validate, BadRequestError } from '@aybars-proj/common';

const router = express.Router();

router.post(
  '/api/users/signup',
  signupValidator,
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check if the user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('User with that email already exists');
    }

    // create a new user and save them
    const user = User.build({ email, password });
    // we applied middleware in mongoose so the password is hashed automatically
    await user.save();

    // generate the token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    // store it on the session object
    req.session = {
      jwt: token,
    };

    res.status(201).send(user);
  }
);

// exports
export { router as signupRouter };
