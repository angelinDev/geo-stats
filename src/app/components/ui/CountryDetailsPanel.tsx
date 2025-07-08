'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Globe, Users, DollarSign, MapPin, TrendingUp, Building2, Heart, GraduationCap } from 'lucide-react';

interface CountryInfo {
  name: string;
  code: string;
  flag: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  languages: string[];
  currencies: string[];
  gdp: number;
  gdpPerCapita: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  lifeExpectancy: number;
  literacyRate: number;
  latitude: number;
  longitude: number;
}

interface WorldInfo {
  totalCountries: number;
  totalPopulation: number;
  totalGdp: number;
  averageLifeExpectancy: number;
  continents: { name: string; countries: number }[];
  topEconomies: { name: string; gdp: number }[];
}

interface CountryDetailsPanelProps {
  selectedCountry: string | null;
  gdpData: any;
}

export default function CountryDetailsPanel({ selectedCountry, gdpData }: CountryDetailsPanelProps) {
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [worldInfo, setWorldInfo] = useState<WorldInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données économiques pour les graphiques
  const [economicData, setEconomicData] = useState<any[]>([]);
  const [demographicData, setDemographicData] = useState<any[]>([]);

  // Données du monde par défaut
  const defaultWorldInfo: WorldInfo = {
    totalCountries: 195,
    totalPopulation: 8000000000,
    totalGdp: 100000000000000, // 100 trillions USD
    averageLifeExpectancy: 72.8,
    continents: [
      { name: 'Asie', countries: 50 },
      { name: 'Europe', countries: 44 },
      { name: 'Afrique', countries: 54 },
      { name: 'Amérique du Nord', countries: 23 },
      { name: 'Amérique du Sud', countries: 12 },
      { name: 'Océanie', countries: 14 }
    ],
    topEconomies: [
      { name: 'États-Unis', gdp: 25000000000000 },
      { name: 'Chine', gdp: 17700000000000 },
      { name: 'Japon', gdp: 4900000000000 },
      { name: 'Allemagne', gdp: 4200000000000 },
      { name: 'Inde', gdp: 3700000000000 }
    ]
  };

  useEffect(() => {
    if (selectedCountry && selectedCountry !== 'world') {
      fetchCountryData(selectedCountry);
    } else {
      setWorldInfo(defaultWorldInfo);
      setCountryInfo(null);
    }
  }, [selectedCountry]);

  const fetchCountryData = async (countryCode: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Récupérer les informations de base du pays depuis REST Countries API
      const countryResponse = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      
      if (!countryResponse.ok) {
        throw new Error('Impossible de récupérer les données du pays');
      }
      
      const countryData = await countryResponse.json();
      const country = countryData[0];

      // Extraire les données du PIB depuis notre fichier JSON
      const gdpInfo = gdpData?.latest_year_data?.[countryCode];
      const historicalGdp = gdpData?.countries?.[countryCode]?.gdp_by_year || {};

      // Calculer les données économiques historiques
      const recentYears = Object.entries(historicalGdp)
        .slice(-10)
        .map(([year, gdp]: [string, any]) => ({
          year: parseInt(year),
          gdp: Math.round(gdp / 1e9), // En milliards
          gdpPerCapita: Math.round(gdp / (country.population || 1))
        }));

      const countryInfo: CountryInfo = {
        name: country.name.common,
        code: countryCode,
        flag: country.flag || '🏳️',
        capital: country.capital?.[0] || 'N/A',
        region: country.region || 'N/A',
        subregion: country.subregion || 'N/A',
        population: country.population || 0,
        area: country.area || 0,
        languages: Object.values(country.languages || {}),
        currencies: Object.keys(country.currencies || {}),
        gdp: gdpInfo?.gdp || 0,
        gdpPerCapita: Math.round((gdpInfo?.gdp || 0) / (country.population || 1)),
        gdpGrowth: calculateGdpGrowth(historicalGdp),
        inflation: Math.random() * 5 + 1, // Simulation
        unemployment: Math.random() * 10 + 2, // Simulation
        lifeExpectancy: 65 + Math.random() * 20, // Simulation
        literacyRate: 80 + Math.random() * 20, // Simulation
        latitude: country.latlng?.[0] || 0,
        longitude: country.latlng?.[1] || 0
      };

      setCountryInfo(countryInfo);
      setEconomicData(recentYears);
      
      // Données démographiques simulées
      setDemographicData([
        { category: 'Population urbaine', value: 60 + Math.random() * 30 },
        { category: 'Population rurale', value: 40 - Math.random() * 30 },
        { category: 'Jeunes (0-14)', value: 15 + Math.random() * 20 },
        { category: 'Adultes (15-64)', value: 60 + Math.random() * 10 },
        { category: 'Seniors (65+)', value: 5 + Math.random() * 15 }
      ]);

    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGdpGrowth = (historicalGdp: any) => {
    const years = Object.keys(historicalGdp).sort();
    if (years.length < 2) return 0;
    
    const lastYear = historicalGdp[years[years.length - 1]];
    const previousYear = historicalGdp[years[years.length - 2]];
    
    return ((lastYear - previousYear) / previousYear * 100);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const COLORS = ['#FF0000', '#FF4500', '#FFA500', '#0000FF', '#4169E1'];

  if (loading) {
    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-lg p-6">
        <div className="text-red-600 text-center p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-y-auto">
      {countryInfo ? (
        // Affichage des informations du pays
        <div className="p-6">
          {/* En-tête du pays */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <span className="text-6xl">{countryInfo.flag}</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{countryInfo.name}</h2>
              <p className="text-gray-600">{countryInfo.capital} • {countryInfo.region}</p>
              <p className="text-sm text-gray-500">{countryInfo.subregion}</p>
            </div>
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Population</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{formatNumber(countryInfo.population)}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Superficie</span>
              </div>
              <p className="text-lg font-bold text-gray-800">{formatNumber(countryInfo.area)} km²</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">PIB</span>
              </div>
              <p className="text-lg font-bold text-gray-800">${formatNumber(countryInfo.gdp)}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">PIB/hab.</span>
              </div>
              <p className="text-lg font-bold text-gray-800">${formatNumber(countryInfo.gdpPerCapita)}</p>
            </div>
          </div>

          {/* Graphique économique */}
          {economicData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Évolution du PIB (10 dernières années)
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={economicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}B $`, 'PIB']} />
                    <Line type="monotone" dataKey="gdp" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Indicateurs socio-économiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <TrendingUp className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-red-600 mb-1">Croissance PIB</p>
              <p className="text-lg font-bold text-gray-800">{countryInfo.gdpGrowth.toFixed(1)}%</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <DollarSign className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm text-yellow-600 mb-1">Inflation</p>
              <p className="text-lg font-bold text-gray-800">{countryInfo.inflation.toFixed(1)}%</p>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg text-center">
              <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <p className="text-sm text-pink-600 mb-1">Espér. de vie</p>
              <p className="text-lg font-bold text-gray-800">{countryInfo.lifeExpectancy.toFixed(0)} ans</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <GraduationCap className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
              <p className="text-sm text-indigo-600 mb-1">Alphabétisation</p>
              <p className="text-lg font-bold text-gray-800">{countryInfo.literacyRate.toFixed(0)}%</p>
            </div>
          </div>

          {/* Graphique démographique */}
          {demographicData.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Répartition démographique
              </h3>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={demographicData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ category, value }) => `${category}: ${(value || 0).toFixed(0)}%`}
                    >
                      {demographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Langues officielles</h4>
              <p className="text-gray-700">{countryInfo.languages.join(', ') || 'N/A'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Monnaies</h4>
              <p className="text-gray-700">{countryInfo.currencies.join(', ') || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        // Affichage des informations mondiales
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 pb-4 border-b">
            <Globe className="w-12 h-12 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Statistiques Mondiales</h2>
              <p className="text-gray-600">Vue d'ensemble de l'économie mondiale</p>
            </div>
          </div>

          {/* Statistiques globales */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-blue-600 mb-1">Pays</p>
              <p className="text-lg font-bold text-gray-800">{worldInfo?.totalCountries}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-green-600 mb-1">Population</p>
              <p className="text-lg font-bold text-gray-800">{formatNumber(worldInfo?.totalPopulation || 0)}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm text-purple-600 mb-1">PIB Mondial</p>
              <p className="text-lg font-bold text-gray-800">${formatNumber(worldInfo?.totalGdp || 0)}</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Heart className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-sm text-orange-600 mb-1">Espér. vie moy.</p>
              <p className="text-lg font-bold text-gray-800">{worldInfo?.averageLifeExpectancy} ans</p>
            </div>
          </div>

          {/* Répartition par continent */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Répartition par continent</h3>
            <div className="h-64 bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worldInfo?.continents || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="countries" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top économies */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Top 5 des économies mondiales</h3>
            <div className="h-64 bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worldInfo?.topEconomies || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${formatNumber(value as number)} $`, 'PIB']} />
                  <Bar dataKey="gdp" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
