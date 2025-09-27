from django.urls import path
from .views import (
    registrar_regla,
    editar_regla,
    eliminar_regla,
    listar_reglas,
)

urlpatterns = [
    path('listar_reglas', listar_reglas),
    path('registrar_regla', registrar_regla),
    path('editar_regla/<int:id_regla>', editar_regla),
    path('eliminar_regla/<int:id_regla>', eliminar_regla),
]
