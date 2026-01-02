import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Suspense } from 'react';
import store from './common/store/store.ts';

import App from './common/App.tsx';
import { Loader } from './common/components/Loader/Loader.tsx';

import './stylesheets/index.scss';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <BrowserRouter>
      <div className='main_container'>
        <Suspense fallback={<Loader />}>
          <App />
        </Suspense>
      </div>
    </BrowserRouter>
  </Provider>,
);
