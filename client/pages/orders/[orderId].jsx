import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { STRIPE_KEY } from '../../api/variables';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired.. Please try again</div>;
  }

  return (
    <div>
      <div>{timeLeft} seconds left to pay</div>
      <br />
      <div>
        <StripeCheckout
          token={(token) => doRequest({ token: token.id })}
          stripeKey={STRIPE_KEY}
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
      </div>
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (ctx, client) => {
  const { orderId } = ctx.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
