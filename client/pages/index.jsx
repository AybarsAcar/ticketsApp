import React from 'react';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const showTickets = tickets.map((t) => (
    <tr key={t.id}>
      <td>{t.title}</td>
      <td>{t.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{showTickets}</tbody>
      </table>
    </div>
  );
};

// make request to grab all the tickets
LandingPage.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;
