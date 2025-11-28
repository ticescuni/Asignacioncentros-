import React, { useState, useMemo } from 'react';
import { Center, FilterState } from './types.ts';
import { MOCK_CENTERS } from './constants.ts';
import Header from './components/Header.tsx';
import TeacherForm from './components/TeacherForm.tsx';
import SearchFilters from './components/SearchFilters.tsx';
import CenterTable from './components/CenterTable.tsx';
import SelectedList from './components/SelectedList.tsx';

const App: React.FC = () => {
  // State
  const [teacherName, setTeacherName] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false); // Estado para el error de validación
  const [selectedCenters, setSelectedCenters] = useState<Center[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    zone: '',
    code: '',
  });

  // Wrapper para limpiar el error cuando el usuario escribe
  const handleNameChange = (name: string) => {
    setTeacherName(name);
    if (nameError && name.trim().length > 0) {
      setNameError(false);
    }
  };

  // Derived State: Filtered Centers
  const filteredCenters = useMemo(() => {
    return MOCK_CENTERS.filter(center => {
      const matchName = center.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchZone = center.zone.toLowerCase().includes(filters.zone.toLowerCase());
      const matchCode = center.code.includes(filters.code);
      return matchName && matchZone && matchCode;
    });
  }, [filters]);

  // Derived State: Set of selected IDs for fast lookup
  const selectedIds = useMemo(() => {
    return new Set(selectedCenters.map(c => c.id));
  }, [selectedCenters]);

  // Handlers
  const handleAddCenter = (center: Center) => {
    if (selectedCenters.length >= 15) {
      alert("Has alcanzado el límite máximo de 15 centros.");
      return;
    }
    if (selectedIds.has(center.id)) return;
    
    setSelectedCenters(prev => [...prev, center]);
  };

  const handleRemoveCenter = (id: string) => {
    setSelectedCenters(prev => prev.filter(c => c.id !== id));
  };

  const handleMoveCenter = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === selectedCenters.length - 1) return;

    const newCenters = [...selectedCenters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newCenters[index], newCenters[targetIndex]] = [newCenters[targetIndex], newCenters[index]];
    
    setSelectedCenters(newCenters);
  };

  const handleExportExcel = () => {
    // Validación estricta del nombre
    if (!teacherName.trim()) {
      setNameError(true);
      // Hacemos scroll hacia arriba para que el usuario vea el error si está en móvil
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert("El nombre del profesor es obligatorio.");
      return;
    }

    if (selectedCenters.length === 0) {
      alert("Selecciona al menos un centro.");
      return;
    }

    // Using the global XLSX object from the CDN
    const XLSX = window.XLSX;
    if (!XLSX) {
      alert("Error: La librería de Excel no se ha cargado correctamente.");
      return;
    }

    // Create Data Structure
    const data: any[][] = [
      ["SOLICITUD DE CENTROS DE PRÁCTICAS"],
      ["Profesor:", teacherName],
      ["Fecha:", new Date().toLocaleDateString()],
      [], // Empty row
      ["Orden", "Código", "Nombre del Centro", "Zona"] // Headers
    ];

    selectedCenters.forEach((center, index) => {
      data.push([
        index + 1,
        center.code,
        center.name,
        center.zone
      ]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // Basic styling adjustments (width)
    const wscols = [
      { wch: 10 }, // Order
      { wch: 15 }, // Code
      { wch: 40 }, // Name
      { wch: 20 }  // Zone
    ];
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, "Selección");
    
    // Sanitize filename
    const safeName = teacherName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    XLSX.writeFile(wb, `practicas_${safeName}.xlsx`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      <Header />
      
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Left Column: Form & Data */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <div className="p-6 h-full flex flex-col overflow-y-auto">
                <TeacherForm 
                  teacherName={teacherName} 
                  setTeacherName={handleNameChange} 
                  hasError={nameError}
                />
                <SearchFilters filters={filters} setFilters={setFilters} />
                <CenterTable 
                    centers={filteredCenters} 
                    selectedIds={selectedIds} 
                    onAdd={handleAddCenter} 
                />
            </div>
        </div>

        {/* Right Column: Sticky Sidebar */}
        <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 h-full relative z-20">
          <SelectedList 
            selectedCenters={selectedCenters}
            onRemove={handleRemoveCenter}
            onMove={handleMoveCenter}
            onExport={handleExportExcel}
          />
        </div>
      </main>
    </div>
  );
};

export default App;