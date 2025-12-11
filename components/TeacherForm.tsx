import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User, AlertCircle, ChevronDown } from 'lucide-react';
import { TEACHER_LIST } from '../constants.ts';

interface TeacherFormProps {
  teacherName: string;
  setTeacherName: (name: string) => void;
  teacherDNI: string;
  setTeacherDNI: (dni: string) => void;
  nameError?: boolean;
  dniError?: boolean;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ 
  teacherName, 
  setTeacherName, 
  teacherDNI,
  setTeacherDNI,
  nameError,
  dniError 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filtrar lista basada en lo que escribe el usuario
  const filteredTeachers = useMemo(() => {
    if (!teacherName) return TEACHER_LIST;
    return TEACHER_LIST.filter(teacher => 
      teacher.toLowerCase().includes(teacherName.toLowerCase())
    );
  }, [teacherName]);

  // Manejar clic fuera para cerrar sugerencias
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectTeacher = (name: string) => {
    setTeacherName(name);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-corporate-dark font-semibold mb-4 flex items-center gap-2 border-b pb-2">
        <User size={18} className="text-corporate-blue" />
        Datos del Profesor
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Campo Nombre con Autocompletado */}
        <div className="md:col-span-2 flex flex-col relative" ref={dropdownRef}>
          <label htmlFor="teacherName" className="text-sm font-medium text-gray-600 mb-1">
            Nombre y Apellidos <span className="text-red-500 font-bold" title="Campo obligatorio">*</span>
          </label>
          <div className="relative w-full">
            <input
              id="teacherName"
              type="text"
              value={teacherName}
              onChange={(e) => {
                setTeacherName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Ej: María García López (o seleccione de la lista)"
              autoComplete="off"
              className={`w-full p-2 pr-8 border rounded bg-white text-gray-900 outline-none transition-all ${
                nameError 
                  ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-corporate-blue focus:border-transparent'
              }`}
            />
            {/* Icono de dropdown o alerta */}
            <div className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                {nameError ? <AlertCircle size={18} className="text-red-500 animate-pulse" /> : <ChevronDown size={16} />}
            </div>

            {/* Lista de Sugerencias */}
            {showSuggestions && (
              <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((name, index) => (
                    <li 
                      key={index}
                      onClick={() => handleSelectTeacher(name)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-corporate-blue cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                    >
                      {name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-sm text-gray-400 italic">
                    No hay coincidencias. Puede escribir un nombre nuevo.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Campo DNI */}
        <div className="md:col-span-1 flex flex-col">
          <label htmlFor="teacherDNI" className="text-sm font-medium text-gray-600 mb-1">
            DNI <span className="text-red-500 font-bold" title="Campo obligatorio">*</span>
          </label>
          <div className="relative w-full">
            <input
              id="teacherDNI"
              type="text"
              value={teacherDNI}
              onChange={(e) => setTeacherDNI(e.target.value)}
              placeholder="Ej: 12345678Z"
              className={`w-full p-2 border rounded bg-white text-gray-900 outline-none transition-all ${
                dniError 
                  ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-2 focus:ring-corporate-blue focus:border-transparent'
              }`}
            />
            {dniError && (
              <div className="absolute right-3 top-2.5 text-red-500 animate-pulse">
                <AlertCircle size={18} />
              </div>
            )}
          </div>
        </div>
      </div>

      {(nameError || dniError) && (
        <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
          <AlertCircle size={12} />
          Por favor, rellene todos los campos obligatorios para poder exportar.
        </p>
      )}
    </div>
  );
};

export default TeacherForm;