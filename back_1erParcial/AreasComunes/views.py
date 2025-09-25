from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import AreaComun
from .serializers import CreateAreaComunSerializer

# 1️⃣ Registrar nueva área común
@api_view(['POST'])
def registrar_area_comun(request):
    serializer = CreateAreaComunSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        area = AreaComun.objects.create(
            nombre=data['nombre'],
            descripcion=data.get('descripcion'),
            tipo_area=data['tipo_area'],
            ubicacion=data['ubicacion'],
            capacidad_maxima=data['capacidad_maxima'],
            hora_apertura=data['hora_apertura'],
            hora_cierre=data['hora_cierre'],
            estado=data['estado'],
            costo_hora=data['costo_hora'],
            requiere_reserva=data['requiere_reserva'],
            tiempo_max_reserva=data['tiempo_max_reserva']
        )
        return Response({'mensaje': 'Área común registrada exitosamente.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 2️⃣ Editar un área común existente
@api_view(['PUT'])
def editar_area_comun(request, id_area):
    try:
        area = AreaComun.objects.get(pk=id_area)
    except AreaComun.DoesNotExist:
        return Response({'error': 'Área común no encontrada'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = CreateAreaComunSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        for attr, value in data.items():
            setattr(area, attr, value)
        area.save()
        return Response({'mensaje': 'Área común actualizada correctamente.'})
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3️⃣ Obtener todas las áreas comunes
@api_view(['GET'])
def listar_areas_comunes(request):
    areas = AreaComun.objects.all()
    resultado = []
    for area in areas:
        resultado.append({
            'id_area': area.id_area,
            'nombre': area.nombre,
            'descripcion': area.descripcion,
            'tipo_area': area.tipo_area,
            'ubicacion': area.ubicacion,
            'capacidad_maxima': area.capacidad_maxima,
            'hora_apertura': area.hora_apertura,
            'hora_cierre': area.hora_cierre,
            'estado': area.estado,
            'costo_hora': str(area.costo_hora),
            'requiere_reserva': area.requiere_reserva,
            'tiempo_max_reserva': area.tiempo_max_reserva,
            'fecha_creacion': area.fecha_creacion,
            'fecha_actualizacion': area.fecha_actualizacion,
        })
    return Response(resultado)
