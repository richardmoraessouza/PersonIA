import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="main-layout">
      <main className="content">
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;