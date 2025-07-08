'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Globe, Users, DollarSign, TrendingUp, Building2, Zap, Activity, Target, ArrowUp, ArrowDown } from 'lucide-react';
import FloatingDashboard from './FloatingDashboard';

export default function UltraModernWorldMap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [countryData, setCountryData] = useState<any>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Données simulées pour demo immédiate
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

  // Ajouter des données de marchés financiers simulées
  const marketData = [
    { name: 'NYSE', value: 45820, change: +2.3, color: '#10b981' },
    { name: 'NASDAQ', value: 14550, change: +1.8, color: '#3b82f6' },
    { name: 'FTSE', value: 7650, change: -0.5, color: '#ef4444' },
    { name: 'Nikkei', value: 28400, change: +0.9, color: '#f59e0b' },
    { name: 'DAX', value: 15900, change: +1.2, color: '#8b5cf6' }
  ];

  // Données de cryptomonnaies simulées
  const cryptoData = [
    { name: 'Bitcoin', symbol: 'BTC', price: 45200, change: +3.2 },
    { name: 'Ethereum', symbol: 'ETH', price: 3100, change: +2.8 },
    { name: 'Cardano', symbol: 'ADA', price: 1.25, change: -1.5 }
  ];

  // Données de matières premières
  const commodityData = [
    { name: 'Or', price: 1985, change: +0.8, unit: '$/oz' },
    { name: 'Pétrole', price: 78.50, change: +2.1, unit: '$/bbl' },
    { name: 'Argent', price: 24.30, change: -0.3, unit: '$/oz' }
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

    // Échelle de couleurs moderne
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, 1]);

    svg.selectAll('.country')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d, i) => colorScale(Math.random()))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('click', function(event, d: any) {
        const countryName = d.properties?.NAME || 'Pays inconnu';
        setSelectedCountry(countryName);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderne */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Atlas Économique Mondial
                </h1>
                <p className="text-gray-600">Données économiques mondiales en temps réel</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-medium">Live</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistiques globales modernes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">PIB Mondial Total</p>
                <p className="text-3xl font-bold text-blue-600">${formatNumber(demoGlobalStats.totalGDP)}</p>
                <p className="text-green-600 text-sm font-medium">+3.2% cette année</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Population Mondiale</p>
                <p className="text-3xl font-bold text-green-600">{formatNumber(demoGlobalStats.totalPopulation)}</p>
                <p className="text-blue-600 text-sm font-medium">+0.9% cette année</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Nombre de Pays</p>
                <p className="text-3xl font-bold text-purple-600">{demoGlobalStats.totalCountries}</p>
                <p className="text-gray-500 text-sm font-medium">Avec données PIB</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">PIB Moyen</p>
                <p className="text-3xl font-bold text-orange-600">${formatNumber(demoGlobalStats.averageGDP)}</p>
                <p className="text-orange-600 text-sm font-medium">Par pays</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Carte Interactive Mondiale</h2>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-600">Données 2024</span>
            </div>
          </div>
          
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                  <span className="text-blue-600 font-medium">Chargement de la carte...</span>
                </div>
              </div>
            )}
            
            <svg ref={svgRef} className="w-full rounded-xl border border-gray-200"></svg>
          </div>
        </div>

        {/* Graphiques et analyses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top 5 des économies */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Top 5 des Économies Mondiales</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demoGlobalStats.topEconomies}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value) => [`$${value}T`, 'PIB']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
                  }}
                />
                <Bar dataKey="gdp" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Évolution économique */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-800">Évolution du PIB Mondial</h3>
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
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-800">Répartition du PIB par Continent</h3>
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
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-6 h-6 text-red-600" />
              <h3 className="text-xl font-bold text-gray-800">Indicateurs Économiques</h3>
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

        {/* Informations sur le pays sélectionné */}
        {selectedCountry && (
          <div className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Informations sur {selectedCountry}</h3>
              <button 
                onClick={() => setSelectedCountry(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors"
              >
                Fermer
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2">PIB</h4>
                <p className="text-2xl font-bold text-blue-600">$2.1T</p>
                <p className="text-blue-600 text-sm">+2.8% cette année</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-2">Population</h4>
                <p className="text-2xl font-bold text-green-600">67.8M</p>
                <p className="text-green-600 text-sm">+0.3% cette année</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h4 className="font-semibold text-purple-800 mb-2">PIB/habitant</h4>
                <p className="text-2xl font-bold text-purple-600">$31,000</p>
                <p className="text-purple-600 text-sm">+2.5% cette année</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Widget flottant avec données en temps réel */}
      <FloatingDashboard />
    </div>
  );
}
