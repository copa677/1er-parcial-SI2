from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response   
from rest_framework import status
from .models import Usuario , Personal, Propietario, Residente
from .serializers import (
    LoginSerializer,
    UsuarioPayloadSerializer,
    PersonalPayloadSerializer,
    PropietarioPayloadSerializer,
    ResidentePayloadSerializer
)
from .utils import generate_jwt
from django.db import connection

# Create your views here.
@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario o password incorrecto'}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            token = generate_jwt(user)
            return Response({'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Usuario o password incorrecto'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def registrar_personal(request):
    user_serializer = UsuarioPayloadSerializer(data=request.data)
    personal_serializer = PersonalPayloadSerializer(data=request.data)

    if user_serializer.is_valid() and personal_serializer.is_valid():
        try:
            # Crear usuario
            user_data = user_serializer.validated_data
            usuario = Usuario(
                username=user_data['username'],
                email=user_data['email'],
                tipo_user=user_data['tipo_user'],
                estado=user_data.get('estado', 'ACTIVO'),
            )
            usuario.set_password(user_data['password'])
            usuario.save()

            # Crear personal
            personal_data = personal_serializer.validated_data
            Personal.objects.create(
                nombre_completo=personal_data['nombre_completo'],
                telefono=personal_data['telefono'],
                direccion=personal_data['direccion'],
                fecha_nacimiento=personal_data['fecha_nacimiento'],
                rol=personal_data['rol'],
                id_user=usuario.id_user # ForeignKey
            )

            return Response({'mensaje': 'Personal registrado correctamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'errors': user_serializer.errors | personal_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registrar_propietario(request):
    user_serializer = UsuarioPayloadSerializer(data=request.data)
    propietario_serializer = PropietarioPayloadSerializer(data=request.data)

    if user_serializer.is_valid() and propietario_serializer.is_valid():
        try:
            user_data = user_serializer.validated_data
            usuario = Usuario(
                username=user_data['username'],
                email=user_data['email'],
                tipo_user=user_data['tipo_user'],
                estado=user_data.get('estado', 'ACTIVO'),
            )
            usuario.set_password(user_data['password'])
            usuario.save()

            propietario_data = propietario_serializer.validated_data
            Propietario.objects.create(
                nombre_completo=propietario_data['nombre_completo'],
                telefono=propietario_data['telefono'],
                fecha_nacimiento=propietario_data['fecha_nacimiento'],
                id_user=usuario.id_user
            )

            return Response({'mensaje': 'Propietario registrado correctamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'errors': user_serializer.errors | propietario_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def registrar_residente(request):
    user_serializer = UsuarioPayloadSerializer(data=request.data)
    residente_serializer = ResidentePayloadSerializer(data=request.data)

    if user_serializer.is_valid() and residente_serializer.is_valid():
        try:
            user_data = user_serializer.validated_data
            usuario = Usuario(
                username=user_data['username'],
                email=user_data['email'],
                tipo_user=user_data['tipo_user'],
                estado=user_data.get('estado', 'ACTIVO'),
            )
            usuario.set_password(user_data['password'])
            usuario.save()

            residente_data = residente_serializer.validated_data

            Residente.objects.create(
                nombre_completo=residente_data['nombre_completo'],
                telefono=residente_data['telefono'],
                tipo_residente=residente_data['tipo_residente'],
                fecha_nacimiento=residente_data['fecha_nacimiento'],
                id_user=usuario.id_user,
                id_propietario_id=residente_data['id_propietario']  # con "_id" para ForeignKey
            )

            return Response({'mensaje': 'Residente registrado correctamente'}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    return Response({'errors': user_serializer.errors | residente_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def obtener_permisos_usuario(request, username):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_permisos_usuario(%s)", [username])
            columnas = [col[0] for col in cursor.description]
            resultados = [
                dict(zip(columnas, fila))
                for fila in cursor.fetchall()
            ]
            return Response({'permisos': resultados}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_permisos_usuario_ventana(request, username, ventana):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_permisos_usuario_ventana(%s, %s)", [username, ventana])
            columnas = [col[0] for col in cursor.description]
            fila = cursor.fetchone()

            if fila:
                permisos = dict(zip(columnas, fila))
            else:
                # Si no hay datos, devolvemos todo en false
                permisos = {
                    'insertar': False,
                    'editar': False,
                    'eliminar': False,
                    'ver': False
                }

            return Response(permisos, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def actualizar_password(request, username):
    # Obtener el nuevo password desde la petición
    nuevo_password = request.data.get('password')

    if not nuevo_password:
        return Response({'error': 'El nuevo password es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Buscar al usuario por el nombre de usuario
        usuario = Usuario.objects.get(username=username)
        
        # Actualizar el password del usuario
        usuario.set_password(nuevo_password)
        usuario.save()
        
        return Response({'mensaje': 'Contraseña actualizada con éxito'}, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)