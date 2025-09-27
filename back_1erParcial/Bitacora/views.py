from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Bitacora
from .serializers import RegistroBitacora
from .serializers import serializerBitacora

# 📋 Listar todas las bitácoras
@api_view(['GET'])
def listar_bitacoras(request):
    bitacoras = Bitacora.objects.all().order_by('-fecha_hora')  # ordenadas por fecha
    serializer = serializerBitacora(bitacoras, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# 📝 Registrar una nueva bitácora
@api_view(['POST'])
def registrar_bitacora(request):
    serializer = RegistroBitacora(data=request.data)
    if serializer.is_valid():
        Bitacora.objects.create(
            ip=serializer.validated_data['ip'],
            fecha_hora=serializer.validated_data['fecha_hora'],
            descripcion=serializer.validated_data['descripcion'],
        )
        return Response({"message": "Bitácora registrada correctamente"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
