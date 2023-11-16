/* eslint-disable react-refresh/only-export-components */

import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import TitleBar from './components/TitleBar';
import './styles/index.scss';
import { setToken } from './utils/api';

if (!import.meta.env.DEV && import.meta.env.VITE_APP_PROTOCOL) {
  window.location.href = `${import.meta.env.VITE_APP_PROTOCOL}://`;
}

const Auth = lazy(() => import('./pages/Auth'));
const Home = lazy(() => import('./pages/Home'));

const suspenseFallback = (
  <div id="spinnerContainer">
    <LoadingSpinner size={60} lineWidth={6} />
  </div>
);

setToken(sessionStorage.getItem('token'));

const router = createBrowserRouter([
  {
    path: '/signUp',
    element: (
      <Suspense fallback={suspenseFallback}>
        <Auth authType="signUp" />
      </Suspense>
    ),
  },
  {
    path: '/signIn',
    element: (
      <Suspense fallback={suspenseFallback}>
        <Auth authType="signIn" />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={suspenseFallback}>
        <Home />
      </Suspense>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <TitleBar />
    <div id="routerContainer">
      <RouterProvider router={router} />
    </div>
  </>
);
