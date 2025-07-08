#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script pour traiter le fichier CSV de PIB et générer un fichier JSON
pour l'application de carte interactive du monde.
"""

import csv
import json
import statistics

def process_gdp_data():
    """
    Traite le fichier CSV de PIB et génère un fichier JSON
    avec les données de PIB par pays et par année.
    """
    
    # Lecture du fichier CSV
    csv_file = "public/API_NY.GDP.MKTP.CD_DS2_fr_csv_v2_22456.csv"
    
    gdp_data = {}
    all_rows = []
    
    # Lire le CSV ligne par ligne
    with open(csv_file, 'r', encoding='utf-8') as f:
        csv_reader = csv.reader(f)
        
        # Ignorer les 4 premières lignes (métadonnées)
        for _ in range(4):
            next(csv_reader)
        
        # Lire l'en-tête
        headers = next(csv_reader)
        
        # Identifier les colonnes d'années
        year_columns = []
        year_indices = {}
        for i, header in enumerate(headers):
            if header.isdigit() and len(header) == 4:
                year = int(header)
                if 1960 <= year <= 2030:  # Plage raisonnable d'années
                    year_columns.append(year)
                    year_indices[year] = i
        
        years = sorted(year_columns)
        print(f"Années disponibles: {min(years)} - {max(years)}")
        
        # Lire les données
        for row in csv_reader:
            if len(row) >= 4:  # Vérifier qu'on a au moins les colonnes de base
                country_name = row[0].strip('"')
                country_code = row[1].strip('"')
                
                # Filtrer les pays individuels (codes ISO-3 de 3 lettres)
                if len(country_code) == 3 and country_code.isalpha():
                    all_rows.append((country_name, country_code, row))
    
    print(f"Nombre de pays trouvés: {len(all_rows)}")
    
    # Traitement pour chaque pays
    for country_name, country_code, row in all_rows:
        # Créer l'entrée pour ce pays
        country_data = {
            'name': country_name,
            'code': country_code,
            'gdp_by_year': {}
        }
        
        # Traitement des données de PIB par année
        for year in years:
            if year in year_indices:
                index = year_indices[year]
                if index < len(row):
                    gdp_value = row[index].strip('"').strip()
                    
                    # Vérifier si la valeur n'est pas vide
                    if gdp_value and gdp_value != '':
                        try:
                            # Convertir en float et nettoyer les valeurs
                            gdp_float = float(gdp_value)
                            if gdp_float > 0:  # Garder seulement les valeurs positives
                                country_data['gdp_by_year'][year] = int(gdp_float)
                        except (ValueError, TypeError):
                            # Ignorer les valeurs non numériques
                            pass
        
        # Ajouter le pays seulement s'il a des données de PIB
        if country_data['gdp_by_year']:
            gdp_data[country_code] = country_data
    
    # Calculer quelques statistiques pour la légende de la carte
    all_gdp_values = []
    latest_year_data = {}
    
    for country_code, country_data in gdp_data.items():
        gdp_years = country_data['gdp_by_year']
        if gdp_years:
            # Récupérer la valeur la plus récente disponible
            latest_year = max(gdp_years.keys())
            latest_gdp = gdp_years[latest_year]
            all_gdp_values.append(latest_gdp)
            latest_year_data[country_code] = {
                'name': country_data['name'],
                'year': latest_year,
                'gdp': latest_gdp
            }
    
    # Statistiques pour l'échelle de couleurs
    if all_gdp_values:
        all_gdp_values.sort()
        n = len(all_gdp_values)
        
        def percentile(data, p):
            """Calcule le percentile p des données"""
            k = (n - 1) * p / 100
            f = int(k)
            c = k - f
            if f == n - 1:
                return data[f]
            return data[f] * (1 - c) + data[f + 1] * c
        
        stats = {
            'min_gdp': int(min(all_gdp_values)),
            'max_gdp': int(max(all_gdp_values)),
            'median_gdp': int(statistics.median(all_gdp_values)),
            'quartiles': [
                int(percentile(all_gdp_values, 25)),
                int(percentile(all_gdp_values, 50)),
                int(percentile(all_gdp_values, 75))
            ],
            'total_countries': len(all_gdp_values),
            'data_years_range': [min(years), max(years)]
        }
    else:
        stats = {}
    
    # Structure finale du JSON
    final_data = {
        'metadata': {
            'description': 'Données de PIB par pays (PIB en USD courants)',
            'source': 'Banque mondiale - Indicateurs du développement dans le monde',
            'indicator': 'NY.GDP.MKTP.CD',
            'last_updated': '2025-07-01',
            'statistics': stats
        },
        'countries': gdp_data,
        'latest_year_data': latest_year_data
    }
    
    # Sauvegarder le fichier JSON
    output_file = "public/gdp_by_country.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    
    print(f"\nFichier JSON généré: {output_file}")
    print(f"Nombre de pays avec données PIB: {len(gdp_data)}")
    print(f"Années de données: {min(years)} - {max(years)}")
    
    if stats:
        print(f"PIB minimum: ${stats['min_gdp']:,}")
        print(f"PIB maximum: ${stats['max_gdp']:,}")
        print(f"PIB médian: ${stats['median_gdp']:,}")
    
    # Afficher quelques exemples
    print("\nExemples de pays:")
    for i, (code, data) in enumerate(latest_year_data.items()):
        if i < 5:  # Afficher les 5 premiers
            print(f"  {data['name']} ({code}): ${data['gdp']:,} ({data['year']})")
    
    return final_data

if __name__ == "__main__":
    result = process_gdp_data()
