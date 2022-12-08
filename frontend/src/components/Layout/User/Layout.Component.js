import { Helmet } from 'react-helmet';
import Navigation from "./Navigation.component";

const Layout = ({ children, TITLE='' }) => {
  return (
    <>
      <Helmet>
        <title>{ TITLE }</title>
      </Helmet>
      <Navigation />
      <main>{children}</main>
    </>
  );
};

export default Layout;
