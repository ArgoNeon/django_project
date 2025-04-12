from django.shortcuts import render
from django.core.cache import cache

from . import countries_work

def index(request):
    return render(request, "index.html")