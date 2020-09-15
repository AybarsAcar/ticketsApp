import { body } from 'express-validator';

export const paymentCreateValidation = [
  body('token').not().isEmpty(),
  body('orderId').not().isEmpty(),
];
