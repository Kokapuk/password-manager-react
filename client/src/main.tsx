import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import Home from './pages/Home';
import Auth from './pages/Auth';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { setToken } from './utils/api';

setToken(sessionStorage.getItem('token'));

const router = createBrowserRouter([
  { path: '/signUp', element: <Auth authType='Sign Up' /> },
  { path: '/signIn', element: <Auth authType='Sign In' /> },
  { path: '/', element: <Home /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
