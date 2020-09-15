import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const Signin = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const { email, password } = values;

  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          name="email"
          onChange={handleChange}
          value={email}
          type="text"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          name="password"
          onChange={handleChange}
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Sign in
      </button>
      {errors}
    </form>
  );
};

export default Signin;
