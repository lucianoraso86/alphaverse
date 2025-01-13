import React from 'react';
import Header from './header/header';
import Footer from './footer/footer';

import './layout.scss';

const Layout = ({ children, hideHeader, hideFooter, logo = null }) => {

  return (
    <div className='layout-container'>
      <Header display-if={!hideHeader} sectionLogo={logo}/>
      <div className='layout-children-container'>
        {children}
      </div>
      <Footer display-if={!hideFooter}/>
    </div>
  )
};

export default Layout;