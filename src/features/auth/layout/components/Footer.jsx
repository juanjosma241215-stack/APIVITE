import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin, FaRobot } from 'react-icons/fa';
import { MdMonetizationOn, MdCalculate } from 'react-icons/md';

export const Footer = () => {
  return (
    <footer className="bg-[#0b101e] text-gray-300 border-t border-gray-800 py-12 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Columna 1: Branding y Temática Dual */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <MdCalculate className="text-3xl text-emerald-500" />
            <span className="text-2xl font-extrabold text-white tracking-wider">APIVITE</span>
          </div>
          <p className="text-sm leading-relaxed">
            Gestión inteligente de gastos diarios con la tecnología de la <span className="text-cyan-400">Ciudadela de los Ricks</span>. No dejes que tus finanzas caigan en un agujero negro interdimensional.
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 pt-2">
            <FaRobot className="text-emerald-500" />
            <span>Integrado con la API oficial de Rick y Morty</span>
          </div>
        </div>

        {/* Columna 2: Navegación de Finanzas */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Finanzas Diarias</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Mi Dashboard', path: '/admin' },
              { label: 'Categorías de Gastos', path: '#' },
              { label: 'Reportes Mensuales', path: '#' },
              { label: 'Mi Presupuesto', path: '#' },
            ].map((link, idx) => (
              <li key={idx}>
                <NavLink 
                  to={link.path} 
                  className="hover:text-emerald-400 flex items-center space-x-2 transition-colors duration-200"
                >
                  <MdMonetizationOn className="text-gray-600" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 3: Navegación de la Ciudadela */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Universo Rick & Morty</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: 'Documentación API', path: '/api' },
              { label: 'Explorar Personajes', path: '#' },
              { label: 'Ubicaciones y Episodios', path: '#' },
              { label: 'Estado del Multiverso', path: '#' },
            ].map((link, idx) => (
              <li key={idx}>
                <NavLink 
                  to={link.path} 
                  className="hover:text-cyan-400 transition-colors duration-200"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna 4: Conéctate con el Proyecto */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-5">Recursos del Portal</h3>
          <p className="text-sm mb-4">Mantente conectado y explora el código de este proyecto:</p>
          <div className="flex space-x-5 mb-6">
            <a href="https://github.com/tu-usuario/APIVITE" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
              <FaGithub className="text-2xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-emerald-400 transition">
              <FaTwitter className="text-2xl" />
            </a>
            <a href="#" className="text-gray-400 hover:text-cyan-400 transition">
              <FaLinkedin className="text-2xl" />
            </a>
          </div>
          <div className="bg-gray-800 rounded-lg p-3 text-xs border border-gray-700">
            Desplegado en: <span className="text-emerald-400">Vercel</span> & <span className="text-cyan-400">Render</span>.
            Base de datos: <span className="text-green-500">MongoDB Atlas</span>.
          </div>
        </div>

      </div>

      <hr className="my-10 border-gray-800 mx-6" />

      {/* Sección Inferior: Créditos y Legal */}
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} Apivite Project - Un desarrollo de <span className="text-emerald-500">Juan José</span>.</p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white">Política de Privacidad</a>
          <a href="#" className="hover:text-white">Términos de Portal Interdimensional</a>
        </div>
      </div>
    </footer>
  );
};