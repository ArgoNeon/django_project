"""Views for the geography application.

This module contains view functions that handle HTTP requests and return responses
for the geography application, including country data management operations.
"""
import json
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from . import countries_work

def index(request):
    """Render the main landing page.
    
    Args:
        request: HttpRequest object containing metadata about the request.
    
    Returns:
        HttpResponse object with the rendered index page.
    """
    return render(request, "index.html")

def countries_table(request):
    """Display the countries listing page.
    
    Args:
        request: HttpRequest object containing metadata about the request.
    
    Returns:
        HttpResponse object with the rendered countries page.
    """
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
    """Render the geography lessons page.
    
    Args:
        request: HttpRequest object containing metadata about the request.
    
    Returns:
        HttpResponse object with the rendered lessons page.
    """
    countries_json = countries_work.get_all_countries()

    context = {'countries': countries_json}

    return render(request, "lessons.html", context=context)

def tests(request):
    """Display the geography tests page.
    
    Args:
        request: HttpRequest object containing metadata about the request.
    
    Returns:
        HttpResponse object with the rendered tests page.
    """
    countries_json = countries_work.get_all_countries()

    context = {'countries': countries_json}

    return render(request, "tests.html", context=context)

def change_database(request):
    """Render the database management interface.
    
    Args:
        request: HttpRequest object containing metadata about the request.
    
    Returns:
        HttpResponse object with the rendered database management page,
        including all country data in the context.
    """
    countries_json = countries_work.get_all_countries()

    context = {'countries': countries_json}

    return render(request, "change_database.html", context=context)

@csrf_exempt
def add_country(request):
    """Handle adding a new country via API request.
    
    Args:
        request: HttpRequest object with JSON payload containing:
            - country: Name of the country to add
            - capital: Capital of the country
            - continent: Continent the country belongs to
    
    Returns:
        JsonResponse with operation status:
        - success: Boolean indicating operation status
        - error: String with error message (if success=False)
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        result = countries_work.add_country_to_csv(data)
        return JsonResponse(result)
    return JsonResponse({'success': False, 'error': 'Invalid method'})

@csrf_exempt
def delete_country(request):
    """Handle country deletion via API request.
    
    Args:
        request: HttpRequest object with JSON payload containing:
            - country: Name of the country to delete
            - continent: Continent the country belongs to
    
    Returns:
        JsonResponse with operation status:
        - success: Boolean indicating operation status
        - error: String with error message (if success=False)
    """
    if request.method == 'POST':
        data = json.loads(request.body)
        result = countries_work.delete_country_from_csv(data)
        return JsonResponse(result)
    return JsonResponse({'success': False, 'error': 'Invalid method'})
