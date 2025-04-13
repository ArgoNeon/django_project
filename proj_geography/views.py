import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from . import countries_work

def index(request):
    return render(request, "index.html")

def countries_table(request):    
    countries = countries_work.get_countries_for_tables()
    context = {
        'africa_countries': countries.get('Africa', []),
        'asia_countries': countries.get('Asia', []),
        'europe_countries': countries.get('Europe', []),
        'north_america_countries': countries.get('North America', []),
        'south_america_countries': countries.get('South America', []),
        'oceania_countries': countries.get('Oceania', []),
    }
    return render(request, "countries.html", context=context)

def lessons(request):
    countries_json = countries_work.get_all_countries()

    context = {'countries': countries_json}

    return render(request, "lessons.html", context=context)

def tests(request):
    countries_json = countries_work.get_all_countries()

    context = {'countries': countries_json}

    return render(request, "tests.html", context=context)

def change_database(request):
    countries_json = countries_work.get_all_countries()

    context = {'countries': countries_json}

    return render(request, "change_database.html", context=context)

@csrf_exempt
def add_country(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            result = countries_work.add_country_to_csv(data)
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid method'})

@csrf_exempt
def delete_country(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            result = countries_work.delete_country_from_csv(data)
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    return JsonResponse({'success': False, 'error': 'Invalid method'})
    