from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.db.models import Q

from .models import Avisos
from .serializers import AvisosRegistration, AvisosSerializers
from Usuarios.models import Usuario   


# 🔹 Registrar aviso
@api_view(['POST'])
def registrar_aviso(request):
    serializer = AvisosRegistration(data=request.data)
    if serializer.is_valid():
        tipo = serializer.validated_data['tipo']

        # Caso individual: buscar usuario por username
        if tipo.lower() == "individual":
            username = serializer.validated_data.get("username")
            try:
                usuario = Usuario.objects.get(username=username)
                id_user = usuario.id_user
            except Usuario.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            id_user = None  # Global → sin usuario asignado

        aviso = Avisos.objects.create(
            titulo=serializer.validated_data['titulo'],
            mensaje=serializer.validated_data['mensaje'],
            fecha_envio=serializer.validated_data['fecha_envio'],
            hora_envio=serializer.validated_data['hora_envio'],
            estado=serializer.validated_data['estado'],
            tipo=tipo,
            id_user=id_user
        )
        return Response({"message": "Aviso registrado correctamente"}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 Listar todos los avisos
@api_view(['GET'])
def listar_avisos(request):
    avisos = Avisos.objects.all().order_by('-fecha_envio', '-hora_envio')
    serializer = AvisosSerializers(avisos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# 🔹 Listar avisos para un usuario (globales + individuales)
@api_view(['GET'])
def avisos_para_usuario(request, id_user):
    ahora_fecha = timezone.now().date()
    ahora_hora = timezone.now().time()

    avisos = Avisos.objects.filter(
        Q(tipo="Global") | Q(id_user=id_user),
        fecha_envio__gte=ahora_fecha  # opcional: solo avisos futuros
    ).order_by("fecha_envio", "hora_envio")

    serializer = AvisosSerializers(avisos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# 🔹 Actualizar un aviso
@api_view(['PUT'])
def actualizar_aviso(request, id_aviso):
    try:
        aviso = Avisos.objects.get(id_aviso=id_aviso)
    except Avisos.DoesNotExist:
        return Response({"error": "Aviso no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AvisosRegistration(data=request.data)
    if serializer.is_valid():
        tipo = serializer.validated_data['tipo']

        # Caso individual: buscar usuario por username
        if tipo.lower() == "individual":
            username = serializer.validated_data.get("username")
            try:
                usuario = Usuario.objects.get(username=username)
                id_user = usuario.id_user
            except Usuario.DoesNotExist:
                return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        else:
            id_user = None  # Global → sin usuario asignado

        # Actualizar campos
        aviso.titulo = serializer.validated_data['titulo']
        aviso.mensaje = serializer.validated_data['mensaje']
        aviso.fecha_envio = serializer.validated_data['fecha_envio']
        aviso.hora_envio = serializer.validated_data['hora_envio']
        aviso.estado = serializer.validated_data['estado']
        aviso.tipo = tipo
        aviso.id_user = id_user
        aviso.save()

        return Response({"message": "Aviso actualizado correctamente"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 Eliminar un aviso
@api_view(['DELETE'])
def eliminar_aviso(request, id_aviso):
    try:
        aviso = Avisos.objects.get(id_aviso=id_aviso)
    except Avisos.DoesNotExist:
        return Response({"error": "Aviso no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    aviso.delete()
    return Response({"message": "Aviso eliminado correctamente"}, status=status.HTTP_200_OK)
