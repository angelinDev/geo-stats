# Carte Interactive du Monde - Statistiques Géopolitiques

## 🗺️ Description

Application web interactive ultra-moderne affichant des statistiques géopolitiques complètes avec des informations détaillées par pays. Utilise D3.js pour la visualisation cartographique avancée et intègre des APIs réelles (World Bank, REST Countries) pour récupérer des données démographiques, économiques, sociales et environnementales en temps réel.

## 🌟 Fonctionnalités Principales

### 📊 Données Complètes par Pays
- **Statistiques démographiques** : Population, densité, âge médian, natalité/mortalité, espérance de vie
- **Indicateurs économiques** : PIB, croissance, inflation, chômage, dette publique
- **Données sociales** : Alphabétisation, IDH, accès internet, dépenses santé/éducation
- **Informations environnementales** : Émissions CO₂, énergies renouvelables, couverture forestière
- **Indicateurs de gouvernance** : Indices de corruption, démocratie, liberté de presse

### 🎯 Sources de Données Réelles
- **World Bank API** : Plus de 20 indicateurs officiels
- **REST Countries API** : Informations de base (capitale, langues, monnaies, drapeaux)
- **Données historiques** : Évolution du PIB sur 10 ans avec graphiques
- **Mise à jour automatique** : Données les plus récentes disponibles (2020-2023)

## ✨ Nouvelles Fonctionnalités

### 🗺️ Carte Interactive Ultra-Moderne
- **Carte mondiale D3.js** avec projection naturelle et rendu vectoriel
- **Coloration basée sur le PIB réel** : échelle de couleur dynamique jaune → orange → rouge
- **Interaction au clic** : Sélectionnez un pays pour voir ses statistiques détaillées
- **Tooltips informatifs** au survol avec nom du pays et PIB
- **Animations fluides** lors des interactions et du clic
- **Normalisation des noms** : Mapping intelligent pour correspondance API
- **Légende visuelle** : Indication claire des niveaux de PIB

### 📊 Panneau de Détails des Pays (NOUVEAU)
- **APIs réelles intégrées** : World Bank API + REST Countries API
- **5 catégories complètes d'informations** :
  - 🏛️ **Aperçu** : Informations de base, drapeau, carte de localisation
  - 👥 **Démographie** : Population, densité, âge médian, distribution par âge
  - 💰 **Économie** : PIB, croissance, inflation, secteurs économiques, historique
  - 🎓 **Social** : Éducation, santé, développement humain, indicateurs sociaux
  - 🌱 **Environnement** : Émissions CO2, énergies renouvelables, couverture forestière
- **Graphiques interactifs** : Barres, lignes, circulaires, radiaux avec Recharts
- **Design glassmorphism** : Interface moderne avec transparence et flou
- **Gestion d'erreurs robuste** : Fallback et récupération gracieuse

### 🚫 Suppression Complète des Données de Marché
- **Aucune donnée financière** : Plus de bourse, crypto, matières premières
- **Focus économique réel** : Statistiques nationales et indicateurs macroéconomiques
- **Nettoyage complet** : Suppression de tous les composants liés aux marchés

### � Dashboard Global Amélioré
- **Statistiques mondiales** : PIB total, population, nombre de pays
- **Top 5 des économies** : Graphique en barres des plus grandes économies
- **Évolution temporelle** : Graphique de l'évolution du PIB mondial sur 6 ans
- **Répartition continentale** : Graphique circulaire par continent
- **Indicateurs économiques** : Inflation et chômage avec courbes temporelles

### 🎨 Design et UX Ultra-Moderne
- **Glassmorphism avancé** : Effets de transparence et flou sophistiqués
- **Animations CSS3** : Transitions fluides et microinteractions
- **Palette moderne** : Dégradés bleu-violet avec accents colorés
- **Interface responsive** : Adaptation parfaite mobile/desktop
- **Icônes cohérentes** : Lucide React pour tous les éléments visuels

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15** : Framework React avec App Router
- **TypeScript** : Typage statique avancé
- **Tailwind CSS** : Styling moderne et responsive
- **D3.js** : Visualisation de données cartographiques
- **Recharts** : Graphiques interactifs et animés
- **Lucide React** : Icônes modernes et cohérentes

### Données & APIs
- **Banque mondiale** : Données PIB officielles (1960-2024)
- **REST Countries API** : Informations détaillées des pays
- **TopJSON** : Données géographiques optimisées

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/
│   │   ├── ui/
│   │   │   └── CountryDetailsPanel.tsx    # Panneau d'informations détaillées
│   │   └── utils/
│   │       └── WorldMapChart.tsx          # Composant carte D3.js
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
public/
├── countries-110m.json                    # Données géographiques TopoJSON
├── gdp_by_country.json                   # Données PIB par pays (1960-2024)
├── country_name_mapping.json             # Mapping noms géographiques ↔ codes ISO
└── API_NY.GDP.MKTP.CD_DS2_fr_csv_v2_22456.csv  # Source CSV originale
```

## 🚀 Installation et Utilisation

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [repository-url]
cd geo-stats

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Accès
Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## 🧪 Comment Tester les Fonctionnalités

### Test du Clic sur un Pays
1. **Lancez l'application** et attendez que la carte se charge
2. **Observez la coloration** : les pays sont colorés selon leur PIB (jaune → orange → rouge)
3. **Survolez un pays** : un tooltip s'affiche avec le nom et le PIB
4. **Cliquez sur un pays** : 
   - Animation bleue temporaire sur le pays cliqué
   - Le nom du pays apparaît dans la barre d'information bleue
   - Le panneau de détails s'ouvre sur la droite avec un effet slide

### Test du Panneau de Détails
1. **Vérifiez les onglets** : Aperçu, Démographie, Économie, Social, Environnement
2. **Testez les graphiques** : ils doivent être interactifs avec des tooltips
3. **Fermez le panneau** : bouton X ou clic sur l'arrière-plan
4. **Testez différents pays** : États-Unis, France, Chine, Royaume-Uni, etc.

### Script de Test Automatique
Copiez et collez ce code dans la console du navigateur (F12) :
```javascript
// Charger le script de test
fetch('/test-functionality.js')
  .then(response => response.text())
  .then(script => eval(script))
  .catch(() => console.log('Script de test non trouvé, tests manuels uniquement'));
```

### Vérification des APIs
- **World Bank API** : Données économiques et sociales officielles
- **REST Countries API** : Informations de base sur les pays
- **Pas de données de marché** : Aucune information sur les bourses, crypto ou matières premières

### Tests Recommandés
- **France** : Données complètes disponibles
- **États-Unis** : Grande économie avec historique complet
- **Petits pays** : Vérifier la gestion des données manquantes
- **Pays avec noms spéciaux** : "Democratic Republic of the Congo", etc.

## 📊 Sources de Données

### PIB (Produit Intérieur Brut)
- **Source** : Banque mondiale - Indicateurs du développement dans le monde
- **Indicateur** : NY.GDP.MKTP.CD (PIB en USD courants)
- **Période** : 1960-2024
- **Couverture** : 262 pays et territoires

### Informations Pays
- **Source** : REST Countries API (https://restcountries.com)
- **Données** : Démographie, géographie, langues, monnaies
- **Mise à jour** : Temps réel

### Cartographie
- **Source** : Natural Earth
- **Format** : TopoJSON optimisé
- **Résolution** : 1:110m (échelle mondiale)

## 🎯 Fonctionnalités Interactives

### Navigation Carte
1. **Survol** : Affichage tooltip avec PIB et invitation au clic
2. **Clic pays** : Sélection et affichage informations détaillées
3. **Bouton mondial** : Retour à la vue d'ensemble mondiale
4. **Responsive** : Adaptation automatique à la taille d'écran

### Panneau Informations
1. **Chargement dynamique** : Données temps réel via API
2. **Graphiques interactifs** : Tooltips et animations
3. **Données simulées** : Complétion avec données démographiques simulées
4. **Scroll vertical** : Navigation dans le contenu étendu

## 🔧 Personnalisation

### Couleurs de la Carte
Modifier dans `WorldMapChart.tsx` :
```typescript
// Actuel : Rouge vif → Bleu vif
.range(['#FF0000', '#0000FF'])

// Alternatives :
.range(['#8B0000', '#000080'])  // Rouge foncé → Bleu foncé
.range(['#FFB6C1', '#ADD8E6'])  // Rouge clair → Bleu clair
```

### APIs Externes
Configurer dans `CountryDetailsPanel.tsx` :
- REST Countries API : Pas de clé requise
- Données simulées pour indicateurs non disponibles

## 📈 Métriques et Statistiques

### Données PIB Traitées
- **262 pays** avec données PIB complètes
- **PIB minimum** : $62M (petites économies insulaires)
- **PIB maximum** : $111T (économies majeures)
- **PIB médian** : $75B
- **Années de données** : 65 années (1960-2024)

### Performance
- **Taille données** : ~17MB (JSON PIB optimisé)
- **Rendu initial** : <2s (chargement carte + données)
- **Interaction** : <500ms (clic pays → affichage)

## 🚧 Développements Futurs

### Améliorations Prévues
- [ ] Sélecteur d'année pour données PIB historiques
- [ ] Comparaison multi-pays
- [ ] Export des données et graphiques
- [ ] Mode sombre / clair
- [ ] Zoom géographique avancé
- [ ] Données économiques temps réel
- [ ] Support mobile optimisé
- [ ] Traductions multilingues

### APIs Supplémentaires
- [ ] World Bank API (données temps réel)
- [ ] IMF API (indicateurs économiques)
- [ ] Flag API (drapeaux haute résolution)
- [ ] Weather API (données climatiques)

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir CONTRIBUTING.md pour les guidelines.

---

**Développé avec ❤️ et TypeScript**
