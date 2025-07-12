// Script de test simple pour vérifier le fonctionnement des clics sur la carte
// À exécuter dans la console du navigateur

console.log('🧪 Test des fonctionnalités de la carte interactive');

// Test 1: Vérifier que les éléments de la carte sont présents
function testMapElements() {
    const svg = document.querySelector('svg');
    const countries = document.querySelectorAll('.country');
    
    console.log('📍 Éléments de la carte:');
    console.log(`- SVG trouvé: ${svg ? '✅' : '❌'}`);
    console.log(`- Nombre de pays: ${countries.length}`);
    
    if (countries.length === 0) {
        console.warn('⚠️ Aucun pays trouvé sur la carte');
        return false;
    }
    
    return true;
}

// Test 2: Simuler un clic sur un pays
function testCountryClick(countryIndex = 0) {
    const countries = document.querySelectorAll('.country');
    
    if (countries.length === 0) {
        console.error('❌ Aucun pays disponible pour le test');
        return false;
    }
    
    const country = countries[countryIndex];
    console.log('🖱️ Simulation d\'un clic sur un pays...');
    
    // Créer un événement de clic
    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
    
    country.dispatchEvent(clickEvent);
    
    // Vérifier si le panneau s'ouvre
    setTimeout(() => {
        const panel = document.querySelector('[class*="CountryDetailsPanel"]') || 
                     document.querySelector('[class*="fixed"]') ||
                     document.querySelector('[class*="absolute"]');
        
        console.log(`- Panneau ouvert: ${panel ? '✅' : '❌'}`);
        
        if (panel) {
            console.log('✅ Test de clic réussi !');
        } else {
            console.warn('⚠️ Le panneau ne s\'est pas ouvert. Vérifiez la console pour les erreurs.');
        }
    }, 1000);
    
    return true;
}

// Test 3: Vérifier la présence des APIs
function testAPIs() {
    console.log('🌐 Test des APIs:');
    
    // Test REST Countries API
    fetch('https://restcountries.com/v3.1/name/france?fullText=true')
        .then(response => {
            console.log(`- REST Countries API: ${response.ok ? '✅' : '❌'}`);
        })
        .catch(() => {
            console.log('- REST Countries API: ❌ (Erreur de réseau)');
        });
    
    // Test World Bank API
    fetch('https://api.worldbank.org/v2/country/FR/indicator/NY.GDP.MKTP.CD?format=json&date=2020:2023&per_page=5')
        .then(response => {
            console.log(`- World Bank API: ${response.ok ? '✅' : '❌'}`);
        })
        .catch(() => {
            console.log('- World Bank API: ❌ (Erreur de réseau)');
        });
}

// Test 4: Vérifier l'absence de données de marché
function testNoMarketData() {
    console.log('💰 Vérification: Absence de données de marché');
    
    const marketKeywords = ['stock', 'crypto', 'market', 'nasdaq', 'dow', 'sp500', 'bitcoin', 'ethereum'];
    const bodyText = document.body.textContent.toLowerCase();
    
    let marketDataFound = false;
    marketKeywords.forEach(keyword => {
        if (bodyText.includes(keyword)) {
            console.warn(`⚠️ Terme de marché trouvé: "${keyword}"`);
            marketDataFound = true;
        }
    });
    
    if (!marketDataFound) {
        console.log('✅ Aucune donnée de marché trouvée');
    }
    
    return !marketDataFound;
}

// Exécuter tous les tests
function runAllTests() {
    console.log('🚀 Démarrage des tests...\n');
    
    const test1 = testMapElements();
    testNoMarketData();
    testAPIs();
    
    if (test1) {
        setTimeout(() => {
            testCountryClick();
        }, 2000);
    }
    
    console.log('\n📝 Instructions:');
    console.log('1. Cliquez manuellement sur un pays de la carte');
    console.log('2. Vérifiez que le panneau s\'ouvre avec les données du pays');
    console.log('3. Testez différents pays pour vérifier la robustesse');
    console.log('4. Vérifiez que les graphiques s\'affichent correctement');
}

// Démarrer les tests automatiquement
runAllTests();

// Exposer les fonctions pour les tests manuels
window.testFunctions = {
    testMapElements,
    testCountryClick,
    testAPIs,
    testNoMarketData,
    runAllTests
};

console.log('\n🔧 Fonctions de test disponibles:');
console.log('- testFunctions.testMapElements()');
console.log('- testFunctions.testCountryClick(index)');
console.log('- testFunctions.testAPIs()');
console.log('- testFunctions.testNoMarketData()');
console.log('- testFunctions.runAllTests()');
