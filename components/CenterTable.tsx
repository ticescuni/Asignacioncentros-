import React from 'react';
import { Plus, School } from 'lucide-react';
import { Center } from '../types.ts';

interface CenterTableProps {
  centers: Center[];
  selectedIds: Set<string>;
  onAdd: (center: Center) => void;
}

const CenterTable: React.FC<CenterTableProps> = ({ centers, selectedIds, onAdd }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col min-h-[400px]">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h2 className="text-corporate-dark font-semibold flex items-center gap-2">
          <School size={18} className="text-corporate-blue" />
          Resultados ({centers.length})
        </h2>
      </div>
      
      <div className="overflow-auto flex-1">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs sticky top-0 shadow-sm z-10">
            <tr>
              <th className="px-6 py-3 tracking-wider">Código</th>
              <th className="px-6 py-3 tracking-wider">Nombre</th>
              <th className="px-6 py-3 tracking-wider">Zona</th>
              <th className="px-6 py-3 tracking-wider text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {centers.length > 0 ? (
              centers.map((center) => {
                const isSelected = selectedIds.has(center.id);
                return (
                  <tr 
                    key={center.id} 
                    className={`hover:bg-blue-50 transition-colors ${isSelected ? 'bg-gray-50 opacity-60' : ''}`}
                  >
                    <td className="px-6 py-3 font-mono text-gray-500">{center.code}</td>
                    <td className="px-6 py-3 font-medium text-corporate-dark">{center.name}</td>
                    <td className="px-6 py-3">{center.zone}</td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => onAdd(center)}
                        disabled={isSelected}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wide transition-all ${
                          isSelected
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-corporate-blue text-white hover:bg-sky-600 shadow-sm'
                        }`}
                      >
                        {isSelected ? 'Añadido' : (
                          <>
                            <Plus size={14} /> Añadir
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-gray-400 italic">
                  No se han encontrado centros con los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CenterTable;