import React from 'react';

import { Route, Redirect } from 'react-router-dom';

import { client } from '../Client';

const PrivateRoute = (props) => (
  <Route {...props} />
);

export default PrivateRoute;
