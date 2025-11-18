import { Outlet } from 'react-router-dom';
import Menu from '../Menu/Menu';


function Layout() {

  return (
    <>
      <Menu/>
      <main className="container mt-5 pt-5">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
