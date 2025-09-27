from django.urls import path
from .views import (
    listar_vehiculos,
    registrar_vehiculo,
    actualizar_vehiculo,
    eliminar_vehiculo,
)

urlpatterns = [
    path('listar_vehiculos', listar_vehiculos),
    path('registrar_vehiculo', registrar_vehiculo),
    path('actualizar_vehiculo/<int:id_vehiculo>', actualizar_vehiculo),
    path('eliminar_vehiculo/<int:id_vehiculo>', eliminar_vehiculo),
]
