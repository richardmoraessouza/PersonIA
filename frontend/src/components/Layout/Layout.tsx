import { Outlet } from 'react-router-dom';
import Menu from '../Menu/Menu';
import CookieBanner from '../CookieBanner/CookieBanner';
import Footer from '../Footer/Footer';
import useAnalytics from '../../hooks/useAnalytics/useAnalytics';

function Layout() {
  // Inicializa GA4 e monitora mudanças de consentimento
  useAnalytics({
    trackPageViews: true,
    debug: true, // Coloque false em produção
  });

  return (
    <>
      <Menu/>
      <main className="container mt-5 pt-5">
        <Outlet />
      </main>

      {/* Footer - informações legais e links institucionais */}
      <Footer />

      {/* Cookie Banner - permite gerenciar consentimento */}
      <CookieBanner 
        autoShow={true}
        position="bottom"
      />
    </>
  );
}

export default Layout;
