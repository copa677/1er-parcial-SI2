from rest_framework import serializers

class VisitanteRegisterSerializer(serializers.Serializer):
    id_visitante = serializers.IntegerField(read_only=True)
    nombre_completo = serializers.CharField(max_length=100)
    telefono = serializers.CharField(max_length=20)
    fecha_visita = serializers.DateField()
    estado = serializers.CharField(max_length=20)
    nombre_anfitrion = serializers.CharField(max_length=100)
