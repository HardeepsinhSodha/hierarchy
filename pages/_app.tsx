import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Layout from '../components/layout/Layout';
import { ThemeContextProvider } from '../components/layout/themeContext';
import { persistor, store } from '../store/store';
import '../styles/globals.css';
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeContextProvider>
      </PersistGate>
    </Provider>
  );
}

export default MyApp;
