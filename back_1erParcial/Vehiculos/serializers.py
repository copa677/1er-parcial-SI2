from rest_framework import serializers

class VehiculoSerializer(serializers.Serializer):
    placa = serializers.CharField(max_length=20)
    marca = serializers.CharField(max_length=50)
    modelo = serializers.CharField(max_length=50)
    color = serializers.CharField(max_length=30)
    propietario_vehiculo = serializers.CharField(max_length=100)