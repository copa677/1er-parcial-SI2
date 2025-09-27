from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Propiedad
from .serializers import PropiedadSerializer, PropiedadRegisterSerializer


# 📋 Listar propiedades
@api_view(['GET'])
def listar_propiedades(request):
    propiedades = Propiedad.objects.all()
    serializer = PropiedadSerializer(propiedades, many=True)
    return Response(serializer.data)


# 📥 Registrar una propiedad
@api_view(['POST'])
def registrar_propiedad(request):
    serializer = PropiedadRegisterSerializer(data=request.data)
    if serializer.is_valid():
        # ⚠️ Aquí convierto nombre_propietario a id_propietario
        # Suponiendo que ya tienes un modelo Propietario
        from Usuarios.models import Propietario
        try:
            propietario = Propietario.objects.get(nombre_completo=serializer.validated_data['nombre_propietario'])
        except Propietario.DoesNotExist:
            return Response({"error": "Propietario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        propiedad = Propiedad.objects.create(
            tipo_propiedad=serializer.validated_data['tipo_propiedad'],
            numero=serializer.validated_data['numero'],
            direccion=serializer.validated_data['direccion'],
            metros_cuadrados=serializer.validated_data['metros_cuadrados'],
            estado=serializer.validated_data['estado'],
            id_propietario=propietario.id_propietario
        )

        return Response(PropiedadSerializer(propiedad).data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✏️ Actualizar una propiedad
@api_view(['PUT'])
def actualizar_propiedad(request, id_propiedad):
    try:
        propiedad = Propiedad.objects.get(id_propiedad=id_propiedad)
    except Propiedad.DoesNotExist:
        return Response({"error": "Propiedad no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PropiedadRegisterSerializer(data=request.data)
    if serializer.is_valid():
        from Usuarios.models import Propietario
        try:
            propietario = Propietario.objects.get(nombre_completo=serializer.validated_data['nombre_propietario'])
        except Propietario.DoesNotExist:
            return Response({"error": "Propietario no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        propiedad.tipo_propiedad = serializer.validated_data['tipo_propiedad']
        propiedad.numero = serializer.validated_data['numero']
        propiedad.direccion = serializer.validated_data['direccion']
        propiedad.metros_cuadrados = serializer.validated_data['metros_cuadrados']
        propiedad.estado = serializer.validated_data['estado']
        propiedad.id_propietario = propietario.id_propietario
        propiedad.save()

        return Response(PropiedadSerializer(propiedad).data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🗑 Eliminar propiedad
@api_view(['DELETE'])
def eliminar_propiedad(request, id_propiedad):
    try:
        propiedad = Propiedad.objects.get(id_priedad=id_propiedad)
    except Propiedad.DoesNotExist:
        return Response({"error": "Propiedad no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    propiedad.delete()
    return Response({"mensaje": "Propiedad eliminada correctamente"}, status=status.HTTP_204_NO_CONTENT)
