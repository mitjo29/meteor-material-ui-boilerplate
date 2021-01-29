import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Navigate } from 'react-router-dom';
import DashboardContent from './components/dashboardContent';
import DashboardLayout from '/imports/ui/layouts/DashboardLayout';
import MainLayout from '/imports/ui/layouts/MainLayout';
import Profile from '/imports/ui/views/account/AccountView/Profile';
import UserListView from '/imports/ui/views/user/UserListView';
import LoginView from '/imports/ui/views/auth/LoginView';
import NotFoundView from '/imports/ui/views/errors/NotFoundView';
import ProductListView from '/imports/ui/views/product/ProductListView';
import RegisterView from '/imports/ui/views/auth/RegisterView';
import ChangePasssword from '/imports/ui/views/account/AccountView/ChangePassword';
import Loading from '/imports/ui/components/loading';

const routes = (isLoggedIn, user, isAdmin, isLoading) => [
  {
    path: 'app',
    element: isLoading ?  <Loading /> : isLoggedIn ? <DashboardLayout user={user} isAdmin={isAdmin} /> : <Navigate to='/login' />,
    children: [
      { path: 'profile', element: <Profile user={user} /> },
      { path: 'users', element: true ? <UserListView /> : <Navigate to='/404' /> },
      { path: 'dashboard', element: <DashboardContent /> },
      { path: 'changepassword', element: <ChangePasssword />},
      { path: 'products', element: <ProductListView /> },
      //{ path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: isLoading ?  <Loading /> : !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
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
