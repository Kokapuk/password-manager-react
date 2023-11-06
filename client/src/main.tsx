import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RouterProvider router={router} />);
