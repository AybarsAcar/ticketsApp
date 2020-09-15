import { useState } from 'react';
import useRequest from '../../hooks/useRequest';
import Router from 'next/router';

const newTicket = () => {
  const [values, setValues] = useState({
    title: '',
    price: '',
  });
  const { title, price } = values;

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleBlur = (price) => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    // round
    setPrice(value.toFixed(2));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            onChange={handleChange}
            value={title}
            name="title"
            className="form-control"
            type="text"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            value={price}
            name="price"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      {errors}
    </div>
  );
};

export default newTicket;
