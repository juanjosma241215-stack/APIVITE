import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaGithub, FaInstagram, FaLinkedin, FaRobot } from 'react-icons/fa';
import { MdMonetizationOn, MdCalculate } from 'react-icons/md';

export const Footer = () => {
  return (
    <footer className="py-5 mt-auto border-top border-secondary" style={{ backgroundColor: '#0a0c10', color: '#ffffff' }}>
      <div className="container">
        <div className="row gy-5">
          
          {/* Columna 1: Branding */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <div className="d-flex align-items-center justify-content-center justify-content-md-start mb-3">
              <MdCalculate className="text-success fs-2 me-2" />
              <span className="h3 mb-0 text-white fw-bold tracking-wider">APIVITE</span>
            </div>
            <p className="small lh-lg max-w-xs mx-auto mx-md-0" style={{ color: '#e0e0e0' }}>
              Gestión inteligente de gastos diarios con la tecnología de la <span className="text-info fw-bold">Ciudadela de los Ricks</span>.
            </p>
          </div>

          {/* Columna 2: Finanzas */}
          <div className="col-6 col-md-2 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Finanzas</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <NavLink to="/admin" className="text-decoration-none d-inline-flex align-items-center" style={{ color: '#ffffff' }}>
                  <MdMonetizationOn className="me-2 text-success" />Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Columna 3: Multiverso */}
          <div className="col-6 col-md-2 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Multiverso</h6>
            <ul className="list-unstyled small">
              <li className="mb-2">
                <NavLink to="/api" className="text-decoration-none" style={{ color: '#ffffff' }}>Personajes</NavLink>
              </li>
            </ul>
          </div>

          {/* Columna 4: RECURSOS (CORREGIDA CON BLANCO) */}
          <div className="col-12 col-md-4 text-center text-md-start">
            <h6 className="text-white mb-4 fw-bold">Recursos del Portal</h6>
            
            <div className="d-flex justify-content-center justify-content-md-start gap-4 mb-4">
              <a href="#" className="fs-4" style={{ color: '#adb5bd' }}><FaGithub /></a>
              <a href="#" className="fs-4" style={{ color: '#adb5bd' }}><FaInstagram /></a>
              <a href="#" className="fs-4" style={{ color: '#adb5bd' }}><FaLinkedin /></a>
            </div>

            {/* ESTA ES LA CAJA QUE MARCASTE - AHORA EN BLANCO FORZADO */}
            <div className="p-3 rounded border border-secondary" style={{ fontSize: '0.85rem', backgroundColor: '#1a1f2b', color: '#ffffff' }}>
              <strong style={{ color: '#ffffff' }}>Desplegado en:</strong>{' '}
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>Vercel</span> &{' '}
              <span style={{ color: '#00d9ff', fontWeight: 'bold' }}>Render</span>.<br />
              <strong style={{ color: '#ffffff' }}>Base de datos:</strong>{' '}
              <span style={{ color: '#00ff88', fontWeight: 'bold' }}>MongoDB Atlas</span>.
            </div>
          </div>

        </div>

        <hr className="my-5 border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small" style={{ color: '#adb5bd' }}>
          <p className="mb-0">© {new Date().getFullYear()} Apivite Project - Por <span className="text-success">Juan José</span>.</p>
          <div className="d-flex gap-4">
            <a href="#" className="text-decoration-none" style={{ color: '#ffffff' }}>Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
};