import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import './styles/index.scss';
import { setToken } from './utils/api';

setToken(sessionStorage.getItem('token'));

const router = createBrowserRouter([
  { path: '/signUp', element: <Auth authType="Sign Up" /> },
  { path: '/signIn', element: <Auth authType="Sign In" /> },
  { path: '/', element: <Home /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
