from django.urls import path
from .views import (
    listar_propiedades,
    registrar_propiedad,
    actualizar_propiedad,
    eliminar_propiedad,
)

urlpatterns = [
    path('listar_propiedades', listar_propiedades),
    path('registrar_propiedad', registrar_propiedad),
    path('actualizar_propiedad/<int:id_propiedad>', actualizar_propiedad),
    path('eliminar_propiedad/<int:id_propiedad>', eliminar_propiedad),
]
