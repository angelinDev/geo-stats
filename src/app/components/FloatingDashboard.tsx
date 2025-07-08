'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Globe, Zap, ArrowUp, ArrowDown } from 'lucide-react';

export default function FloatingDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Données simulées en temps réel
  const liveData = {
    globalGDP: {
      value: 104.2,
      change: +0.23,
      trend: 'up'
    },
    stockMarkets: {
      sp500: { value: 4580, change: +1.2 },
      nasdaq: { value: 14250, change: +0.8 },
      dow: { value: 34950, change: +0.5 }
    },
    commodities: {
      oil: { value: 78.45, change: +2.1 },
      gold: { value: 1985, change: -0.3 },
      bitcoin: { value: 45200, change: +3.2 }
    },
    currencies: {
      eurusd: { value: 1.0875, change: +0.15 },
      gbpusd: { value: 1.2650, change: -0.08 },
      usdjpy: { value: 149.85, change: +0.25 }
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50"
      >
        <Zap className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-4 z-50 max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="font-bold text-gray-800">Données Live</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {currentTime.toLocaleTimeString()}
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* PIB Mondial */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">PIB Mondial</span>
          </div>
          <div className="flex items-center space-x-1">
            {liveData.globalGDP.trend === 'up' ? (
              <ArrowUp className="w-3 h-3 text-green-500" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-500" />
            )}
            <span className={`text-xs font-medium ${liveData.globalGDP.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {liveData.globalGDP.change >= 0 ? '+' : ''}{liveData.globalGDP.change}%
            </span>
          </div>
        </div>
        <p className="text-lg font-bold text-blue-600 mt-1">
          ${liveData.globalGDP.value}T
        </p>
      </div>

      {/* Marchés boursiers */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
          Marchés
        </h4>
        <div className="space-y-1">
          {Object.entries(liveData.stockMarkets).map(([key, data]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 uppercase">{key}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium">{data.value.toLocaleString()}</span>
                <span className={`text-xs ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.change >= 0 ? '+' : ''}{data.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matières premières */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-3 mb-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <DollarSign className="w-4 h-4 mr-1 text-orange-600" />
          Commodités
        </h4>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Pétrole</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium">${liveData.commodities.oil.value}</span>
              <span className="text-xs text-green-600">+{liveData.commodities.oil.change}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Or</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium">${liveData.commodities.gold.value}</span>
              <span className="text-xs text-red-600">{liveData.commodities.gold.change}%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600">Bitcoin</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium">${liveData.commodities.bitcoin.value.toLocaleString()}</span>
              <span className="text-xs text-green-600">+{liveData.commodities.bitcoin.change}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Devises */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1 text-purple-600" />
          Devises
        </h4>
        <div className="space-y-1">
          {Object.entries(liveData.currencies).map(([pair, data]) => (
            <div key={pair} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 uppercase">{pair}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-medium">{data.value}</span>
                <span className={`text-xs ${data.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {data.change >= 0 ? '+' : ''}{data.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          🔄 Actualisé toutes les 30 secondes
        </p>
      </div>
    </div>
  );
}
