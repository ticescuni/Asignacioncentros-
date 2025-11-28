import React from 'react';
import { Trash2, ArrowUp, ArrowDown, FileDown, CheckCircle } from 'lucide-react';
import { Center } from '../types.ts';

interface SelectedListProps {
  selectedCenters: Center[];
  onRemove: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
  onExport: () => void;
}

const SelectedList: React.FC<SelectedListProps> = ({ selectedCenters, onRemove, onMove, onExport }) => {
  const maxCenters = 15;
  const count = selectedCenters.length;

  return (
    <div className="bg-white h-full flex flex-col shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)] border-l border-gray-200 w-full">
      {/* Sidebar Header - Changed to White for visual separation */}
      <div className="p-5 border-b border-gray-200 bg-white shrink-0">
        <h3 className="font-semibold text-lg flex items-center justify-between text-corporate-dark">
          Centros Seleccionados
          <span className={`text-xs px-2 py-1 rounded-full text-white ${count === maxCenters ? 'bg-red-500' : 'bg-corporate-blue'}`}>
            {count}/{maxCenters}
          </span>
        </h3>
        <p className="text-xs text-gray-500 mt-1">Orden de preferencia para la asignación.</p>
      </div>

      {/* List Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {count === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-4">
            <CheckCircle size={48} className="mb-2 opacity-20" />
            <p className="text-sm">No hay centros seleccionados.</p>
            <p className="text-xs mt-1">Añade centros desde la tabla de la izquierda.</p>
          </div>
        ) : (
          selectedCenters.map((center, index) => (
            <div 
              key={center.id} 
              className="group bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col gap-2 relative"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                    <div className="bg-corporate-blue text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shrink-0">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-corporate-dark leading-tight">{center.name}</h4>
                        <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="bg-gray-100 px-1 rounded font-mono">{center.code}</span>
                            <span>{center.zone}</span>
                        </div>
                    </div>
                </div>
                <button 
                  onClick={() => onRemove(center.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Controls Overlay */}
              <div className="flex justify-end gap-1 mt-1 border-t border-gray-100 pt-2">
                <button 
                    onClick={() => onMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-corporate-blue disabled:opacity-20 disabled:cursor-not-allowed hover:bg-blue-50 rounded"
                    title="Subir prioridad"
                >
                    <ArrowUp size={16} />
                </button>
                <button 
                    onClick={() => onMove(index, 'down')}
                    disabled={index === count - 1}
                    className="p-1 text-gray-400 hover:text-corporate-blue disabled:opacity-20 disabled:cursor-not-allowed hover:bg-blue-50 rounded"
                    title="Bajar prioridad"
                >
                    <ArrowDown size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Action */}
      <div className="p-4 bg-white border-t border-gray-200 shrink-0">
        <button
          onClick={onExport}
          disabled={count === 0}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold shadow-lg shadow-green-600/20 transition-all active:scale-[0.98]"
        >
          <FileDown size={20} />
          Finalizar y Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default SelectedList;