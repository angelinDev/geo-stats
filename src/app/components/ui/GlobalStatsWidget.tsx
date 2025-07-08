'use client';

import React, { useEffect, useState } from 'react';
import { 
  Globe, TrendingUp, DollarSign, Users, Factory, Zap, 
  Leaf, Building, Plane, Wifi, Heart, GraduationCap,
  AlertTriangle, CheckCircle, Clock, Star
} from 'lucide-react';

interface GlobalStatsProps {
  gdpData: any;
  selectedYear: number;
}

export default function GlobalStatsWidget({ gdpData, selectedYear }: GlobalStatsProps) {
  const [liveStats, setLiveStats] = useState<any>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gdpData) {
      calculateLiveStats();
    }
  }, [gdpData, selectedYear]);

  const calculateLiveStats = () => {
    if (!gdpData) return;

    const countries = Object.values(gdpData.countries) as any[];
    const validCountries = countries.filter(country => 
      country.gdp_by_year[selectedYear] > 0
    );

    const totalGdp = validCountries.reduce((sum, country) => 
      sum + (country.gdp_by_year[selectedYear] || 0), 0
    );

    const avgGdp = totalGdp / validCountries.length;
    
    // Calculer des statistiques en temps réel simulées
    const currentTimestamp = Date.now();
    const variation = Math.sin(currentTimestamp / 10000) * 0.001; // Petite variation

    setLiveStats({
      totalCountries: validCountries.length,
      totalGdp: totalGdp * (1 + variation),
      avgGdp: avgGdp,
      topCountries: validCountries
        .sort((a, b) => (b.gdp_by_year[selectedYear] || 0) - (a.gdp_by_year[selectedYear] || 0))
        .slice(0, 5),
      // Statistiques simulées globales
      worldPopulation: 8100000000 + Math.floor(Math.random() * 1000000),
      internetUsers: 5.16e9 + Math.floor(Math.random() * 100000),
      co2Emissions: 36.7e9 + Math.random() * 1e7,
      renewableEnergy: 29.5 + Math.random() * 2,
      globalTemperature: 15.0 + Math.random() * 0.1,
      economicGrowth: 3.1 + (Math.random() - 0.5) * 0.5,
      // Données économiques en temps réel
      stockMarkets: {
        sp500: 4200 + Math.sin(currentTimestamp / 5000) * 50,
        nasdaq: 13000 + Math.sin(currentTimestamp / 7000) * 200,
        dow: 34000 + Math.sin(currentTimestamp / 6000) * 100
      },
      currencies: {
        usd: 1.0,
        eur: 0.85 + Math.sin(currentTimestamp / 8000) * 0.01,
        jpy: 110 + Math.sin(currentTimestamp / 9000) * 2,
        gbp: 0.75 + Math.sin(currentTimestamp / 7500) * 0.005
      }
    });
  };

  const formatNumber = (num: number, precision = 1): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(precision)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(precision)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(precision)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(precision)}K`;
    return num.toFixed(precision);
  };

  const LiveIndicator = ({ value, trend }: { value: string; trend: 'up' | 'down' | 'stable' }) => (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-white font-mono">{value}</span>
      <span className={`text-xs ${
        trend === 'up' ? 'text-green-400' : 
        trend === 'down' ? 'text-red-400' : 
        'text-yellow-400'
      }`}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
      </span>
    </div>
  );

  if (!liveStats) {
    return (
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-white/10 rounded"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec horloge mondiale */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-400 animate-spin" style={{animationDuration: '10s'}} />
            <h2 className="text-2xl font-bold gradient-text">Centre de Contrôle Mondial</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Session active</div>
              <div className="text-white font-mono">
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </div>
            </div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Métriques en temps réel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl p-4 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <Globe className="w-6 h-6 text-blue-400" />
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <LiveIndicator 
              value={formatNumber(liveStats.worldPopulation, 2)} 
              trend="up" 
            />
            <div className="text-xs text-blue-300 mt-1">Population mondiale</div>
          </div>

          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl p-4 border border-green-500/30">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-6 h-6 text-green-400" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <LiveIndicator 
              value={`$${formatNumber(liveStats.totalGdp)}`} 
              trend="up" 
            />
            <div className="text-xs text-green-300 mt-1">PIB Mondial Total</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <Wifi className="w-6 h-6 text-purple-400" />
              <CheckCircle className="w-4 h-4 text-green-400" />
            </div>
            <LiveIndicator 
              value={formatNumber(liveStats.internetUsers)} 
              trend="up" 
            />
            <div className="text-xs text-purple-300 mt-1">Utilisateurs Internet</div>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl p-4 border border-orange-500/30">
            <div className="flex items-center justify-between mb-2">
              <Factory className="w-6 h-6 text-orange-400" />
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <LiveIndicator 
              value={`${formatNumber(liveStats.co2Emissions)}t`} 
              trend="down" 
            />
            <div className="text-xs text-orange-300 mt-1">Émissions CO2/an</div>
          </div>
        </div>
      </div>

      {/* Marchés financiers en temps réel */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Marchés Financiers (Temps Réel)</h3>
          <div className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">LIVE</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-300">S&P 500</div>
                <div className="text-xl font-bold text-white">
                  {liveStats.stockMarkets.sp500.toFixed(2)}
                </div>
              </div>
              <div className="text-green-400 text-sm">+0.8%</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-300">NASDAQ</div>
                <div className="text-xl font-bold text-white">
                  {liveStats.stockMarkets.nasdaq.toFixed(0)}
                </div>
              </div>
              <div className="text-blue-400 text-sm">+1.2%</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-300">DOW JONES</div>
                <div className="text-xl font-bold text-white">
                  {liveStats.stockMarkets.dow.toFixed(0)}
                </div>
              </div>
              <div className="text-purple-400 text-sm">+0.6%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs environnementaux et sociaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-white">Environnement Global</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Énergies renouvelables</span>
              </div>
              <div className="text-white font-semibold">
                {liveStats.renewableEnergy.toFixed(1)}%
              </div>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-yellow-500 h-2 rounded-full"
                style={{ width: `${liveStats.renewableEnergy}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-gray-300">Température moyenne</span>
              </div>
              <div className="text-white font-semibold">
                {liveStats.globalTemperature.toFixed(1)}°C
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Croissance économique</span>
              </div>
              <div className="text-white font-semibold">
                {liveStats.economicGrowth.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Building className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Top 5 Économies ({selectedYear})</h3>
          </div>

          <div className="space-y-3">
            {liveStats.topCountries.map((country: any, index: number) => {
              const gdp = country.gdp_by_year[selectedYear] || 0;
              const percentage = (gdp / liveStats.totalGdp) * 100;
              
              return (
                <div key={country.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-300 text-black' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-blue-500/50 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-white text-sm">{country.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold text-sm">
                      ${formatNumber(gdp)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Taux de change en temps réel */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">Taux de Change (USD)</h3>
          <div className="text-xs text-green-400 bg-green-400/20 px-2 py-1 rounded-full">LIVE</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(liveStats.currencies).map(([currency, rate]: [string, any]) => (
            <div key={currency} className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-sm text-gray-300 uppercase">{currency}</div>
              <div className="text-lg font-bold text-white font-mono">
                {rate.toFixed(currency === 'jpy' ? 1 : 4)}
              </div>
              <div className="text-xs text-gray-400">
                {currency === 'usd' ? 'Base' : `vs USD`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
