import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { signinValidator } from '../validators';
import { BadRequestError, validate } from '@aybars-proj/common';
import { Password } from '../utils/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  signinValidator,
  validate,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // check user in db
    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError('User with that email does not exists');
    }

    // check the password
    const passwordMatch = await Password.compare(user.password, password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

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
export { router as signinRouter };
