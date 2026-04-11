import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaRobot } from 'react-icons/fa';
import { MdMonetizationOn, MdCalculate } from 'react-icons/md';

export const Footer = () => {
  return (
    <footer className="py-5 mt-auto border-top border-secondary" style={{ backgroundColor: '#0a0c10', color: '#adb5bd' }}>
      <div className="container">
        <div className="row gy-4">
          
          {/* Columna 1: Branding y Temática */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center mb-3">
              <MdCalculate className="text-success fs-2 me-2" />
              <span className="h3 mb-0 text-white fw-bold tracking-wider">APIVITE</span>
            </div>
            <p className="small lh-lg">
              Gestión inteligente de gastos diarios con la tecnología de la <span className="text-info fw-bold">Ciudadela de los Ricks</span>. No dejes que tus finanzas caigan en un agujero negro interdimensional.
            </p>
            <div className="d-flex align-items-center small text-muted mt-3">
              <FaRobot className="text-success me-2" />
              <span>Integrado con la API oficial de Rick & Morty</span>
            </div>
          </div>

          {/* Columna 2: Navegación de Finanzas */}
          <div className="col-6 col-md-2">
            <h6 className="text-white mb-4 fw-bold">Finanzas</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <NavLink to="/admin" className="text-decoration-none text-reset hover-success">
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

          {/* Columna 3: Navegación API */}
          <div className="col-6 col-md-2">
            <h6 className="text-white mb-4 fw-bold">Multiverso</h6>
            <ul className="list-unstyled small">
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

          {/* Columna 4: Recursos y Redes */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Recursos del Portal</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-4 mb-4">
              <a href="#" className="text-muted fs-4"><FaGithub /></a>
              <a href="#" className="text-muted fs-4"><FaTwitter /></a>
              <a href="#" className="text-muted fs-4"><FaLinkedin /></a>
            </div>
            <div className="p-3 rounded border border-secondary bg-dark text-muted" style={{ fontSize: '0.7rem' }}>
              Desplegado en: <span className="text-success">Vercel</span> & <span className="text-info">Render</span>.<br />
              DB: <span className="text-success">MongoDB Atlas</span>.
            </div>
          </div>

        </div>

        <hr className="my-5 border-secondary" />

        {/* Sección Inferior */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-2 mb-md-0">© {new Date().getFullYear()} Apivite Project - Por <span className="text-success">Juan José</span>.</p>
          <div className="d-flex gap-4">
            <a href="#" className="text-reset text-decoration-none">Privacidad</a>
            <a href="#" className="text-reset text-decoration-none">Términos Interdimensionales</a>
          </div>
        </div>
      </div>

      {/* Estilos CSS Inline para los efectos hover */}
      <style>{`
        .hover-success:hover { color: #198754 !important; transition: 0.3s; }
        .hover-info:hover { color: #0dcaf0 !important; transition: 0.3s; }
        footer a:hover { color: white !important; }
      `}</style>
    </footer>
  );
};