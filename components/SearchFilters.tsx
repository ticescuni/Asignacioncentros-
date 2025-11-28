import React from 'react';
import { Search, MapPin, Hash, School } from 'lucide-react';
import { FilterState } from '../types.ts';

interface SearchFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, setFilters }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-corporate-dark font-semibold mb-4 flex items-center gap-2 border-b pb-2">
        <Search size={18} className="text-corporate-blue" />
        Buscador de Centros
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Name Filter */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Nombre del Centro</label>
          <div className="relative">
            <School size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleChange}
              placeholder="Buscar por nombre..."
              className="w-full pl-9 p-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-1 focus:ring-corporate-blue focus:border-corporate-blue outline-none"
            />
          </div>
        </div>

        {/* Zone Filter */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Zona / Distrito</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="zone"
              value={filters.zone}
              onChange={handleChange}
              placeholder="Ej: Centro, Hortaleza..."
              className="w-full pl-9 p-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-1 focus:ring-corporate-blue focus:border-corporate-blue outline-none"
            />
          </div>
        </div>

        {/* Code Filter */}
        <div className="relative">
          <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Código de Centro</label>
          <div className="relative">
            <Hash size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="code"
              value={filters.code}
              onChange={handleChange}
              placeholder="Ej: 2800..."
              className="w-full pl-9 p-2 border border-gray-300 rounded text-sm bg-white text-gray-900 focus:ring-1 focus:ring-corporate-blue focus:border-corporate-blue outline-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default SearchFilters;