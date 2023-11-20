/* eslint-disable react-refresh/only-export-components */

import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/index.scss';
import { setToken } from './utils/api';
import isDesktopApp from './utils/isDesktopApp';
import TitleBar from './components/TitleBar';

if (!import.meta.env.DEV && import.meta.env.VITE_APP_PROTOCOL && !isDesktopApp()) {
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
        <Auth key="signUp" authType="signUp" />
      </Suspense>
    ),
  },
  {
    path: '/signIn',
    element: (
      <Suspense fallback={suspenseFallback}>
        <Auth key="signIn" authType="signIn" />
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

ReactDOM.createRoot(document.getElementById('routeRoot') as HTMLElement).render(
  <>
    <TitleBar />
    <RouterProvider router={router} />
  </>
);
