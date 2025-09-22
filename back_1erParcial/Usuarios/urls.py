
from django.urls import path
from .views import login, registrar_personal, registrar_propietario, registrar_residente, actualizar_password, obtener_permisos_usuario, obtener_permisos_usuario_ventana

urlpatterns = [
    path('login', login, name='login'),
    path('registrar_personal', registrar_personal, name='registrar_personal'),
    path('registrar_propietario', registrar_propietario, name='registrar_propietario'),
    path('registrar_residente', registrar_residente, name='registrar_residente'),
    path('newPassword/<str:username>', actualizar_password),
    path('permisos/<str:username>', obtener_permisos_usuario, name='obtener_permisos_usuario'),
    path('permisos_ventana/<str:username>', obtener_permisos_usuario_ventana, name='obtener_permisos_usuario_ventana'),

]