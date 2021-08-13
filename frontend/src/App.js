import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserLogin from './Routes/UserLogin/';
import Calculate from './Routes/Calculate';
import { createBrowserHistory } from 'history';
import axios from 'axios';
import UploadFile from './Routes/UploadFile';
import CustomNavbar from './Components/CustomNavbar';

const history = createBrowserHistory();

//Get the token or null
const token = Cookies.get('token') ?? null;

//Set user details based on JWT token
const user = token && JSON.parse(atob(token.split('.')[1])).user;

const App = () => {
  //Checks if token is valid
  const tokenCheck = () => {
    if (!token) {
      history.push('/login');
    } else if (token) {
      axios
        .get('/api/check', {
          headers: { Authorization: `token ${token}` }
        })
        .catch((error) => {
          Cookies.remove('token');
          window.location.href = '/login';
          console.log(error);
        });
    }
  };

  const AuthRoutes = () => {
    let routeList = [];

    //Always check token before returning routes would make a middleware for token check
    tokenCheck();

    if (token) {
      switch (user.user_type) {
        case 'admin':
          routeList.push(
            <Route
              key="uploadFile"
              path="/upload"
              exact
              component={UploadFile}
            />
          );
        default:
          routeList.push(
            <Route key="calculate" path="/" exact component={Calculate} />
          );
          break;
      }
    }

    return routeList;
  };

  return (
    <Router history={history}>
      <div className="main-div">
        <CustomNavbar />
        <Switch>
          <Route key="userLogin" path="/login" exact component={UserLogin} />,
          {AuthRoutes()}
        </Switch>
      </div>
    </Router>
  );
};

export default App;
