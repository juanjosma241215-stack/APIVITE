import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaGithub, FaInstagram, FaLinkedin, FaRobot } from 'react-icons/fa';
import { MdMonetizationOn, MdCalculate } from 'react-icons/md';

export const Footer = () => {
  return (
    <footer className="py-5 mt-auto border-top border-secondary" style={{ backgroundColor: '#0a0c10', color: '#adb5bd' }}>
      <div className="container">
        <div className="row gy-5"> {/* 'gy-5' da espacio vertical en móviles */}
          
          {/* Columna 1: Branding y Temática Dual */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <MdCalculate className="text-success fs-2 me-2" />
              <span className="h3 mb-0 text-white fw-bold tracking-wider">APIVITE</span>
            </div>
            <p className="small lh-lg max-w-xs mx-auto mx-md-0">
              Gestión inteligente de gastos diarios con la tecnología de la <span className="text-info fw-bold">Ciudadela de los Ricks</span>. No dejes que tus finanzas caigan en un agujero negro interdimensional.
            </p>
            <div className="d-flex align-items-center justify-content-center justify-content-md-start small text-muted mt-3 pt-2">
              <FaRobot className="text-success me-2" />
              <span>Integrado con la API oficial de Rick & Morty</span>
            </div>
          </div>

          {/* Columna 2: Navegación de Finanzas */}
          <div className="col-6 col-md-2 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Finanzas</h6>
            <ul className="list-unstyled small space-y-3">
              <li className="mb-2">
                <NavLink to="/admin" className="text-decoration-none text-reset hover-success d-inline-flex align-items-center">
                  <MdMonetizationOn className="me-2" />Dashboard
                </NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/admin" className="text-decoration-none text-reset hover-success">Categorías</NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="#" className="text-decoration-none text-reset hover-success">Reportes</NavLink>
              </li>
            </ul>
          </div>

          {/* Columna 3: Navegación Multiverso */}
          <div className="col-6 col-md-2 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Multiverso</h6>
            <ul className="list-unstyled small space-y-3">
              <li className="mb-2">
                <NavLink to="/api" className="text-decoration-none text-reset hover-info">Personajes</NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="/api" className="text-decoration-none text-reset hover-info">Documentación</NavLink>
              </li>
              <li className="mb-2">
                <NavLink to="#" className="text-decoration-none text-reset hover-info">Episodios</NavLink>
              </li>
            </ul>
          </div>

          {/* Columna 4: Recursos y Redes (Aquí estaba el error) */}
          {/* Usamos col-12 en móviles y col-md-4 en PC para alinear */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Recursos del Portal</h6>
            
            {/* Íconos Alineados y con Instagram */}
            <div className="d-flex justify-content-center justify-content-md-start gap-4 mb-4">
              <a href="https://github.com/tu-usuario/APIVITE" target="_blank" rel="noopener noreferrer" className="text-muted fs-4 hover-white">
                <FaGithub />
              </a>
              <a href="https://instagram.com/tu-perfil" target="_blank" rel="noopener noreferrer" className="text-muted fs-4 hover-white">
                <FaInstagram /> {/* CAMBIO: Ahora es Instagram */}
              </a>
              <a href="https://linkedin.com/in/tu-perfil" target="_blank" rel="noopener noreferrer" className="text-muted fs-4 hover-white">
                <FaLinkedin />
              </a>
            </div>

            {/* Caja de Recursos Corregida y Alineada */}
            <div className="p-3 rounded border border-secondary bg-dark text-muted text-center text-md-start" style={{ fontSize: '0.75rem', backgroundColor: '#129934' }}>
              Desplegado en: <span className="text-success fw-medium">Vercel</span> & <span className="text-info fw-medium">Render</span>.<br />
              Base de datos: <span className="text-success fw-medium">MongoDB Atlas</span>.
            </div>
          </div>

        </div>

        <hr className="my-5 border-secondary" />

        {/* Sección Inferior Corregida (Privacidad y Términos) */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted text-center text-md-start space-y-3 space-y-md-0">
          <p className="mb-0">© {new Date().getFullYear()} Apivite Project - Un desarrollo de <span className="text-success">Juan José</span>.</p>
          <div className="d-flex gap-4">
            <a href="#" className="text-reset text-decoration-none hover-white">Privacidad</a>
            <a href="#" className="text-reset text-decoration-none hover-white">Términos Interdimensionales</a>
          </div>
        </div>
      </div>

      {/* Estilos CSS Inline para los efectos hover */}
      <style>{`
        .hover-success:hover { color: #198754 !important; transition: 0.2s ease-in; }
        .hover-info:hover { color: #0dcaf0 !important; transition: 0.2s ease-in; }
        .hover-white:hover { color: white !important; transition: 0.2s ease-in; }
      `}</style>
    </footer>
  );
};