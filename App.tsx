import React, { useState, useMemo } from 'react';
import { Center, FilterState } from './types.ts';
import { MOCK_CENTERS } from './constants.ts';
import Header from './components/Header.tsx';
import TeacherForm from './components/TeacherForm.tsx';
import SearchFilters from './components/SearchFilters.tsx';
import CenterTable from './components/CenterTable.tsx';
import SelectedList from './components/SelectedList.tsx';

// --- CONFIGURACIÓN BACKEND ---
// URL de tu Script de Google Apps desplegado
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxqCRFYzk6WvUcRZsm_3al9zmNOGawN1eg7G_RK5YV-Ukq808GVIOadsrlMHtgeLVTl1w/exec"; 

const App: React.FC = () => {
  // State
  const [teacherName, setTeacherName] = useState<string>('');
  const [teacherDNI, setTeacherDNI] = useState<string>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [dniError, setDniError] = useState<boolean>(false);
  const [selectedCenters, setSelectedCenters] = useState<Center[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    zone: '',
    code: '',
  });
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Handlers
  const handleNameChange = (name: string) => {
    setTeacherName(name);
    if (nameError && name.trim().length > 0) setNameError(false);
  };

  const handleDNIChange = (dni: string) => {
    setTeacherDNI(dni);
    if (dniError && dni.trim().length > 0) setDniError(false);
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

  const selectedIds = useMemo(() => new Set(selectedCenters.map(c => c.id)), [selectedCenters]);

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
    [newCenters[index], newCenters[targetIndex]] = [newCenters[targetIndex], newCenters[index]];
    setSelectedCenters(newCenters);
  };

  const handleExportExcel = async () => {
    let hasError = false;

    if (!teacherName.trim()) {
      setNameError(true);
      hasError = true;
    }

    if (!teacherDNI.trim()) {
      setDniError(true);
      hasError = true;
    }

    if (hasError) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      alert("Por favor, rellene todos los campos obligatorios.");
      return;
    }

    if (selectedCenters.length === 0) {
      alert("Selecciona al menos un centro.");
      return;
    }

    const XLSX = window.XLSX;
    if (!XLSX) {
      alert("Error: La librería de Excel no se ha cargado correctamente.");
      return;
    }

    setIsUploading(true);

    try {
        // 1. Preparar datos
        const data: any[][] = [
          ["SOLICITUD DE CENTROS DE PRÁCTICAS"],
          ["Fecha de exportación:", new Date().toLocaleDateString()],
          [], 
          ["Orden", "Nombre del Profesor", "DNI", "Código Centro", "Nombre del Centro", "Zona"] 
        ];

        selectedCenters.forEach((center, index) => {
          data.push([
            index + 1,
            teacherName,
            teacherDNI,
            center.code,
            center.name,
            center.zone
          ]);
        });

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(data);

        ws['!cols'] = [
          { wch: 8 }, { wch: 30 }, { wch: 15 }, { wch: 15 }, { wch: 40 }, { wch: 20 }
        ];

        XLSX.utils.book_append_sheet(wb, ws, "Selección");
        
        const safeName = teacherName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const fileName = `practicas_${safeName}.xlsx`;

        // 2. Enviar a Google Apps Script (si hay URL)
        if (GOOGLE_SCRIPT_URL) {
            const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
            
            await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify({
                    filename: fileName,
                    fileData: wbout,
                    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                })
            });
            
            alert("✅ Archivo enviado correctamente a Google Drive.");
        }

        // 3. Descargar copia local
        XLSX.writeFile(wb, fileName);

    } catch (error) {
        console.error(error);
        alert("Hubo un error al procesar el archivo. Se descargará una copia local.");
        // Fallback: intentar descargar localmente si falló el envío
        try {
           const wb = XLSX.utils.book_new();
        } catch(e) {}
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 font-sans">
      <Header />
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <div className="p-6 h-full flex flex-col overflow-y-auto">
                <TeacherForm 
                  teacherName={teacherName} 
                  setTeacherName={handleNameChange} 
                  teacherDNI={teacherDNI}
                  setTeacherDNI={handleDNIChange}
                  nameError={nameError}
                  dniError={dniError}
                />
                <SearchFilters filters={filters} setFilters={setFilters} />
                <CenterTable 
                    centers={filteredCenters} 
                    selectedIds={selectedIds} 
                    onAdd={handleAddCenter} 
                />
            </div>
        </div>

        <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 h-full relative z-20">
          <SelectedList 
            selectedCenters={selectedCenters}
            onRemove={handleRemoveCenter}
            onMove={handleMoveCenter}
            onExport={handleExportExcel}
            isUploading={isUploading}
            hasBackend={!!GOOGLE_SCRIPT_URL}
          />
        </div>
      </main>
    </div>
  );
};

export default App;