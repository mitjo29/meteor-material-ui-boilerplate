import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from "react-router-dom";
import { useTracker } from 'meteor/react-meteor-data';
import Dashboard from './Dashboard';
import SignIn from './SignIn';
import NotFoundView from './NotFoundView';

const App = () => {
  return (
    <Router>
      <Switch>
          <Route path="/signin" exact component={SignIn} />
          <PrivateRoute><Route path="/" exact component={Dashboard} /></PrivateRoute>
          <Route path="*" component={NotFoundView} />
        </Switch>
    </Router>
  );
}

function PrivateRoute({ children, ...rest }) {
  let auth = useTracker(() => Meteor.user());
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export default App;