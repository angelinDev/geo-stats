'use client';

import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Search, Download, Settings } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSearchCountry: (country: string) => void;
  onExportMap: () => void;
  onToggleSettings: () => void;
}

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onReset,
  onSearchCountry,
  onExportMap,
  onToggleSettings
}: MapControlsProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearchCountry(searchTerm.trim());
      setSearchTerm('');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-1 mb-2">
        <input
          type="text"
          placeholder="Rechercher un pays..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
      </form>

      {/* Control Buttons */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onZoomIn}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom avant"
        >
          <ZoomIn className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={onZoomOut}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Zoom arrière"
        >
          <ZoomOut className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={onReset}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Réinitialiser la vue"
        >
          <RotateCcw className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={onExportMap}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Exporter la carte"
        >
          <Download className="w-5 h-5 text-gray-700" />
        </button>
        
        <button
          onClick={onToggleSettings}
          className="p-2 bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          title="Paramètres"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
