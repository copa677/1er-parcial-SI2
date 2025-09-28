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
            if user.tipo_user == "Personal":
                token = generate_jwt(user)
                return Response({'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Solo usuarios tipo Personal pueden iniciar sesión'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'error': 'Usuario o password incorrecto'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_residente_propietario(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        try:
            user = Usuario.objects.get(username=username)
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario o password incorrecto'}, status=status.HTTP_404_NOT_FOUND)

        if user.check_password(password):
            if user.tipo_user == "Residente" or user.tipo_user == "Propietario":
                token = generate_jwt(user)
                return Response({'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Solo usuarios tipo Personal pueden iniciar sesión'}, status=status.HTTP_403_FORBIDDEN)
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
            propietario = Propietario.objects.get(nombre_completo=residente_serializer.validated_data['nombre_propietario'])
            residente_data = residente_serializer.validated_data

            Residente.objects.create(
                nombre_completo=residente_data['nombre_completo'],
                telefono=residente_data['telefono'],
                tipo_residente=residente_data['tipo_residente'],
                fecha_nacimiento=residente_data['fecha_nacimiento'],
                id_user=usuario.id_user,
                id_propietario=propietario.id_propietario
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
    
@api_view(['GET'])
def obtener_all_usuarios(request):
    try:
        usuarios = list(Usuario.objects.values())
        return Response({'usuarios': usuarios}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_all_personal(request):
    try:
        personal = list(Personal.objects.values())
        return Response({'personal': personal}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_all_propietarios(request):
    try:
        propietarios = list(Propietario.objects.values())
        return Response({'propietarios': propietarios}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def obtener_all_residentes(request):
    try:
        residentes = list(Residente.objects.values())
        return Response({'residentes': residentes}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def listar_nombre_propietarios(request):
    try:
        nombres = list(
            Propietario.objects.values_list('nombre_completo', flat=True)
        )
        return Response({'nombres_propietarios': nombres}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def listar_nombres_anfitriones(request):
    propietarios = list(Propietario.objects.values('nombre_completo'))
    residentes = list(Residente.objects.values('nombre_completo'))

    # Unir ambas listas en una sola
    anfitriones = propietarios + residentes

    return Response(anfitriones)

# 🔹 Actualizar Personal (solo tabla personal)
@api_view(['PUT'])
def actualizar_personal(request, id_personal):
    try:
        personal = Personal.objects.get(id_personal=id_personal)
    except Personal.DoesNotExist:
        return Response({"error": "Personal no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PersonalPayloadSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        for campo, valor in serializer.validated_data.items():
            setattr(personal, campo, valor)
        personal.save()
        return Response({"mensaje": "Personal actualizado correctamente"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 Actualizar Propietario (solo tabla propietario)
@api_view(['PUT'])
def actualizar_propietario(request, id_propietario):
    try:
        propietario = Propietario.objects.get(id_propietario=id_propietario)
    except Propietario.DoesNotExist:
        return Response({"error": "Propietario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PropietarioPayloadSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        for campo, valor in serializer.validated_data.items():
            setattr(propietario, campo, valor)
        propietario.save()
        return Response({"mensaje": "Propietario actualizado correctamente"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔹 Actualizar Residente (solo tabla residente)
@api_view(['PUT'])
def actualizar_residente(request, id_residente):
    try:
        residente = Residente.objects.get(id_residente=id_residente)
    except Residente.DoesNotExist:
        return Response({"error": "Residente no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ResidentePayloadSerializer(data=request.data, partial=True)
    if serializer.is_valid():
        residente_data = serializer.validated_data

        # Si se manda un propietario por nombre, actualizar id_propietario
        if "nombre_propietario" in residente_data:
            from .models import Propietario
            try:
                propietario = Propietario.objects.get(nombre_completo=residente_data["nombre_propietario"])
                residente.id_propietario = propietario.id_propietario
            except Propietario.DoesNotExist:
                return Response({"error": "Propietario no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        # Actualizar otros campos
        for campo, valor in residente_data.items():
            if campo != "nombre_propietario":  # ya lo manejamos arriba
                setattr(residente, campo, valor)

        residente.save()
        return Response({"mensaje": "Residente actualizado correctamente"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
