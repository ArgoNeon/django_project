import csv
import json
from django.shortcuts import render

from . import countries_work

def index(request):
    return render(request, "index.html")

def countries(request):    
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
    return render(request, "change_database.html")

def get_database(request):
    return render(request, "countries.csv")