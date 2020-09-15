import { body } from 'express-validator';
import mongoose from 'mongoose';

// make sure the id is a mongodb id
export const newOrderValidation = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided'),
];
