from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import vehiculo
from .serializers import VehiculoSerializer


# 📋 Listar todos los vehículos
@api_view(['GET'])
def listar_vehiculos(request):
    vehiculos = vehiculo.objects.all()
    data = [
        {
            "id_vehiculo": v.id_vehiculo,
            "placa": v.placa,
            "marca": v.marca,
            "modelo": v.modelo,
            "color": v.color,
            "propietario_vehiculo": v.propietario_vehiculo
        }
        for v in vehiculos
    ]
    return Response(data)


# 📥 Registrar un nuevo vehículo
@api_view(['POST'])
def registrar_vehiculo(request):
    serializer = VehiculoSerializer(data=request.data)
    if serializer.is_valid():
        vehiculo.objects.create(**serializer.validated_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✏️ Actualizar un vehículo existente
@api_view(['PUT'])
def actualizar_vehiculo(request, id_vehiculo):
    try:
        vehiculo_obj = vehiculo.objects.get(id_vehiculo=id_vehiculo)
    except vehiculo.DoesNotExist:
        return Response({"error": "Vehículo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    serializer = VehiculoSerializer(data=request.data)
    if serializer.is_valid():
        for key, value in serializer.validated_data.items():
            setattr(vehiculo_obj, key, value)
        vehiculo_obj.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🗑️ Eliminar un vehículo
@api_view(['DELETE'])
def eliminar_vehiculo(request, id_vehiculo):
    try:
        vehiculo_obj = vehiculo.objects.get(id_vehiculo=id_vehiculo)
    except vehiculo.DoesNotExist:
        return Response({"error": "Vehículo no encontrado"}, status=status.HTTP_404_NOT_FOUND)

    vehiculo_obj.delete()
    return Response({"mensaje": "Vehículo eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)
