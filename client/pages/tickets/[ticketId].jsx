import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  const handleClick = () => {
    doRequest();
  };

  return (
    <div>
      <h1>{ticket.title}</h1>
      <hr />
      <h4>Price: {ticket.price}</h4>
      <button onClick={handleClick} className="btn btn-primary">
        Purchase
      </button>
      {errors}
    </div>
  );
};

TicketShow.getInitialProps = async (ctx, client) => {
  const { ticketId } = ctx.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
