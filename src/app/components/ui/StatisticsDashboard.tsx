'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Globe, Users, DollarSign, TrendingUp, Award, MapPin } from 'lucide-react';

interface StatisticsDashboardProps {
  gdpData: any;
  selectedYear: number;
}

export default function StatisticsDashboard({ gdpData, selectedYear }: StatisticsDashboardProps) {
  if (!gdpData) return null;

  // Calculer les statistiques globales
  const calculateGlobalStats = () => {
    const yearData = Object.values(gdpData.countries).map((country: any) => ({
      name: country.name,
      code: country.code,
      gdp: country.gdp_by_year[selectedYear] || 0
    })).filter(country => country.gdp > 0);

    const totalGdp = yearData.reduce((sum, country) => sum + country.gdp, 0);
    const averageGdp = totalGdp / yearData.length;
    const topCountries = yearData.sort((a, b) => b.gdp - a.gdp).slice(0, 10);
    
    return {
      totalCountries: yearData.length,
      totalGdp,
      averageGdp,
      topCountries,
      medianGdp: gdpData.metadata.statistics.median_gdp || 0
    };
  };

  const stats = calculateGlobalStats();

  // Données pour les graphiques
  const topCountriesData = stats.topCountries.slice(0, 5).map(country => ({
    name: country.name.length > 10 ? country.name.substring(0, 10) + '...' : country.name,
    gdp: country.gdp / 1e12, // En trillions
    fullName: country.name
  }));

  // Données par région (simulées pour l'exemple)
  const regionData = [
    { name: 'Amérique du Nord', value: 25, countries: 3 },
    { name: 'Europe', value: 22, countries: 27 },
    { name: 'Asie-Pacifique', value: 35, countries: 15 },
    { name: 'Amérique Latine', value: 8, countries: 20 },
    { name: 'Afrique', value: 4, countries: 54 },
    { name: 'Moyen-Orient', value: 6, countries: 12 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toFixed(0)}`;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Pays avec données</p>
              <p className="text-2xl font-bold">{stats.totalCountries}</p>
            </div>
            <Globe className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">PIB Mondial Total</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalGdp)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">PIB Moyen</p>
              <p className="text-xl font-bold">{formatCurrency(stats.averageGdp)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Année</p>
              <p className="text-2xl font-bold">{selectedYear}</p>
            </div>
            <Award className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 des économies */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Top 5 des Économies ({selectedYear})
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCountriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${value}T`}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `$${value.toFixed(2)}T`,
                  props.payload.fullName
                ]}
                labelFormatter={() => 'PIB'}
              />
              <Bar dataKey="gdp" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par région */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">
              Répartition du PIB par Région
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number, name: string, props: any) => [
                  `${value}% (${props.payload.countries} pays)`,
                  'Part du PIB mondial'
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Informations sur les Données
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>Source:</strong> {gdpData.metadata.source}</p>
            <p><strong>Indicateur:</strong> {gdpData.metadata.indicator}</p>
            <p><strong>Dernière mise à jour:</strong> {gdpData.metadata.last_updated}</p>
          </div>
          <div>
            <p><strong>PIB Minimum:</strong> {formatCurrency(gdpData.metadata.statistics.min_gdp)}</p>
            <p><strong>PIB Maximum:</strong> {formatCurrency(gdpData.metadata.statistics.max_gdp)}</p>
            <p><strong>PIB Médian:</strong> {formatCurrency(gdpData.metadata.statistics.median_gdp)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
