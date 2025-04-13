from django.shortcuts import render
from django.core.cache import cache

from . import countries_work

def index(request):
    return render(request, "index.html")

def countries(request):    
    countries = countries_work.countries_for_tables()
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
    return render(request, "lessons.html")

def tests(request):
    return render(request, "tests.html")

def change_database(request):
    return render(request, "change_database.html")