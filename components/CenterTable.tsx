import React from 'react';
import { Plus, School, ArrowUp, ArrowDown } from 'lucide-react';
import { Center, SortConfig } from '../types.ts';

interface CenterTableProps {
  centers: Center[];
  selectedIds: Set<string>;
  onAdd: (center: Center) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Center) => void;
}

const CenterTable: React.FC<CenterTableProps> = ({ 
  centers, 
  selectedIds, 
  onAdd,
  sortConfig,
  onSort
}) => {
  // Función para determinar el color del badge de estado
  const getStatusColor = (status: string) => {
    if (status.startsWith('Disponible')) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (status === 'Libre') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-gray-100 text-gray-700 border-gray-200'; // Otros
  };

  // Función auxiliar para renderizar el icono de ordenación
  const renderSortIcon = (key: keyof Center) => {
    if (sortConfig.key !== key) return <div className="w-3.5 h-3.5 ml-1 inline-block opacity-0 group-hover:opacity-30 transition-opacity"><ArrowUp size={14} /></div>;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="ml-1 text-corporate-blue inline-block" />
      : <ArrowDown size={14} className="ml-1 text-corporate-blue inline-block" />;
  };

  // Se añade 'align-middle' para asegurar que todos los títulos estén centrados verticalmente
  const headerClass = "px-4 py-3 tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none group align-middle";

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
              <th className={`${headerClass} w-24`} onClick={() => onSort('status')}>
                Estado {renderSortIcon('status')}
              </th>
              <th className={headerClass} onClick={() => onSort('code')}>
                Código {renderSortIcon('code')}
              </th>
              <th className={headerClass} onClick={() => onSort('name')}>
                Nombre {renderSortIcon('name')}
              </th>
              <th className={headerClass} onClick={() => onSort('zone')}>
                Zona {renderSortIcon('zone')}
              </th>
              <th className={`${headerClass} text-center`} onClick={() => onSort('students')}>
                Nº de estudiantes {renderSortIcon('students')}
              </th>
              <th className="px-4 py-3 tracking-wider text-right cursor-default align-middle">
                Acción
              </th>
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
                    <td className="px-4 py-3">
                      <span 
                        className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide inline-flex items-center gap-1 ${getStatusColor(center.status)}`}
                      >
                        {center.status.split(' ')[0]} {/* Muestra solo la primera palabra para ahorrar espacio si es muy largo */}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-500 text-xs">{center.code}</td>
                    <td className="px-4 py-3 font-medium text-corporate-dark">{center.name}</td>
                    <td className="px-4 py-3">{center.zone}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{center.students}</td>
                    <td className="px-4 py-3 text-right">
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
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
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