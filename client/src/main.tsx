import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import Auth from './pages/Auth/Auth';
import Home from './pages/Home';
import './styles/index.scss';
import { setToken } from './utils/api';

setToken(sessionStorage.getItem('token'));

const router = createBrowserRouter([
  { path: '/signUp', element: <Auth authType="signUp" /> },
  { path: '/signIn', element: <Auth authType="signIn" /> },
  { path: '/', element: <Home /> },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <TitleBar />
    <div id="routerContainer">
      <RouterProvider router={router} />
    </div>
  </>
);
