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
import {Images} from '/imports/api/images/images';

const useAccount = () => useTracker(() => {
  let isLoading = true;
    const noDataAvailable = { user: [], isLoading };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const user = Meteor.user()
    const userId = Meteor.userId()
    const handle = Meteor.subscribe('users.current')
    if (!handle.ready()) {
      return noDataAvailable;
    }
    const isAdmin = Roles.userIsInRole(userId,['Admin']);
    const subscription = Meteor.subscribe('images.avatar')
    if (!subscription.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }
    const avatar = Images.findOne({'meta.objectId': userId});
    if(avatar){
      user.avatar = avatar.link();
    }
    
  return {
    user,
    userId,
    isAdmin,
    isLoggedIn: !!userId,
    isLoading : false
  }
}, [])

const App = () => {
  const { user, userId, isAdmin, isLoggedIn , isLoading} = useAccount();
  // const { avatar, isLoading }  = useTracker(() =>  {
  //   let isLoading = true;
  //   const noDataAvailable = { avatar: [], isLoading };
  //   if (!Meteor.user()) {
  //     return noDataAvailable;
  //   }
  //   const subscription = Meteor.subscribe('images.avatar')
  //   if (!subscription.ready()) {
  //     return { ...noDataAvailable, isLoading: true };
  //   }
  
  //   const avatar = Images.findOne({'meta.objectId': userId});
  //   if(avatar){
  //     user.avatar = avatar.link();
  //   }

  //   return { avatar, isLoading };
    
  // });
  const routing = useRoutes(routes(isLoggedIn, user, isAdmin, isLoading));
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
