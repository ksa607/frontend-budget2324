import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './components/NotFound';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import TransactionList from './pages/transactions/TransactionList';
import AddOrEditTransaction from './pages/transactions/AddOrEditTransaction';
import PlacesList from './pages/places/PlacesList';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { ThemeProvider } from './contexts/Theme.context';
import { AuthProvider } from './contexts/Auth.context';
import './index.css';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Navigate replace to="/transactions" />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/logout',
        element: <Logout />,
      },
      {
        path: '/transactions',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <TransactionList />,
          },
          {
            path: 'add',
            element: <AddOrEditTransaction />,
          },
          {
            path: 'edit/:id',
            element: <AddOrEditTransaction />,
          },
        ],
      },
      {
        path: '/places',
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <PlacesList />,
          }
        ]
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
