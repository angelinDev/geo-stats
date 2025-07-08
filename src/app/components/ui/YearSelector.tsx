'use client';

import React from 'react';
import { Calendar, Play, Pause } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  onPlayPause: () => void;
}

export default function YearSelector({ 
  selectedYear, 
  onYearChange, 
  minYear, 
  maxYear, 
  isPlaying, 
  onPlayPause 
}: YearSelectorProps) {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onYearChange(parseInt(e.target.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Année sélectionnée: {selectedYear}
          </h3>
        </div>
        
        <button
          onClick={onPlayPause}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Lecture
            </>
          )}
        </button>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={selectedYear}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
              ((selectedYear - minYear) / (maxYear - minYear)) * 100
            }%, #e5e7eb ${((selectedYear - minYear) / (maxYear - minYear)) * 100}%, #e5e7eb 100%)`
          }}
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{minYear}</span>
          <span>{maxYear}</span>
        </div>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {[1970, 1990, 2000, 2010, 2020].map(year => (
          <button
            key={year}
            onClick={() => onYearChange(year)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedYear === year
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {year}
          </button>
        ))}
      </div>
    </div>
  );
}
