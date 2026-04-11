import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#0b0f1a] text-gray-400 py-10 border-t border-gray-800 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Branding */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-emerald-500 mb-4">APIVITE</h2>
            <p className="text-sm leading-relaxed">
              Gestión inteligente de gastos y tareas con integración en la nube. 
              Potenciando tu productividad con tecnología de vanguardia.
            </p>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Plataforma</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/admin" className="hover:text-emerald-400 transition">Dashboard</a></li>
              <li><a href="/api" className="hover:text-emerald-400 transition">Documentación API</a></li>
              <li><a href="/" className="hover:text-emerald-400 transition">Inicio</a></li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Ayuda</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-emerald-400 transition">Guía de Usuario</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Estado del Sistema</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 4: Newsletter / Social */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">Conéctate</h3>
            <div className="flex space-x-4 mb-4">
              {/* Puedes usar iconos de react-icons aquí */}
              <span className="bg-gray-800 p-2 rounded-full hover:bg-emerald-600 transition cursor-pointer">GH</span>
              <span className="bg-gray-800 p-2 rounded-full hover:bg-emerald-600 transition cursor-pointer">LI</span>
              <span className="bg-gray-800 p-2 rounded-full hover:bg-emerald-600 transition cursor-pointer">TW</span>
            </div>
            <p className="text-xs italic text-gray-500">
              Desplegado en Vercel & Render.
            </p>
          </div>

        </div>

        <hr className="my-8 border-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} Apivite Project. Todos los derechos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Política de Privacidad</a>
            <a href="#" className="hover:text-white">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};