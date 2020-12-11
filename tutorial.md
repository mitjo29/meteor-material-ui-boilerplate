## Step 1 : Create the app
Let's create the meteor App:

```shell
meteor create meteor-materialui-boilerplate --react
cd meteor-materialui-boilerplate/
```

then go to http://localhost:3000 to test your application

Add the dependencies :

```shell
meteor npm install --save clsx @material-ui/core @material-ui/icons bcrypt
meteor npm install --save react-router-dom
```

Add the Account package : 

```shell
meteor add accounts-password
```

Add form field validation with Formik

```shell 
meteor npm install formik --save
```
```js
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
import Register from './Register';
import NotFoundView from './NotFoundView';
import PasswordReset from './PasswordReset';
import Profile from './Profile copy';

const App = () => {
  return (
    <Router>
      <Switch>
          <Route path="/signin" exact component={SignIn} />
          <Route path="/register" exact component={Register} />
          <Route path="/passwordreset" exact component={PasswordReset} />
          <Route path="/profile" exact component={Profile} />
          <PrivateRoute>
            <Route path="/" exact component={Dashboard} >
                <Route path="dashboard" exact component={DashboardContent} />
                <Route path="users" exact component={Users} />
                    <Route path=":id" exact component={UserProfile} />
            </Route>
          </PrivateRoute>
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
```