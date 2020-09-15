import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@aybars-proj/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  // get the id
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
