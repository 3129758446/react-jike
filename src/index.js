import ReactDOM from 'react-dom/client';
import './index.css';
import router from './router/index'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)

