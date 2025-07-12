# Test des APIs Intégrées

Ce fichier permet de tester les APIs intégrées dans l'application.

## URLs de Test

### REST Countries API
```bash
# Test pour la France
curl "https://restcountries.com/v3.1/name/France?fullText=true"

# Test pour l'Allemagne
curl "https://restcountries.com/v3.1/name/Germany?fullText=true"

# Test pour l'Espagne
curl "https://restcountries.com/v3.1/name/Spain?fullText=true"
```

### World Bank API
```bash
# PIB de la France
curl "https://api.worldbank.org/v2/country/FR/indicator/NY.GDP.MKTP.CD?format=json&date=2023"

# Population de l'Allemagne
curl "https://api.worldbank.org/v2/country/DE/indicator/SP.POP.TOTL?format=json&date=2023"

# Espérance de vie en Espagne
curl "https://api.worldbank.org/v2/country/ES/indicator/SP.DYN.LE00.IN?format=json&date=2023"

# Multiples indicateurs pour la France
curl "https://api.worldbank.org/v2/country/FR/indicator/SP.POP.TOTL;NY.GDP.MKTP.CD;SP.DYN.LE00.IN?format=json&date=2020:2023&per_page=100"
```

## Tests de Fonctionnalité

### 1. Test des Pays Disponibles
- ✅ France
- ✅ Allemagne  
- ✅ Espagne
- ✅ États-Unis (United States)
- ✅ Canada
- ✅ Japon (Japan)
- ✅ Brésil (Brazil)
- ✅ Inde (India)
- ✅ Chine (China)
- ✅ Royaume-Uni (United Kingdom)

### 2. Données Récupérées

#### Informations de Base (REST Countries)
- [x] Nom du pays
- [x] Capitale
- [x] Région/Continent  
- [x] Drapeau
- [x] Superficie
- [x] Coordonnées
- [x] Langues
- [x] Monnaies

#### Données Démographiques (World Bank)
- [x] Population totale
- [x] Densité de population
- [x] Population urbaine %
- [x] Espérance de vie
- [x] Taux de natalité
- [x] Taux de mortalité
- [x] Taux de fécondité

#### Données Économiques (World Bank)
- [x] PIB total
- [x] PIB par habitant
- [x] Croissance du PIB
- [x] Inflation
- [x] Taux de chômage
- [x] Historique du PIB (graphique)

#### Données Sociales (World Bank)
- [x] Taux d'alphabétisation
- [x] Dépenses santé % PIB
- [x] Dépenses éducation % PIB  
- [x] Pénétration internet

#### Données Environnementales (World Bank)
- [x] Émissions CO₂ par habitant
- [x] Énergies renouvelables %
- [x] Couverture forestière %
- [x] Accès eau potable %

### 3. Gestion des Erreurs

#### Cas de Test
1. **Pays inexistant** : "PaysInexistant"
   - Résultat attendu : Message d'erreur "Pays non trouvé"

2. **API indisponible** : Simulation de timeout
   - Résultat attendu : Utilisation des données de fallback

3. **Données manquantes** : Pays avec données partielles
   - Résultat attendu : Valeurs par défaut utilisées

### 4. Performance

#### Temps de Chargement Cibles
- REST Countries API : < 1 seconde
- World Bank API : < 3 secondes  
- Affichage complet : < 5 secondes

#### Optimisations Implémentées
- Requêtes parallèles avec Promise.allSettled
- Timeout de 10 secondes par requête
- Fallback vers données par défaut
- Mise en cache des résultats (24h)

## Instructions de Test

### Test Manuel dans l'Application
1. Ouvrir http://localhost:3001
2. Cliquer sur différents pays sur la carte
3. Vérifier que les données se chargent correctement
4. Tester avec des pays de différents niveaux de développement

### Test des APIs en Direct
```javascript
// Test dans la console du navigateur
async function testCountryAPI(countryName) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    const data = await response.json();
    console.log('REST Countries:', data[0]);
    
    const wbResponse = await fetch(`https://api.worldbank.org/v2/country/${data[0].cca2}/indicator/SP.POP.TOTL?format=json&date=2023`);
    const wbData = await wbResponse.json();
    console.log('World Bank:', wbData);
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exemples d'utilisation
testCountryAPI('France');
testCountryAPI('Germany');
testCountryAPI('Japan');
```

## Status des APIs

### ✅ APIs Opérationnelles
- **REST Countries** : https://restcountries.com/ 
- **World Bank** : https://api.worldbank.org/

### ⚠️ APIs en Attente d'Intégration
- **UN Data** : Pour les objectifs de développement durable
- **OECD** : Pour des données économiques détaillées
- **Transparency International** : Pour l'indice de corruption

## Améliorations Futures

### Prochaines Étapes
1. Intégrer plus d'APIs pour des données plus complètes
2. Ajouter un système de cache Redis pour améliorer les performances  
3. Implémenter la géolocalisation pour détecter le pays de l'utilisateur
4. Ajouter des comparaisons entre pays
5. Créer des alertes pour les données obsolètes

### Fonctionnalités Avancées
- Recherche de pays par nom
- Filtres par région/continent
- Graphiques comparatifs entre pays
- Export des données en PDF/Excel
- Mode hors ligne avec cache local

---

*Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}*
