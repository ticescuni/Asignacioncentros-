import React from 'react';
import { GraduationCap } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-corporate-dark text-white px-6 py-4 shadow-md flex items-center gap-3 shrink-0 z-50 relative">
      <div className="p-2 bg-corporate-blue rounded-lg">
        <GraduationCap size={24} className="text-white" />
      </div>
      <div>
        <h1 className="text-xl font-semibold tracking-wide">Portal de Gestión Docente</h1>
        <p className="text-xs text-gray-300 font-light">Selección de Centros de Prácticas</p>
      </div>
    </header>
  );
};

export default Header;