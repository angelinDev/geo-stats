'use client';

import React from 'react';
import { X, Palette, Eye, BarChart3 } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  colorScheme: string;
  onColorSchemeChange: (scheme: string) => void;
  showTooltips: boolean;
  onShowTooltipsChange: (show: boolean) => void;
  showLegend: boolean;
  onShowLegendChange: (show: boolean) => void;
  dataMetric: string;
  onDataMetricChange: (metric: string) => void;
}

const colorSchemes = [
  { id: 'red-blue', name: 'Rouge → Bleu', preview: 'linear-gradient(to right, #dc2626, #2563eb)' },
  { id: 'green-yellow', name: 'Vert → Jaune', preview: 'linear-gradient(to right, #16a34a, #eab308)' },
  { id: 'purple-pink', name: 'Violet → Rose', preview: 'linear-gradient(to right, #9333ea, #ec4899)' },
  { id: 'blue-cyan', name: 'Bleu → Cyan', preview: 'linear-gradient(to right, #1e40af, #06b6d4)' },
  { id: 'orange-red', name: 'Orange → Rouge', preview: 'linear-gradient(to right, #ea580c, #dc2626)' }
];

const dataMetrics = [
  { id: 'gdp', name: 'PIB Total', description: 'Produit Intérieur Brut total' },
  { id: 'gdp-per-capita', name: 'PIB par Habitant', description: 'PIB divisé par la population' },
  { id: 'population', name: 'Population', description: 'Nombre d\'habitants' },
  { id: 'area', name: 'Superficie', description: 'Superficie du territoire' }
];

export default function SettingsPanel({
  isOpen,
  onClose,
  colorScheme,
  onColorSchemeChange,
  showTooltips,
  onShowTooltipsChange,
  showLegend,
  onShowLegendChange,
  dataMetric,
  onDataMetricChange
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Paramètres de la carte</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Schéma de couleurs */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <h4 className="text-md font-medium text-gray-900">Schéma de couleurs</h4>
                </div>
                <div className="space-y-2">
                  {colorSchemes.map(scheme => (
                    <label
                      key={scheme.id}
                      className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="colorScheme"
                        value={scheme.id}
                        checked={colorScheme === scheme.id}
                        onChange={(e) => onColorSchemeChange(e.target.value)}
                        className="text-blue-600"
                      />
                      <div
                        className="w-8 h-4 rounded"
                        style={{ background: scheme.preview }}
                      />
                      <span className="text-sm text-gray-700">{scheme.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Métrique de données */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h4 className="text-md font-medium text-gray-900">Données affichées</h4>
                </div>
                <div className="space-y-2">
                  {dataMetrics.map(metric => (
                    <label
                      key={metric.id}
                      className="flex items-start gap-3 p-2 rounded-lg border cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="dataMetric"
                        value={metric.id}
                        checked={dataMetric === metric.id}
                        onChange={(e) => onDataMetricChange(e.target.value)}
                        className="text-green-600 mt-1"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{metric.name}</div>
                        <div className="text-xs text-gray-500">{metric.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Options d'affichage */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <h4 className="text-md font-medium text-gray-900">Affichage</h4>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showTooltips}
                      onChange={(e) => onShowTooltipsChange(e.target.checked)}
                      className="text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Afficher les infobulles</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={showLegend}
                      onChange={(e) => onShowLegendChange(e.target.checked)}
                      className="text-purple-600"
                    />
                    <span className="text-sm text-gray-700">Afficher la légende</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Appliquer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
