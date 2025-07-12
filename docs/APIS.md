# APIs Utilisées pour les Statistiques des Pays

Ce document répertorie toutes les APIs intégrées dans l'application pour récupérer des données réelles sur les pays.

## 📊 APIs Principales

### 1. **REST Countries API**
- **URL**: `https://restcountries.com/v3.1/`
- **Documentation**: https://restcountries.com/
- **Usage**: Informations de base des pays
- **Gratuit**: ✅ Oui
- **Rate Limit**: Aucun
- **Données fournies**:
  - Nom du pays, capitale, région
  - Population, superficie
  - Langues, monnaies
  - Drapeau, coordonnées
  - Frontières, codes ISO

### 2. **World Bank API**
- **URL**: `https://api.worldbank.org/v2/`
- **Documentation**: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- **Usage**: Indicateurs économiques et sociaux
- **Gratuit**: ✅ Oui
- **Rate Limit**: 120 requêtes/minute
- **Données fournies**:
  - PIB, PIB par habitant
  - Taux de croissance économique
  - Espérance de vie
  - Taux d'alphabétisation
  - Accès à internet
  - Émissions CO₂
  - Dépenses santé/éducation

### 3. **UN Data API**
- **URL**: `https://unstats.un.org/SDGAPI/`
- **Documentation**: https://unstats.un.org/SDGAPI/swagger/
- **Usage**: Objectifs de Développement Durable (ODD)
- **Gratuit**: ✅ Oui
- **Rate Limit**: Modéré
- **Données fournies**:
  - Indicateurs de développement durable
  - Statistiques démographiques
  - Indicateurs sociaux

### 4. **OECD API**
- **URL**: `https://stats.oecd.org/SDMX-JSON/`
- **Documentation**: https://data.oecd.org/api/
- **Usage**: Statistiques économiques détaillées
- **Gratuit**: ✅ Oui
- **Rate Limit**: Modéré
- **Données fournies**:
  - Taux de chômage
  - Inflation
  - Dette publique
  - Commerce international

## 📈 Indicateurs Récupérés

### Démographiques
- **Population totale** (World Bank: SP.POP.TOTL)
- **Densité de population** (World Bank: EN.POP.DNST)
- **Population urbaine %** (World Bank: SP.URB.TOTL.IN.ZS)
- **Âge médian** (World Bank: SP.POP.AG00.MA.IN)
- **Taux de natalité** (World Bank: SP.DYN.CBRT.IN)
- **Taux de mortalité** (World Bank: SP.DYN.CDRT.IN)
- **Espérance de vie** (World Bank: SP.DYN.LE00.IN)
- **Taux de fécondité** (World Bank: SP.DYN.TFRT.IN)

### Économiques
- **PIB (USD courant)** (World Bank: NY.GDP.MKTP.CD)
- **PIB par habitant** (World Bank: NY.GDP.PCAP.CD)
- **Croissance du PIB %** (World Bank: NY.GDP.MKTP.KD.ZG)
- **Inflation** (World Bank: FP.CPI.TOTL.ZG)
- **Taux de chômage** (World Bank: SL.UEM.TOTL.ZS)
- **Dette publique % PIB** (World Bank: GC.DOD.TOTL.GD.ZS)
- **Exportations** (World Bank: NE.EXP.GNFS.CD)
- **Importations** (World Bank: NE.IMP.GNFS.CD)

### Sociaux
- **Taux d'alphabétisation** (World Bank: SE.ADT.LITR.ZS)
- **Indice de développement humain** (UNDP HDR API)
- **Accès à internet %** (World Bank: IT.NET.USER.ZS)
- **Dépenses santé % PIB** (World Bank: SH.XPD.CHEX.GD.ZS)
- **Dépenses éducation % PIB** (World Bank: SE.XPD.TOTL.GD.ZS)
- **Accès à l'eau potable %** (World Bank: SH.H2O.BASW.ZS)

### Environnementaux
- **Émissions CO₂ (tonnes/hab)** (World Bank: EN.ATM.CO2E.PC)
- **Énergies renouvelables %** (World Bank: EG.FEC.RNEW.ZS)
- **Couverture forestière %** (World Bank: AG.LND.FRST.ZS)

### Gouvernance
- **Indice de corruption** (Transparency International via API)
- **Indice de démocratie** (Freedom House via API)

## 🔄 Gestion des APIs

### Stratégie de Fallback
1. **Données primaires**: APIs en temps réel
2. **Cache local**: Stockage temporaire (24h)
3. **Données de secours**: Valeurs par défaut si API indisponible

### Gestion des Erreurs
- Timeout: 10 secondes par requête
- Retry: 2 tentatives avec délai exponentiel
- Fallback vers données simulées si échec

### Performance
- **Mise en cache**: 24 heures pour données statiques
- **Batch requests**: Regroupement des indicateurs
- **Lazy loading**: Chargement progressif des graphiques

## 📝 Notes d'Implémentation

### Format des Réponses World Bank
```json
[
  {
    "indicator": {"id": "SP.POP.TOTL", "value": "Population, total"},
    "country": {"id": "FR", "value": "France"},
    "countryiso3code": "FRA",
    "date": "2023",
    "value": 67810000,
    "unit": "",
    "obs_status": "",
    "decimal": 0
  }
]
```

### Codes ISO Utilisés
- **Alpha-2**: FR, DE, ES, US, etc.
- **Alpha-3**: FRA, DEU, ESP, USA, etc.
- **Numérique**: 250, 276, 724, 840, etc.

### Limitations Connues
- Certaines données peuvent être manquantes pour certains pays
- Les données les plus récentes peuvent avoir 1-2 ans de retard
- Quelques indicateurs ne sont pas disponibles pour tous les pays

## 🔐 Authentification
- **World Bank**: Aucune clé API requise
- **REST Countries**: Aucune clé API requise
- **UN Data**: Aucune clé API requise
- **OECD**: Aucune clé API requise

## 📊 Exemples d'URL

```bash
# Population de la France
https://api.worldbank.org/v2/country/FR/indicator/SP.POP.TOTL?format=json&date=2023

# PIB par habitant de l'Allemagne
https://api.worldbank.org/v2/country/DE/indicator/NY.GDP.PCAP.CD?format=json&date=2023

# Informations de base de l'Espagne
https://restcountries.com/v3.1/alpha/ES

# Multiples indicateurs pour la France
https://api.worldbank.org/v2/country/FR/indicator/SP.POP.TOTL;NY.GDP.MKTP.CD;SP.DYN.LE00.IN?format=json&date=2023
```

---

*Dernière mise à jour: ${new Date().toLocaleDateString('fr-FR')}*
