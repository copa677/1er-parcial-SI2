from rest_framework import serializers

class MascotaRegistroSerializer(serializers.Serializer):
    especie = serializers.CharField(max_length=50)
    raza = serializers.CharField(max_length=50)
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    sexo = serializers.CharField(max_length=10)
    dueno = serializers.CharField(max_length=100)

class MascotasSerializer(serializers.Serializer):
    id_mascota = serializers.IntegerField()
    especie = serializers.CharField(max_length=50)
    raza = serializers.CharField(max_length=50)
    nombre = serializers.CharField(max_length=100)
    descripcion = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    sexo = serializers.CharField(max_length=10)
    dueno = serializers.CharField(max_length=100)