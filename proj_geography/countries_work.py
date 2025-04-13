import csv
import json

def get_countries_for_tables():
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
    countries = []
    with open('./data/countries.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            countries.append(row)

    result = json.dumps(countries, ensure_ascii=False)

    return result

def add_country_to_csv(country_data):
    try:
        with open('./data/countries.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            for row in reader:
                if row['country'] == country_data['country'] and row['continent'] == country_data['continent']:
                    return {'success': False, 'error': 'Страна уже существует в этом континенте'}
        
        with open('./data/countries.csv', 'a', encoding='utf-8', newline='') as file:
            writer = csv.writer(file, delimiter=';')
            writer.writerow([country_data['country'], country_data['capital'], country_data['continent']])
        
        return {'success': True}
    except Exception as e:
        return {'success': False, 'error': str(e)}

def delete_country_from_csv(country_data):
    try:
        rows = []
        deleted = False
        with open('./data/countries.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file, delimiter=';')
            for row in reader:
                if row['country'] == country_data['country'] and row['continent'] == country_data['continent']:
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
    except Exception as e:
        return {'success': False, 'error': str(e)}
