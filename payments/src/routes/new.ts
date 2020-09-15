import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validate,
} from '@aybars-proj/common';
import express, { Request, Response } from 'express';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe';
import { paymentCreateValidation } from '../validators';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  paymentCreateValidation,
  validate,
  async (req: Request, res: Response) => {
    // get from the request body object
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    // check if the same user
    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    // make sure the order is not yet cancelled
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Can not pay for an expired order');
    }

    // process the charge and bill the the user
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    // add the response to the database
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    /* 
    emit an event
    dont need to wait for performance
    just send a response to the user asap
    */
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
