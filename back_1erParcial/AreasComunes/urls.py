from django.urls import path
from . import views

urlpatterns = [
    path('registrar', views.registrar_area_comun, name='registrar_area'),
    path('editar/<int:id_area>', views.editar_area_comun, name='editar_area'),
    path('listar', views.listar_areas_comunes, name='listar_areas'),
]
