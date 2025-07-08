'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

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

export default function WorldMapChart() {
  const svgRef = useRef<SVGSVGElement | null>(null);

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
        
        if (!geoRes.ok) {
          throw new Error(`Erreur HTTP géographie: ${geoRes.status}`);
        }
        if (!gdpRes.ok) {
          throw new Error(`Erreur HTTP PIB: ${gdpRes.status}`);
        }
        if (!mappingRes.ok) {
          throw new Error(`Erreur HTTP mapping: ${mappingRes.status}`);
        }
        
        const topology = await geoRes.json();
        const gdpData: GDPData = await gdpRes.json();
        const nameMapping: {[key: string]: string} = await mappingRes.json();
        
        console.log('Topology chargée:', topology);
        console.log('Données PIB chargées:', gdpData.metadata);
        console.log('Mapping chargé:', Object.keys(nameMapping).length, 'entrées');
        
        // Convertir TopoJSON en GeoJSON
        const countries = topojson.feature(topology, topology.objects.countries) as any;
        console.log('Countries convertis:', countries);
        console.log('Nombre de pays:', countries.features?.length);

        if (!countries.features) {
          throw new Error('Aucune feature trouvée dans les données');
        }

        // Créer une map pour associer noms de pays aux codes ISO
        const nameToCode = new Map<string, string>();
        Object.values(gdpData.countries).forEach(country => {
          nameToCode.set(country.name, country.code);
          nameToCode.set(country.name.toLowerCase(), country.code);
        });

        // Ajouter les mappings personnalisés
        Object.entries(nameMapping).forEach(([geoName, code]) => {
          nameToCode.set(geoName, code);
          nameToCode.set(geoName.toLowerCase(), code);
        });

        // Mapper les données PIB avec les pays géographiques
        const dataMap = new Map<string, number>();
        const countryDataMap = new Map<string, {code: string, gdp: number, year: number}>();
        let matchedCountries = 0;
        
        countries.features.forEach((feature: any) => {
          const geoName = feature.properties?.NAME || feature.properties?.name || 'Unknown';
          const geoId = feature.id;
          
          // Essayer de trouver le PIB par différentes méthodes
          let gdpValue = 0;
          let countryCode = '';
          let year = 0;
          
          // 1. Par mapping personnalisé direct
          if (nameMapping[geoName]) {
            countryCode = nameMapping[geoName];
            if (gdpData.latest_year_data[countryCode]) {
              gdpValue = gdpData.latest_year_data[countryCode].gdp;
              year = gdpData.latest_year_data[countryCode].year;
            }
          }
          // 2. Par ID numérique (souvent code ISO-3 numérique)
          else if (geoId && gdpData.latest_year_data[geoId]) {
            gdpValue = gdpData.latest_year_data[geoId].gdp;
            countryCode = geoId;
            year = gdpData.latest_year_data[geoId].year;
          }
          // 3. Par nom exact
          else if (nameToCode.has(geoName)) {
            countryCode = nameToCode.get(geoName)!;
            if (gdpData.latest_year_data[countryCode]) {
              gdpValue = gdpData.latest_year_data[countryCode].gdp;
              year = gdpData.latest_year_data[countryCode].year;
            }
          }
          // 4. Par nom en minuscule
          else if (nameToCode.has(geoName.toLowerCase())) {
            countryCode = nameToCode.get(geoName.toLowerCase())!;
            if (gdpData.latest_year_data[countryCode]) {
              gdpValue = gdpData.latest_year_data[countryCode].gdp;
              year = gdpData.latest_year_data[countryCode].year;
            }
          }
          // 5. Recherche approximative pour certains cas
          else {
            const normalizedName = geoName.toLowerCase().trim();
            for (const [name, code] of nameToCode.entries()) {
              if (name.toLowerCase().includes(normalizedName) || normalizedName.includes(name.toLowerCase())) {
                if (gdpData.latest_year_data[code]) {
                  gdpValue = gdpData.latest_year_data[code].gdp;
                  countryCode = code;
                  year = gdpData.latest_year_data[code].year;
                  break;
                }
              }
            }
          }
          
          if (gdpValue > 0) {
            matchedCountries++;
            // Stocker le log du PIB pour une meilleure visualisation
            dataMap.set(geoName, Math.log10(gdpValue));
            // Stocker les données du pays pour les tooltips
            countryDataMap.set(geoName, {code: countryCode, gdp: gdpValue, year});
          } else {
            // Valeur par défaut pour les pays sans données
            dataMap.set(geoName, 0);
            console.log(`Pas de données PIB pour: ${geoName} (ID: ${geoId})`);
          }
        });

        console.log(`PIB associé pour ${matchedCountries} pays sur ${countries.features.length}`);

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

          // Créer l'échelle de couleurs basée sur le log du PIB (Rouge vif → Bleu vif)
          const minLogGDP = Math.log10(gdpData.metadata.statistics.min_gdp);
          const maxLogGDP = Math.log10(gdpData.metadata.statistics.max_gdp);
          
          // Échelle de couleurs vives et saturées
          const colorScale = d3.scaleLinear<string>()
            .domain([minLogGDP, maxLogGDP])
            .range(['#FF0000', '#0000FF']) // Rouge vif → Bleu vif
            .interpolate(d3.interpolateHsl);
          
          // Alternative avec des couleurs encore plus éclatantes
          // const colorScale = d3.scaleLinear<string>()
          //   .domain([minLogGDP, maxLogGDP])
          //   .range(['#FF1744', '#2196F3']) // Rouge Material → Bleu Material
          //   .interpolate(d3.interpolateHsl);

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
              const countryName = d.properties?.NAME || d.properties?.name || 'Unknown';
              const logValue = dataMap.get(countryName) || 0;
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
                   PIB complet: $${countryData.gdp.toLocaleString()}` :
                  `<strong>${countryName}</strong><br/>
                   <em>Données PIB non disponibles</em>`);

              tooltip
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
              // Retirer l'effet hover
              d3.select(this)
                .attr('stroke-width', 0.5)
                .attr('stroke', '#ffffff');

              // Supprimer tooltip
              d3.selectAll('.tooltip').remove();
            })
            .on('mousemove', function(event) {
              // Déplacer tooltip
              d3.selectAll('.tooltip')
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 10) + 'px');
            });

          // Ajouter une légende
          const legend = svg.append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${width - 250}, ${height - 120})`);

          // Échelle pour la légende (en milliards de dollars)
          const minGDPBillions = gdpData.metadata.statistics.min_gdp / 1e9;
          const maxGDPBillions = gdpData.metadata.statistics.max_gdp / 1e9;
          const medianGDPBillions = gdpData.metadata.statistics.median_gdp / 1e9;
          
          const legendValues = [
            minGDPBillions,
            gdpData.metadata.statistics.quartiles[0] / 1e9,
            medianGDPBillions,
            gdpData.metadata.statistics.quartiles[2] / 1e9,
            maxGDPBillions
          ];

          const legendScale = d3.scaleLinear()
            .domain([Math.log10(gdpData.metadata.statistics.min_gdp), Math.log10(gdpData.metadata.statistics.max_gdp)])
            .range([0, 200]);

          // Gradient pour la légende
          const defs = svg.append('defs');
          const linearGradient = defs.append('linearGradient')
            .attr('id', 'legend-gradient')
            .attr('x1', '0%')
            .attr('x2', '100%');

          // Créer le gradient avec la même échelle de couleurs
          const gradientStops = d3.range(0, 1.1, 0.1);
          linearGradient.selectAll('stop')
            .data(gradientStops)
            .enter()
            .append('stop')
            .attr('offset', d => d * 100 + '%')
            .attr('stop-color', d => {
              const logValue = minLogGDP + (maxLogGDP - minLogGDP) * d;
              return colorScale(logValue);
            });

          legend.append('rect')
            .attr('width', 200)
            .attr('height', 20)
            .style('fill', 'url(#legend-gradient)')
            .style('stroke', '#333')
            .style('stroke-width', 1);

          // Ajouter des ticks de valeurs
          const tickValues = [minGDPBillions, medianGDPBillions, maxGDPBillions];
          const tickPositions = tickValues.map(val => 
            legendScale(Math.log10(val * 1e9))
          );

          legend.selectAll('.tick-line')
            .data(tickPositions)
            .enter()
            .append('line')
            .attr('class', 'tick-line')
            .attr('x1', d => d)
            .attr('x2', d => d)
            .attr('y1', 20)
            .attr('y2', 25)
            .style('stroke', '#333')
            .style('stroke-width', 1);

          legend.selectAll('.tick-text')
            .data(tickValues)
            .enter()
            .append('text')
            .attr('class', 'tick-text')
            .attr('x', (d, i) => tickPositions[i])
            .attr('y', 38)
            .style('text-anchor', 'middle')
            .style('font-size', '11px')
            .style('fill', '#333')
            .text(d => d >= 1000 ? `${(d/1000).toFixed(0)}T` : d >= 1 ? `${d.toFixed(0)}B` : `${(d*1000).toFixed(0)}M`);

          legend.append('text')
            .attr('x', 100)
            .attr('y', -8)
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#333')
            .text('PIB (USD)');

          legend.append('text')
            .attr('x', 100)
            .attr('y', 55)
            .style('text-anchor', 'middle')
            .style('font-size', '10px')
            .style('fill', '#666')
            .text(`${gdpData.metadata.statistics.total_countries} pays • ${gdpData.metadata.statistics.data_years_range[1]}`);

          console.log('Carte D3.js créée avec succès avec données PIB réelles');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la carte:', error);
      }
    };

    loadMap();
  }, []);

  return (
    <div className="w-full h-[80vh] max-h-[800px] bg-white border border-gray-200 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
        PIB par Pays - Carte Interactive du Monde
      </h2>
      <div className="text-sm text-gray-600 mb-3 text-center">
        Source: Banque mondiale - Données les plus récentes disponibles
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <svg ref={svgRef} className="max-w-full max-h-full"></svg>
      </div>
    </div>
  );
}
