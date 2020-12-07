import React from 'react';

import { Navigate } from 'react-router-dom';
//import Dashboard from './Dashboard';
import DashboardContent from './components/dashboardContent';
//import SignIn from './SignIn';
//import Register from './Register';
//import NotFoundView from './NotFoundView';
//import PasswordReset from './PasswordReset';
//import Users from './Users';


import DashboardLayout from '/imports/ui/layouts/DashboardLayout';
import MainLayout from '/imports/ui/layouts/MainLayout';
//import AccountView from '/imports/ui/views/account/AccountView';
//import Profile from '/imports/ui/views/account/AccountView/Profile';
import UserListView from '/imports/ui/views/user/UserListView';
//import DashboardView from '/imports/ui/views/reports/DashboardView';
import LoginView from '/imports/ui/views/auth/LoginView';
import NotFoundView from '/imports/ui/views/errors/NotFoundView';
// import ProductListView from '/imports/ui/views/product/ProductListView';
import RegisterView from '/imports/ui/views/auth/RegisterView';
//import SettingsView from '/imports/ui/views/settings/SettingsView';

const routes = (isLoggedIn) => [
  {
    path: 'app',
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to='/login' />,
    children: [
      //{ path: 'profile', element: <Profile /> },
      { path: 'users', element: <UserListView /> },
      { path: 'dashboard', element: <DashboardContent /> },
      // { path: 'products', element: <ProductListView /> },
      //{ path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    children: [
      { path: 'login', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
