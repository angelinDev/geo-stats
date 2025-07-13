'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Globe, Users, DollarSign, TrendingUp, Building2, Activity, Target } from 'lucide-react';
import CountryDetailsPanel from './ui/CountryDetailsPanel';

export default function UltraModernWorldMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<any>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Données mondiales de démonstration
  const demoGlobalStats = {
    totalCountries: 195,
    totalGDP: 104000000000000, // 104 trillion USD
    totalPopulation: 8100000000, // 8.1 billion
    averageGDP: 533000000000,
    topEconomies: [
      { name: 'États-Unis', gdp: 26900, population: 331, color: '#3b82f6' },
      { name: 'Chine', gdp: 17700, population: 1412, color: '#ef4444' },
      { name: 'Japon', gdp: 4900, population: 125, color: '#10b981' },
      { name: 'Allemagne', gdp: 4260, population: 83, color: '#f59e0b' },
      { name: 'Inde', gdp: 3730, population: 1380, color: '#8b5cf6' }
    ],
    continentData: [
      { name: 'Asie', gdp: 38.2, population: 59.5, countries: 50 },
      { name: 'Europe', gdp: 24.3, population: 9.6, countries: 44 },
      { name: 'Amérique du Nord', gdp: 28.1, population: 7.6, countries: 23 },
      { name: 'Amérique du Sud', gdp: 3.2, population: 5.7, countries: 12 },
      { name: 'Afrique', gdp: 2.8, population: 17.2, countries: 54 },
      { name: 'Océanie', gdp: 1.4, population: 0.5, countries: 14 }
    ]
  };

  const economicTrends = [
    { year: 2019, gdp: 87.8, inflation: 2.1, unemployment: 5.4 },
    { year: 2020, gdp: 84.9, inflation: 1.9, unemployment: 6.2 },
    { year: 2021, gdp: 96.3, inflation: 3.2, unemployment: 5.8 },
    { year: 2022, gdp: 100.8, inflation: 7.1, unemployment: 5.2 },
    { year: 2023, gdp: 104.0, inflation: 4.8, unemployment: 4.9 },
    { year: 2024, gdp: 107.2, inflation: 3.2, unemployment: 4.6 }
  ];

  useEffect(() => {
    loadMapAndData();
  }, []);

  const loadMapAndData = async () => {
    try {
      setLoading(true);
      
      // Charger les données géographiques
      const [geoResponse, gdpResponse] = await Promise.all([
        fetch('/countries-110m.json'),
        fetch('/gdp_by_country.json')
      ]);

      if (geoResponse.ok && gdpResponse.ok) {
        const topology = await geoResponse.json();
        const gdpData = await gdpResponse.json();
        
        setWorldData(gdpData);
        renderMap(topology, gdpData);
      } else {
        // Si les fichiers ne sont pas trouvés, utiliser une version simplifiée
        renderDemoMap();
      }
    } catch (error) {
      console.log('Utilisation du mode démo:', error);
      renderDemoMap();
    } finally {
      setLoading(false);
    }
  };

  const renderDemoMap = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 960;
    const height = 500;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', '100%');

    // Créer un fond avec gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'mapGradient')
      .attr('x1', '0%')
      .attr('x2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#1e3a8a');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#3b82f6');

    // Ajouter un rectangle de fond
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#mapGradient)')
      .attr('opacity', 0.1);

    // Ajouter du texte de démo
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1e40af')
      .text('🌍 Carte Interactive du Monde');

    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2 + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('fill', '#64748b')
      .text('Chargement des données géographiques...');

    // Ajouter des cercles animés pour représenter les pays
    const countries = demoGlobalStats.topEconomies;
    countries.forEach((country, i) => {
      const x = 200 + i * 120;
      const y = 300;
      
      svg.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 0)
        .attr('fill', country.color)
        .attr('opacity', 0.8)
        .style('cursor', 'pointer')
        .transition()
        .delay(i * 200)
        .duration(800)
        .attr('r', Math.sqrt(country.gdp) * 2)
        .on('end', function() {
          // Ajouter le nom du pays
          svg.append('text')
            .attr('x', x)
            .attr('y', y + Math.sqrt(country.gdp) * 2 + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', '#374151')
            .text(country.name);
        });
    });
  };

  const renderMap = (topology: any, gdpData: any) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 960;
    const height = 500;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', '100%');

    const countries = topojson.feature(topology, topology.objects.countries) as any;
    
    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Créer une échelle de couleurs basée sur les données PIB réelles
    const gdpValues = Object.values(gdpData).filter((v: any) => v && v.gdp) as any[];
    const gdpRange = d3.extent(gdpValues, (d: any) => d.gdp) as [number, number];
    
    const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain(gdpRange);

    // Fonction pour obtenir le PIB d'un pays
    const getCountryGDP = (countryName: string) => {
      const countryData = gdpData[countryName];
      return countryData?.gdp || 0;
    };

    // Fonction pour normaliser les noms de pays
    const normalizeCountryName = (name: string) => {
      const normalizations: {[key: string]: string} = {
        'United States of America': 'United States',
        'Russian Federation': 'Russia',
        'China': 'China',
        'United Kingdom': 'United Kingdom',
        'Democratic Republic of the Congo': 'Congo (Democratic Republic)',
        'Republic of the Congo': 'Congo',
        'Central African Republic': 'Central African Republic',
        'South Korea': 'Korea (Republic of)',
        'North Korea': 'Korea (Democratic People\'s Republic of)',
        'Myanmar': 'Myanmar',
        'Iran': 'Iran (Islamic Republic of)',
        'Syria': 'Syrian Arab Republic',
        'Venezuela': 'Venezuela (Bolivarian Republic of)',
        'Tanzania': 'Tanzania (United Republic of)',
        'Bolivia': 'Bolivia (Plurinational State of)',
        'Vietnam': 'Viet Nam'
      };
      
      return normalizations[name] || name;
    };

    svg.selectAll('.country')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties?.NAME || d.properties?.name || d.properties?.NAME_EN;
        const normalizedName = normalizeCountryName(countryName);
        const gdp = getCountryGDP(normalizedName);
        return gdp > 0 ? colorScale(gdp) : '#e5e7eb';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('click', function(event, d: any) {
        const countryName = d.properties?.NAME || d.properties?.name || d.properties?.NAME_EN || 'Pays inconnu';
        const normalizedName = normalizeCountryName(countryName);
        console.log('Pays cliqué:', normalizedName); // Debug
        
        // Effet visuel pour confirmer le clic
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 3)
          .transition()
          .duration(200)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 0.5);
        
        setSelectedCountry(normalizedName);
      })
      .on('mouseover', function(event, d: any) {
        const countryName = d.properties?.NAME || d.properties?.name || d.properties?.NAME_EN;
        const normalizedName = normalizeCountryName(countryName);
        const gdp = getCountryGDP(normalizedName);
        
        // Effet hover
        d3.select(this)
          .style('opacity', 0.8)
          .attr('stroke-width', 1.5);
          
        // Tooltip simple
        if (gdp > 0) {
          svg.append('text')
            .attr('id', 'country-tooltip')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#1f2937')
            .attr('background', 'white')
            .text(`${normalizedName}: $${(gdp / 1e12).toFixed(2)}T PIB`);
        }
      })
      .on('mouseout', function(event, d: any) {
        d3.select(this)
          .style('opacity', 1)
          .attr('stroke-width', 0.5);
          
        // Supprimer le tooltip
        svg.select('#country-tooltip').remove();
      });
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    return num.toLocaleString();
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 transition-colors duration-300 container-responsive">
      {/* Header moderne */}
      <div className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-responsive">
                  Atlas Économique Mondial
                </h1>
                <p className="text-sm sm:text-base text-gray-300 text-responsive">Données économiques mondiales en temps réel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="flex items-center space-x-2 bg-green-900/30 px-3 sm:px-4 py-2 rounded-full">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-green-400" />
                <span className="text-sm text-green-200 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 container-responsive">
        {/* Statistiques globales modernes */}
        <div className="responsive-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 mb-6 sm:mb-8">
          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-300 text-xs sm:text-sm font-medium">PIB Mondial Total</p>
                <p className="text-lg sm:text-xl lg:text-3xl font-bold text-blue-400 text-responsive">${formatNumber(demoGlobalStats.totalGDP)}</p>
                <p className="text-green-400 text-xs sm:text-sm font-medium">+3.2% cette année</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Population Mondiale</p>
                <p className="text-lg sm:text-xl lg:text-3xl font-bold text-green-400 text-responsive">{formatNumber(demoGlobalStats.totalPopulation)}</p>
                <p className="text-blue-400 text-xs sm:text-sm font-medium">+0.9% cette année</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-300 text-xs sm:text-sm font-medium">Nombre de Pays</p>
                <p className="text-lg sm:text-xl lg:text-3xl font-bold text-purple-400">{demoGlobalStats.totalCountries}</p>
                <p className="text-gray-400 text-xs sm:text-sm font-medium">Avec données PIB</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-700/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-gray-300 text-xs sm:text-sm font-medium">PIB Moyen</p>
                <p className="text-lg sm:text-xl lg:text-3xl font-bold text-orange-400 text-responsive">${formatNumber(demoGlobalStats.averageGDP)}</p>
                <p className="text-orange-400 text-xs sm:text-sm font-medium">Par pays</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/20 dark:border-gray-700/20 shadow-xl mb-8">
          {/* Header responsive */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">Carte Interactive Mondiale</h2>
            
            {/* Indicateurs responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 text-sm">Données économiques 2024</span>
              </div>
              
              {/* Légende PIB responsive */}
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Légende PIB:</span>
                <div className="flex items-center space-x-3 sm:space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 dark:bg-yellow-600 rounded flex-shrink-0"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Faible</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-400 dark:bg-orange-500 rounded flex-shrink-0"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Moyen</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded flex-shrink-0"></div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Élevé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Instructions pour l'utilisateur */}
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-xl">
              <p className="text-blue-800 dark:text-blue-200 text-sm font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Cliquez sur un pays pour voir ses statistiques détaillées
                {selectedCountry && (
                  <span className="ml-4 px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold">
                    Pays sélectionné: {selectedCountry}
                  </span>
                )}
              </p>
            </div>
            
            {loading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Chargement de la carte...</span>
                </div>
              </div>
            )}
            
            <svg ref={svgRef} className="w-full rounded-xl border border-gray-200 dark:border-gray-700"></svg>
          </div>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 des économies */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Top 5 des Économies Mondiales</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demoGlobalStats.topEconomies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" fontSize={12} stroke="#9ca3af" />
                <YAxis fontSize={12} stroke="#9ca3af" />
                <Tooltip 
                  formatter={(value) => [`$${value}T`, 'PIB']}
                  labelStyle={{ color: '#f3f4f6' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                    color: '#f3f4f6'
                  }}
                />
                <Bar dataKey="gdp" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Évolution économique */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Évolution du PIB Mondial</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={economicTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [`${value}T$`, 'PIB Mondial']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="gdp" 
                  stroke="#10b981" 
                  fill="url(#colorGdp)" 
                  strokeWidth={3}
                />
                <defs>
                  <linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Répartition par continent */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Répartition du PIB par Continent</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demoGlobalStats.continentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, gdp }) => `${name}: ${gdp}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="gdp"
                >
                  {demoGlobalStats.continentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Part du PIB mondial']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Indicateurs économiques */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-gray-700/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-6 h-6 text-red-600 dark:text-red-400" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Indicateurs Économiques</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={economicTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Line type="monotone" dataKey="inflation" stroke="#ef4444" strokeWidth={3} name="Inflation %" />
                <Line type="monotone" dataKey="unemployment" stroke="#f59e0b" strokeWidth={3} name="Chômage %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


      </div>
      
      {/* Panneau de détails du pays */}
      {selectedCountry && (
        <CountryDetailsPanel 
          countryName={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
