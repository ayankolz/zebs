import React from 'react';
import '../styles/Index.css';
import { useUserGroup } from './Sidebardata';
import { Link, Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';

const Index = () => {
  const sidebarData = useUserGroup();

  return (
    <React.Fragment>
      <div className='header'>
        <Header />
      </div>

      <section className="sidebar-container">
        <div className='dashboard'>
          {sidebarData.map((item, index) => (
            <div key={index}>
              <Link to={item.path} className='menu'>
                <span className='icon1'>{item.icon}</span> {/* Assuming item.icon is defined somewhere */}
                <span className='title1'>{item.title}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="content-container">
          <Outlet />
        </div>
      </section>

      <div className='footer'>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export default Index;
