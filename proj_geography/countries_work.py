"""Country data management utilities.

This module provides functions for reading, adding, and deleting country data
from a CSV database. It handles all low-level file operations and data
transformations for country information.
"""
import csv
import json

def get_countries_for_tables():
    """Organize country data by continent for table display.
    
    Reads the country data from CSV and structures it as a dictionary
    where keys are continent names and values are lists of country dictionaries.
    
    Returns:
        A dictionary mapping continents to lists of country data.
    """
    result = {}
    with open('./data/countries.csv', mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            continent = row['continent']
            country_data = {
                'country': row['country'],
                'capital': row['capital']
            }
            if continent not in result:
                result[continent] = []
            result[continent].append(country_data)
    return result

def get_all_countries():
    """Get all country data as a JSON string.
    
    Reads all country records from the CSV and returns them as a JSON string
    with Unicode character preservation.
    
    Returns:
        JSON string containing all country data.
    """
    countries = []
    with open('./data/countries.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            countries.append(row)
    result = json.dumps(countries, ensure_ascii=False)
    return result

def add_country_to_csv(country_data):
    """Add a new country to the database.
    
    Args:
        country_data: Dictionary containing:
            - 'country': Name of the country
            - 'capital': Name of the capital
            - 'continent': Name of the continent
    
    Returns:
        Dictionary with operation status:
        - 'success': Boolean indicating operation status
        - 'error': String with error message (if success=False)
    """
    with open('./data/countries.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            if (row['country'] == country_data['country'] and
                row['continent'] == country_data['continent']):
                return {'success': False, 'error': 'Страна уже существует в этом континенте'}
    with open('./data/countries.csv', 'a', encoding='utf-8', newline='') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerow([   country_data['country'],
                            country_data['capital'],
                            country_data['continent']])
    return {'success': True}

def delete_country_from_csv(country_data):
    """Delete a country from the database.
    
    Args:
        country_data: Dictionary containing:
            - 'country': Name of the country to delete
            - 'continent': Continent the country belongs to
    
    Returns:
        Dictionary with operation status:
        - 'success': Boolean indicating operation status
        - 'error': String with error message (if success=False)
    """
    rows = []
    deleted = False
    with open('./data/countries.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            if (row['country'] == country_data['country'] and
                row['continent'] == country_data['continent']):
                deleted = True
                continue
            rows.append(row)
    if not deleted:
        return {'success': False, 'error': 'Страна не найдена'}
    with open('./data/countries.csv', 'w', encoding='utf-8', newline='') as file:
        writer = csv.writer(file, delimiter=';')
        writer.writerow(['country', 'capital', 'continent'])
        for row in rows:
            writer.writerow([row['country'], row['capital'], row['continent']])
    return {'success': True}
