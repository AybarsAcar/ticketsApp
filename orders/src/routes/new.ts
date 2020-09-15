import express, { Request, Response } from 'express';
import {
  requireAuth,
  validate,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@aybars-proj/common';
import { newOrderValidation } from '../validators';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 15 mins

router.post(
  '/api/orders',
  requireAuth,
  newOrderValidation,
  validate,
  async (req: Request, res: Response) => {
    // get the ticket if from the request body
    const { ticketId } = req.body;

    // find the ticket user wants to order
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // check the ticket is reserved
    // find an order associated with the ticket and the following status
    const existingOrder = await ticket.isReserved();
    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // build the order and save it to db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      ticket: ticket,
      expiresAt: expiration,
    });
    await order.save();

    // publish an event for order created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    //
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
