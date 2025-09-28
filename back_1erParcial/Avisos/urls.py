from django.urls import path
from .views import (
    registrar_aviso,
    listar_avisos,
    avisos_para_usuario,
    actualizar_aviso,
    eliminar_aviso
)

urlpatterns = [
    path('registrar/', registrar_aviso, name='registrar_aviso'),
    path('listar/', listar_avisos, name='listar_avisos'),
    path('usuario/<int:id_user>/', avisos_para_usuario, name='avisos_para_usuario'),
    path('actualizar/<int:id_aviso>/', actualizar_aviso, name='actualizar_aviso'),
    path('eliminar/<int:id_aviso>/', eliminar_aviso, name='eliminar_aviso'),
]
