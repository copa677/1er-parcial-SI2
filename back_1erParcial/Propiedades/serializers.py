from rest_framework import serializers

class PropiedadSerializer(serializers.Serializer):
    id_propiedad = serializers.IntegerField()
    tipo_propiedad = serializers.CharField(max_length=50)
    numero = serializers.CharField(max_length=20)
    direccion = serializers.CharField(max_length=200)
    metros_cuadrados = serializers.FloatField()
    estado = serializers.CharField(max_length=20)
    id_propietario = serializers.IntegerField()

class PropiedadRegisterSerializer(serializers.Serializer):
    tipo_propiedad = serializers.CharField(max_length=50)
    numero = serializers.CharField(max_length=20)
    direccion = serializers.CharField(max_length=200)
    metros_cuadrados = serializers.FloatField()
    estado = serializers.CharField(max_length=20)
    nombre_propietario = serializers.CharField(max_length=100)