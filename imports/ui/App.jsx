import React from 'react';
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

const useAccount = () => useTracker(() => {
  const user = Meteor.user()
  const userId = Meteor.userId()
  return {
    user,
    userId,
    isLoggedIn: !!userId
  }
}, [])

const App = () => {
  const { user, userId, isLoggedIn } = useAccount();
  const routing = useRoutes(routes(isLoggedIn));
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {routing}
    </ThemeProvider>
  );
};

export default App;

// const App = () => {
//   return (
//     <Router>
//       <Switch>
//           <Route path="/signin" exact component={SignIn} />
//           <Route path="/register" exact component={Register} />
//           <Route path="/passwordreset" exact component={PasswordReset} />
//           <Route path="/profile" exact component={Profile} />
//           <PrivateRoute>
//             <Route path="/dashboard" exact component={Dashboard} />
//           </PrivateRoute>
//           <Route path="*" component={NotFoundView} />
//         </Switch>
//     </Router>
//   );
// }

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
