from django.urls import path
from . import views

from django.urls import path
from .views import (
    registrar_visitante,
    actualizar_visitante,
    eliminar_visitante,
    listar_visitantes
)

urlpatterns = [
    path('listar_visitantes', listar_visitantes),
    path('registrar_visitante', registrar_visitante),
    path('actualizar_visitante/<int:id_visitante>', actualizar_visitante),
    path('elimnar_visitante/<int:id_visitante>', eliminar_visitante),
]
