import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';

const baseApiUrl = process.env.REACT_APP_API_URL;

const UserLogin = () => {
  const [state, setState] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    //Send login info
    axios
      .post(`${baseApiUrl}/api/login`, {
        user_name: state.username,
        password: state.password
      })
      .then((response) => {
        if (response.status === 200) {
          Cookies.set('token', response.data);
          window.location.href = '/';
        }
      })
      .catch((error) => alert(error.response.data));
  };

  return (
    <div>
      <Card
        border="dark"
        style={{
          borderRadius: '10px',
          width: '40ch',
          justifyContent: 'center',
          alignItems: 'center',
          margin: 'auto'
        }}
      >
        <Card.Header as="h5">User Login</Card.Header>
        <Card.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                name="username"
                type="name"
                placeholder="Enter username"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="primary" style={{ float: 'right' }}>
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserLogin;
