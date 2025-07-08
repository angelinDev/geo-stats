'use client';

import React from 'react';
import { Info, TrendingUp, Users, DollarSign } from 'lucide-react';

interface LegendProps {
  minValue: number;
  maxValue: number;
  colorScheme: string;
  dataMetric: string;
  selectedYear: number;
  visible: boolean;
}

const getColorStops = (scheme: string) => {
  const schemes: {[key: string]: string[]} = {
    'red-blue': ['#dc2626', '#2563eb'],
    'green-yellow': ['#16a34a', '#eab308'],
    'purple-pink': ['#9333ea', '#ec4899'],
    'blue-cyan': ['#1e40af', '#06b6d4'],
    'orange-red': ['#ea580c', '#dc2626']
  };
  return schemes[scheme] || schemes['red-blue'];
};

const formatValue = (value: number, metric: string) => {
  if (metric === 'gdp' || metric === 'gdp-per-capita') {
    if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T $`;
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B $`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M $`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K $`;
    return `${value.toFixed(0)} $`;
  }
  
  if (metric === 'population') {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B hab.`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M hab.`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K hab.`;
    return `${value.toFixed(0)} hab.`;
  }
  
  if (metric === 'area') {
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M km²`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K km²`;
    return `${value.toFixed(0)} km²`;
  }
  
  return value.toFixed(0);
};

const getMetricInfo = (metric: string) => {
  const info: {[key: string]: {name: string, icon: React.ReactNode, unit: string}} = {
    'gdp': { name: 'PIB Total', icon: <DollarSign className="w-4 h-4" />, unit: 'USD' },
    'gdp-per-capita': { name: 'PIB par Habitant', icon: <TrendingUp className="w-4 h-4" />, unit: 'USD/hab.' },
    'population': { name: 'Population', icon: <Users className="w-4 h-4" />, unit: 'habitants' },
    'area': { name: 'Superficie', icon: <Info className="w-4 h-4" />, unit: 'km²' }
  };
  return info[metric] || info['gdp'];
};

export default function Legend({ 
  minValue, 
  maxValue, 
  colorScheme, 
  dataMetric, 
  selectedYear, 
  visible 
}: LegendProps) {
  if (!visible) return null;

  const colors = getColorStops(colorScheme);
  const metricInfo = getMetricInfo(dataMetric);
  
  // Créer les segments de la légende
  const segments = 10;
  const gradientStops = Array.from({ length: segments + 1 }, (_, i) => {
    const percentage = i / segments;
    const value = minValue + (maxValue - minValue) * percentage;
    return { percentage: percentage * 100, value };
  });

  const gradientId = `legend-gradient-${colorScheme}`;

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex items-center gap-2 mb-3">
        {metricInfo.icon}
        <h3 className="text-sm font-semibold text-gray-800">
          {metricInfo.name} ({selectedYear})
        </h3>
      </div>
      
      {/* Gradient bar */}
      <div className="relative mb-3">
        <svg width="100%" height="20" className="rounded">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${gradientId})`}
            rx="2"
          />
        </svg>
      </div>
      
      {/* Value labels */}
      <div className="flex justify-between text-xs text-gray-600 mb-2">
        <span className="font-medium">
          {formatValue(minValue, dataMetric)}
        </span>
        <span className="font-medium">
          {formatValue(maxValue, dataMetric)}
        </span>
      </div>
      
      {/* Intermediate values */}
      <div className="grid grid-cols-3 gap-1 text-xs text-gray-500">
        <div className="text-left">
          Minimum
        </div>
        <div className="text-center">
          {formatValue((minValue + maxValue) / 2, dataMetric)}
        </div>
        <div className="text-right">
          Maximum
        </div>
      </div>
      
      {/* Info note */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Cliquez sur un pays pour plus d'informations
        </p>
      </div>
    </div>
  );
}
