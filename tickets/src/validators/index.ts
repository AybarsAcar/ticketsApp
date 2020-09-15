import { body } from 'express-validator';

export const titleValidator = [
  body('title').not().isEmpty().withMessage('Title is required'),
];

export const priceValidator = [
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
];
