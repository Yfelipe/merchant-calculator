import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token') ?? null;

const baseApiUrl = process.env.REACT_APP_API_URL;

const Calculate = () => {
  const [valueState, setValueState] = useState();
  const [industryNames, setIndustryNames] = useState([]);
  const [calculationState, setCalculationState] = useState({
    industry: '',
    transaction_volume: '',
    transaction_count: ''
  });

  useEffect(() => {
    getIndustryNames();
  }, []);

  const handleChange = (e) => {
    e.preventDefault();

    setCalculationState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    axios
      .post(`${baseApiUrl}/api/calculate`, calculationState, {
        headers: { Authorization: `token ${token}` }
      })
      .then((response) => setValueState(response.data))
      .catch((error) => alert(error.response.data));
  };

  const getIndustryNames = () => {
    axios
      .get(`${baseApiUrl}/api/industries`, {
        headers: {
          Authorization: `token ${token}`,
          'Access-Control-Allow-Origin': '*'
        }
      })
      .then((response) => {
        setIndustryNames(response.data);
      })
      .catch((error) => alert(error.response.data));
  };

  const noIndustriesFound = industryNames?.length === 0;

  return (
    <div className="login-div">
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
        <Card.Header as="h5">Merchants Cost Calculator</Card.Header>
        {!valueState ? (
          <Card.Body>
            <Form onSubmit={handleCalculate}>
              <Form.Group className="mb-3" controlId="formBasicIndustry">
                <Form.Label>Industry</Form.Label>
                <Form.Select
                  name="industry"
                  disabled={noIndustriesFound}
                  onChange={handleChange}
                >
                  {noIndustriesFound ? (
                    <option>No industries found</option>
                  ) : (
                    industryNames.map((name) => <option value={name}>{name}</option>)
                  )}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicTransactionVolume">
                <Form.Label>Transaction Volume</Form.Label>
                <Form.Control
                  name="transaction_volume"
                  type="number"
                  placeholder="Enter transaction volume"
                  disabled={noIndustriesFound}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicTransaction Count">
                <Form.Label>Transaction Count</Form.Label>
                <Form.Control
                  name="transaction_count"
                  type="number"
                  step="0.01"
                  placeholder="Enter transaction count"
                  disabled={noIndustriesFound}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={noIndustriesFound}
                style={{ float: 'right' }}
              >
                Calculate
              </Button>
            </Form>
          </Card.Body>
        ) : (
          <Card.Body>
            <Card.Text>Merchant price ${valueState} NZD</Card.Text>
            <Button
              variant="primary"
              style={{ float: 'right' }}
              onClick={() => setValueState(null)}
            >
              Close
            </Button>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default Calculate;
