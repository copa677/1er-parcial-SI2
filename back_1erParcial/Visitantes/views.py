from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Visitante
from .serializers import VisitanteRegisterSerializer


# 1️⃣ Registrar visitante
@api_view(['POST'])
def registrar_visitante(request):
    serializer = VisitanteRegisterSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        visitante = Visitante.objects.create(
            nombre_completo=data['nombre_completo'],
            telefono=data['telefono'],
            fecha_visita=data['fecha_visita'],
            estado=data['estado'],
            nombre_anfitrion=data['nombre_anfitrion']
            # `fecha_agregacion` se llena automáticamente (auto_now_add=True)
        )
        return Response({'mensaje': 'Visitante registrado correctamente.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 2️⃣ Actualizar visitante
@api_view(['PUT'])
def actualizar_visitante(request, id_visitante):
    try:
        visitante = Visitante.objects.get(pk=id_visitante)
    except Visitante.DoesNotExist:
        return Response({'error': 'Visitante no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = VisitanteRegisterSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        visitante.nombre_completo = data['nombre_completo']
        visitante.telefono = data['telefono']
        visitante.fecha_visita = data['fecha_visita']
        visitante.estado = data['estado']
        visitante.nombre_anfitrion = data['nombre_anfitrion']
        visitante.save()
        return Response({'mensaje': 'Visitante actualizado correctamente.'}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 3️⃣ Eliminar visitante
@api_view(['DELETE'])
def eliminar_visitante(request, id_visitante):
    try:
        visitante = Visitante.objects.get(pk=id_visitante)
        visitante.delete()
        return Response({'mensaje': 'Visitante eliminado correctamente.'}, status=status.HTTP_200_OK)
    except Visitante.DoesNotExist:
        return Response({'error': 'Visitante no encontrado.'}, status=status.HTTP_404_NOT_FOUND)


# 4️⃣ Obtener todos los visitantes
@api_view(['GET'])
def listar_visitantes(request):
    visitantes = Visitante.objects.all()
    resultado = []

    for v in visitantes:
        resultado.append({
            'id_visitante': v.id_visitante,
            'nombre_completo': v.nombre_completo,
            'telefono': v.telefono,
            'fecha_agregacion': v.fecha_agregacion,
            'fecha_visita': v.fecha_visita,
            'estado': v.estado,
            'nombre_anfitrion': v.nombre_anfitrion
        })

    return Response(resultado, status=status.HTTP_200_OK)
