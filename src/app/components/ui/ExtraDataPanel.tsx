'use client';

import React from 'react';
import { 
  TrendingUp, Users, Building2, Zap, Heart, GraduationCap, 
  Globe, Briefcase, Home, Car, Wifi, Factory, Plane, Ship
} from 'lucide-react';

interface ExtraDataPanelProps {
  countryCode: string;
  countryName: string;
  population: number;
  gdp: number;
  area: number;
}

export default function ExtraDataPanel({ 
  countryCode, 
  countryName, 
  population, 
  gdp, 
  area 
}: ExtraDataPanelProps) {
  // Simuler des données économiques et sociales supplémentaires
  const generateExtraData = () => {
    const gdpPerCapita = gdp / population;
    const densité = population / area;
    
    // Simuler des données basées sur le PIB et la population
    const baseIndex = Math.log10(gdpPerCapita);
    
    return {
      économie: {
        inflation: Math.random() * 5 + 1,
        chômage: Math.max(1, 15 - baseIndex * 2 + Math.random() * 3),
        croissance: Math.random() * 6 - 1,
        dette: Math.random() * 100 + 20,
        exportations: gdp * (0.15 + Math.random() * 0.3),
        importations: gdp * (0.12 + Math.random() * 0.25)
      },
      social: {
        espéranceVie: Math.min(85, 65 + baseIndex * 3 + Math.random() * 5),
        alphabétisation: Math.min(99, 70 + baseIndex * 5 + Math.random() * 10),
        mortalitéInfantile: Math.max(1, 50 - baseIndex * 8 + Math.random() * 10),
        médecins: Math.min(5, baseIndex * 0.8 + Math.random() * 1),
        accèsInternet: Math.min(98, 40 + baseIndex * 10 + Math.random() * 20),
        urbain: Math.min(95, 30 + baseIndex * 12 + Math.random() * 15)
      },
      infrastructure: {
        routes: Math.min(1000, area * 0.8 + Math.random() * 200),
        aéroports: Math.max(1, Math.floor(Math.log10(population) * 20 + Math.random() * 10)),
        ports: Math.max(1, Math.floor(baseIndex * 15 + Math.random() * 5)),
        énergie: gdp * (0.001 + Math.random() * 0.002),
        émissionsCO2: gdp * (0.0003 + Math.random() * 0.0002)
      },
      démographie: {
        moins15: 15 + Math.random() * 25,
        plus65: 5 + baseIndex * 2 + Math.random() * 10,
        natalité: Math.max(8, 35 - baseIndex * 4 + Math.random() * 5),
        densité: densité,
        migration: (Math.random() - 0.5) * 10
      }
    };
  };

  const data = generateExtraData();

  const MetricCard = ({ 
    icon, 
    title, 
    value, 
    unit, 
    color, 
    trend 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    value: number; 
    unit: string; 
    color: string;
    trend?: 'up' | 'down' | 'stable';
  }) => (
    <div className={`bg-gradient-to-r ${color} backdrop-blur-xl rounded-2xl p-4 border border-white/20`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-white/80">{icon}</div>
        {trend && (
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend === 'up' ? 'bg-green-500/30 text-green-300' :
            trend === 'down' ? 'bg-red-500/30 text-red-300' :
            'bg-gray-500/30 text-gray-300'
          }`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">
        {value.toFixed(1)}{unit}
      </div>
      <div className="text-xs text-white/70">{title}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Indicateurs économiques */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-green-400" />
          <h3 className="text-2xl font-bold text-white">Indicateurs Économiques</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Taux d'inflation"
            value={data.économie.inflation}
            unit="%"
            color="from-red-500/20 to-red-600/20"
            trend={data.économie.inflation > 3 ? 'up' : 'stable'}
          />
          <MetricCard
            icon={<Briefcase className="w-6 h-6" />}
            title="Taux de chômage"
            value={data.économie.chômage}
            unit="%"
            color="from-orange-500/20 to-orange-600/20"
            trend={data.économie.chômage > 8 ? 'up' : 'down'}
          />
          <MetricCard
            icon={<Zap className="w-6 h-6" />}
            title="Croissance PIB"
            value={data.économie.croissance}
            unit="%"
            color="from-blue-500/20 to-blue-600/20"
            trend={data.économie.croissance > 2 ? 'up' : data.économie.croissance < 0 ? 'down' : 'stable'}
          />
          <MetricCard
            icon={<Building2 className="w-6 h-6" />}
            title="Dette publique"
            value={data.économie.dette}
            unit="% PIB"
            color="from-purple-500/20 to-purple-600/20"
            trend={data.économie.dette > 60 ? 'up' : 'stable'}
          />
          <MetricCard
            icon={<Plane className="w-6 h-6" />}
            title="Exportations"
            value={data.économie.exportations / 1e9}
            unit="B$"
            color="from-green-500/20 to-green-600/20"
            trend="up"
          />
          <MetricCard
            icon={<Ship className="w-6 h-6" />}
            title="Importations"
            value={data.économie.importations / 1e9}
            unit="B$"
            color="from-cyan-500/20 to-cyan-600/20"
            trend="stable"
          />
        </div>
      </div>

      {/* Indicateurs sociaux */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Heart className="w-6 h-6 text-pink-400" />
          <h3 className="text-2xl font-bold text-white">Indicateurs Sociaux</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={<Heart className="w-6 h-6" />}
            title="Espérance de vie"
            value={data.social.espéranceVie}
            unit=" ans"
            color="from-pink-500/20 to-pink-600/20"
            trend="up"
          />
          <MetricCard
            icon={<GraduationCap className="w-6 h-6" />}
            title="Taux d'alphabétisation"
            value={data.social.alphabétisation}
            unit="%"
            color="from-indigo-500/20 to-indigo-600/20"
            trend="up"
          />
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Mortalité infantile"
            value={data.social.mortalitéInfantile}
            unit="‰"
            color="from-red-500/20 to-red-600/20"
            trend="down"
          />
          <MetricCard
            icon={<Heart className="w-6 h-6" />}
            title="Médecins"
            value={data.social.médecins}
            unit="/1000 hab"
            color="from-green-500/20 to-green-600/20"
            trend="up"
          />
          <MetricCard
            icon={<Wifi className="w-6 h-6" />}
            title="Accès Internet"
            value={data.social.accèsInternet}
            unit="%"
            color="from-blue-500/20 to-blue-600/20"
            trend="up"
          />
          <MetricCard
            icon={<Building2 className="w-6 h-6" />}
            title="Population urbaine"
            value={data.social.urbain}
            unit="%"
            color="from-gray-500/20 to-gray-600/20"
            trend="up"
          />
        </div>
      </div>

      {/* Infrastructure et environnement */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Factory className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Infrastructure & Environnement</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={<Car className="w-6 h-6" />}
            title="Réseau routier"
            value={data.infrastructure.routes}
            unit=" km"
            color="from-yellow-500/20 to-yellow-600/20"
            trend="stable"
          />
          <MetricCard
            icon={<Plane className="w-6 h-6" />}
            title="Aéroports"
            value={data.infrastructure.aéroports}
            unit=""
            color="from-blue-500/20 to-blue-600/20"
            trend="stable"
          />
          <MetricCard
            icon={<Ship className="w-6 h-6" />}
            title="Ports"
            value={data.infrastructure.ports}
            unit=""
            color="from-cyan-500/20 to-cyan-600/20"
            trend="stable"
          />
          <MetricCard
            icon={<Zap className="w-6 h-6" />}
            title="Consommation énergie"
            value={data.infrastructure.énergie / 1e9}
            unit=" TWh"
            color="from-orange-500/20 to-orange-600/20"
            trend="up"
          />
          <MetricCard
            icon={<Factory className="w-6 h-6" />}
            title="Émissions CO2"
            value={data.infrastructure.émissionsCO2 / 1e6}
            unit=" Mt"
            color="from-red-500/20 to-red-600/20"
            trend={data.infrastructure.émissionsCO2 > gdp * 0.0004 ? 'up' : 'down'}
          />
          <MetricCard
            icon={<Globe className="w-6 h-6" />}
            title="Indice développement"
            value={Math.min(1, 0.4 + Math.log10(gdp/population) * 0.1)}
            unit=""
            color="from-purple-500/20 to-purple-600/20"
            trend="up"
          />
        </div>
      </div>

      {/* Démographie */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-400" />
          <h3 className="text-2xl font-bold text-white">Démographie</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon={<Users className="w-6 h-6" />}
            title="Population < 15 ans"
            value={data.démographie.moins15}
            unit="%"
            color="from-green-500/20 to-green-600/20"
            trend="stable"
          />
          <MetricCard
            icon={<Heart className="w-6 h-6" />}
            title="Population > 65 ans"
            value={data.démographie.plus65}
            unit="%"
            color="from-purple-500/20 to-purple-600/20"
            trend="up"
          />
          <MetricCard
            icon={<Home className="w-6 h-6" />}
            title="Taux de natalité"
            value={data.démographie.natalité}
            unit="‰"
            color="from-pink-500/20 to-pink-600/20"
            trend={data.démographie.natalité > 20 ? 'up' : 'down'}
          />
          <MetricCard
            icon={<Globe className="w-6 h-6" />}
            title="Migration nette"
            value={Math.abs(data.démographie.migration)}
            unit={data.démographie.migration >= 0 ? "‰ +" : "‰ -"}
            color="from-blue-500/20 to-blue-600/20"
            trend={data.démographie.migration > 0 ? 'up' : 'down'}
          />
        </div>
      </div>

      {/* Graphique comparatif */}
      <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">Comparaison avec les moyennes mondiales</h3>
        
        <div className="space-y-4">
          {[
            { label: 'PIB par habitant', value: gdp/population, average: 12000, unit: '$' },
            { label: 'Espérance de vie', value: data.social.espéranceVie, average: 72, unit: ' ans' },
            { label: 'Accès Internet', value: data.social.accèsInternet, average: 65, unit: '%' },
            { label: 'Émissions CO2', value: data.infrastructure.émissionsCO2/population*1e6, average: 4.8, unit: ' t/hab' },
          ].map((metric, index) => {
            const percentage = (metric.value / metric.average) * 100;
            const isAbove = percentage > 100;
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{metric.label}</span>
                  <span className="text-white font-semibold">
                    {metric.value.toFixed(1)}{metric.unit} 
                    <span className={`ml-2 ${isAbove ? 'text-green-400' : 'text-orange-400'}`}>
                      ({percentage.toFixed(0)}% de la moyenne)
                    </span>
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isAbove ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-gradient-to-r from-orange-500 to-red-500'}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
