import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token') ?? null;

const baseApiUrl = process.env.REACT_APP_API_URL;

const UploadFile = () => {
  const handleUpload = (e) => {
    e.preventDefault();

    const file = e.target.formFile.files[0];

    let formData = new FormData();
    formData.append('file', file);

    axios
      .post(`${baseApiUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `token ${token}`
        }
      })
      .then((response) => {
        alert(response.data);
      }).catch((error) => alert(error.response.data));
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
        <Card.Header as="h5">Upload Cost CSV</Card.Header>
        <Card.Body>
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" />
            </Form.Group>

            <Button type="submit" variant="primary" style={{ float: 'right' }}>
              Send
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UploadFile;
