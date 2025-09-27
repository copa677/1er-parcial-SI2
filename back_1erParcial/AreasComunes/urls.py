from django.urls import path
from .views import listar_areas_comunes, registrar_area_comun, editar_area_comun, eliminar_area_comun

urlpatterns = [
    path('listar', listar_areas_comunes, name='listar_areas_comunes'),
    path('registrar', registrar_area_comun, name='registrar_area_comun'),
    path('editar/<int:id_area>', editar_area_comun, name='editar_area_comun'),
    path('eliminar/<int:id_area>', eliminar_area_comun, name='eliminar_area_comun'),
]
