const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h1>My Orders</h1>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.ticket.title} - {o.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (ctx, client) => {
  const { data } = await client.get('/api/orders');

  return { orders: data };
};

export default OrderIndex;
