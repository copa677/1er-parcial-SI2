from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import AreaComun
from .serializers import CreateAreaComunSerializer
from .serializers import AreaComunSerializer


# 📌 Listar todas las áreas comunes
@api_view(['GET'])
def listar_areas_comunes(request):
    try:
        areas = AreaComun.objects.all()
        serializer = AreaComunSerializer(areas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# 📌 Registrar nueva área común
@api_view(['POST'])
def registrar_area_comun(request):
    serializer = CreateAreaComunSerializer(data=request.data)
    if serializer.is_valid():
        try:
            AreaComun.objects.create(**serializer.validated_data)
            return Response({"mensaje": "Área común registrada exitosamente"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 📌 Editar área común
@api_view(['PUT'])
def editar_area_comun(request, id_area):
    try:
        area = AreaComun.objects.get(id_area=id_area)
    except AreaComun.DoesNotExist:
        return Response({"error": "Área común no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    serializer = CreateAreaComunSerializer(data=request.data)
    if serializer.is_valid():
        for attr, value in serializer.validated_data.items():
            setattr(area, attr, value)
        area.save()
        return Response({"mensaje": "Área común actualizada exitosamente"}, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 📌 Eliminar área común
@api_view(['DELETE'])
def eliminar_area_comun(request, id_area):
    try:
        area = AreaComun.objects.get(id_area=id_area)
        area.delete()
        return Response({"mensaje": "Área común eliminada exitosamente"}, status=status.HTTP_200_OK)
    except AreaComun.DoesNotExist:
        return Response({"error": "Área común no encontrada"}, status=status.HTTP_404_NOT_FOUND)
