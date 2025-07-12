// Script de test pour valider les APIs intégrées
// Exécuter dans la console du navigateur ou avec Node.js

async function testCountryData(countryName) {
  console.log(`🔍 Test des données pour: ${countryName}`);
  console.log('=' .repeat(50));

  try {
    // 1. Test REST Countries API
    console.log('📍 Test REST Countries API...');
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
    
    if (!countryResponse.ok) {
      throw new Error(`REST Countries API error: ${countryResponse.status}`);
    }
    
    const countryInfo = await countryResponse.json();
    const country = countryInfo[0];
    const countryCode = country.cca2;
    
    console.log('✅ REST Countries API:', {
      name: country.name.common,
      capital: country.capital?.[0],
      region: country.region,
      population: country.population,
      area: country.area,
      flag: country.flag
    });

    // 2. Test World Bank API - Indicateurs multiples
    console.log('🏦 Test World Bank API...');
    const worldBankIndicators = [
      'SP.POP.TOTL',        // Population
      'NY.GDP.MKTP.CD',     // PIB
      'SP.DYN.LE00.IN',     // Espérance de vie
      'IT.NET.USER.ZS',     // Internet %
      'EN.ATM.CO2E.PC'      // CO2 par habitant
    ];

    const indicatorString = worldBankIndicators.join(';');
    const worldBankUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicatorString}?format=json&date=2020:2023&per_page=100`;
    
    const wbResponse = await fetch(worldBankUrl);
    if (wbResponse.ok) {
      const wbJson = await wbResponse.json();
      const wbData = wbJson[1] || [];
      
      // Organiser les données par indicateur
      const indicators = {};
      wbData.forEach(item => {
        if (item && item.value !== null) {
          const indicatorId = item.indicator.id;
          if (!indicators[indicatorId] || parseInt(item.date) > parseInt(indicators[indicatorId].date)) {
            indicators[indicatorId] = {
              value: item.value,
              date: item.date,
              name: item.indicator.value
            };
          }
        }
      });

      console.log('✅ World Bank API:', indicators);
    } else {
      console.log('⚠️ World Bank API non disponible');
    }

    // 3. Test historique PIB
    console.log('📈 Test historique PIB...');
    const gdpHistoryUrl = `https://api.worldbank.org/v2/country/${countryCode}/indicator/NY.GDP.MKTP.CD?format=json&date=2019:2023`;
    
    const gdpResponse = await fetch(gdpHistoryUrl);
    if (gdpResponse.ok) {
      const gdpJson = await gdpResponse.json();
      const gdpData = gdpJson[1] || [];
      const historicalGdp = gdpData
        .filter(item => item?.value !== null)
        .map(item => ({
          year: parseInt(item.date),
          value: (item.value / 1e9).toFixed(1) + 'B USD'
        }))
        .sort((a, b) => a.year - b.year);
      
      console.log('✅ Historique PIB:', historicalGdp);
    } else {
      console.log('⚠️ Historique PIB non disponible');
    }

    console.log('✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }

  console.log('\n');
}

// Tests pour différents pays
async function runAllTests() {
  const countries = ['France', 'Germany', 'Japan', 'Brazil', 'Canada'];
  
  for (const country of countries) {
    await testCountryData(country);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Pause entre les requêtes
  }
}

// Test d'un pays spécifique
// testCountryData('France');

// Test de plusieurs pays
// runAllTests();

console.log('🚀 Script de test chargé!');
console.log('Utilisez: testCountryData("NomDuPays") pour tester un pays');
console.log('Utilisez: runAllTests() pour tester plusieurs pays');
