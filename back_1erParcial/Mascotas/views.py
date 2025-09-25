from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Mascota
from .serializers import MascotaRegistroSerializer
from Usuarios.models import Propietario, Residente


# 1️⃣ Agregar nueva mascota
@api_view(['POST'])
def registrar_mascota(request):
    serializer = MascotaRegistroSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        id_propietario = None
        id_residente = None

        # Buscar ID del propietario
        if data.get('nombre_propietario'):
            try:
                propietario = Propietario.objects.get(nombre_completo__iexact=data['nombre_propietario'])
                id_propietario = propietario.id_propietario
            except Propietario.DoesNotExist:
                return Response({'error': 'Propietario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Buscar ID del residente
        elif data.get('nombre_residente'):
            try:
                residente = Residente.objects.get(nombre_completo__iexact=data['nombre_residente'])
                id_residente = residente.id_residente
            except Residente.DoesNotExist:
                return Response({'error': 'Residente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Crear mascota
        mascota = Mascota.objects.create(
            especie=data['especie'],
            raza=data['raza'],
            nombre=data['nombre'],
            descripcion=data['descripcion'],
            fecha_nacimiento=data['fecha_nacimiento'],
            sexo=data['sexo'],
            id_propietario=id_propietario,
            id_residente=id_residente
        )

        return Response({'mensaje': 'Mascota registrada exitosamente'}, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 2️⃣ Editar una mascota
@api_view(['PUT'])
def editar_mascota(request, id_mascota):
    try:
        mascota = Mascota.objects.get(pk=id_mascota)
    except Mascota.DoesNotExist:
        return Response({'error': 'Mascota no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    serializer = MascotaRegistroSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data

        id_propietario = None
        id_residente = None

        # Buscar ID correspondiente
        if data.get('nombre_propietario'):
            try:
                propietario = Propietario.objects.get(nombre_completo__iexact=data['nombre_propietario'])
                id_propietario = propietario.id_propietario
            except Propietario.DoesNotExist:
                return Response({'error': 'Propietario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        elif data.get('nombre_residente'):
            try:
                residente = Residente.objects.get(nombre_completo__iexact=data['nombre_residente'])
                id_residente = residente.id_residente
            except Residente.DoesNotExist:
                return Response({'error': 'Residente no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Actualizar atributos
        mascota.especie = data['especie']
        mascota.raza = data['raza']
        mascota.nombre = data['nombre']
        mascota.descripcion = data['descripcion']
        mascota.fecha_nacimiento = data['fecha_nacimiento']
        mascota.sexo = data['sexo']
        mascota.id_propietario = id_propietario
        mascota.id_residente = id_residente
        mascota.save()

        return Response({'mensaje': 'Mascota actualizada correctamente.'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# 3️⃣ Obtener todas las mascotas
@api_view(['GET'])
def listar_mascotas(request):
    mascotas = Mascota.objects.all()
    resultado = []

    for mascota in mascotas:
        nombre_propietario = None
        nombre_residente = None

        # Buscar nombre del propietario
        if mascota.id_propietario:
            try:
                propietario = Propietario.objects.get(pk=mascota.id_propietario)
                nombre_propietario = propietario.nombre_completo
            except Propietario.DoesNotExist:
                nombre_propietario = "Propietario no encontrado"

        # Buscar nombre del residente
        if mascota.id_residente:
            try:
                residente = Residente.objects.get(pk=mascota.id_residente)
                nombre_residente = residente.nombre_completo
            except Residente.DoesNotExist:
                nombre_residente = "Residente no encontrado"

        resultado.append({
            'id_mascota': mascota.id_mascota,
            'especie': mascota.especie,
            'raza': mascota.raza,
            'nombre': mascota.nombre,
            'descripcion': mascota.descripcion,
            'fecha_nacimiento': mascota.fecha_nacimiento,
            'sexo': mascota.sexo,
            'nombre_propietario': nombre_propietario,
            'nombre_residente': nombre_residente,
        })

    return Response(resultado)

@api_view(['DELETE'])
def eliminar_mascota(request, id_mascota):
    try:
        mascota = Mascota.objects.get(pk=id_mascota)
    except Mascota.DoesNotExist:
        return Response({'error': 'Mascota no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    mascota.delete()
    return Response({'mensaje': 'Mascota eliminada correctamente.'}, status=status.HTTP_200_OK)