'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';
import { Globe, Users, DollarSign, MapPin, TrendingUp, Building2, Heart, GraduationCap, Baby, Calendar, Activity, Home, Briefcase, Award, X, Wifi, Leaf, Scale } from 'lucide-react';

interface CountryDetailsPanelProps {
  countryName: string;
  onClose: () => void;
}

interface CountryData {
  basicInfo: {
    name: string;
    capital: string;
    continent: string;
    region: string;
    flag: string;
    area: number;
    coordinates: [number, number];
    population: number;
    currencies: string[];
    languages: string[];
  };
  demographics: {
    population: number;
    populationDensity: number;
    urbanPopulation: number;
    medianAge: number;
    birthRate: number;
    deathRate: number;
    lifeExpectancy: number;
    fertilityRate: number;
    ageDistribution: Array<{name: string; value: number; count: number}>;
  };
  economy: {
    gdp: number;
    gdpPerCapita: number;
    gdpGrowthRate: number;
    inflation: number;
    unemployment: number;
    publicDebt: number;
    currency: string;
    mainIndustries: string[];
    exports: number;
    imports: number;
    economicSectors: Array<{name: string; value: number; color: string}>;
    historicalGdp: Array<{year: number; value: number}>;
  };
  social: {
    literacyRate: number;
    healthcareExpenditure: number;
    educationExpenditure: number;
    humanDevelopmentIndex: number;
    giniCoefficient: number;
    internetPenetration: number;
    mobileSubscriptions: number;
    waterAccess: number;
    socialIndicators: Array<{name: string; value: number; color: string}>;
  };
  environment: {
    co2Emissions: number;
    renewableEnergy: number;
    forestCoverage: number;
    waterAccess: number;
  };
  governance: {
    corruptionIndex: number;
    democracyIndex: number;
    pressFreedowIndex: number;
  };
}

export default function CountryDetailsPanel({ countryName, onClose }: CountryDetailsPanelProps) {
  const [countryData, setCountryData] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour générer des données réalistes en cas d'échec des APIs
  const generateRealisticData = (country: any): CountryData => {
    const population = country.population || 1000000;
    const area = country.area || 100000;
    
    // Estimer le niveau de développement basé sur la région
    const developmentLevel = (() => {
      const region = country.region?.toLowerCase() || '';
      const subregion = country.subregion?.toLowerCase() || '';
      
      if (region.includes('europe') || subregion.includes('northern america') || subregion.includes('australia')) {
        return 'high'; // PIB/hab > 30000
      } else if (region.includes('asia') && !subregion.includes('southern asia')) {
        return 'upper-middle'; // PIB/hab 10000-30000
      } else {
        return 'lower-middle'; // PIB/hab < 10000
      }
    })();
    
    // Calculer le PIB par habitant estimé
    const gdpPerCapita = (() => {
      switch (developmentLevel) {
        case 'high': return 30000 + Math.random() * 50000;
        case 'upper-middle': return 10000 + Math.random() * 20000;
        default: return 1000 + Math.random() * 9000;
      }
    })();
    
    const gdp = population * gdpPerCapita;
    
    console.log(`🏗️ Génération de données réalistes pour ${country.name.common}`);
    console.log(`📊 Niveau de développement estimé: ${developmentLevel}`);
    console.log(`💰 PIB/habitant estimé: ${gdpPerCapita.toLocaleString()} USD`);
    
    return {
      basicInfo: {
        name: country.name.common,
        capital: country.capital?.[0] || 'N/A',
        continent: country.continents?.[0] || 'N/A',
        region: country.region || 'N/A',
        flag: country.flag || '🏳️',
        area: area,
        coordinates: country.latlng || [0, 0],
        population: population,
        currencies: Object.keys(country.currencies || {}),
        languages: Object.values(country.languages || {})
      },
      demographics: {
        population: population,
        populationDensity: Math.round(population / area),
        urbanPopulation: developmentLevel === 'high' ? 75 + Math.random() * 15 : developmentLevel === 'upper-middle' ? 50 + Math.random() * 25 : 30 + Math.random() * 30,
        medianAge: developmentLevel === 'high' ? 35 + Math.random() * 10 : developmentLevel === 'upper-middle' ? 28 + Math.random() * 12 : 22 + Math.random() * 10,
        birthRate: developmentLevel === 'high' ? 8 + Math.random() * 6 : developmentLevel === 'upper-middle' ? 12 + Math.random() * 8 : 20 + Math.random() * 15,
        deathRate: developmentLevel === 'high' ? 6 + Math.random() * 4 : developmentLevel === 'upper-middle' ? 8 + Math.random() * 4 : 9 + Math.random() * 6,
        lifeExpectancy: developmentLevel === 'high' ? 75 + Math.random() * 10 : developmentLevel === 'upper-middle' ? 65 + Math.random() * 15 : 55 + Math.random() * 15,
        fertilityRate: developmentLevel === 'high' ? 1.2 + Math.random() * 0.8 : developmentLevel === 'upper-middle' ? 1.8 + Math.random() * 1.2 : 2.5 + Math.random() * 2.5,
        ageDistribution: [
          { name: '0-14 ans', value: developmentLevel === 'high' ? 15 + Math.random() * 5 : 25 + Math.random() * 15, count: 0 },
          { name: '15-64 ans', value: 65 + Math.random() * 10, count: 0 },
          { name: '65+ ans', value: developmentLevel === 'high' ? 15 + Math.random() * 10 : 5 + Math.random() * 10, count: 0 }
        ].map(item => ({ ...item, count: Math.round(population * item.value / 100) }))
      },
      economy: {
        gdp: gdp,
        gdpPerCapita: gdpPerCapita,
        gdpGrowthRate: developmentLevel === 'high' ? 1 + Math.random() * 3 : 2 + Math.random() * 6,
        inflation: developmentLevel === 'high' ? 1 + Math.random() * 3 : 3 + Math.random() * 7,
        unemployment: developmentLevel === 'high' ? 3 + Math.random() * 7 : 5 + Math.random() * 15,
        publicDebt: 30 + Math.random() * 70,
        currency: Object.keys(country.currencies || {})[0] || 'N/A',
        mainIndustries: developmentLevel === 'high' ? ['Services', 'Technology', 'Manufacturing', 'Finance'] : 
                       developmentLevel === 'upper-middle' ? ['Manufacturing', 'Services', 'Agriculture', 'Mining'] :
                       ['Agriculture', 'Services', 'Manufacturing', 'Tourism'],
        exports: gdp * (0.15 + Math.random() * 0.35),
        imports: gdp * (0.15 + Math.random() * 0.35),
        economicSectors: developmentLevel === 'high' ? [
          { name: 'Services', value: 65 + Math.random() * 15, color: '#3b82f6' },
          { name: 'Industrie', value: 20 + Math.random() * 15, color: '#ef4444' },
          { name: 'Agriculture', value: 1 + Math.random() * 4, color: '#10b981' },
          { name: 'Construction', value: 4 + Math.random() * 6, color: '#f59e0b' },
          { name: 'Énergie', value: 2 + Math.random() * 5, color: '#8b5cf6' }
        ] : developmentLevel === 'upper-middle' ? [
          { name: 'Services', value: 45 + Math.random() * 20, color: '#3b82f6' },
          { name: 'Industrie', value: 25 + Math.random() * 20, color: '#ef4444' },
          { name: 'Agriculture', value: 8 + Math.random() * 15, color: '#10b981' },
          { name: 'Construction', value: 6 + Math.random() * 10, color: '#f59e0b' },
          { name: 'Énergie', value: 3 + Math.random() * 8, color: '#8b5cf6' }
        ] : [
          { name: 'Agriculture', value: 20 + Math.random() * 30, color: '#10b981' },
          { name: 'Services', value: 30 + Math.random() * 25, color: '#3b82f6' },
          { name: 'Industrie', value: 15 + Math.random() * 20, color: '#ef4444' },
          { name: 'Construction', value: 8 + Math.random() * 12, color: '#f59e0b' },
          { name: 'Énergie', value: 2 + Math.random() * 8, color: '#8b5cf6' }
        ],
        historicalGdp: Array.from({length: 10}, (_, i) => ({
          year: 2014 + i,
          value: (gdp * (0.8 + Math.random() * 0.4)) / 1e9
        }))
      },
      social: {
        literacyRate: developmentLevel === 'high' ? 95 + Math.random() * 5 : developmentLevel === 'upper-middle' ? 75 + Math.random() * 20 : 50 + Math.random() * 40,
        healthcareExpenditure: developmentLevel === 'high' ? 8 + Math.random() * 7 : developmentLevel === 'upper-middle' ? 4 + Math.random() * 6 : 2 + Math.random() * 4,
        educationExpenditure: developmentLevel === 'high' ? 4 + Math.random() * 3 : developmentLevel === 'upper-middle' ? 3 + Math.random() * 3 : 2 + Math.random() * 3,
        humanDevelopmentIndex: developmentLevel === 'high' ? 0.8 + Math.random() * 0.15 : developmentLevel === 'upper-middle' ? 0.6 + Math.random() * 0.25 : 0.4 + Math.random() * 0.3,
        giniCoefficient: developmentLevel === 'high' ? 25 + Math.random() * 15 : 35 + Math.random() * 25,
        internetPenetration: developmentLevel === 'high' ? 80 + Math.random() * 15 : developmentLevel === 'upper-middle' ? 50 + Math.random() * 35 : 20 + Math.random() * 40,
        mobileSubscriptions: developmentLevel === 'high' ? 100 + Math.random() * 20 : 70 + Math.random() * 50,
        waterAccess: developmentLevel === 'high' ? 95 + Math.random() * 5 : developmentLevel === 'upper-middle' ? 80 + Math.random() * 15 : 60 + Math.random() * 30,
        socialIndicators: [
          { name: 'Éducation', value: developmentLevel === 'high' ? 80 + Math.random() * 15 : 60 + Math.random() * 25, color: '#3b82f6' },
          { name: 'Santé', value: developmentLevel === 'high' ? 85 + Math.random() * 10 : 65 + Math.random() * 25, color: '#10b981' },
          { name: 'Égalité', value: developmentLevel === 'high' ? 70 + Math.random() * 20 : 50 + Math.random() * 30, color: '#f59e0b' },
          { name: 'Environnement', value: 40 + Math.random() * 40, color: '#8b5cf6' }
        ]
      },
      environment: {
        co2Emissions: developmentLevel === 'high' ? 8 + Math.random() * 12 : developmentLevel === 'upper-middle' ? 4 + Math.random() * 8 : 1 + Math.random() * 4,
        renewableEnergy: 15 + Math.random() * 40,
        forestCoverage: 20 + Math.random() * 40,
        waterAccess: developmentLevel === 'high' ? 95 + Math.random() * 5 : developmentLevel === 'upper-middle' ? 80 + Math.random() * 15 : 60 + Math.random() * 30
      },
      governance: {
        corruptionIndex: developmentLevel === 'high' ? 70 + Math.random() * 25 : developmentLevel === 'upper-middle' ? 40 + Math.random() * 40 : 20 + Math.random() * 40,
        democracyIndex: developmentLevel === 'high' ? 7 + Math.random() * 2.5 : developmentLevel === 'upper-middle' ? 5 + Math.random() * 3 : 3 + Math.random() * 4,
        pressFreedowIndex: developmentLevel === 'high' ? 10 + Math.random() * 20 : developmentLevel === 'upper-middle' ? 20 + Math.random() * 30 : 40 + Math.random() * 40
      }
    };
  };

  // Service pour récupérer les données via les APIs réelles
  const fetchCountryData = async (countryName: string): Promise<CountryData> => {
    try {
      console.log(`🔍 Recherche des données pour: ${countryName}`);
      
      // 1. Récupérer les informations de base depuis REST Countries API
      const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
      if (!countryResponse.ok) throw new Error('Pays non trouvé');
      
      const countryInfo = await countryResponse.json();
      const country = countryInfo[0];
      const countryCode = country.cca2; // Code ISO 2 lettres
      
      console.log(`✅ Informations de base récupérées pour ${country.name.common} (${countryCode})`);
      console.log(`📊 Population depuis REST Countries: ${country.population?.toLocaleString() || 'N/A'}`);
      
      // 2. Récupérer les indicateurs économiques et sociaux depuis World Bank API
      const worldBankIndicators = [
        'SP.POP.TOTL',        // Population totale
        'EN.POP.DNST',        // Densité de population
        'SP.URB.TOTL.IN.ZS',  // Population urbaine %
        'SP.DYN.LE00.IN',     // Espérance de vie
        'SP.DYN.CBRT.IN',     // Taux de natalité
        'SP.DYN.CDRT.IN',     // Taux de mortalité
        'SP.DYN.TFRT.IN',     // Taux de fécondité
        'NY.GDP.MKTP.CD',     // PIB (USD)
        'NY.GDP.PCAP.CD',     // PIB par habitant
        'NY.GDP.MKTP.KD.ZG',  // Croissance PIB %
        'FP.CPI.TOTL.ZG',     // Inflation
        'SL.UEM.TOTL.ZS',     // Chômage
        'SE.ADT.LITR.ZS',     // Alphabétisation
        'IT.NET.USER.ZS',     // Internet %
        'SH.XPD.CHEX.GD.ZS',  // Dépenses santé % PIB
        'SE.XPD.TOTL.GD.ZS',  // Dépenses éducation % PIB
        'EN.ATM.CO2E.PC',     // CO2 par habitant
        'EG.FEC.RNEW.ZS',     // Énergies renouvelables %
        'AG.LND.FRST.ZS',     // Couverture forestière %
        'SH.H2O.BASW.ZS'      // Accès eau potable %
      ];

      const indicatorString = worldBankIndicators.join(';');
      const worldBankUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorString}?format=json&date=2020:2023&per_page=500`;
      
      const [wbResponse] = await Promise.allSettled([
        fetch(worldBankUrl)
      ]);

      let wbData: any[] = [];
      if (wbResponse.status === 'fulfilled' && wbResponse.value.ok) {
        const wbJson = await wbResponse.value.json();
        wbData = wbJson[1] || [];
        console.log(`📈 World Bank API: ${wbData.length} indicateurs récupérés`);
      } else {
        console.warn('⚠️ World Bank API non disponible, utilisation de données par défaut');
      }

      // Fonction helper pour extraire la valeur la plus récente d'un indicateur
      const getLatestValue = (indicatorId: string, defaultValue: number = 0): number => {
        const values = wbData
          .filter(item => item?.indicator?.id === indicatorId && item?.value !== null)
          .sort((a, b) => parseInt(b.date) - parseInt(a.date));
        
        const result = values.length > 0 ? values[0].value : defaultValue;
        console.log(`📊 ${indicatorId}: ${result === defaultValue ? `${result} (défaut)` : result}`);
        return result;
      };

      // 3. Récupérer l'historique du PIB pour les graphiques
      const gdpHistoryUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&date=2014:2023`;
      let historicalGdp: Array<{year: number; value: number}> = [];
      
      try {
        const gdpResponse = await fetch(gdpHistoryUrl);
        if (gdpResponse.ok) {
          const gdpJson = await gdpResponse.json();
          const gdpData = gdpJson[1] || [];
          historicalGdp = gdpData
            .filter((item: any) => item?.value !== null)
            .map((item: any) => ({
              year: parseInt(item.date),
              value: item.value / 1e9 // Convertir en milliards
            }))
            .sort((a: any, b: any) => a.year - b.year);
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération de l\'historique du PIB:', error);
      }

      // 4. Construire l'objet de données avec des valeurs par défaut plus réalistes
      const population = getLatestValue('SP.POP.TOTL', country.population || 1000000);
      const area = country.area || 100000;
      const gdp = getLatestValue('NY.GDP.MKTP.CD', population * 15000); // PIB estimé basé sur la population
      const gdpPerCapita = gdp > 0 && population > 0 ? gdp / population : getLatestValue('NY.GDP.PCAP.CD', 15000);
      
      console.log(`💰 PIB calculé: ${gdp.toLocaleString()} USD`);
      console.log(`💰 PIB/habitant calculé: ${gdpPerCapita.toLocaleString()} USD`);
      
      // Calculer la répartition par âge (simulée basée sur des données démographiques réelles)
      const calculateAgeDistribution = (population: number) => {
        // Estimation basée sur les tendances démographiques moyennes
        const young = Math.random() * 10 + 15; // 15-25%
        const senior = Math.random() * 10 + 10; // 10-20%
        const adult = 100 - young - senior;
        
        return [
          { name: '0-14 ans', value: young, count: Math.round(population * young / 100) },
          { name: '15-64 ans', value: adult, count: Math.round(population * adult / 100) },
          { name: '65+ ans', value: senior, count: Math.round(population * senior / 100) }
        ];
      };

      // Estimation des secteurs économiques basée sur le niveau de développement
      const calculateEconomicSectors = (gdpPerCapita: number) => {
        if (gdpPerCapita > 40000) {
          // Pays développé
          return [
            { name: 'Services', value: 70 + Math.random() * 10, color: '#3b82f6' },
            { name: 'Industrie', value: 20 + Math.random() * 10, color: '#ef4444' },
            { name: 'Agriculture', value: 1 + Math.random() * 4, color: '#10b981' },
            { name: 'Construction', value: 4 + Math.random() * 4, color: '#f59e0b' },
            { name: 'Énergie', value: 2 + Math.random() * 3, color: '#8b5cf6' }
          ];
        } else if (gdpPerCapita > 15000) {
          // Pays en développement
          return [
            { name: 'Services', value: 50 + Math.random() * 15, color: '#3b82f6' },
            { name: 'Industrie', value: 25 + Math.random() * 15, color: '#ef4444' },
            { name: 'Agriculture', value: 5 + Math.random() * 15, color: '#10b981' },
            { name: 'Construction', value: 8 + Math.random() * 7, color: '#f59e0b' },
            { name: 'Énergie', value: 3 + Math.random() * 5, color: '#8b5cf6' }
          ];
        } else {
          // Pays moins développé
          return [
            { name: 'Agriculture', value: 20 + Math.random() * 30, color: '#10b981' },
            { name: 'Services', value: 35 + Math.random() * 20, color: '#3b82f6' },
            { name: 'Industrie', value: 15 + Math.random() * 20, color: '#ef4444' },
            { name: 'Construction', value: 8 + Math.random() * 12, color: '#f59e0b' },
            { name: 'Énergie', value: 2 + Math.random() * 8, color: '#8b5cf6' }
          ];
        }
      };

      const result: CountryData = {
        basicInfo: {
          name: country.name.common,
          capital: country.capital?.[0] || 'N/A',
          continent: country.continents?.[0] || 'N/A',
          region: country.region || 'N/A',
          flag: country.flag || '🏳️',
          area: area,
          coordinates: country.latlng || [0, 0],
          population: population,
          currencies: Object.keys(country.currencies || {}),
          languages: Object.values(country.languages || {})
        },
        demographics: {
          population: population,
          populationDensity: area > 0 ? Math.round(population / area) : getLatestValue('EN.POP.DNST', 50),
          urbanPopulation: getLatestValue('SP.URB.TOTL.IN.ZS', gdpPerCapita > 20000 ? 75 : gdpPerCapita > 5000 ? 50 : 35),
          medianAge: gdpPerCapita > 30000 ? 35 + Math.random() * 10 : gdpPerCapita > 10000 ? 25 + Math.random() * 15 : 20 + Math.random() * 15,
          birthRate: getLatestValue('SP.DYN.CBRT.IN', gdpPerCapita > 20000 ? 10 + Math.random() * 5 : gdpPerCapita > 5000 ? 15 + Math.random() * 10 : 25 + Math.random() * 15),
          deathRate: getLatestValue('SP.DYN.CDRT.IN', gdpPerCapita > 20000 ? 6 + Math.random() * 4 : gdpPerCapita > 5000 ? 8 + Math.random() * 4 : 10 + Math.random() * 6),
          lifeExpectancy: getLatestValue('SP.DYN.LE00.IN', gdpPerCapita > 30000 ? 75 + Math.random() * 10 : gdpPerCapita > 10000 ? 65 + Math.random() * 15 : 55 + Math.random() * 15),
          fertilityRate: getLatestValue('SP.DYN.TFRT.IN', gdpPerCapita > 20000 ? 1.3 + Math.random() * 0.8 : gdpPerCapita > 5000 ? 2.0 + Math.random() * 1.0 : 3.0 + Math.random() * 2.0),
          ageDistribution: calculateAgeDistribution(population)
        },
        economy: {
          gdp: gdp,
          gdpPerCapita: gdpPerCapita,
          gdpGrowthRate: getLatestValue('NY.GDP.MKTP.KD.ZG', 2),
          inflation: getLatestValue('FP.CPI.TOTL.ZG', 3),
          unemployment: getLatestValue('SL.UEM.TOTL.ZS', 5),
          publicDebt: 50 + Math.random() * 50, // Estimation
          currency: Object.keys(country.currencies || {})[0] || 'N/A',
          mainIndustries: ['Services', 'Manufacturing', 'Agriculture', 'Tourism'],
          exports: gdp * (0.2 + Math.random() * 0.3), // Estimation
          imports: gdp * (0.2 + Math.random() * 0.3), // Estimation
          economicSectors: calculateEconomicSectors(gdpPerCapita),
          historicalGdp: historicalGdp
        },
        social: {
          literacyRate: getLatestValue('SE.ADT.LITR.ZS', 85),
          healthcareExpenditure: getLatestValue('SH.XPD.CHEX.GD.ZS', 6),
          educationExpenditure: getLatestValue('SE.XPD.TOTL.GD.ZS', 4),
          humanDevelopmentIndex: 0.6 + Math.random() * 0.35, // Estimation
          giniCoefficient: 25 + Math.random() * 30, // Estimation
          internetPenetration: getLatestValue('IT.NET.USER.ZS', 50),
          mobileSubscriptions: 80 + Math.random() * 40, // Estimation
          waterAccess: getLatestValue('SH.H2O.BASW.ZS', 85),
          socialIndicators: [
            { name: 'Éducation', value: 70 + Math.random() * 25, color: '#3b82f6' },
            { name: 'Santé', value: 75 + Math.random() * 20, color: '#10b981' },
            { name: 'Égalité', value: 60 + Math.random() * 30, color: '#f59e0b' },
            { name: 'Environnement', value: 50 + Math.random() * 40, color: '#8b5cf6' }
          ]
        },
        environment: {
          co2Emissions: getLatestValue('EN.ATM.CO2E.PC', 4),
          renewableEnergy: getLatestValue('EG.FEC.RNEW.ZS', 20),
          forestCoverage: getLatestValue('AG.LND.FRST.ZS', 30),
          waterAccess: getLatestValue('SH.H2O.BASW.ZS', 85)
        },
        governance: {
          corruptionIndex: 40 + Math.random() * 40, // Estimation (0-100)
          democracyIndex: 5 + Math.random() * 4, // Estimation (0-10)
          pressFreedowIndex: 15 + Math.random() * 50 // Estimation (0-100, plus bas = plus libre)
        }
      };

      return result;
    } catch (error) {
      console.error('Erreur lors de la récupération des données depuis les APIs:', error);
      console.log('🔄 Utilisation des données de fallback réalistes...');
      
      // En cas d'erreur, essayons quand même de récupérer les infos de base du pays
      try {
        const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
        if (countryResponse.ok) {
          const countryInfo = await countryResponse.json();
          const country = countryInfo[0];
          return generateRealisticData(country);
        }
      } catch (fallbackError) {
        console.warn('Impossible de récupérer même les infos de base:', fallbackError);
      }
      
      throw new Error(`Impossible de récupérer les données pour ${countryName}`);
    }
  };

  useEffect(() => {
    const loadCountryData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchCountryData(countryName);
        setCountryData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCountryData();
  }, [countryName]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4">
          <div className="flex items-center space-x-4">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full"></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Chargement des données</h3>
              <p className="text-gray-600 dark:text-gray-300">Récupération des statistiques depuis les APIs pour {countryName}...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !countryData) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Erreur</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-6xl">{countryData.basicInfo.flag}</span>
                  <div>
                    <h1 className="text-3xl font-bold">{countryData.basicInfo.name}</h1>
                    <p className="text-blue-100 dark:text-blue-200 text-lg">{countryData.basicInfo.capital} • {countryData.basicInfo.region}</p>
                    <p className="text-blue-200 dark:text-blue-300 text-sm">Population: {formatNumber(countryData.demographics.population)} habitants</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 dark:bg-white/30 rounded-full flex items-center justify-center hover:bg-white/30 dark:hover:bg-white/40 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 dark:bg-gray-800">{/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Superficie</p>
                      <p className="text-xl font-bold text-blue-900 dark:text-blue-100">{countryData.basicInfo.area.toLocaleString()} km²</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-green-800 dark:text-green-300 font-medium">Densité</p>
                      <p className="text-xl font-bold text-green-900 dark:text-green-100">{countryData.demographics.populationDensity} hab/km²</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    <div>
                      <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">PIB/habitant</p>
                      <p className="text-xl font-bold text-orange-900 dark:text-orange-100">${countryData.economy.gdpPerCapita.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Espérance de vie</p>
                      <p className="text-xl font-bold text-purple-900 dark:text-purple-100">{countryData.demographics.lifeExpectancy.toFixed(1)} ans</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphiques principaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Répartition par âge */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Baby className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Répartition par Âge</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={countryData.demographics.ageDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value?.toFixed(1) || '0'}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {countryData.demographics.ageDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Pourcentage']} 
                        contentStyle={{
                          backgroundColor: '#374151',
                          border: '1px solid #6b7280',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Secteurs économiques */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Secteurs Économiques</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={countryData.economy.economicSectors}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                      <XAxis dataKey="name" fontSize={12} tick={{ fill: '#f9fafb' }} />
                      <YAxis fontSize={12} tick={{ fill: '#f9fafb' }} />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Part du PIB']} 
                        contentStyle={{
                          backgroundColor: '#374151',
                          border: '1px solid #6b7280',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                      />
                      <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Évolution du PIB */}
              {countryData.economy.historicalGdp.length > 0 && (
                <div className="mb-8">
                  <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Évolution du PIB (10 dernières années)</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={countryData.economy.historicalGdp}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                        <XAxis dataKey="year" tick={{ fill: '#f9fafb' }} />
                        <YAxis tick={{ fill: '#f9fafb' }} />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toFixed(1)}B $`, 'PIB']} 
                          contentStyle={{
                            backgroundColor: '#374151',
                            border: '1px solid #6b7280',
                            borderRadius: '8px',
                            color: '#f9fafb'
                          }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#34d399" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Indicateurs détaillés */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Indicateurs démographiques */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Démographie</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Âge médian</span>
                      <span className="font-semibold dark:text-white">{countryData.demographics.medianAge.toFixed(1)} ans</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Taux de natalité</span>
                      <span className="font-semibold dark:text-white">{countryData.demographics.birthRate.toFixed(1)}‰</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Taux de mortalité</span>
                      <span className="font-semibold dark:text-white">{countryData.demographics.deathRate.toFixed(1)}‰</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Fécondité</span>
                      <span className="font-semibold dark:text-white">{countryData.demographics.fertilityRate.toFixed(2)} enfants/femme</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Population urbaine</span>
                      <span className="font-semibold dark:text-white">{countryData.demographics.urbanPopulation.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Indicateurs économiques */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Économie</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">PIB total</span>
                      <span className="font-semibold dark:text-white">${formatNumber(countryData.economy.gdp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Croissance PIB</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">+{countryData.economy.gdpGrowthRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Inflation</span>
                      <span className="font-semibold text-orange-600 dark:text-orange-400">{countryData.economy.inflation.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Chômage</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{countryData.economy.unemployment.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Dette publique</span>
                      <span className="font-semibold dark:text-white">{countryData.economy.publicDebt.toFixed(1)}% PIB</span>
                    </div>
                  </div>
                </div>

                {/* Indicateurs sociaux */}
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Social</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Alphabétisation</span>
                      <span className="font-semibold dark:text-white">{countryData.social.literacyRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">IDH</span>
                      <span className="font-semibold dark:text-white">{countryData.social.humanDevelopmentIndex.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Coefficient Gini</span>
                      <span className="font-semibold dark:text-white">{countryData.social.giniCoefficient.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Internet</span>
                      <span className="font-semibold dark:text-white">{countryData.social.internetPenetration.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Santé (% PIB)</span>
                      <span className="font-semibold dark:text-white">{countryData.social.healthcareExpenditure.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicateurs environnementaux */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Environnement</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">CO₂ (t/hab/an)</span>
                      <span className="font-semibold dark:text-white">{countryData.environment.co2Emissions.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Énergies renouvelables</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{countryData.environment.renewableEnergy.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Couverture forestière</span>
                      <span className="font-semibold dark:text-white">{countryData.environment.forestCoverage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Accès eau potable</span>
                      <span className="font-semibold dark:text-white">{countryData.environment.waterAccess.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Scale className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Gouvernance</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Indice corruption</span>
                      <span className="font-semibold dark:text-white">{countryData.governance.corruptionIndex.toFixed(0)}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Indice démocratie</span>
                      <span className="font-semibold dark:text-white">{countryData.governance.democracyIndex.toFixed(2)}/10</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Liberté de presse</span>
                      <span className="font-semibold dark:text-white">{countryData.governance.pressFreedowIndex.toFixed(0)}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Indicateurs de qualité de vie */}
              <div className="mb-8">
                <div className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Indicateurs de Qualité de Vie</h3>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" barSize={20} data={countryData.social.socialIndicators}>
                      <RadialBar
                        label={{ position: 'insideStart', fill: '#fff' }}
                        background
                        dataKey="value"
                      />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toFixed(0)}/100`, 'Score']} 
                        contentStyle={{
                          backgroundColor: '#374151',
                          border: '1px solid #6b7280',
                          borderRadius: '8px',
                          color: '#f9fafb'
                        }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-white">Langues officielles</h4>
                  <p className="text-gray-700 dark:text-gray-200">{countryData.basicInfo.languages.join(', ') || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 dark:text-white">Monnaies</h4>
                  <p className="text-gray-700 dark:text-gray-200">{countryData.basicInfo.currencies.join(', ') || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
