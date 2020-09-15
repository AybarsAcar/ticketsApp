import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import Header from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </>
  );
};

AppComponent.getInitialProps = async (appCtx) => {
  const client = buildClient(appCtx.ctx);
  const { data } = await client.get('/api/users/currentuser');

  // custom page props
  let pageProps = {};
  if (appCtx.Component.getInitialProps) {
    // manually invoking the getInitialProps of the pages
    pageProps = await appCtx.Component.getInitialProps(
      appCtx.ctx,
      client,
      data.currentUser
    );
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
