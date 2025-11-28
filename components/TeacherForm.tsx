import React from 'react';
import { User, AlertCircle } from 'lucide-react';

interface TeacherFormProps {
  teacherName: string;
  setTeacherName: (name: string) => void;
  hasError?: boolean;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ teacherName, setTeacherName, hasError }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
      <h2 className="text-corporate-dark font-semibold mb-4 flex items-center gap-2 border-b pb-2">
        <User size={18} className="text-corporate-blue" />
        Datos del Profesor
      </h2>
      <div className="flex flex-col">
        <label htmlFor="teacherName" className="text-sm font-medium text-gray-600 mb-1">
          Nombre y Apellidos <span className="text-red-500 font-bold" title="Campo obligatorio">*</span>
        </label>
        <div className="relative w-full md:w-1/2">
          <input
            id="teacherName"
            type="text"
            required
            value={teacherName}
            onChange={(e) => setTeacherName(e.target.value)}
            placeholder="Ej: María García López"
            className={`w-full p-2 border rounded bg-white text-gray-900 outline-none transition-all ${
              hasError 
                ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-2 focus:ring-corporate-blue focus:border-transparent'
            }`}
          />
          {hasError && (
            <div className="absolute right-3 top-2.5 text-red-500 animate-pulse">
              <AlertCircle size={18} />
            </div>
          )}
        </div>
        {hasError && (
          <p className="text-red-500 text-xs mt-1 font-medium">
            Este campo es obligatorio para poder exportar.
          </p>
        )}
      </div>
    </div>
  );
};

export default TeacherForm;