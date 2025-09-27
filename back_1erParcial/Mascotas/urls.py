from django.urls import path
from .views import listar_mascotas, registrar_mascota, actualizar_mascota, eliminar_mascota

urlpatterns = [
    path('listar_mascotas', listar_mascotas, name='listar_mascotas'),
    path('registrar_mascota', registrar_mascota, name='registrar_mascota'),
    path('actualizar_mascota/<int:id_mascota>', actualizar_mascota, name='actualizar_mascota'),
    path('eliminar_mascota/<int:id_mascota>', eliminar_mascota, name='eliminar_mascota'),
]
