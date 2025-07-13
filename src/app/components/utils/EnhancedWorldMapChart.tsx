'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import CountryDetailsPanel from '../ui/CountryDetailsPanel';
import YearSelector from '../ui/YearSelector';
import MapControls from '../ui/MapControls';
import SettingsPanel from '../ui/SettingsPanel';
import Legend from '../ui/Legend';
import StatisticsDashboard from '../ui/StatisticsDashboard';

interface GDPData {
  metadata: {
    description: string;
    source: string;
    indicator: string;
    last_updated: string;
    statistics: {
      min_gdp: number;
      max_gdp: number;
      median_gdp: number;
      quartiles: number[];
      total_countries: number;
      data_years_range: number[];
    };
  };
  countries: {
    [code: string]: {
      name: string;
      code: string;
      gdp_by_year: { [year: number]: number };
    };
  };
  latest_year_data: {
    [code: string]: {
      name: string;
      year: number;
      gdp: number;
    };
  };
}

export default function EnhancedWorldMapChart() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [gdpData, setGdpData] = useState<any>(null);
  const [selectedYear, setSelectedYear] = useState(2023);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [colorScheme, setColorScheme] = useState('red-blue');
  const [showTooltips, setShowTooltips] = useState(true);
  const [showLegend, setShowLegend] = useState(true);
  const [dataMetric, setDataMetric] = useState('gdp');
  const [zoomTransform, setZoomTransform] = useState<any>(null);

  // Animation pour la lecture des années
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && gdpData) {
      const years = gdpData.metadata.statistics.data_years_range;
      const minYear = Math.min(...years);
      const maxYear = Math.max(...years);
      
      interval = setInterval(() => {
        setSelectedYear(prev => {
          if (prev >= maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          return prev + 1;
        });
      }, 500); // Changement toutes les 500ms
    }
    return () => clearInterval(interval);
  }, [isPlaying, gdpData]);

  useEffect(() => {
    const loadMap = async () => {
      try {
        console.log('Début du chargement de la carte...');
        
        // Charger les données géographiques, PIB et mapping en parallèle
        const [geoRes, gdpRes, mappingRes] = await Promise.all([
          fetch('/countries-110m.json'),
          fetch('/gdp_by_country.json'),
          fetch('/country_name_mapping.json')
        ]);
        
        if (!geoRes.ok || !gdpRes.ok || !mappingRes.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        
        const topology = await geoRes.json();
        const gdpDataLoaded: GDPData = await gdpRes.json();
        const nameMapping: {[key: string]: string} = await mappingRes.json();
        
        setGdpData(gdpDataLoaded);
        
        // Convertir TopoJSON en GeoJSON
        const countries = topojson.feature(topology, topology.objects.countries) as any;
        
        if (!countries.features) {
          throw new Error('Aucune feature trouvée dans les données');
        }

        renderMap(countries, gdpDataLoaded, nameMapping);
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    };

    loadMap();
  }, [selectedYear, colorScheme, dataMetric]);

  const renderMap = (countries: any, gdpDataLoaded: GDPData, nameMapping: any) => {
    // Créer une map pour associer noms de pays aux codes ISO
    const nameToCode = new Map<string, string>();
    Object.values(gdpDataLoaded.countries).forEach((country: any) => {
      nameToCode.set(country.name, country.code);
      nameToCode.set(country.name.toLowerCase(), country.code);
    });

    // Ajouter les mappings personnalisés
    Object.entries(nameMapping).forEach(([geoName, code]) => {
      nameToCode.set(geoName, code as string);
      nameToCode.set(geoName.toLowerCase(), code as string);
    });

    // Mapper les données avec les pays géographiques
    const dataMap = new Map<string, number>();
    const countryDataMap = new Map<string, {code: string, gdp: number, year: number}>();
    
    countries.features.forEach((feature: any) => {
      const geoName = feature.properties?.NAME || feature.properties?.name || 'Unknown';
      let gdpValue = 0;
      let countryCode = '';

      // Trouver le code du pays
      if (nameMapping[geoName]) {
        countryCode = nameMapping[geoName];
      } else if (nameToCode.has(geoName)) {
        countryCode = nameToCode.get(geoName)!;
      } else if (nameToCode.has(geoName.toLowerCase())) {
        countryCode = nameToCode.get(geoName.toLowerCase())!;
      }

      // Récupérer les données pour l'année sélectionnée
      if (countryCode && gdpDataLoaded.countries[countryCode]) {
        gdpValue = gdpDataLoaded.countries[countryCode].gdp_by_year[selectedYear] || 0;
      }

      if (gdpValue > 0) {
        dataMap.set(geoName, Math.log10(gdpValue));
        countryDataMap.set(geoName, {code: countryCode, gdp: gdpValue, year: selectedYear});
      } else {
        dataMap.set(geoName, 0);
      }
    });

    if (svgRef.current) {
      // Nettoyer le SVG existant
      d3.select(svgRef.current).selectAll("*").remove();

      const svg = d3.select(svgRef.current);
      const width = 960;
      const height = 500;

      svg
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('width', '100%')
        .style('height', '100%');

      // Créer la projection
      const projection = d3.geoNaturalEarth1()
        .scale(width / 6.5)
        .translate([width / 2, height / 2]);

      // Créer le générateur de chemin
      const path = d3.geoPath().projection(projection);

      // Échelle de couleurs selon le schéma sélectionné
      const getColorScale = () => {
        const minLogGDP = Math.log10(gdpDataLoaded.metadata.statistics.min_gdp);
        const maxLogGDP = Math.log10(gdpDataLoaded.metadata.statistics.max_gdp);
        
        const colorSchemes: {[key: string]: string[]} = {
          'red-blue': ['#dc2626', '#2563eb'],
          'green-yellow': ['#16a34a', '#eab308'],
          'purple-pink': ['#9333ea', '#ec4899'],
          'blue-cyan': ['#1e40af', '#06b6d4'],
          'orange-red': ['#ea580c', '#dc2626']
        };
        
        const colors = colorSchemes[colorScheme] || colorSchemes['red-blue'];
        
        return d3.scaleLinear<string>()
          .domain([minLogGDP, maxLogGDP])
          .range(colors)
          .interpolate(d3.interpolateHsl);
      };

      const colorScale = getColorScale();

      // Ajouter zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on('zoom', (event) => {
          setZoomTransform(event.transform);
          svg.selectAll('.country')
            .attr('transform', event.transform);
        });

      svg.call(zoom as any);

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
          return logValue > 0 ? colorScale(logValue) : '#f0f0f0';
        })
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 0.5)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d: any) {
          if (!showTooltips) return;
          
          const countryName = d.properties?.NAME || d.properties?.name || 'Unknown';
          const countryData = countryDataMap.get(countryName);
          
          // Effet hover
          d3.select(this)
            .attr('stroke-width', 2)
            .attr('stroke', '#ff6b6b');

          // Créer tooltip
          const tooltip = d3.select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(0, 0, 0, 0.9)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '6px')
            .style('font-size', '13px')
            .style('pointer-events', 'none')
            .style('z-index', '1000')
            .style('box-shadow', '0 4px 8px rgba(0,0,0,0.3)')
            .html(countryData ? 
              `<strong>${countryName}</strong><br/>
               Code: ${countryData.code}<br/>
               PIB (${countryData.year}): $${(countryData.gdp / 1e9).toFixed(1)}B<br/>
               <em>Cliquez pour plus d'informations</em>` :
              `<strong>${countryName}</strong><br/>
               <em>Données non disponibles</em><br/>
               <em>Cliquez pour plus d'informations</em>`);

          tooltip
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('mouseout', function() {
          const countryName = (this as any).__data__.properties?.NAME || (this as any).__data__.properties?.name || 'Unknown';
          const countryData = countryDataMap.get(countryName);
          
          if (!countryData || selectedCountry !== countryData.code) {
            d3.select(this)
              .attr('stroke-width', 0.5)
              .attr('stroke', '#ffffff');
          }

          d3.selectAll('.tooltip').remove();
        })
        .on('mousemove', function(event) {
          d3.selectAll('.tooltip')
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px');
        })
        .on('click', function(event, d: any) {
          const countryName = d.properties?.NAME || d.properties?.name || 'Unknown';
          const countryData = countryDataMap.get(countryName);
          
          // Réinitialiser le style de tous les pays
          svg.selectAll('.country')
            .attr('stroke-width', 0.5)
            .attr('stroke', '#ffffff');
          
          if (countryData) {
            d3.select(this)
              .attr('stroke-width', 3)
              .attr('stroke', '#ff6b6b');
            
            setSelectedCountry(countryData.code);
          } else {
            setSelectedCountry('world');
          }
          
          d3.selectAll('.tooltip').remove();
        });
    }
  };

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom().scaleBy as any, 1.5
      );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(
        d3.zoom().scaleBy as any, 0.75
      );
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(500).call(
        d3.zoom().transform as any,
        d3.zoomIdentity
      );
    }
    setSelectedCountry(null);
  };

  const handleSearchCountry = (countryName: string) => {
    // Rechercher le pays et le sélectionner
    if (gdpData) {
      const foundCountry = Object.values(gdpData.countries).find((country: any) => 
        country.name.toLowerCase().includes(countryName.toLowerCase())
      );
      if (foundCountry) {
        setSelectedCountry((foundCountry as any).code);
      }
    }
  };

  const handleExportMap = () => {
    if (svgRef.current) {
      const svgElement = svgRef.current;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `world-map-${selectedYear}.svg`;
      link.click();
      
      URL.revokeObjectURL(url);
    }
  };

  const getMinMaxValues = () => {
    if (!gdpData) return { min: 0, max: 0 };
    return {
      min: gdpData.metadata.statistics.min_gdp,
      max: gdpData.metadata.statistics.max_gdp
    };
  };

  const { min, max } = getMinMaxValues();

  return (
    <div className="relative w-full">
      {/* Contrôles principaux */}
      {gdpData && (
        <YearSelector
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          minYear={Math.min(...gdpData.metadata.statistics.data_years_range)}
          maxYear={Math.max(...gdpData.metadata.statistics.data_years_range)}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      )}

      {/* Conteneur de la carte avec contrôles */}
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <svg ref={svgRef} className="w-full h-auto" />
        
        {/* Contrôles de la carte */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onSearchCountry={handleSearchCountry}
          onExportMap={handleExportMap}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />

        {/* Légende */}
        {gdpData && (
          <Legend
            minValue={min}
            maxValue={max}
            colorScheme={colorScheme}
            dataMetric={dataMetric}
            selectedYear={selectedYear}
            visible={showLegend}
          />
        )}
      </div>

      {/* Panneau de paramètres */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        colorScheme={colorScheme}
        onColorSchemeChange={setColorScheme}
        showTooltips={showTooltips}
        onShowTooltipsChange={setShowTooltips}
        showLegend={showLegend}
        onShowLegendChange={setShowLegend}
        dataMetric={dataMetric}
        onDataMetricChange={setDataMetric}
      />

      {/* Panneau d'informations */}
      <div className="mt-6">
        {selectedCountry && selectedCountry !== 'world' ? (
          <CountryDetailsPanel 
            countryName={selectedCountry} 
            onClose={() => setSelectedCountry(null)}
          />
        ) : (
          gdpData && (
            <div>
              <div className="text-center mb-6">
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  📊 Vue d'ensemble mondiale
                </button>
              </div>
              <StatisticsDashboard 
                gdpData={gdpData} 
                selectedYear={selectedYear} 
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}
