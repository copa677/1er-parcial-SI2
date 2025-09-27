from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Mascota
from .serializers import MascotaRegistroSerializer
from .serializers import MascotasSerializer

# ✅ Listar todas las mascotas
@api_view(['GET'])
def listar_mascotas(request):
    mascotas = Mascota.objects.all()
    serializer = MascotasSerializer(mascotas, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ✅ Registrar mascota
@api_view(['POST'])
def registrar_mascota(request):
    serializer = MascotaRegistroSerializer(data=request.data)
    if serializer.is_valid():
        Mascota.objects.create(**serializer.validated_data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Actualizar mascota
@api_view(['PUT'])
def actualizar_mascota(request, id_mascota):
    try:
        mascota = Mascota.objects.get(pk=id_mascota)
    except Mascota.DoesNotExist:
        return Response({"error": "Mascota no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    serializer = MascotaRegistroSerializer(mascota, data=request.data)
    if serializer.is_valid():
        for field, value in serializer.validated_data.items():
            setattr(mascota, field, value)
        mascota.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Eliminar mascota
@api_view(['DELETE'])
def eliminar_mascota(request, id_mascota):
    try:
        mascota = Mascota.objects.get(pk=id_mascota)
        mascota.delete()
        return Response({"message": "Mascota eliminada correctamente"}, status=status.HTTP_200_OK)
    except Mascota.DoesNotExist:
        return Response({"error": "Mascota no encontrada"}, status=status.HTTP_404_NOT_FOUND)
