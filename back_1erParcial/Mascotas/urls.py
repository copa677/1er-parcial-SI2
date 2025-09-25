from django.urls import path
from . import views

urlpatterns = [
    path('registrar', views.registrar_mascota, name='registrar_mascota'),
    path('editar/<int:id_mascota>', views.editar_mascota, name='editar_mascota'),
    path('listar', views.listar_mascotas, name='listar_mascotas'),
    path('eliminar/<int:id_mascota>', views.eliminar_mascota, name='eliminar_mascota'),
]
