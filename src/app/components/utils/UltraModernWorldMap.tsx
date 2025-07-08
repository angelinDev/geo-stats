'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import ExtraDataPanel from '../ui/ExtraDataPanel';
import GlobalStatsWidget from '../ui/GlobalStatsWidget';
import { 
  Globe, Users, DollarSign, TrendingUp, Building2, Map, 
  BarChart3, PieChart, Activity, Zap, Target, Award,
  ArrowUp, ArrowDown, Minus, Play, Pause, Settings,
  Download, Search, RotateCcw, ZoomIn, ZoomOut, Calendar
} from 'lucide-react';

interface ModernMapProps {}

export default function UltraModernWorldMap({}: ModernMapProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [gdpData, setGdpData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [countryInfo, setCountryInfo] = useState<any>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);

  // Animation d'années
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gdpData) {
      interval = setInterval(() => {
        setSelectedYear(prev => {
          if (prev >= 2023) {
            setIsPlaying(false);
            return 2023;
          }
          return prev + 1;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, gdpData]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [geoRes, gdpRes, mappingRes] = await Promise.all([
        fetch('/countries-110m.json'),
        fetch('/gdp_by_country.json'),
        fetch('/country_name_mapping.json')
      ]);
      
      if (!geoRes.ok || !gdpRes.ok || !mappingRes.ok) {
        throw new Error('Erreur de chargement des données');
      }
      
      const [topology, gdpDataLoaded, nameMapping] = await Promise.all([
        geoRes.json(),
        gdpRes.json(),
        mappingRes.json()
      ]);
      
      setGdpData(gdpDataLoaded);
      calculateGlobalStats(gdpDataLoaded);
      renderMap(topology, gdpDataLoaded, nameMapping);
      setLoading(false);
      
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  const calculateGlobalStats = (data: any) => {
    if (!data) return;
    
    const countries = Object.values(data.countries) as any[];
    const totalGdp = countries.reduce((sum, country) => {
      const gdp = country.gdp_by_year[selectedYear] || 0;
      return sum + gdp;
    }, 0);
    
    const topCountries = countries
      .map(country => ({
        name: country.name,
        code: country.code,
        gdp: country.gdp_by_year[selectedYear] || 0
      }))
      .filter(c => c.gdp > 0)
      .sort((a, b) => b.gdp - a.gdp)
      .slice(0, 10);
    
    setGlobalStats({
      totalCountries: countries.length,
      totalGdp,
      topCountries,
      year: selectedYear
    });
  };

  useEffect(() => {
    if (gdpData) {
      calculateGlobalStats(gdpData);
      renderMap(null, gdpData, null);
    }
  }, [selectedYear]);

  const renderMap = async (topology: any, gdpDataLoaded: any, nameMapping: any) => {
    if (!topology && !gdpDataLoaded) return;
    
    // Si on a déjà une topology stockée, on l'utilise
    if (!topology) {
      const geoRes = await fetch('/countries-110m.json');
      topology = await geoRes.json();
    }
    if (!nameMapping) {
      const mappingRes = await fetch('/country_name_mapping.json');
      nameMapping = await mappingRes.json();
    }

    const countries = topojson.feature(topology, topology.objects.countries) as any;
    
    if (!svgRef.current || !countries.features) return;

    // Nettoyer le SVG
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 600;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', '100%');

    // Projection
    const projection = d3.geoNaturalEarth1()
      .scale(width / 6.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Créer les données par pays
    const dataMap = new Map();
    const countryDataMap = new Map();
    
    countries.features.forEach((feature: any) => {
      const geoName = feature.properties?.NAME || feature.properties?.name || 'Unknown';
      let countryCode = '';
      let gdpValue = 0;

      // Trouver le code du pays
      if (nameMapping[geoName]) {
        countryCode = nameMapping[geoName];
      } else {
        const foundCountry = Object.values(gdpDataLoaded.countries).find((country: any) => 
          country.name.toLowerCase().includes(geoName.toLowerCase()) ||
          geoName.toLowerCase().includes(country.name.toLowerCase())
        ) as any;
        if (foundCountry) {
          countryCode = foundCountry.code;
        }
      }

      if (countryCode && gdpDataLoaded.countries[countryCode]) {
        gdpValue = gdpDataLoaded.countries[countryCode].gdp_by_year[selectedYear] || 0;
      }

      if (gdpValue > 0) {
        dataMap.set(geoName, Math.log10(gdpValue));
        countryDataMap.set(geoName, {
          code: countryCode,
          gdp: gdpValue,
          year: selectedYear,
          name: gdpDataLoaded.countries[countryCode]?.name || geoName
        });
      } else {
        dataMap.set(geoName, 0);
      }
    });

    // Échelle de couleurs moderne avec dégradé
    const minLogGDP = Math.log10(gdpDataLoaded.metadata.statistics.min_gdp);
    const maxLogGDP = Math.log10(gdpDataLoaded.metadata.statistics.max_gdp);
    
    const colorScale = d3.scaleSequential(d3.interpolateViridis)
      .domain([minLogGDP, maxLogGDP]);

    // Ajouter un filtre de glow
    const defs = svg.append('defs');
    const filter = defs.append('filter')
      .attr('id', 'glow');
    
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Dessiner les pays
    svg.selectAll('.country')
      .data(countries.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const countryName = d.properties?.NAME || d.properties?.name || 'Unknown';
        const logValue = dataMap.get(countryName) || 0;
        return logValue > 0 ? colorScale(logValue) : '#2a2a2a';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.3)
      .style('cursor', 'pointer')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function(event, d: any) {
        const countryName = d.properties?.NAME || d.properties?.name || 'Unknown';
        const countryData = countryDataMap.get(countryName);
        
        d3.select(this)
          .attr('stroke-width', 2)
          .attr('stroke', '#00ffff')
          .style('filter', 'url(#glow)');

        // Tooltip moderne
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'modern-tooltip')
          .style('position', 'absolute')
          .style('background', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)')
          .style('color', 'white')
          .style('padding', '16px')
          .style('border-radius', '12px')
          .style('font-size', '14px')
          .style('font-weight', '500')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('box-shadow', '0 10px 25px rgba(0,0,0,0.3)')
          .style('backdrop-filter', 'blur(10px)')
          .style('border', '1px solid rgba(255,255,255,0.2)')
          .html(countryData ? 
            `<div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 12px; height: 12px; background: #00ffff; border-radius: 50%; margin-right: 8px;"></div>
              <strong style="font-size: 16px;">${countryData.name}</strong>
            </div>
            <div style="margin-bottom: 4px;">💰 PIB (${countryData.year}): <strong>$${(countryData.gdp / 1e9).toFixed(1)}B</strong></div>
            <div style="font-size: 12px; opacity: 0.8;">🖱️ Cliquez pour plus d'infos</div>` :
            `<div style="display: flex; align-items: center; margin-bottom: 8px;">
              <div style="width: 12px; height: 12px; background: #ff6b6b; border-radius: 50%; margin-right: 8px;"></div>
              <strong style="font-size: 16px;">${countryName}</strong>
            </div>
            <div style="margin-bottom: 4px;">📊 Données non disponibles</div>
            <div style="font-size: 12px; opacity: 0.8;">🖱️ Cliquez pour les infos de base</div>`);

        tooltip
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 10) + 'px')
          .style('opacity', '0')
          .transition()
          .duration(200)
          .style('opacity', '1');
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke-width', 0.3)
          .attr('stroke', '#ffffff')
          .style('filter', 'none');

        d3.selectAll('.modern-tooltip').remove();
      })
      .on('mousemove', function(event) {
        d3.selectAll('.modern-tooltip')
          .style('left', (event.pageX + 15) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('click', function(event, d: any) {
        const countryName = d.properties?.NAME || d.properties?.name || 'Unknown';
        const countryData = countryDataMap.get(countryName);
        
        // Reset tous les pays
        svg.selectAll('.country')
          .attr('stroke-width', 0.3)
          .attr('stroke', '#ffffff')
          .style('filter', 'none');
        
        if (countryData) {
          d3.select(this)
            .attr('stroke-width', 3)
            .attr('stroke', '#00ffff')
            .style('filter', 'url(#glow)');
          
          setSelectedCountry(countryData.code);
          fetchCountryDetails(countryData.code);
        }
        
        d3.selectAll('.modern-tooltip').remove();
      });
  };

  const fetchCountryDetails = async (countryCode: string) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      if (response.ok) {
        const data = await response.json();
        setCountryInfo(data[0]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du pays:', error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-b-transparent rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Chargement des données mondiales...</h2>
          <p className="text-gray-300">Analyse de 195 pays en cours</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header ultra-moderne */}
      <div className="relative overflow-hidden bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
              🌍 GeoStats 2025
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Explorez l'économie mondiale en temps réel
            </p>
            
            {/* Statistiques globales en header */}
            {globalStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/30">
                  <Globe className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{globalStats.totalCountries}</div>
                  <div className="text-sm text-blue-300">Pays analysés</div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-xl rounded-2xl p-4 border border-green-500/30">
                  <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">${formatNumber(globalStats.totalGdp)}</div>
                  <div className="text-sm text-green-300">PIB Mondial</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
                  <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{selectedYear}</div>
                  <div className="text-sm text-purple-300">Année sélectionnée</div>
                </div>
                <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-4 border border-orange-500/30">
                  <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{globalStats.topCountries[0]?.name.substring(0, 8)}...</div>
                  <div className="text-sm text-orange-300">1ère économie</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Contrôles de l'année */}
        <div className="mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-white">Sélecteur temporel</h3>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {selectedYear}
                </div>
              </div>
              
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-semibold shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause' : 'Animation'}
              </button>
            </div>
            
            <div className="relative">
              <input
                type="range"
                min={1990}
                max={2023}
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    ((selectedYear - 1990) / (2023 - 1990)) * 100
                  }%, rgba(59, 130, 246, 0.3) ${((selectedYear - 1990) / (2023 - 1990)) * 100}%, rgba(59, 130, 246, 0.3) 100%)`
                }}
              />
              
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>1990</span>
                <span>2000</span>
                <span>2010</span>
                <span>2020</span>
                <span>2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="mb-8">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10 overflow-hidden">
            <div className="relative">
              <svg ref={svgRef} className="w-full h-auto border border-white/10 rounded-2xl bg-slate-800/50" />
              
              {/* Contrôles de la carte */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button className="p-3 bg-black/50 backdrop-blur-xl text-white rounded-xl border border-white/10 hover:bg-black/70 transition-all">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black/50 backdrop-blur-xl text-white rounded-xl border border-white/10 hover:bg-black/70 transition-all">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black/50 backdrop-blur-xl text-white rounded-xl border border-white/10 hover:bg-black/70 transition-all">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="p-3 bg-black/50 backdrop-blur-xl text-white rounded-xl border border-white/10 hover:bg-black/70 transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>

              {/* Légende moderne */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-3">PIB par pays (USD)</h4>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-4 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-green-400"></div>
                  <div className="text-xs text-gray-300">
                    <div>Min: $62M</div>
                    <div>Max: $111T</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Données du pays sélectionné ou vue globale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {selectedCountry && countryInfo ? (
            // Panneau pays sélectionné
            <div className="lg:col-span-2">
              <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src={countryInfo.flags?.svg} 
                      alt={`Drapeau ${countryInfo.name?.common}`}
                      className="w-16 h-12 object-cover rounded-lg shadow-lg"
                    />
                    <div>
                      <h2 className="text-3xl font-bold text-white">{countryInfo.name?.common}</h2>
                      <p className="text-gray-300">{countryInfo.capital?.[0]} • {countryInfo.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                  >
                    Fermer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl p-6 border border-blue-500/30">
                    <Users className="w-8 h-8 text-blue-400 mb-3" />
                    <div className="text-2xl font-bold text-white">{formatNumber(countryInfo.population || 0)}</div>
                    <div className="text-blue-300">Population</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/30">
                    <Map className="w-8 h-8 text-green-400 mb-3" />
                    <div className="text-2xl font-bold text-white">{formatNumber(countryInfo.area || 0)} km²</div>
                    <div className="text-green-300">Superficie</div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
                    <DollarSign className="w-8 h-8 text-purple-400 mb-3" />
                    <div className="text-2xl font-bold text-white">
                      ${formatNumber(gdpData?.countries[selectedCountry]?.gdp_by_year[selectedYear] || 0)}
                    </div>
                    <div className="text-purple-300">PIB ({selectedYear})</div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-semibold mb-3">Informations générales</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Région:</span>
                        <span className="text-white">{countryInfo.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sous-région:</span>
                        <span className="text-white">{countryInfo.subregion}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Langues:</span>
                        <span className="text-white">
                          {countryInfo.languages ? Object.values(countryInfo.languages).slice(0, 2).join(', ') : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monnaies:</span>
                        <span className="text-white">
                          {countryInfo.currencies ? Object.values(countryInfo.currencies).map((c: any) => c.name).slice(0, 2).join(', ') : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-3">Indicateurs économiques</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">PIB par habitant:</span>
                        <span className="text-white">
                          ${formatNumber((gdpData?.countries[selectedCountry]?.gdp_by_year[selectedYear] || 0) / (countryInfo.population || 1))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Densité:</span>
                        <span className="text-white">
                          {((countryInfo.population || 0) / (countryInfo.area || 1)).toFixed(1)} hab/km²
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Code pays:</span>
                        <span className="text-white">{countryInfo.cca3}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fuseau horaire:</span>
                        <span className="text-white">{countryInfo.timezones?.[0] || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Données supplémentaires complètes */}
                <div className="mt-8">
                  <ExtraDataPanel
                    countryCode={selectedCountry}
                    countryName={countryInfo.name?.common || ''}
                    population={countryInfo.population || 0}
                    gdp={gdpData?.countries[selectedCountry]?.gdp_by_year[selectedYear] || 0}
                    area={countryInfo.area || 0}
                  />
                </div>
              </div>
            </div>
          ) : (
            // Vue globale avec statistiques complètes
            gdpData && (
              <div className="space-y-8">
                <div className="text-center">
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold text-lg shadow-lg glow-blue"
                  >
                    🌍 Tableau de Bord Mondial
                  </button>
                </div>
                
                <GlobalStatsWidget 
                  gdpData={gdpData} 
                  selectedYear={selectedYear} 
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
