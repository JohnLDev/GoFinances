import React from 'react';

import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Import from '../pages/Import';
import Registry from '../pages/Registry';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Dashboard} />
    <Route path="/registry" component={Registry} />
    <Route path="/import" component={Import} />
  </Switch>
);

export default Routes;
