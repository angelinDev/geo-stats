'use client';

import React, { useEffect, useState } from 'react';
import { 
  Activity, Zap, Globe, TrendingUp, Users, DollarSign,
  Wifi, Factory, Heart, Minimize2, Maximize2
} from 'lucide-react';

interface FloatingDashboardProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function FloatingDashboard({ isVisible, onToggle }: FloatingDashboardProps) {
  const [metrics, setMetrics] = useState<any>({});
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const updateMetrics = () => {
      const timestamp = Date.now();
      setMetrics({
        globalGDP: 95.7 + Math.sin(timestamp / 10000) * 2,
        internetSpeed: 120.5 + Math.random() * 10,
        co2Level: 421.3 + Math.sin(timestamp / 15000) * 1.5,
        renewablePercent: 31.2 + Math.sin(timestamp / 20000) * 2,
        globalPopulation: 8.1 + Math.random() * 0.001,
        energyConsumption: 580.4 + Math.sin(timestamp / 8000) * 5,
        tradingVolume: 6.8 + Math.random() * 0.5,
        networkConnections: 98.7 + Math.random() * 1.3
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const MetricBadge = ({ 
    icon, 
    value, 
    unit, 
    label, 
    color, 
    pulse = false 
  }: { 
    icon: React.ReactNode; 
    value: number; 
    unit: string; 
    label: string; 
    color: string;
    pulse?: boolean;
  }) => (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${color} ${pulse ? 'animate-pulse' : ''}`}>
      <div className="text-white/80">{icon}</div>
      <div className="text-xs">
        <div className="text-white font-bold">
          {value.toFixed(1)}{unit}
        </div>
        <div className="text-white/60 text-[10px]">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl transition-all duration-500 ${
        isMinimized ? 'w-16 h-16' : 'w-80 h-auto'
      }`}>
        {isMinimized ? (
          <div 
            className="w-full h-full flex items-center justify-center cursor-pointer"
            onClick={() => setIsMinimized(false)}
          >
            <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold text-sm">Métriques Live</h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <Minimize2 className="w-4 h-4 text-white/60" />
                </button>
                <button 
                  onClick={onToggle}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                >
                  <span className="w-4 h-4 text-white/60 text-lg">×</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <MetricBadge
                  icon={<DollarSign className="w-4 h-4" />}
                  value={metrics.globalGDP}
                  unit="T$"
                  label="PIB Mondial"
                  color="bg-green-500/20"
                  pulse={true}
                />
                <MetricBadge
                  icon={<Users className="w-4 h-4" />}
                  value={metrics.globalPopulation}
                  unit="B"
                  label="Population"
                  color="bg-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <MetricBadge
                  icon={<Wifi className="w-4 h-4" />}
                  value={metrics.internetSpeed}
                  unit="Mbps"
                  label="Internet"
                  color="bg-purple-500/20"
                />
                <MetricBadge
                  icon={<Factory className="w-4 h-4" />}
                  value={metrics.co2Level}
                  unit="ppm"
                  label="CO2"
                  color="bg-red-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <MetricBadge
                  icon={<Zap className="w-4 h-4" />}
                  value={metrics.renewablePercent}
                  unit="%"
                  label="Renouvelable"
                  color="bg-yellow-500/20"
                />
                <MetricBadge
                  icon={<TrendingUp className="w-4 h-4" />}
                  value={metrics.tradingVolume}
                  unit="T$"
                  label="Trading"
                  color="bg-orange-500/20"
                  pulse={true}
                />
              </div>

              {/* Mini Chart */}
              <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-xs font-medium">Activité Réseau</span>
                  <span className="text-green-400 text-xs">{metrics.networkConnections?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${metrics.networkConnections}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs py-2 px-3 rounded-lg transition-colors border border-blue-500/30">
                  <Globe className="w-3 h-3 mx-auto mb-1" />
                  Stats
                </button>
                <button className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 text-xs py-2 px-3 rounded-lg transition-colors border border-green-500/30">
                  <Activity className="w-3 h-3 mx-auto mb-1" />
                  Live
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
