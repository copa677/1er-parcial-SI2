
from django.urls import path
from .views import login, registrar_personal, registrar_propietario, registrar_residente, actualizar_password, obtener_permisos_usuario, obtener_permisos_usuario_ventana, obtener_all_personal, obtener_all_propietarios, obtener_all_residentes, obtener_all_usuarios, listar_nombre_propietarios, listar_nombres_anfitriones

urlpatterns = [
    path('login', login, name='login'),
    path('registrar_personal', registrar_personal, name='registrar_personal'),
    path('registrar_propietario', registrar_propietario, name='registrar_propietario'),
    path('registrar_residente', registrar_residente, name='registrar_residente'),
    path('newPassword/<str:username>', actualizar_password),
    path('permisos/<str:username>', obtener_permisos_usuario, name='obtener_permisos_usuario'),
    path('permisos_ventana/<str:username>', obtener_permisos_usuario_ventana, name='obtener_permisos_usuario_ventana'),
    path('obtener_all_usuarios', obtener_all_usuarios, name='obtener_all_usuarios'),
    path('obtener_all_personal', obtener_all_personal, name='obtener_all_personal'),
    path('obtener_all_propietarios', obtener_all_propietarios, name='obtener_all_propietarios'),
    path('obtener_all_residentes', obtener_all_residentes, name='obtener_all_residentes'),
    path('listar_nombre_propietarios', listar_nombre_propietarios, name='listar_nombre_propietarios'),
    path('listar_nombres_anfitriones', listar_nombres_anfitriones, name='listar_nombres_anfitriones'),

]