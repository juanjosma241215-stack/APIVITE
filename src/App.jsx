import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './features/auth/layout/components/Header';
import { Footer } from './features/auth/layout/components/Footer';
import { AppRoutes } from './AppRoutes';
import './shared/responsive.css';

// Componente raíz del frontend: monta layout general, router y estilos globales.
function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 app-shell" style={{ backgroundColor: '#050505' }}>
        {/* Header compartido para toda la aplicación */}
        <Header />

        {/* Contenedor donde React Router renderiza cada página */}
        <main className="flex-grow-1">
          <AppRoutes />
        </main>

        {/* Footer fijo al final del layout */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
