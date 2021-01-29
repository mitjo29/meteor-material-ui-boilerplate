import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route
} from "react-router-dom";
import { useTracker } from 'meteor/react-meteor-data';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from '/imports/ui/components/GlobalStyles';
import theme from '/imports/ui/theme';
import routes from '/imports/ui/routes';
import { Images } from '/imports/api/images/images';

const useAccount = () => useTracker(() => {
  const noDataAvailable = { user: [], isLoading: true };
  const user = Meteor.user()
  const userId = Meteor.userId()
  const handle = Meteor.subscribe('users.current')
  if (!userId) {
    return { user: [], isLoading: false };;
  } else {

    if (!(handle.ready() && user !== null)) {
      return noDataAvailable;
    }
    const isLoading = false
    const isAdmin = Roles.userIsInRole(userId, ['Admin']);
    // const subscription = Meteor.subscribe('images.avatar')
    const avatar = Images.findOne({ 'meta.objectId': userId });
    if (avatar) {
      user.avatar = avatar.link();
    }

    return {
      user,
      userId,
      isAdmin,
      isLoggedIn: !!userId,
      isLoading
    }
  }

}, [])

const App = () => {
  const { user, userId, isAdmin, isLoggedIn, isLoading } = useAccount();

  const routing = useRoutes(routes(isLoggedIn, user, isAdmin, isLoading));
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;


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
