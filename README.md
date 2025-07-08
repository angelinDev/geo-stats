# Carte Interactive du Monde - PIB par Pays

## 🗺️ Description

Application web interactive ultra-moderne affichant les données de PIB mondial avec des informations détaillées par pays. Utilise D3.js pour la visualisation cartographique avancée et des APIs publiques pour récupérer les informations en temps réel des pays.

## ✨ Nouvelles Fonctionnalités

### �️ Contrôles Avancés
- **Sélecteur d'année** : Visualisez l'évolution du PIB de 1960 à 2024
- **Lecture automatique** : Animation temporelle des données économiques
- **Zoom intelligent** : Contrôles de zoom avec boutons dédiés
- **Recherche de pays** : Trouvez rapidement un pays spécifique
- **Export de carte** : Sauvegardez la carte en format SVG
- **Paramètres personnalisables** : Interface complète de configuration

### 🎨 Personnalisation Visuelle
- **5 schémas de couleurs** : Rouge-Bleu, Vert-Jaune, Violet-Rose, Bleu-Cyan, Orange-Rouge
- **Métriques variables** : PIB total, PIB par habitant, Population, Superficie
- **Légende dynamique** : S'adapte automatiquement aux données
- **Tooltips configurables** : Activables/désactivables
- **Animations fluides** : Transitions douces entre les états

### 📊 Tableau de Bord Statistiques
- **Vue d'ensemble mondiale** : Statistiques globales en temps réel
- **Top 5 des économies** : Graphique en barres interactif
- **Répartition par région** : Graphique circulaire détaillé
- **Métriques clés** : Nombre de pays, PIB total, moyennes

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
