import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import {
  NotFoundError,
  validate,
  NotAuthorizedError,
  requireAuth,
  BadRequestError,
} from '@aybars-proj/common';
import { titleValidator, priceValidator } from '../validators';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  titleValidator,
  priceValidator,
  validate,
  async (req: Request, res: Response) => {
    // get the id
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    // check if the user owns the ticket
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // check if the ticket is reserved
    if (ticket.orderId) {
      throw new BadRequestError(
        'Ticket is reserved, cannot edit at the moment'
      );
    }

    // apply the updates and save
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();

    // publish an event
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
