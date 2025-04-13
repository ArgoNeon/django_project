from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),
    path('countries', views.countries_table),
    path('lessons', views.lessons),
    path('tests', views.tests),
    path('change_database', views.change_database),
    path('add_country', views.add_country),
    path('delete_country', views.delete_country)
]
