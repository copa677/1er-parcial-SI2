from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Regla
from .serializers import ReglaSerializer

# 1️⃣ Registrar regla
@api_view(['POST'])
def registrar_regla(request):
    serializer = ReglaSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        regla = Regla.objects.create(
            descripcion=data['descripcion'],
            monto=data['monto']
        )
        return Response({'mensaje': 'Regla registrada correctamente.'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 2️⃣ Editar regla
@api_view(['PUT'])
def editar_regla(request, id_regla):
    try:
        regla = Regla.objects.get(pk=id_regla)
    except Regla.DoesNotExist:
        return Response({'error': 'Regla no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ReglaSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        regla.descripcion = data['descripcion']
        regla.monto = data['monto']
        regla.save()
        return Response({'mensaje': 'Regla actualizada correctamente.'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 3️⃣ Eliminar regla
@api_view(['DELETE'])
def eliminar_regla(request, id_regla):
    try:
        regla = Regla.objects.get(pk=id_regla)
        regla.delete()
        return Response({'mensaje': 'Regla eliminada correctamente.'}, status=status.HTTP_200_OK)
    except Regla.DoesNotExist:
        return Response({'error': 'Regla no encontrada.'}, status=status.HTTP_404_NOT_FOUND)


# 4️⃣ Listar todas las reglas
@api_view(['GET'])
def listar_reglas(request):
    reglas = Regla.objects.all()
    resultado = []

    for regla in reglas:
        resultado.append({
            'id_regla': regla.id_regla,
            'descripcion': regla.descripcion,
            'monto': regla.monto,
        })

    return Response(resultado, status=status.HTTP_200_OK)
